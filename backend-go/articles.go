package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

const articleFile = "data/articles.json"

type Article struct {
	ID           int64       `json:"id"`
	Judul        string      `json:"judul"`
	Kategori     string      `json:"kategori"`
	Konten       string      `json:"konten"`
	KontenJSON   interface{} `json:"konten_json"`
	Cuplikan     string      `json:"cuplikan"`
	ThumbnailURL string      `json:"thumbnail_url"`
	AuthorID     int64       `json:"author_id"`
	AccByID      int64       `json:"acc_by_id"`
	Status       string      `json:"status"`
	IsPinned     bool        `json:"is_pinned"`
	ViewEvents   []time.Time `json:"view_events"`
	PublishedAt  *time.Time  `json:"published_at"`
	CreatedAt    time.Time   `json:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at"`
}

type ArticleInput struct {
	Judul        string      `json:"judul"`
	Kategori     string      `json:"kategori"`
	Konten       string      `json:"konten"`
	KontenJSON   interface{} `json:"konten_json"`
	Cuplikan     string      `json:"cuplikan"`
	ThumbnailURL string      `json:"thumbnail_url"`
	AuthorID     int64       `json:"author_id"`
	ActorID      int64       `json:"actor_id"`
	Status       string      `json:"status"`
}

type ArticleResponse struct {
	Article
	AuthorName     string `json:"author_name"`
	AuthorNickname string `json:"author_nickname"`
}

func (s *userStore) loadArticles() error {
	file, err := os.Open(articleFile)
	if errors.Is(err, os.ErrNotExist) {
		return s.saveArticlesLocked()
	}
	if err != nil {
		return err
	}
	defer file.Close()

	var articles []Article
	if err := json.NewDecoder(file).Decode(&articles); err != nil {
		return err
	}

	var maxID int64
	for _, article := range articles {
		if article.Status == "" {
			article.Status = "pending"
		}
		s.articles[article.ID] = article
		if article.ID > maxID {
			maxID = article.ID
		}
	}
	s.nextArticleID = maxID + 1
	return nil
}

func (s *userStore) saveArticlesLocked() error {
	articles := make([]Article, 0, len(s.articles))
	for _, article := range s.articles {
		articles = append(articles, article)
	}
	sort.Slice(articles, func(i, j int) bool {
		return articles[i].ID < articles[j].ID
	})

	payload, err := json.MarshalIndent(articles, "", "  ")
	if err != nil {
		return err
	}
	payload = append(payload, '\n')
	return os.WriteFile(articleFile, payload, 0644)
}

func (s *userStore) articlesHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/v1/articles" {
		writeError(w, http.StatusNotFound, "route not found")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.listArticles(w, r)
	case http.MethodPost:
		s.createArticle(w, r)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *userStore) articleByIDHandler(w http.ResponseWriter, r *http.Request) {
	trimmed := strings.TrimPrefix(r.URL.Path, "/api/v1/articles/")
	parts := strings.Split(strings.Trim(trimmed, "/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		writeError(w, http.StatusBadRequest, "invalid article id")
		return
	}
	id, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid article id")
		return
	}

	if len(parts) == 2 {
		switch parts[1] {
		case "approve":
			s.approveArticle(w, r, id)
		case "status":
			s.updateArticleStatus(w, r, id)
		case "pin":
			s.pinArticle(w, r, id)
		case "view":
			s.trackArticleView(w, r, id)
		default:
			writeError(w, http.StatusNotFound, "route not found")
		}
		return
	}
	if len(parts) != 1 {
		writeError(w, http.StatusNotFound, "route not found")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.getArticle(w, id)
	case http.MethodPut, http.MethodPatch:
		s.updateArticle(w, r, id)
	case http.MethodDelete:
		s.deleteArticle(w, r, id)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *userStore) listArticles(w http.ResponseWriter, r *http.Request) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	status := strings.TrimSpace(r.URL.Query().Get("status"))
	category := normalizeArticleCategory(r.URL.Query().Get("kategori"))
	homepage := r.URL.Query().Get("homepage") == "true"
	articles := make([]Article, 0, len(s.articles))
	for _, article := range s.articles {
		if status != "" && article.Status != status {
			continue
		}
		if category != "" && normalizeArticleCategory(article.Kategori) != category {
			continue
		}
		if homepage && article.Status != "published" {
			continue
		}
		articles = append(articles, article)
	}

	if homepage {
		articles = sortHomepageArticles(articles)
	} else if category != "" {
		articles = sortCategoryArticles(articles)
	} else {
		sort.Slice(articles, func(i, j int) bool {
			return articles[i].CreatedAt.After(articles[j].CreatedAt)
		})
	}
	writeJSON(w, http.StatusOK, s.articleResponsesLocked(articles))
}

