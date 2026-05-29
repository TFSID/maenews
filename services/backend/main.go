package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	dataFile       = "data/users.json"
	subRoleFile    = "data/sub_roles.json"
	uploadDir      = "uploads"
	defaultPhoto   = "default.jpg"
	maxRequestSize = 12 << 20
	hashIterations = 100000
)

type User struct {
	ID           int64     `json:"id"`
	Nama         string    `json:"nama"`
	Nickname     string    `json:"nickname"`
	Alamat       string    `json:"alamat"`
	NoHP         string    `json:"no_hp"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	SubRole      int       `json:"sub_role"`
	Foto         string    `json:"foto"`
	Facebook     string    `json:"facebook"`
	Twitter      string    `json:"twitter"`
	Instagram    string    `json:"instagram"`
	Discord      string    `json:"discord"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type userRecord struct {
	User
	PasswordHash string `json:"password_hash"`
}

type userInput struct {
	Nama      string `json:"nama"`
	Nickname  string `json:"nickname"`
	Alamat    string `json:"alamat"`
	NoHP      string `json:"no_hp"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Role      string `json:"role"`
	SubRole   int    `json:"sub_role"`
	Foto      string `json:"foto"`
	Facebook  string `json:"facebook"`
	Twitter   string `json:"twitter"`
	Instagram string `json:"instagram"`
	Discord   string `json:"discord"`
}

type SubRole struct {
	ID        int64     `json:"id"`
	SubRole   string    `json:"sub_role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type subRoleInput struct {
	SubRole string `json:"sub_role"`
}

type userStore struct {
	mu            sync.RWMutex
	users         map[int64]User
	subRoles      map[int64]SubRole
	articles      map[int64]Article
	nextID        int64
	nextSubRoleID int64
	nextArticleID int64
}

func main() {
	store := &userStore{
		users:         map[int64]User{},
		subRoles:      map[int64]SubRole{},
		articles:      map[int64]Article{},
		nextID:        1,
		nextSubRoleID: 1,
		nextArticleID: 1,
	}
	if err := store.load(); err != nil {
		log.Fatalf("failed to load users: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", rootHandler)
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/v1/auth/login", store.loginHandler)
	mux.HandleFunc("/api/v1/articles", store.articlesHandler)
	mux.HandleFunc("/api/v1/articles/", store.articleByIDHandler)
	mux.HandleFunc("/api/v1/sub-roles", store.subRolesHandler)
	mux.HandleFunc("/api/v1/sub-roles/", store.subRoleByIDHandler)
	mux.HandleFunc("/api/v1/users", store.usersHandler)
	mux.HandleFunc("/api/v1/users/", store.userByIDHandler)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadDir))))

	addr := env("PORT", "8080")
	log.Printf("Maenews User API running on http://localhost:%s", addr)
	log.Fatal(http.ListenAndServe(":"+addr, withCORS(mux)))
}

func (s *userStore) load() error {
	if err := os.MkdirAll(filepath.Dir(dataFile), 0755); err != nil {
		return err
	}
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return err
	}

	if err := s.loadSubRoles(); err != nil {
		return err
	}
	if err := s.loadArticles(); err != nil {
		return err
	}

	file, err := os.Open(dataFile)
	if errors.Is(err, os.ErrNotExist) {
		return s.seedAdmin()
	}
	if err != nil {
		return err
	}
	defer file.Close()

	var records []userRecord
	if err := json.NewDecoder(file).Decode(&records); err != nil {
		return err
	}

	var maxID int64
	usersChanged := false
	for _, record := range records {
		user := record.User
		user.PasswordHash = record.PasswordHash
		subRoleName := s.subRoleNameByIDLocked(user.SubRole)
		if user.Role == "admin" && subRoleName == "super_admin" {
			user.Role = "super_admin"
			usersChanged = true
		}
		if user.Role != "super_admin" && user.Role != "admin" && user.Role != "member" {
			user.Role = "admin"
			usersChanged = true
		}
		s.users[user.ID] = user
		if user.ID > maxID {
			maxID = user.ID
		}
	}
	s.nextID = maxID + 1

	if len(s.users) == 0 {
		return s.seedAdmin()
	}
	if usersChanged {
		return s.saveLocked()
	}
	return nil
}

