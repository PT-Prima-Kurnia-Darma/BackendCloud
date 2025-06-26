'use strict';
const config = require('../../../config');
const routes = require('./routes');
const { Firestore } = require('@google-cloud/firestore');
const Jwt = require('@hapi/jwt');

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async function (server, options) {
    // Inisialisasi Firestore
    let privateKey = config.FIRESTORE_PRIVATE_KEY;
    if (privateKey && privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    server.app.firestore = new Firestore({
      projectId: config.FIRESTORE_PROJECT_ID,
      credentials: {
        client_email: config.FIRESTORE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });

    // Daftarkan plugin JWT dan strategy bernama 'jwt'
    await server.register(Jwt);
    server.auth.strategy('jwt', 'jwt', {
      keys: config.JWT_SECRET,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 7 * 24 * 60 * 60, // 1 minggu dalam detik
      },
      validate: (artifacts, request, h) => {
        return { isValid: true, credentials: artifacts.decoded.payload };
      },
    });
    server.auth.default('jwt');

    // Daftarkan routes
    server.route(routes);
  },
};