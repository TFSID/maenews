# Maenews API Documentation

Dokumentasi ini ditujukan untuk programmer frontend yang akan mengonsumsi API Golang Maenews.

## Base URL

Local development:

```txt
http://localhost:8080
```

API prefix:

```txt
/api/v1
```

Contoh:

```txt
http://localhost:8080/api/v1/articles
```

## Format Response

Response sukses memakai JSON langsung berupa object atau array.

Response error:

```json
{
  "error": "message"
}
```

Status umum:

```txt
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

## Authentication

Saat ini token login bersifat development token dan belum wajib dikirim ulang ke endpoint lain. Untuk operasi yang butuh identitas actor, frontend mengirim `actor_id`.

### Login

```txt
POST /api/v1/auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "syahrul@gmail.com",
  "password": "12345678"
}
```

Response:

```json
{
  "token": "dev-token-1-1779280000",
  "user": {
    "id": 1,
    "nama": "admin",
    "nickname": "admin",
    "alamat": "bogor",
    "no_hp": "088217071996",
    "email": "syahrul@gmail.com",
    "role": "super_admin",
    "sub_role": 1,
    "foto": "default.jpg",
    "facebook": "",
    "twitter": "",
    "instagram": "",
    "discord": "",
    "created_at": "2026-05-20T12:27:41Z",
    "updated_at": "2026-05-20T12:27:41Z"
  }
}
```

## Model Data

### User

```ts
type UserRole = "super_admin" | "admin" | "member";

interface User {
  id: number;
  nama: string;
  nickname: string;
  alamat: string;
  no_hp: string;
  email: string;
  role: UserRole;
  sub_role: number;
  foto: string;
  facebook: string;
  twitter: string;
  instagram: string;
  discord: string;
  created_at: string;
  updated_at: string;
}
```

Catatan:

- `email` unique.
- `no_hp` unique.
- `password` tidak pernah dikirim di response.
- Jika `foto` kosong, backend memakai `default.jpg`.
- Role `member` otomatis memakai sub role bernama `member`.

### Sub Role

```ts
interface SubRole {
  id: number;
  sub_role: string;
  created_at: string;
  updated_at: string;
}
```

### Article

```ts
type ArticleCategory = "anime" | "creator" | "event" | "gaming" | "cosplay";
type ArticleStatus = "draft" | "pending" | "published" | "rejected" | "takedown";