func (s *userStore) loadSubRoles() error {
	file, err := os.Open(subRoleFile)
	if errors.Is(err, os.ErrNotExist) {
		return s.seedSubRoles()
	}
	if err != nil {
		return err
	}
	defer file.Close()

	var subRoles []SubRole
	if err := json.NewDecoder(file).Decode(&subRoles); err != nil {
		return err
	}

	var maxID int64
	for _, subRole := range subRoles {
		s.subRoles[subRole.ID] = subRole
		if subRole.ID > maxID {
			maxID = subRole.ID
		}
	}
	s.nextSubRoleID = maxID + 1
	if len(s.subRoles) == 0 {
		return s.seedSubRoles()
	}
	changed := s.ensureDefaultSubRolesLocked()
	if changed {
		return s.saveSubRolesLocked()
	}
	return nil
}

func (s *userStore) seedSubRoles() error {
	now := time.Now().UTC()
	s.subRoles[1] = SubRole{
		ID:        1,
		SubRole:   "admin",
		CreatedAt: now,
		UpdatedAt: now,
	}
	s.subRoles[2] = SubRole{
		ID:        2,
		SubRole:   "member",
		CreatedAt: now,
		UpdatedAt: now,
	}
	s.nextSubRoleID = 3
	return s.saveSubRolesLocked()
}

func (s *userStore) ensureDefaultSubRolesLocked() bool {
	changed := false
	defaults := []string{"admin", "member"}
	for _, name := range defaults {
		if _, ok := s.findSubRoleByNameLocked(name); ok {
			continue
		}
		now := time.Now().UTC()
		s.subRoles[s.nextSubRoleID] = SubRole{
			ID:        s.nextSubRoleID,
			SubRole:   name,
			CreatedAt: now,
			UpdatedAt: now,
		}
		s.nextSubRoleID++
		changed = true
	}
	return changed
}

func (s *userStore) seedAdmin() error {
	passwordHash, err := hashPassword("12345678")
	if err != nil {
		return err
	}
	now := time.Now().UTC()
	s.users[1] = User{
		ID:           1,
		Nama:         "admin",
		Nickname:     "admin",
		Alamat:       "bogor",
		NoHP:         "088217071996",
		Email:        "syahrul@gmail.com",
		PasswordHash: passwordHash,
		Role:         "super_admin",
		SubRole:      1,
		Foto:         defaultPhoto,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	s.nextID = 2
	return s.saveLocked()
}

func (s *userStore) saveLocked() error {
	records := make([]userRecord, 0, len(s.users))
	for _, user := range s.users {
		records = append(records, userRecord{User: user, PasswordHash: user.PasswordHash})
	}

	payload, err := json.MarshalIndent(records, "", "  ")
	if err != nil {
		return err
	}
	payload = append(payload, '\n')
	return os.WriteFile(dataFile, payload, 0644)
}

func (s *userStore) saveSubRolesLocked() error {
	subRoles := make([]SubRole, 0, len(s.subRoles))
	for _, subRole := range s.subRoles {
		subRoles = append(subRoles, subRole)
	}

	payload, err := json.MarshalIndent(subRoles, "", "  ")
	if err != nil {
		return err
	}
	payload = append(payload, '\n')
	return os.WriteFile(subRoleFile, payload, 0644)
}

func (s *userStore) usersHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/v1/users" {
		writeError(w, http.StatusNotFound, "route not found")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.listUsers(w)
	case http.MethodPost:
		s.createUser(w, r)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *userStore) userByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := parseUserID(r.URL.Path)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.getUser(w, id)
	case http.MethodPut, http.MethodPatch:
		s.updateUser(w, r, id)
	case http.MethodDelete:
		s.deleteUser(w, id)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *userStore) subRolesHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/api/v1/sub-roles" {
		writeError(w, http.StatusNotFound, "route not found")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.listSubRoles(w)
	case http.MethodPost:
		s.createSubRole(w, r)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *userStore) subRoleByIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := parseID(r.URL.Path, "/api/v1/sub-roles/")
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid sub role id")
		return
	}

	switch r.Method {
	case http.MethodGet:
		s.getSubRole(w, id)
	case http.MethodPut, http.MethodPatch:
		s.updateSubRole(w, r, id)
	case http.MethodDelete:
		s.deleteSubRole(w, id)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (s *userStore) loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))
	if email == "" || strings.TrimSpace(input.Password) == "" {
		writeError(w, http.StatusBadRequest, "email and password are required")
		return
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, user := range s.users {
		if strings.EqualFold(user.Email, email) && verifyPassword(input.Password, user.PasswordHash) {
			writeJSON(w, http.StatusOK, map[string]any{
				"token": fmt.Sprintf("dev-token-%d-%d", user.ID, time.Now().Unix()),
				"user":  user,
			})
			return
		}
	}

	writeError(w, http.StatusUnauthorized, "invalid email or password")
}

