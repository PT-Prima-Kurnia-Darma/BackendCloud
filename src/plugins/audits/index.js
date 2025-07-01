'use strict';

const routes = require('./routes');

module.exports = {
  name: 'audits',
  version: '1.0.0',
  register: async (server, options) => {
    server.route(routes);
  },
};