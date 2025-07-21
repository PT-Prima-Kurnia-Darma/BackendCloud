// src/plugins/audits/allAudits/index.js
'use strict';

const routes = require('./routes');

module.exports = {
  name: 'app-all-audits', // Nama plugin yang deskriptif
  version: '1.0.0',
  register: async (server) => {
    server.route(routes);
  },
};