func (s *userStore) listSubRoles(w http.ResponseWriter) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	subRoles := make([]SubRole, 0, len(s.subRoles))
	for _, subRole := range s.subRoles {
		subRoles = append(subRoles, subRole)
	}
	writeJSON(w, http.StatusOK, subRoles)
}

func (s *userStore) getSubRole(w http.ResponseWriter, id int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	subRole, ok := s.subRoles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "sub role not found")
		return
	}
	writeJSON(w, http.StatusOK, subRole)
}

func (s *userStore) createSubRole(w http.ResponseWriter, r *http.Request) {
	input, err := parseSubRoleInput(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()
	subRole := SubRole{
		ID:        s.nextSubRoleID,
		SubRole:   strings.TrimSpace(input.SubRole),
		CreatedAt: now,
		UpdatedAt: now,
	}
	s.subRoles[subRole.ID] = subRole
	s.nextSubRoleID++

	if err := s.saveSubRolesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save sub role")
		return
	}
	writeJSON(w, http.StatusCreated, subRole)
}

func (s *userStore) updateSubRole(w http.ResponseWriter, r *http.Request, id int64) {
	input, err := parseSubRoleInput(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	subRole, ok := s.subRoles[id]
	if !ok {
		writeError(w, http.StatusNotFound, "sub role not found")
		return
	}

	subRole.SubRole = strings.TrimSpace(input.SubRole)
	subRole.UpdatedAt = time.Now().UTC()
	s.subRoles[id] = subRole

	if err := s.saveSubRolesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save sub role")
		return
	}
	writeJSON(w, http.StatusOK, subRole)
}

func (s *userStore) deleteSubRole(w http.ResponseWriter, id int64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.subRoles[id]; !ok {
		writeError(w, http.StatusNotFound, "sub role not found")
		return
	}

	for _, user := range s.users {
		if int64(user.SubRole) == id {
			writeError(w, http.StatusConflict, "sub role is still used by a user")
			return
		}
	}

	delete(s.subRoles, id)
	if err := s.saveSubRolesLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save sub role")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *userStore) listUsers(w http.ResponseWriter) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	users := make([]User, 0, len(s.users))
	for _, user := range s.users {
		users = append(users, user)
	}
	writeJSON(w, http.StatusOK, users)
}

