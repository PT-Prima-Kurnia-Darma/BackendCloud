'use strict';

const Boom = require('@hapi/boom');
const services = require('./services');

const register = async (request, h) => {
  try {
    const payload = request.payload;
    const firestore = request.server.app.firestore;
    const user = await services.createUser(firestore, payload);
    const responseData = {
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };
    return h.response({ status: 'success', data: responseData }).code(201);
  } catch (err) {
    if (Boom.isBoom(err)) {
      throw err;
    }
    console.error('Error di handler.register:', err);
    throw Boom.internal('Gagal melakukan registrasi');
  }
};

module.exports = {
  register,
};
