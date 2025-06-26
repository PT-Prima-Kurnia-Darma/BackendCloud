'use strict';
const handlers = require('./handlers');
const validations = require('./validations');

module.exports = [
  // Register dan deleteUser seperti sebelumnya
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
    method: 'DELETE',
    path: '/auth/delete/{id}',
    handler: handlers.deleteUser,
    options: { auth: false, validate: { params: validations.deletePayload, failAction: (r,h,e) => { throw e; } } },
  },
];