func (s *userStore) getUser(w http.ResponseWriter, id int64) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, ok := s.users[id]
	if !ok {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *userStore) createUser(w http.ResponseWriter, r *http.Request) {
	input, file, err := parseInput(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := validateRequired(input, true); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	passwordHash, err := hashPassword(input.Password)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to hash password")
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if err := s.normalizeUserInputLocked(&input); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if s.emailExists(input.Email, 0) {
		writeError(w, http.StatusConflict, "email already exists")
		return
	}
	if s.noHPExists(input.NoHP, 0) {
		writeError(w, http.StatusConflict, "no_hp already exists")
		return
	}

	now := time.Now().UTC()
	user := User{
		ID:           s.nextID,
		Nama:         strings.TrimSpace(input.Nama),
		Nickname:     strings.TrimSpace(input.Nickname),
		Alamat:       strings.TrimSpace(input.Alamat),
		NoHP:         strings.TrimSpace(input.NoHP),
		Email:        strings.ToLower(strings.TrimSpace(input.Email)),
		PasswordHash: passwordHash,
		Role:         strings.ToLower(strings.TrimSpace(input.Role)),
		SubRole:      input.SubRole,
		Foto:         cleanOptional(input.Foto),
		Facebook:     cleanOptional(input.Facebook),
		Twitter:      cleanOptional(input.Twitter),
		Instagram:    cleanOptional(input.Instagram),
		Discord:      cleanOptional(input.Discord),
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	if user.Foto == "" {
		user.Foto = defaultPhoto
	}
	if file != nil {
		user.Foto, err = saveUpload(file, user.ID)
		if err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	s.users[user.ID] = user
	s.nextID++
	if err := s.saveLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save user")
		return
	}
	writeJSON(w, http.StatusCreated, user)
}

func (s *userStore) updateUser(w http.ResponseWriter, r *http.Request, id int64) {
	input, file, err := parseInput(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := validateRequired(input, false); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	user, ok := s.users[id]
	if !ok {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	if err := s.normalizeUserInputLocked(&input); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if s.emailExists(input.Email, id) {
		writeError(w, http.StatusConflict, "email already exists")
		return
	}
	if s.noHPExists(input.NoHP, id) {
		writeError(w, http.StatusConflict, "no_hp already exists")
		return
	}

	user.Nama = strings.TrimSpace(input.Nama)
	user.Nickname = strings.TrimSpace(input.Nickname)
	user.Alamat = strings.TrimSpace(input.Alamat)
	user.NoHP = strings.TrimSpace(input.NoHP)
	user.Email = strings.ToLower(strings.TrimSpace(input.Email))
	user.Role = strings.ToLower(strings.TrimSpace(input.Role))
	user.SubRole = input.SubRole
	user.Facebook = cleanOptional(input.Facebook)
	user.Twitter = cleanOptional(input.Twitter)
	user.Instagram = cleanOptional(input.Instagram)
	user.Discord = cleanOptional(input.Discord)
	user.UpdatedAt = time.Now().UTC()

	if strings.TrimSpace(input.Password) != "" {
		user.PasswordHash, err = hashPassword(input.Password)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to hash password")
			return
		}
	}
	if cleanOptional(input.Foto) != "" {
		user.Foto = cleanOptional(input.Foto)
	}
	if user.Foto == "" {
		user.Foto = defaultPhoto
	}
	if file != nil {
		user.Foto, err = saveUpload(file, user.ID)
		if err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			return
		}
	}

	s.users[id] = user
	if err := s.saveLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save user")
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *userStore) deleteUser(w http.ResponseWriter, id int64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.users[id]; !ok {
		writeError(w, http.StatusNotFound, "user not found")
		return
	}
	delete(s.users, id)
	if err := s.saveLocked(); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save user")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (s *userStore) emailExists(email string, exceptID int64) bool {
	email = strings.ToLower(strings.TrimSpace(email))
	for id, user := range s.users {
		if id != exceptID && strings.EqualFold(user.Email, email) {
			return true
		}
	}
	return false
}

func (s *userStore) noHPExists(noHP string, exceptID int64) bool {
	noHP = strings.TrimSpace(noHP)
	for id, user := range s.users {
		if id != exceptID && user.NoHP == noHP {
			return true
		}
	}
	return false
}

func (s *userStore) normalizeUserInputLocked(input *userInput) error {
	role := strings.ToLower(strings.TrimSpace(input.Role))
	if role != "super_admin" && role != "admin" && role != "member" {
		return errors.New("role must be super_admin, admin, or member")
	}
	input.Role = role

	if role == "member" {
		memberSubRole, ok := s.findSubRoleByNameLocked("member")
		if !ok {
			return errors.New("member sub role is not available")
		}
		input.SubRole = int(memberSubRole.ID)
		return nil
	}

	if input.SubRole <= 0 {
		return errors.New("sub_role must be greater than 0")
	}
	if _, ok := s.subRoles[int64(input.SubRole)]; !ok {
		return errors.New("sub_role must exist in sub_role table")
	}
	return nil
}

func (s *userStore) findSubRoleByNameLocked(name string) (SubRole, bool) {
	name = strings.ToLower(strings.TrimSpace(name))
	for _, subRole := range s.subRoles {
		if strings.ToLower(strings.TrimSpace(subRole.SubRole)) == name {
			return subRole, true
		}
	}
	return SubRole{}, false
}

func (s *userStore) subRoleNameByIDLocked(id int) string {
	subRole, ok := s.subRoles[int64(id)]
	if !ok {
		return ""
	}
	return strings.ToLower(strings.TrimSpace(subRole.SubRole))
}

func parseInput(r *http.Request) (userInput, *multipart.FileHeader, error) {
	r.Body = http.MaxBytesReader(nil, r.Body, maxRequestSize)
	contentType := r.Header.Get("Content-Type")

	if strings.HasPrefix(contentType, "multipart/form-data") {
		if err := r.ParseMultipartForm(maxRequestSize); err != nil {
			return userInput{}, nil, errors.New("invalid multipart form")
		}
		subRole, _ := strconv.Atoi(r.FormValue("sub_role"))
		var fileHeader *multipart.FileHeader
		if r.MultipartForm != nil && len(r.MultipartForm.File["foto"]) > 0 {
			fileHeader = r.MultipartForm.File["foto"][0]
			if err := validatePhotoExt(fileHeader.Filename); err != nil {
				return userInput{}, nil, err
			}
		}
		return userInput{
			Nama:      r.FormValue("nama"),
			Nickname:  r.FormValue("nickname"),
			Alamat:    r.FormValue("alamat"),
			NoHP:      r.FormValue("no_hp"),
			Email:     r.FormValue("email"),
			Password:  r.FormValue("password"),
			Role:      r.FormValue("role"),
			SubRole:   subRole,
			Foto:      r.FormValue("foto"),
			Facebook:  r.FormValue("facebook"),
			Twitter:   r.FormValue("twitter"),
			Instagram: r.FormValue("instagram"),
			Discord:   r.FormValue("discord"),
		}, fileHeader, nil
	}

	var input userInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return userInput{}, nil, errors.New("invalid json body")
	}
	return input, nil, nil
}

func parseSubRoleInput(r *http.Request) (subRoleInput, error) {
	var input subRoleInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		return input, errors.New("invalid json body")
	}
	if strings.TrimSpace(input.SubRole) == "" {
		return input, errors.New("sub_role is required")
	}
	return input, nil
}

