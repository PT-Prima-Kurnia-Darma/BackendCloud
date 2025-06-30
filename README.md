# Sistem Backend Audit Riksa Uji PT Prima Kurnia Darma

Sistem ini menggunakan **Node.js** dengan framework **Hapi.js** serta database **FireStore** untuk mengelola data sistem Manajemen Audit Riksa Uji.

## Fitur
- Register Pengguna
- Login Pengguna
- Logout Pengguna
- Delete Pengguna
- Modifikasi Data Pengguna
- Validasi JWT  

## Start Project
**Install Dependecies**
  ```json
  npm i
  ```

## File Configuration
**.env**
  ```json
  # Server Configuration
  PORT=
  HOST=
  JWT_SECRET=
  LLM_API_KEY

  # Firestore service account credentials
  FIRESTORE_PROJECT_ID=
  FIRESTORE_CLIENT_EMAIL=
  FIRESTORE_PRIVATE_KEY=
  ```

## API EndPoint

### Fitur Autentifikasi

#### Register
**URL:**
`/auth/register`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "name": "Nama Lengkap",
  "username": "usernamebaru",
  "password": "passwordrahasia"
  }
  ```

**Response:**
- **Success:**
  ```json
  {
    "status": "success",
    "message": "Registrasi berhasil",
    "data": {
        "id": "userIdBaru",
        "name": "Nama Lengkap",
        "username": "usernamebaru",
        "createdAt": "2023-10-27T10:00:00.000Z"
    }
  }
  ```

- **Failur (409 Conflict - Username sudah ada)**
  ```json
  {
   "status": "error",
   "message": "Username sudah terdaftar"
  }
  ```

- **Failure (400 Bad Request - Validasi gagal)**
  ```json
  {
   "status": "error",
   "message": "Name minimal 3 karakter"
  }
  ```

#### Login
**URL:**
`/auth/login`
**Method:**
`POST`

**Body Request**
  ```json
  {
  "username": "usernamebaru",
  "password": "passwordrahasia"
  }
  ```

**Response:**
- **Success (200 OK)**
  ```json
  {
    "status": "success",
    "message": "Login berhasil",
        "data": {
         "user": {
         "id": "userId",
         "username": "usernamebaru",
         "name": "Nama Lengkap"
         },
           "token": "jwt.token.panjang"
    }
  }
  ```

- **Failur (401 Unauthorized - Kredensial salah)**
  ```json
  {
    "status": "error",
    "message": "Username atau password salah"
  }
  ```

#### Logout
**URL:**
`/auth/logout`
**Method:**
`POST`
**Headers**
`Authorization: Bearer jwt.token.panjang`

**Response:**
- **Success (200 OK)**
  ```json
  {
   "status": "success",
   "message": "Logout berhasil"
  }
  ```

- **Failur (401 Unauthorized - Kredensial salah)**
  ```json
  {
   "status": "error",
   "message": "Missing authentication"
  }

#### Modifikasi Pengguna
**URL:**
`/auth/change`
**Method:**
`PUT`
**Headers**
`Authorization: Bearer jwt.token.panjang`

**Body Request**
  ```json
{
  "name": "Nama Baru",
  "username": "usernamebaru_diubah",
  "oldPassword": "pasword lama",
  "newPassword": "password baru",
}
  ```

**Response:**
- **Success (200 OK)**
  ```json
  {
    "status": "success",
    "message": "Profil berhasil diperbarui",
    "data": {
        "username": "hadriannew",
        "name": "hadriannew",
        "userId": "XffGBpu1bn6ZfFVZ7LR6"
      }
  }
  ```

- **Failur (401 Unauthorized - Kata sandi lama salah)**
  ```json
  {
   "status": "error",
   "message": "Password lama salah"
  }

- **Failur (409 Conflict - Username baru sudah digunakan)**
  ```json
  {
   "status": "error",
   "message": "Username sudah digunakan"
  }

- **Failur (404 Not Found - Pengguna tidak ditemukan)**
  ```json
  {
   "status": "error",
   "message": "User tidak ditemukan"
  }

- **Failur (404 Not Found - password tidak boleh sama)**
  ```json
  {
    "status": "error",
    "message": "password lama dan baru tidak bole sama"
  }'

- **Failur (404 Not Found - data tidak boleh sama)**
  ```json
  {
    "status": "error",
    "message": "data pengguna tidak boleh sama seperti sebelumnya"
  }

- **Failur (404 Not Found - username tidak boleh sama)**
  ```json
  {
    "status": "error",
    "message": "username tidak boleh sama seperti sebelumnya"
  }

- **Failur (404 Not Found - name tidak boleh sama)**
  ```json
  {
    "status": "error",
    "message": "name tidak boleh sama seperti sebelumnya"
  }

#### Delete Pengguna
**URL:**
`/auth/delete{id}`
**Method:**
`DELETE`

**Response:**
- **Success (200 OK)**
  ```json
  {
   "status": "success",
   "message": "User berhasil dihapus"
  }
  ```

- **Failure (404 Not Found - Pengguna tidak ditemukan)**
  ```json
  {
   "status": "error",
   "message": "User tidak ditemukan"
  }

#### Validasi Token
**URL:**
`/auth/validateToken`
**Method:**
`POST`

**Body Request**
  ```json
  {
   "token": "jwt token"
  }
  ```

**Response:**
- **Success (200 OK)**
  ```json
  {
   "status": "success",
   "message": "token valid"
  }
  ```

- **Failure (404 Not Found - Pengguna tidak ditemukan)**
  ```json
  {
   "status": "error",
   "message": "token invalid"
  }