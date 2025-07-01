// src/utils/firestore.js
'use strict';

const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

// Logika untuk memformat private key dipindahkan ke sini
let privateKey = config.FIRESTORE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

// Inisialisasi instance Firestore
const firestore = new Firestore({
  projectId: config.FIRESTORE_PROJECT_ID,
  credentials: {
    client_email: config.FIRESTORE_CLIENT_EMAIL,
    private_key: privateKey,
  },
});

// Ekspor instance yang sudah jadi agar bisa digunakan di file lain
module.exports = firestore;