func validateRequired(input userInput, requirePassword bool) error {
	required := map[string]string{
		"nama":     input.Nama,
		"nickname": input.Nickname,
		"alamat":   input.Alamat,
		"no_hp":    input.NoHP,
		"email":    input.Email,
		"role":     input.Role,
	}
	for field, value := range required {
		if strings.TrimSpace(value) == "" {
			return fmt.Errorf("%s is required", field)
		}
	}
	role := strings.ToLower(strings.TrimSpace(input.Role))
	if role != "member" && input.SubRole <= 0 {
		return errors.New("sub_role must be greater than 0")
	}
	if requirePassword && strings.TrimSpace(input.Password) == "" {
		return errors.New("password is required")
	}
	if strings.TrimSpace(input.Password) != "" && len(input.Password) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	if !strings.Contains(input.Email, "@") {
		return errors.New("email is invalid")
	}
	return nil
}

func saveUpload(fileHeader *multipart.FileHeader, userID int64) (string, error) {
	if err := validatePhotoExt(fileHeader.Filename); err != nil {
		return "", err
	}
	src, err := fileHeader.Open()
	if err != nil {
		return "", errors.New("failed to open uploaded photo")
	}
	defer src.Close()

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	filename := fmt.Sprintf("user-%d-%d%s", userID, time.Now().UnixNano(), ext)
	dstPath := filepath.Join(uploadDir, filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		return "", errors.New("failed to save uploaded photo")
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return "", errors.New("failed to write uploaded photo")
	}
	return filename, nil
}

