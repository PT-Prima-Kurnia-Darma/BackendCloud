// src/utils/firestore.js
'use strict';

const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

let firestore;

// Di Cloud Run, NODE_ENV akan kita set ke 'production'
if (process.env.NODE_ENV === 'production') {
  // Jika di produksi, inisialisasi tanpa kredensial.
  // Library akan otomatis memakai service account dari Cloud Run.
  firestore = new Firestore();
} else {
  // Jika di lokal (pengembangan), gunakan kredensial dari file .env.
  let privateKey = config.FIRESTORE_PRIVATE_KEY;
  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Pastikan kredensial ada sebelum mencoba inisialisasi
  if (!config.FIRESTORE_PROJECT_ID || !config.FIRESTORE_CLIENT_EMAIL || !privateKey) {
    throw new Error('Kredensial Firestore tidak lengkap. Pastikan .env sudah benar.');
  }

  firestore = new Firestore({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

module.exports = firestore;