// server.js
'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const config = require('./src/config');
const firestore = require('./src/utils/firestore');

const init = async () => {
  const server = Hapi.server({
    port: config.PORT,
    host: config.HOST,
    routes: {
      cors: { origin: ['*'] },
    },
  });

  server.app.firestore = firestore;

  await server.register([
    require('./src/plugins/auth'),
    require('./src/plugins/audits/allAudits'),
    require('./src/plugins/audits/elevatorEskalator'),
    require('./src/plugins/audits/paa'),
    require('./src/plugins/audits/petirListrik'),
    require('./src/plugins/audits/ipk'),
    require('./src/plugins/audits/pubt'),
    require('./src/plugins/audits/ptp'),
  ]);

  // Logging sederhana
  server.ext('onRequest', (request, h) => {
    // ✅ Diubah ke WIB dengan format 'Z'
    const timestamp = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
    console.log(`[${timestamp}] ${request.method.toUpperCase()} ${request.path}`);
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

  //  —— Endpoint untuk DEBUGGING JWT_SECRET ——
  server.route({
    method: 'GET',
    path: '/debug-secret',
    handler: (request, h) => {
      const jwtSecret = config.JWT_SECRET;
      
      if (!jwtSecret) {
        console.error('DEBUG: JWT_SECRET tidak terdefinisi atau kosong!');
        return h.response({ status: 'error', message: 'JWT_SECRET is not defined' }).code(500);
      }

      // Kita hanya akan log beberapa karakter untuk keamanan
      const firstChars = jwtSecret.substring(0, 4);
      const lastChars = jwtSecret.substring(jwtSecret.length - 4);
      const secretLength = jwtSecret.length;

      const debugInfo = `DEBUG: JWT_SECRET diterima. Panjang: ${secretLength}, Awal: ${firstChars}, Akhir: ${lastChars}`;
      
      // Cetak ke log Cloud Run
      console.log(debugInfo);

      // Kirim respons ke Postman
      return h.response({ status: 'success', data: {
        length: secretLength,
        start: firstChars,
        end: lastChars,
      }});
    },
    options: {
      auth: false, // TIDAK perlu token untuk mengakses ini
      tags: ['api', 'debug'],
    },
  });

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