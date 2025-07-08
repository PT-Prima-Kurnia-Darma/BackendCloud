# Sistem Backend Audit Riksa Uji PT Prima Kurnia Darma

Sistem ini menggunakan **Node.js** dengan framework **Hapi.js** serta database **FireStore** untuk mengelola data sistem Manajemen Audit Riksa Uji.

## Fitur

- Register Pengguna
- Login Pengguna
- Logout Pengguna
- Delete Pengguna
- Modifikasi Data Pengguna
- Validasi JWT
- CRUD Elevator dan Eskalator (Laporan dan BAP)

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
[![Dokumentasi API](https://img.shields.io/badge/Dokumentasi-API-blue.svg)](https://graceful-panda-jjxsc.apidocumentation.com/)