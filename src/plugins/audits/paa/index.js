'use strict';

const routes = require('./routes');

module.exports = {
    name: 'app-paa-audits',
    version: '1.0.0',
    register: async (server) => {
        server.route(routes);
    },
};