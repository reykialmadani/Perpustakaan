# API Endpoint Mapping - INDKESTAT

Dokumentasi lengkap endpoint API back-end Golang yang dikonsumsi oleh front-end React.

**Base URL**: `http://localhost:8001/api/v1`

---

## 1. Authentication

### POST `/login`
Login pegawai (admin).

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "error": false,
  "msg": "Login successful",
  "data": {
    "username": "admin",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response 401:**
```json
{
  "error": true,
  "msg": "username atau password salah"
}
```

---

## 2. Buku (Public - Tanpa JWT)

### GET `/buku`
List semua buku.

**Response 200:**
```json
{
  "error": false,
  "msg": "Success get all buku",
  "data": [
    {
      "id_buku": "01H...",
      "isbn": "978-...",
      "judul_buku": "...",
      "stok_buku": 5,
      ...
    }
  ]
}
```

### GET `/buku/:id`
Detail buku by ID.

---

## 3. Jenis Buku (Protected - Butuh JWT)

**Header**: `Authorization: Bearer <token>`

### GET `/admin/buku/jenbuk`
List semua jenis buku. Optional query: `?q=fiksi` untuk search.

### GET `/admin/buku/jenbuk/:id`
Detail jenis buku.

### POST `/admin/buku/jenbuk/create`
**Request:**
```json
{
  "jenis_buku": "Fiksi",
  "deskripsi": "Buku-buku fiksi"
}
```

### PUT `/admin/buku/jenbuk/update`
**Request:**
```json
{
  "id": "01H...",
  "jenis_buku": "Fiksi",
  "deskripsi": "..."
}
```

### DELETE `/admin/buku/jenbuk/delete`
**Request:**
```json
{ "id": "01H..." }
```

---

## 4. Penerbit Buku (Protected)

### GET `/admin/buku/penbuk`
List penerbit. Optional `?q=...`.

### POST `/admin/buku/penbuk/create`
```json
{
  "penerbit_buku": "Gramedia",
  "alamat_penerbit": "Jakarta",
  "telp_penerbit": "021-12345",
  "email_penerbit": "info@gramedia.com",
  "deskripsi": "..."
}
```

### PUT `/admin/buku/penbuk/update`
Sama dengan create + tambah field `id`.

### DELETE `/admin/buku/penbuk/delete`
```json
{ "id": "01H..." }
```

---

## 5. Penulis Buku (Protected)

### GET `/admin/buku/author`
List penulis. Optional `?q=...`.

### POST `/admin/buku/author/create`
```json
{
  "penulis_buku": "Andrea Hirata",
  "alamat_penulis": "Belitung",
  "email_penulis": "andrea@example.com",
  "deskripsi": "..."
}
```

### PUT `/admin/buku/author/update`
Tambah field `id`.

### DELETE `/admin/buku/author/delete`
```json
{ "id": "01H..." }
```

---

## 6. Peminjaman (Protected)

### GET `/admin/peminjaman`
List semua peminjaman.

### GET `/admin/peminjaman/:id`
Detail peminjaman by ID.

### GET `/admin/peminjaman/detail/:id`
Detail peminjaman dengan **detail buku yang dipinjam** (relasi).

**Response 200:**
```json
{
  "error": false,
  "data": {
    "id": "01H...",
    "anggota": {
      "id_anggota": "01H...",
      "nama": "John Doe"
    },
    "tgl_pinjam": "2025-...",
    "tgl_hrs_kembali": "2025-...",
    "jaminan": "KTP",
    "details": [
      {
        "id_detailpinjam": "01H...",
        "id_buku": "01H...",
        "kondisi": "Baik"
      }
    ]
  }
}
```

### POST `/admin/peminjaman/create`
```json
{
  "id_anggota": "01H...",
  "tgl_pinjam": "2025-01-15T00:00:00Z",
  "tgl_hrs_kembali": "2025-01-22T00:00:00Z",
  "jaminan": "KTP"
}
```

### PUT `/admin/peminjaman/update`
Tambah field `id_peminjaman`.

### DELETE `/admin/peminjaman/delete`
```json
{ "id_peminjaman": "01H..." }
```

---

## 7. Denda (Protected)

### GET `/admin/denda`
List semua denda.

### GET `/admin/denda/:id`
Detail denda.

### POST `/admin/denda/create`
```json
{
  "jumlah_denda": 50000,
  "tgl_pinjam": "2025-01-15T00:00:00Z",
  "tgl_hrs_kembali": "2025-01-22T00:00:00Z",
  "tgl_kembali": "2025-01-25T00:00:00Z",
  "id_peminjaman": "01H...",
  "id_anggota": "01H..."
}
```

### PUT `/admin/denda/update`
Tambah field `id_denda`.

### DELETE `/admin/denda/delete`
```json
{ "id_denda": "01H..." }
```

---

## Error Response Format (Umum)

```json
{
  "error": true,
  "msg": "Pesan error..."
}
```

## HTTP Status Codes
- `200 OK` - Sukses get/update/delete
- `201 Created` - Sukses create
- `400 Bad Request` - Validasi gagal
- `401 Unauthorized` - JWT invalid/expired
- `500 Internal Server Error` - Error server

---

## Catatan Important

1. **Semua ID** menggunakan **ULID** (26 karakter)
2. **Tanggal** dikirim dalam format **ISO 8601** (`2025-01-15T00:00:00Z`)
3. **DELETE** menggunakan **request body** (bukan params), butuh `data` di Axios
4. **PUT** untuk update juga via body (tanpa `:id` di URL)
5. **Search**: gunakan `?q=keyword` di endpoint list jenis/penerbit/penulis
