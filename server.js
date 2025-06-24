require('dotenv').config();
const Hapi = require('@hapi/hapi');

const init = async () => {
  try {
    const portEnv = process.env.PORT;
    if (!portEnv) {
      console.error('Error: PORT environment variable belum di-set. Silakan set di .env.');
      process.exit(1);
    }
    const port = parseInt(portEnv, 10);
    if (isNaN(port)) {
      console.error('Error: PORT environment variable tidak valid:', portEnv);
      process.exit(1);
    }
    const host = process.env.HOST || 'localhost';

    const server = Hapi.server({
      port,
      host,
      routes: {
        cors: true
      }
    });

    server.route({
      method: 'GET',
      path: '/health',
      handler: (request, h) => ({ status: 'ok', timestamp: Date.now(), port, host })
    });

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => ({ message: `Welcome to Hapi server running on ${host}:${port}` })
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });

    await server.start();
    console.log(`Server berjalan pada: ${server.info.uri}`);
  } catch (err) {
    console.error('Gagal memulai server:', err);
    process.exit(1);
  }
};

init();