func (s *userStore) getArticle(w http.ResponseWriter, id int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	writeJSON(w, http.StatusOK, s.articleResponseLocked(article))
}

func (s *userStore) createArticle(w http.ResponseWriter, r *http.Request) {
	input, err := parseArticleInput(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.users[input.AuthorID]; !ok {
		writeError(w, http.StatusBadRequest, "author_id is not valid")
		return
	}

	now := time.Now().UTC()
	status := editableArticleStatus(input.Status)
	article := Article{
		ID:           s.nextArticleID,
		Judul:        strings.TrimSpace(input.Judul),
		Kategori:     normalizeArticleCategory(input.Kategori),
		Konten:       input.Konten,
		KontenJSON:   input.KontenJSON,
		Cuplikan:     strings.TrimSpace(input.Cuplikan),
		ThumbnailURL: strings.TrimSpace(input.ThumbnailURL),
		AuthorID:     input.AuthorID,
		Status:       status,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	if err := validateArticle(article); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.articles[article.ID] = article
	s.nextArticleID++
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	writeJSON(w, http.StatusCreated, s.articleResponseLocked(article))
}

func (s *userStore) updateArticle(w http.ResponseWriter, r *http.Request, id int64) {
	input, err := parseArticleInput(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	if !s.canEditArticleLocked(input.ActorID, article) {
		writeError(w, http.StatusForbidden, "not allowed to edit this article")
		return
	}

	article.Judul = strings.TrimSpace(input.Judul)
	article.Kategori = normalizeArticleCategory(input.Kategori)
	article.Konten = input.Konten
	article.KontenJSON = input.KontenJSON
	article.Cuplikan = strings.TrimSpace(input.Cuplikan)
	article.ThumbnailURL = strings.TrimSpace(input.ThumbnailURL)
	if article.Status != "published" {
		article.Status = editableArticleStatus(input.Status)
	}
	article.UpdatedAt = time.Now().UTC()
	if err := validateArticle(article); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.articles[id] = article
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	writeJSON(w, http.StatusOK, s.articleResponseLocked(article))
}

func (s *userStore) deleteArticle(w http.ResponseWriter, r *http.Request, id int64) {
	actorID, _ := strconv.ParseInt(r.URL.Query().Get("actor_id"), 10, 64)

	s.mu.Lock()
	defer s.mu.Unlock()

	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	if !s.canEditArticleLocked(actorID, article) {
		writeError(w, http.StatusForbidden, "not allowed to delete this article")
		return
	}
	delete(s.articles, id)
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *userStore) approveArticle(w http.ResponseWriter, r *http.Request, id int64) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var input struct {
		ActorID int64 `json:"actor_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.canModerateArticlesLocked(input.ActorID) {
		writeError(w, http.StatusForbidden, "not allowed to approve article")
		return
	}
	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}

	now := time.Now().UTC()
	article.Status = "published"
	article.AccByID = input.ActorID
	article.PublishedAt = &now
	article.UpdatedAt = now
	s.articles[id] = article
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	writeJSON(w, http.StatusOK, s.articleResponseLocked(article))
}

func (s *userStore) updateArticleStatus(w http.ResponseWriter, r *http.Request, id int64) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var input struct {
		ActorID int64  `json:"actor_id"`
		Status  string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.canModerateArticlesLocked(input.ActorID) {
		writeError(w, http.StatusForbidden, "not allowed to update article status")
		return
	}
	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}

	status := strings.ToLower(strings.TrimSpace(input.Status))
	switch status {
	case "published":
		now := time.Now().UTC()
		article.Status = status
		article.AccByID = input.ActorID
		article.PublishedAt = &now
		article.UpdatedAt = now
	case "rejected", "takedown":
		article.Status = status
		article.AccByID = input.ActorID
		article.IsPinned = false
		article.UpdatedAt = time.Now().UTC()
	default:
		writeError(w, http.StatusBadRequest, "status must be published, rejected, or takedown")
		return
	}

	s.articles[id] = article
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	writeJSON(w, http.StatusOK, s.articleResponseLocked(article))
}

func (s *userStore) pinArticle(w http.ResponseWriter, r *http.Request, id int64) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var input struct {
		ActorID  int64 `json:"actor_id"`
		IsPinned bool  `json:"is_pinned"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.canModerateArticlesLocked(input.ActorID) {
		writeError(w, http.StatusForbidden, "not allowed to pin article")
		return
	}
	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	if article.Status != "published" {
		writeError(w, http.StatusBadRequest, "only published article can be pinned")
		return
	}

	if input.IsPinned {
		pinnedCount := 0
		for articleID, item := range s.articles {
			if articleID == id {
				continue
			}
			if item.Status == "published" &&
				item.IsPinned &&
				normalizeArticleCategory(item.Kategori) == normalizeArticleCategory(article.Kategori) {
				pinnedCount++
			}
		}
		if pinnedCount >= 3 {
			writeError(w, http.StatusBadRequest, "maximum pinned articles per category is 3")
			return
		}
	}
	article.IsPinned = input.IsPinned
	article.UpdatedAt = time.Now().UTC()
	s.articles[id] = article
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	writeJSON(w, http.StatusOK, s.articleResponseLocked(article))
}

func (s *userStore) trackArticleView(w http.ResponseWriter, r *http.Request, id int64) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	article, ok := s.articles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "article not found")
		return
	}
	article.ViewEvents = append(article.ViewEvents, time.Now().UTC())
	s.articles[id] = article
	if err := s.saveArticlesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save article")
		return
	}
	writeJSON(w, http.StatusOK, s.articleResponseLocked(article))
}

