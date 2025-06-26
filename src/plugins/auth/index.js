'use strict';

const config = require('../../../config');
const routes = require('./routes');
const { Firestore } = require('@google-cloud/firestore');

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async function (server, options) {
    let privateKey = config.FIRESTORE_PRIVATE_KEY;
    if (privateKey && privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    const firestore = new Firestore({
      projectId: config.FIRESTORE_PROJECT_ID,
      credentials: {
        client_email: config.FIRESTORE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
    server.app.firestore = firestore;

    server.route(routes);
  },
};
