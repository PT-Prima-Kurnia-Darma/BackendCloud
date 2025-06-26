// src/plugins/auth/index.js
'use strict';
const config = require('../../../config');
const routes = require('./routes');
const Jwt = require('@hapi/jwt');

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async function (server, options) {
    // Hanya daftarkan JWT plugin & strategy
    await server.register(Jwt);
    server.auth.strategy('jwt', 'jwt', {
      keys: config.JWT_SECRET,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 7 * 24 * 60 * 60,
      },
      validate: async (artifacts, request, h) => {
        const token = artifacts.token;
        const firestore = request.server.app.firestore;
        // cek blacklist
        const blackDoc = await firestore
          .collection('token_blacklist')
          .doc(token)
          .get();
        return {
          isValid: !blackDoc.exists,
          credentials: artifacts.decoded.payload,
        };
      },
    });
    server.auth.default('jwt');

    server.route(routes);
  },
};
