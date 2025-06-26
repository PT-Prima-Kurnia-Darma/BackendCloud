'use strict';

const handlers = require('./handlers');
const validations = require('./validations');

module.exports = [
  {
    method: 'POST',
    path: '/auth/register',
    handler: handlers.register,
    options: {
      auth: false,
      validate: {
        payload: validations.registerPayload,
        failAction: (request, h, err) => { throw err; },
      },
      description: 'Registrasi user baru dengan name, username, password',
      tags: ['api', 'auth'],
    },
  },
    {
    method: 'DELETE',
    path: '/auth/delete/{id}',
    handler: handlers.deleteUser,
    options: {
      auth: false,
      validate: { params: validations.deleteParams, failAction: (r, h, e) => { throw e; } },
    },
  },
];