interface Article {
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
```

Catatan artikel:

- Artikel yang tampil ke publik adalah `status = "published"`.
- Saat user membuat artikel, status hanya bisa menjadi `draft` atau `pending`.
- Status `published`, `rejected`, dan `takedown` hanya lewat endpoint moderasi.
- Moderator artikel adalah `super_admin` atau `admin` dengan sub role `editor`.
- Artikel pinned maksimal 3 artikel per kategori.

## Users API

### List Users

```txt
GET /api/v1/users
```

Response:

```json
[
  {
    "id": 1,
    "nama": "admin",
    "nickname": "admin",
    "alamat": "bogor",
    "no_hp": "088217071996",
    "email": "syahrul@gmail.com",
    "role": "super_admin",
    "sub_role": 1,
    "foto": "default.jpg",
    "facebook": "",
    "twitter": "",
    "instagram": "",
    "discord": "",
    "created_at": "2026-05-20T12:27:41Z",
    "updated_at": "2026-05-20T12:27:41Z"
  }
]
```

### Get User

```txt
GET /api/v1/users/{id}
```

### Create User

```txt
POST /api/v1/users
Content-Type: application/json
```

Request JSON:

```json
{
  "nama": "Ruli",
  "nickname": "ruli",
  "alamat": "Bogor",
  "no_hp": "082171627162",
  "email": "ruli@gmail.com",
  "password": "12345678",
  "role": "member",
  "sub_role": 3,
  "foto": "",
  "facebook": "",
  "twitter": "",
  "instagram": "",
  "discord": ""
}
```

Untuk upload foto gunakan `multipart/form-data`:

```txt
POST /api/v1/users
Content-Type: multipart/form-data
```

Field form:

```txt
nama
nickname
alamat
no_hp
email
password
role
sub_role
foto      file, optional
facebook  optional
twitter   optional
instagram optional
discord   optional
```

### Update User

```txt
PUT /api/v1/users/{id}
PATCH /api/v1/users/{id}
```

Body sama seperti create. `password` boleh kosong jika tidak ingin mengganti password.

### Delete User

```txt
DELETE /api/v1/users/{id}
```

Response sukses:

```txt
204 No Content
```

## Sub Roles API

### List Sub Roles

```txt
GET /api/v1/sub-roles
```

### Get Sub Role

```txt
GET /api/v1/sub-roles/{id}
```

### Create Sub Role

```txt
POST /api/v1/sub-roles
Content-Type: application/json
```

Request:

```json
{
  "sub_role": "editor"
}
```

### Update Sub Role

```txt
PUT /api/v1/sub-roles/{id}
PATCH /api/v1/sub-roles/{id}
```

Request:

```json
{
  "sub_role": "kelola_member"
}
```

### Delete Sub Role

```txt
DELETE /api/v1/sub-roles/{id}
```

Catatan:

- Sub role tidak bisa dihapus jika masih dipakai user.

## Articles API

### List Articles

```txt
GET /api/v1/articles
```

Query params:

```txt
status    optional: draft | pending | published | rejected | takedown
kategori  optional: anime | creator | event | gaming | cosplay
homepage  optional: true
```

Contoh artikel published kategori anime:

```txt
GET /api/v1/articles?status=published&kategori=anime
```

Contoh artikel homepage:

```txt
GET /api/v1/articles?homepage=true
```

Catatan sorting:

- `homepage=true`: hanya artikel `published`, pinned di atas, lalu trending berdasarkan jumlah view 7 hari sejak `published_at`.
- Dengan `kategori`: pinned di atas, lalu artikel terbaru.
- Tanpa query khusus: artikel terbaru berdasarkan `created_at`.

### Get Article

```txt
GET /api/v1/articles/{id}
```

### Create Article

```txt
POST /api/v1/articles
Content-Type: application/json
```

Request:

```json
{
  "judul": "Judul artikel",
  "kategori": "anime",
  "konten": "<p>Isi artikel dalam HTML</p>",
  "konten_json": {
    "type": "doc",
    "content": []
  },
  "cuplikan": "Ringkasan pendek artikel.",
  "thumbnail_url": "https://example.com/image.jpg",
  "author_id": 5,
  "actor_id": 5,
  "status": "pending"
}
```

Catatan:

- `status` hanya efektif untuk `draft` atau `pending`.
- Jika frontend mengirim `published`, backend tetap menyimpan sebagai `pending`.
- `author_id` harus ID user yang valid.
- `kategori` wajib salah satu: `anime`, `creator`, `event`, `gaming`, `cosplay`.

### Update Article

```txt
PUT /api/v1/articles/{id}
PATCH /api/v1/articles/{id}
Content-Type: application/json
```

Request sama seperti create.

Permission:

- Author bisa edit artikel sendiri selama artikel belum `published`.
- Moderator bisa edit artikel.

### Delete Article

```txt
DELETE /api/v1/articles/{id}?actor_id={user_id}
```

Permission:

- Author bisa delete artikel sendiri selama artikel belum `published`.
- Moderator bisa delete artikel.

### Approve Article

```txt
POST /api/v1/articles/{id}/approve
Content-Type: application/json
```

Request:

```json
{
  "actor_id": 3
}
```

Efek:

- `status` menjadi `published`.
- `acc_by_id` menjadi `actor_id`.
- `published_at` terisi waktu saat approve.

Permission:

- `super_admin`
- `admin` dengan sub role `editor`

### Update Article Status

```txt
POST /api/v1/articles/{id}/status
Content-Type: application/json
```

Request publish:

```json
{
  "actor_id": 3,
  "status": "published"
}
```

Request tolak:

```json
{
  "actor_id": 3,
  "status": "rejected"
}
```

Request takedown:

```json
{
  "actor_id": 3,
  "status": "takedown"
}
```

Status yang diterima endpoint ini:

```txt
published
rejected
takedown
```

Catatan:

- `rejected` dan `takedown` otomatis membuat `is_pinned = false`.

### Pin / Unpin Article

```txt
POST /api/v1/articles/{id}/pin
Content-Type: application/json
```

Request pin:

```json
{
  "actor_id": 3,
  "is_pinned": true
}
```

Request unpin:

```json
{
  "actor_id": 3,
  "is_pinned": false
}
```

Catatan:

- Hanya artikel `published` yang bisa di-pin.
- Maksimal 3 pinned artikel per kategori.

### Track Article View

```txt
POST /api/v1/articles/{id}/view
```

Dipanggil saat user membuka detail artikel. Backend menambahkan timestamp ke `view_events`.

## Uploads

Foto user yang diupload bisa diakses lewat:

```txt
GET /uploads/{filename}
```

Contoh:

```txt
http://localhost:8080/uploads/user-4-1779283017402517100.png
```

## Frontend Notes

### URL Artikel

Frontend membuat URL artikel seperti:

```txt
/article/{id}/{judul-dengan-strip}
```

Contoh:

```txt
/article/3/manga-sakamoto-days-menuju-akhir
```

API backend tetap mengambil artikel dengan ID:

```txt
GET /api/v1/articles/3
```

### Halaman Kategori

Untuk halaman kategori:

```txt
/category/anime
```

Frontend sebaiknya fetch:

```txt
GET /api/v1/articles?status=published&kategori=anime
```

Lalu pagination frontend menampilkan 9 artikel per halaman.

### Homepage

Untuk homepage:

```txt
GET /api/v1/articles?homepage=true
```

Response sudah disortir:

1. Pinned artikel di atas.
2. Hot/trending berdasarkan view 7 hari setelah publish.
3. Artikel published lain berdasarkan waktu publish.

## Contoh Fetch Frontend

```ts
const API_BASE_URL = "http://localhost:8080/api/v1";

export async function getPublishedArticlesByCategory(category: string) {
  const response = await fetch(
    `${API_BASE_URL}/articles?status=published&kategori=${encodeURIComponent(category)}`
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Gagal memuat artikel");
  }

  return data;
}
```

```ts
export async function approveArticle(articleID: number, actorID: number) {
  const response = await fetch(`${API_BASE_URL}/articles/${articleID}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ actor_id: actorID }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Gagal acc artikel");
  }

  return data;
}
```

