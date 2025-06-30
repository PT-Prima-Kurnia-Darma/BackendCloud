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
    return h
      .response({ status: 'success', message: 'Registrasi berhasil', data: responseData })
      .code(201);
  } catch (err) {
    if (Boom.isBoom(err)) {
      throw err;
    }
    console.error('Error di handler.register user:', err);
    throw Boom.internal('Gagal melakukan registrasi');
  }
};

const login = async (request, h) => {
  try {
    const { username, password } = request.payload;
    const { user, token } = await services.login(request.server.app.firestore, { username, password });

    return h
      .response({ status: 'success', message: 'Login berhasil', data: { user, token } })
      .code(200);
  } catch (err) {
    if (Boom.isBoom(err)) throw err;
    console.error('Error di handler.login:', err);
    throw Boom.internal('Gagal melakukan login');
  }
};

const updateProfile = async (request, h) => {
  try {
    const userId = request.auth.credentials.id;
    const { name, username, oldPassword, newPassword } = request.payload;
    await services.updateProfile(
      request.server.app.firestore,
      userId,
      { name, username, oldPassword, newPassword }
    );
    return h
      .response({ status: 'success', message: 'Profil berhasil diperbarui', data: { username, name, userId } })
      .code(200);
  } catch (err) {
    if (Boom.isBoom(err)) throw err;
    console.error('Error di handler.updateProfile:', err);
    throw Boom.internal('Gagal memperbarui profil');
  }
};

const logout = async (request, h) => {
  try {
    // ambil token raw dari header Authorization: 'Bearer <token>'
    const authorization = request.headers.authorization || '';
    const token = authorization.replace(/^Bearer\s+/i, '');
    if (!token) {
      throw Boom.badRequest('Header Authorization (Bearer token) diperlukan');
    }

    await services.logout(request.server.app.firestore, token);
    return h
      .response({ status: 'success', message: 'Logout berhasil' })
      .code(200);
  } catch (err) {
    if (Boom.isBoom(err)) throw err;
    console.error('Error di handler.logout:', err);
    throw Boom.internal('Gagal melakukan logout');
  }
};

const deleteUser = async (request, h) => {
  try {
    const { id } = request.params;
    await services.deleteUser(request.server.app.firestore, id);
    return h
      .response({ status: 'success', message: 'User berhasil dihapus' })
      .code(200);
  } catch (err) {
    if (Boom.isBoom(err)) throw err;
    throw Boom.internal(err.message);
  }
};

const validateToken = async (request, h) => {
  try {
    const { token } = request.payload;
    if (!token) {
      throw Boom.badRequest('membutuhkan token');
    }
    await services.validateToken(request.server.app.firestore, token);
    return h.response({ status: 'success', message: 'Token valid' }).code(200);
  } catch (err) {
    if (Boom.isBoom(err)) throw err;
    console.error('Error in handler.validateToken:', err);
    throw Boom.internal('gagal validasi token');
  }
};

module.exports = {
  register,
  updateProfile,
  deleteUser,
  login,
  logout,
  validateToken
};
