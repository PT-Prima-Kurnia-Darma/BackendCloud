'use strict';
require('dotenv').config();

const {
  PORT = 3000,
  HOST = '0.0.0.0',
  FIRESTORE_PROJECT_ID,
  FIRESTORE_CLIENT_EMAIL,
  FIRESTORE_PRIVATE_KEY,
  JWT_SECRET,
} = process.env;

if (!FIRESTORE_PROJECT_ID || !FIRESTORE_CLIENT_EMAIL || !FIRESTORE_PRIVATE_KEY) {
  console.warn('Environment variable Firestore credentials belum lengkap.');
}
if (!JWT_SECRET) {
  console.warn('Environment variable JWT_SECRET belum didefinisikan.');
}

module.exports = {
  PORT: Number(PORT),
  HOST,
  FIRESTORE_PROJECT_ID,
  FIRESTORE_CLIENT_EMAIL,
  FIRESTORE_PRIVATE_KEY,
  JWT_SECRET,
};