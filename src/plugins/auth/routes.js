'use strict';
const handlers = require('./handlers');
const validations = require('./validations');

module.exports = [
  {
    method: 'POST',
    path: '/auth/register',
    handler: handlers.register,
    options: { auth: false, validate: { payload: validations.registerPayload, failAction: (r,h,e) => { throw e; } } },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: handlers.login,
    options: {
      auth: false,
      validate: { payload: validations.loginPayload, failAction: (r,h,e) => { throw e; } },
      description: 'Login user dan kembalikan JWT',
      tags: ['api','auth'],
    },
  },
  {
  method: 'PUT',
  path: '/auth/change',
  handler: handlers.updateProfile,
  options: {
    auth: 'jwt',  // User harus login
    validate: {
      payload: validations.updateProfilePayload,
      failAction: (r,h,e) => { throw e; }
    },
    description: 'Perbarui name, username, dan/atau password user yang sedang login',
    tags: ['api','auth'],
  },
  },
    {
    method: 'POST',
    path: '/auth/logout',
    handler: handlers.logout,
    options: {
      auth: 'jwt',    // hanya user yang sudah login
      description: 'Logout dan hanguskan JWT saat ini',
      tags: ['api','auth'],
    }
  },
  {
    method: 'DELETE',
    path: '/auth/delete/{id}',
    handler: handlers.deleteUser,
    options: { auth: false, validate: { params: validations.deletePayload, failAction: (r,h,e) => { throw e; } } },
  },
  {
    method: 'POST',
    path: '/auth/validateToken',
    handler: handlers.validateToken,
    options: {
      auth: false, // Tidak memerlukan autentikasi karena kita akan memvalidasi token yang dikirim
      description: 'Validate a JWT token',
      tags: ['api', 'auth'],
    },
  },
];