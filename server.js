'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const config = require('./config');

const init = async () => {
  const server = Hapi.server({
    port: config.PORT,
    host: config.HOST,
    routes: {
      cors: { origin: ['*'] },
    },
  });

  // Logging sederhana
  server.ext('onRequest', (request, h) => {
    console.log(`[${new Date().toISOString()}] ${request.method.toUpperCase()} ${request.path}`);
    return h.continue;
  });

  //  —— Health-check endpoint ——
  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      try {
        await request.server.app.firestore.listCollections();
        return h
          .response({ status: 'success', message: 'Server is up and running' })
          .code(200);
      } catch (err) {
        console.error('Health-check failed:', err);
        return h
          .response({ status: 'error', message: err.message })
          .code(500);
      }
    },
    options: {
      auth: false,
      description: 'Health-check endpoint',
      tags: ['api'],
    },
  });

  //plugin auth
  await server.register(require('./src/plugins/auth'));

  // Global error formatting (404, Boom errors)
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      const { statusCode, payload } = response.output;
      return h
        .response({ status: 'error', message: payload.message })
        .code(statusCode);
    }
    return h.continue;
  });

  //Start server dengan try/catch untuk logging error ——
  try {
    await server.start();
    console.log(`✅ Server berjalan pada ${server.info.uri}`);
  } catch (err) {
    console.error('❌ Gagal memulai server:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

init();
