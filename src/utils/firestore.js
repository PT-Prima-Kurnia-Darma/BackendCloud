
'use strict';

const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

let firestore;

// Di Cloud Run, NODE_ENV akan set ke production
if (process.env.NODE_ENV === 'production') {
  // Jika di produksi, inisialisasi tanpa kredensial.
  // Library akan otomatis memakai service account dari Cloud Run.
  firestore = new Firestore();
} else {
  // Jika di lokal gunakan kredensial dari file .env.
  let privateKey = config.GOOGLE_CLOUD_PRIVATE_KEY;
  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // Pastikan kredensial ada sebelum mencoba inisialisasi
  if (!config.GOOGLE_CLOUD_PROJECT_ID || !config.GOOGLE_CLOUD_CLIENT_EMAIL || !privateKey) {
    throw new Error('Kredensial Google Cloud tidak lengkap. Pastikan .env sudah benar.');
  }

  firestore = new Firestore({
    projectId: config.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: config.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

module.exports = firestore;