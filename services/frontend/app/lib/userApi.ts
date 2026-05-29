export interface User {
  id: number;
  nama: string;
  nickname: string;
  alamat: string;
  no_hp: string;
  email: string;
  role: string;
  sub_role: number;
  foto: string;
  facebook: string;
  twitter: string;
  instagram: string;
  discord: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = "super_admin" | "admin" | "member";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SubRole {
  id: number;
  sub_role: string;
  created_at: string;
  updated_at: string;
}

export interface UserPayload {
  nama: string;
  nickname: string;
  alamat: string;
  no_hp: string;
  email: string;
  password?: string;
  role: UserRole;
  sub_role: number;
  foto?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  discord?: string;
  fotoFile?: File | null;
}

export interface NewsArticle {
  id: number;
  judul: string;
  kategori: ArticleCategory;
  konten: string;
  konten_json: unknown;
  cuplikan: string;
  thumbnail_url: string;
  author_id: number;
  acc_by_id: number;
  status: ArticleStatus;
  is_pinned: boolean;
  view_events: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsArticlePayload {
  judul: string;
  kategori: ArticleCategory;
  konten: string;
  konten_json: unknown;
  cuplikan: string;
  thumbnail_url: string;
  author_id: number;
  actor_id: number;
  status?: "draft" | "pending";
}

export type ArticleCategory = "anime" | "creator" | "event" | "gaming" | "cosplay";
export type ArticleStatus = "draft" | "pending" | "published" | "rejected" | "takedown";

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "anime",
  "creator",
  "event",
  "gaming",
  "cosplay",
];

const USER_API_BASE_URL =
  process.env.NEXT_PUBLIC_USER_API_BASE_URL || "http://localhost:8080/api/v1";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${USER_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || "Login gagal");
  }

  return payload as LoginResponse;
}

async function requestJSON<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${USER_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Request gagal");
  }
  return payload as T;
}

export function getSubRoles(): Promise<SubRole[]> {
  return requestJSON<SubRole[]>("/sub-roles");
}

export function getUsers(): Promise<User[]> {
  return requestJSON<User[]>("/users");
}

export function createUser(payload: UserPayload): Promise<User> {
  return requestUserForm<User>("/users", "POST", payload);
}

export function updateUser(id: number, payload: UserPayload): Promise<User> {
  return requestUserForm<User>(`/users/${id}`, "PUT", payload);
}

export function deleteUser(id: number): Promise<void> {
  return requestJSON<void>(`/users/${id}`, {
    method: "DELETE",
  });
}

export function getNewsArticles(status?: string): Promise<NewsArticle[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return requestJSON<NewsArticle[]>(`/articles${query}`);
}

export function getNewsArticle(id: number): Promise<NewsArticle> {
  return requestJSON<NewsArticle>(`/articles/${id}`);
}

export function createNewsArticle(
  payload: NewsArticlePayload
): Promise<NewsArticle> {
  return requestJSON<NewsArticle>("/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateNewsArticle(
  id: number,
  payload: NewsArticlePayload
): Promise<NewsArticle> {
  return requestJSON<NewsArticle>(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteNewsArticle(id: number, actorID: number): Promise<void> {
  return requestJSON<void>(`/articles/${id}?actor_id=${actorID}`, {
    method: "DELETE",
  });
}

export function approveNewsArticle(
  id: number,
  actorID: number
): Promise<NewsArticle> {
  return requestJSON<NewsArticle>(`/articles/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ actor_id: actorID }),
  });
}

export function updateNewsArticleStatus(
  id: number,
  actorID: number,
  status: Extract<ArticleStatus, "published" | "rejected" | "takedown">
): Promise<NewsArticle> {
  return requestJSON<NewsArticle>(`/articles/${id}/status`, {
    method: "POST",
    body: JSON.stringify({ actor_id: actorID, status }),
  });
}

export function pinNewsArticle(
  id: number,
  actorID: number,
  isPinned: boolean
): Promise<NewsArticle> {
  return requestJSON<NewsArticle>(`/articles/${id}/pin`, {
    method: "POST",
    body: JSON.stringify({ actor_id: actorID, is_pinned: isPinned }),
  });
}

export function createSubRole(subRole: string): Promise<SubRole> {
  return requestJSON<SubRole>("/sub-roles", {
    method: "POST",
    body: JSON.stringify({ sub_role: subRole }),
  });
}

export function updateSubRole(id: number, subRole: string): Promise<SubRole> {
  return requestJSON<SubRole>(`/sub-roles/${id}`, {
    method: "PUT",
    body: JSON.stringify({ sub_role: subRole }),
  });
}

export function deleteSubRole(id: number): Promise<void> {
  return requestJSON<void>(`/sub-roles/${id}`, {
    method: "DELETE",
  });
}

async function requestUserForm<T>(
  path: string,
  method: "POST" | "PUT",
  payload: UserPayload
): Promise<T> {
  const formData = new FormData();
  formData.set("nama", payload.nama);
  formData.set("nickname", payload.nickname);
  formData.set("alamat", payload.alamat);
  formData.set("no_hp", payload.no_hp);
  formData.set("email", payload.email);
  formData.set("role", payload.role);
  formData.set("sub_role", String(payload.sub_role));
  formData.set("foto", payload.foto || "");
  formData.set("facebook", payload.facebook || "");
  formData.set("twitter", payload.twitter || "");
  formData.set("instagram", payload.instagram || "");
  formData.set("discord", payload.discord || "");
  if (payload.password) {
    formData.set("password", payload.password);
  }
  if (payload.fotoFile) {
    formData.set("foto", payload.fotoFile);
  }

  const response = await fetch(`${USER_API_BASE_URL}${path}`, {
    method,
    body: formData,
  });

  const responsePayload = await response.json();
  if (!response.ok) {
    throw new Error(responsePayload.error || "Request gagal");
  }
  return responsePayload as T;
}
