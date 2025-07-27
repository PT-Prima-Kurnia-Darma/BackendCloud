
'use strict';

const { Storage } = require('@google-cloud/storage');
const config = require('../config');

let storage;

// Cek apakah aplikasi berjalan di lingkungan produksi (seperti Cloud Run)
if (process.env.NODE_ENV === 'production') {
  // Jika di produksi, inisialisasi tanpa kredensial.
  // Library akan otomatis memakai service account dari Cloud Run.
  storage = new Storage();
} else {
  // Jika di lokal (pengembangan), gunakan kredensial dari file .env.
  let privateKey = config.FIRESTORE_PRIVATE_KEY;
  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Pastikan kredensial ada sebelum mencoba inisialisasi
  if (!config.FIRESTORE_PROJECT_ID || !config.FIRESTORE_CLIENT_EMAIL || !privateKey) {
    throw new Error('Kredensial Firestore/Storage tidak lengkap di .env.');
  }

  storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

const BUCKET_NAME = 'audit-riksauji'; // Nama bucket Anda

module.exports = { storage, BUCKET_NAME };