require('dotenv').config();  // <— harus di paling atas

const Hapi = require('@hapi/hapi');
const registerPlugin = require('./src/plugins/auth/register');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { cors: { origin: ['*'] } },
  });

  // // (Optional) debug env:
  // console.log('ENV FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'OK' : 'MISSING');
  // console.log('ENV FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'OK' : 'MISSING');
  // console.log('ENV FIREBASE_PRIVATE_KEY present:', process.env.FIREBASE_PRIVATE_KEY ? 'OK' : 'MISSING');

  await server.register(registerPlugin);

  server.route({
    method: 'GET',
    path: '/',
    handler: () => 'API berjalan',
  });

  await server.start();
  console.log('Server berjalan pada:', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