func validatePhotoExt(filename string) error {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp":
		return nil
	default:
		return errors.New("foto must be .jpg, .jpeg, .png, or .webp")
	}
}

func parseUserID(path string) (int64, error) {
	return parseID(path, "/api/v1/users/")
}

func parseID(path string, prefix string) (int64, error) {
	idPart := strings.TrimPrefix(path, prefix)
	if idPart == "" || strings.Contains(idPart, "/") {
		return 0, errors.New("invalid id")
	}
	return strconv.ParseInt(idPart, 10, 64)
}

func hashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	hash := pbkdf2SHA256([]byte(password), salt, hashIterations, 32)
	return fmt.Sprintf(
		"pbkdf2_sha256$%d$%s$%s",
		hashIterations,
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	), nil
}

func verifyPassword(password, encodedHash string) bool {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 4 || parts[0] != "pbkdf2_sha256" {
		return false
	}

	iterations, err := strconv.Atoi(parts[1])
	if err != nil || iterations <= 0 {
		return false
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[2])
	if err != nil {
		return false
	}

	expectedHash, err := base64.RawStdEncoding.DecodeString(parts[3])
	if err != nil {
		return false
	}

	actualHash := pbkdf2SHA256([]byte(password), salt, iterations, len(expectedHash))
	return hmac.Equal(actualHash, expectedHash)
}

func pbkdf2SHA256(password, salt []byte, iterations, keyLen int) []byte {
	hashLen := sha256.Size
	numBlocks := (keyLen + hashLen - 1) / hashLen
	output := make([]byte, 0, numBlocks*hashLen)

	for block := 1; block <= numBlocks; block++ {
		mac := hmac.New(sha256.New, password)
		mac.Write(salt)
		var intBlock [4]byte
		binary.BigEndian.PutUint32(intBlock[:], uint32(block))
		mac.Write(intBlock[:])
		u := mac.Sum(nil)
		t := make([]byte, len(u))
		copy(t, u)

		for i := 1; i < iterations; i++ {
			mac = hmac.New(sha256.New, password)
			mac.Write(u)
			u = mac.Sum(nil)
			for j := range t {
				t[j] ^= u[j]
			}
		}
		output = append(output, t...)
	}
	return output[:keyLen]
}

func healthHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		writeError(w, http.StatusNotFound, "route not found")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"name":    "Maenews User API",
		"status":  "running",
		"version": "1.0.0",
		"routes": []string{
			"GET /health",
			"POST /api/v1/auth/login",
			"GET /api/v1/articles",
			"GET /api/v1/articles/{id}",
			"POST /api/v1/articles",
			"PUT /api/v1/articles/{id}",
			"DELETE /api/v1/articles/{id}",
			"POST /api/v1/articles/{id}/approve",
			"POST /api/v1/articles/{id}/pin",
			"POST /api/v1/articles/{id}/view",
			"GET /api/v1/sub-roles",
			"GET /api/v1/sub-roles/{id}",
			"POST /api/v1/sub-roles",
			"PUT /api/v1/sub-roles/{id}",
			"PATCH /api/v1/sub-roles/{id}",
			"DELETE /api/v1/sub-roles/{id}",
			"GET /api/v1/users",
			"GET /api/v1/users/{id}",
			"POST /api/v1/users",
			"PUT /api/v1/users/{id}",
			"PATCH /api/v1/users/{id}",
			"DELETE /api/v1/users/{id}",
			"GET /uploads/{filename}",
		},
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func cleanOptional(value string) string {
	return strings.TrimSpace(value)
}

func env(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
