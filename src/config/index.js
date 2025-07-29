'use strict';
require('dotenv').config();

const {
  PORT = process.env.PORT || 3000,
  HOST = '0.0.0.0',
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_PRIVATE_KEY,
  JWT_SECRET,
} = process.env;

if (!GOOGLE_CLOUD_PROJECT_ID || !GOOGLE_CLOUD_CLIENT_EMAIL || !GOOGLE_CLOUD_PRIVATE_KEY) {
  console.warn('Environment variable Googel Cloud credentials belum lengkap.');
}
if (!JWT_SECRET) {
  console.warn('Environment variable JWT_SECRET belum didefinisikan.');
}

module.exports = {
  PORT: Number(PORT),
  HOST,
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_CLIENT_EMAIL,
  GOOGLE_CLOUD_PRIVATE_KEY,
  JWT_SECRET,
};