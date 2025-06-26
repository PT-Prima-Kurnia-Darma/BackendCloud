'use strict';
require('dotenv').config();

const {
  PORT = 3000,
  HOST = 'localhost',
  FIRESTORE_PROJECT_ID,
  FIRESTORE_CLIENT_EMAIL,
  FIRESTORE_PRIVATE_KEY,
} = process.env;

if (!FIRESTORE_PROJECT_ID || !FIRESTORE_CLIENT_EMAIL || !FIRESTORE_PRIVATE_KEY) {
  console.warn('Environment variable Firestore credentials belum lengkap.');
}

module.exports = {
  PORT: Number(PORT),
  HOST,
  FIRESTORE_PROJECT_ID,
  FIRESTORE_CLIENT_EMAIL,
  FIRESTORE_PRIVATE_KEY,
};
