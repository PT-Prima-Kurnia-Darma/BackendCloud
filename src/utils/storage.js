
'use strict';

const { Storage } = require('@google-cloud/storage');
const config = require('../config');

let storage;

if (process.env.NODE_ENV === 'production') {
  // Jika di produksi, inisialisasi tanpa kredensial.
  // Library akan otomatis memakai service account dari Cloud Run.
  storage = new Storage();
} else {
  // Jika di lokal gunakan kredensial dari file .env.
  let privateKey = config.GOOGLE_CLOUD_PRIVATE_KEY;
  if (privateKey && privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!config.GOOGLE_CLOUD_PROJECT_ID || !config.GOOGLE_CLOUD_CLIENT_EMAIL || !privateKey) {
    throw new Error('Kredensial Google Cloud tidak lengkap di .env.');
  }

  storage = new Storage({
    projectId: config.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
      client_email: config.GOOGLE_CLOUD_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

const BUCKET_NAME = 'audit-riksauji';

module.exports = { storage, BUCKET_NAME };