func (s *userStore) articleResponsesLocked(articles []Article) []ArticleResponse {
	responses := make([]ArticleResponse, 0, len(articles))
	for _, article := range articles {
		responses = append(responses, s.articleResponseLocked(article))
	}
	return responses
}

func (s *userStore) articleResponseLocked(article Article) ArticleResponse {
	response := ArticleResponse{Article: article}
	if author, ok := s.users[article.AuthorID]; ok {
		response.AuthorName = author.Nama
		response.AuthorNickname = author.Nickname
	}
	return response
}

func parseArticleInput(r *http.Request) (ArticleInput, error) {
	var input ArticleInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return input, errors.New("invalid json body")
	}
	return input, nil
}

func editableArticleStatus(status string) string {
	if strings.ToLower(strings.TrimSpace(status)) == "draft" {
		return "draft"
	}
	return "pending"
}

func validateArticle(article Article) error {
	if strings.TrimSpace(article.Judul) == "" {
		return errors.New("judul is required")
	}
	if !isAllowedArticleCategory(article.Kategori) {
		return errors.New("kategori must be anime, creator, event, gaming, cosplay")
	}
	if strings.TrimSpace(article.Konten) == "" {
		return errors.New("konten is required")
	}
	if strings.TrimSpace(article.Cuplikan) == "" {
		return errors.New("cuplikan is required")
	}
	if article.AuthorID <= 0 {
		return errors.New("author_id is required")
	}
	switch article.Status {
	case "draft", "pending", "published", "rejected", "takedown":
		return nil
	default:
		return errors.New("status must be draft, pending, published, rejected, or takedown")
	}
}

func normalizeArticleCategory(category string) string {
	return strings.ToLower(strings.TrimSpace(category))
}

func isAllowedArticleCategory(category string) bool {
	switch normalizeArticleCategory(category) {
	case "anime", "creator", "event", "gaming", "cosplay":
		return true
	default:
		return false
	}
}

func (s *userStore) canEditArticleLocked(actorID int64, article Article) bool {
	if actorID <= 0 {
		return false
	}
	if actorID == article.AuthorID && article.Status != "published" {
		return true
	}
	return s.canModerateArticlesLocked(actorID)
}

func (s *userStore) canModerateArticlesLocked(actorID int64) bool {
	user, ok := s.users[actorID]
	if !ok {
		return false
	}
	if user.Role == "super_admin" {
		return true
	}
	if user.Role != "admin" {
		return false
	}
	return s.subRoleNameByIDLocked(user.SubRole) == "editor"
}

func sortHomepageArticles(articles []Article) []Article {
	sort.Slice(articles, func(i, j int) bool {
		left := articles[i]
		right := articles[j]
		if left.IsPinned != right.IsPinned {
			return left.IsPinned
		}
		leftViews := weeklyViewCount(left)
		rightViews := weeklyViewCount(right)
		if leftViews != rightViews {
			return leftViews > rightViews
		}
		return articlePublishedAt(left).After(articlePublishedAt(right))
	})
	return articles
}

func sortCategoryArticles(articles []Article) []Article {
	sort.Slice(articles, func(i, j int) bool {
		left := articles[i]
		right := articles[j]
		if left.IsPinned != right.IsPinned {
			return left.IsPinned
		}
		return articlePublishedAt(left).After(articlePublishedAt(right))
	})
	return articles
}

func weeklyViewCount(article Article) int {
	if article.PublishedAt == nil {
		return 0
	}
	deadline := article.PublishedAt.AddDate(0, 0, 7)
	count := 0
	for _, viewedAt := range article.ViewEvents {
		if !viewedAt.Before(*article.PublishedAt) && viewedAt.Before(deadline) {
			count++
		}
	}
	return count
}

func articlePublishedAt(article Article) time.Time {
	if article.PublishedAt != nil {
		return *article.PublishedAt
	}
	return article.CreatedAt
}
