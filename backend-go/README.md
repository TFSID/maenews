# Maenews User API

API Golang eksternal untuk CRUD user.

Dokumentasi endpoint lengkap untuk frontend ada di [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Menjalankan

```bash
cd backend-go
go run .
```

Default server:

```txt
http://localhost:8080
```

Jika ingin port lain:

```bash
PORT=8000 go run .
```

## Endpoint

```txt
GET    /
GET    /health
POST   /api/v1/auth/login
GET    /api/v1/sub-roles
GET    /api/v1/sub-roles/{id}
POST   /api/v1/sub-roles
PUT    /api/v1/sub-roles/{id}
PATCH  /api/v1/sub-roles/{id}
DELETE /api/v1/sub-roles/{id}
GET    /api/v1/users
GET    /api/v1/users/{id}
POST   /api/v1/users
PUT    /api/v1/users/{id}
PATCH  /api/v1/users/{id}
DELETE /api/v1/users/{id}
GET    /uploads/{filename}
```

## Field User

```json
{
  "nama": "admin",
  "nickname": "admin",
  "alamat": "bogor",
  "no_hp": "088217071996",
  "email": "syahrul@gmail.com",
  "password": "12345678",
  "role": "super_admin",
  "sub_role": 1,
  "foto": "default.jpg",
  "facebook": "",
  "twitter": "",
  "instagram": "",
  "discord": ""
}
```

Catatan:

- `no_hp` dan `email` wajib unique.
- `password` disimpan sebagai hash PBKDF2-SHA256, tidak dikirim ulang di response.
- Jika `foto` kosong dan tidak ada upload file, nilainya otomatis `default.jpg`.
- `facebook`, `twitter`, `instagram`, dan `discord` boleh kosong.
- Data disimpan ke `data/users.json`.
- File upload foto disimpan ke folder `uploads`.

## Dummy Data

Saat pertama kali dijalankan, API otomatis membuat user:

```txt
nama: admin
nickname: admin
alamat: bogor
no_hp: 088217071996
email: syahrul@gmail.com
password: 12345678
role: super_admin
sub_role: 1
foto: default.jpg
```

## Contoh Request JSON

```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "user satu",
    "nickname": "user1",
    "alamat": "jakarta",
    "no_hp": "081234567890",
    "email": "user1@example.com",
    "password": "12345678",
    "role": "admin",
    "sub_role": 1,
    "facebook": "",
    "twitter": "",
    "instagram": "",
    "discord": ""
  }'
```

## Contoh Upload Foto

```bash
curl -X POST http://localhost:8080/api/v1/users \
  -F "nama=user foto" \
  -F "nickname=userfoto" \
  -F "alamat=bandung" \
  -F "no_hp=089999999999" \
  -F "email=userfoto@example.com" \
  -F "password=12345678" \
  -F "role=admin" \
  -F "sub_role=1" \
  -F "foto=@avatar.jpg"
```
