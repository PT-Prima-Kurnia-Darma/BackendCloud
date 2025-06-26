'use strict';

const Boom = require('@hapi/boom');
const services = require('./services');

const register = async (request, h) => {
  try {
    const payload = request.payload;
    const firestore = request.server.app.firestore;
    const user = await services.register(firestore, payload);
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
    console.error('Error di handler.register user:', err);
    throw Boom.internal('Gagal melakukan registrasi');
  }
};

const deleteUser = async (request, h) => {
  try {
    const { id } = request.params;
    await services.deleteUser(request.server.app.firestore, id);
    return h.response({ status: 'success', message: 'User berhasil dihapus' });
  } catch (err) {
    if (Boom.isBoom(err)) throw err;
    throw Boom.internal(err.message);
  }
};

module.exports = {
  register,
  deleteUser
};
