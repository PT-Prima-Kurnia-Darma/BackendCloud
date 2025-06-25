// src/plugins/auth/register.js
'use strict';

const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const { registerUser } = require('../../services/authService');

exports.plugin = {
  name: 'auth-register',
  version: '1.1.0',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/auth/register',
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string().trim().min(1).required().messages({
              'string.empty': 'Name tidak boleh kosong.',
              'any.required': 'Field name wajib diisi.',
            }),
            username: Joi.string().trim().pattern(/^[a-zA-Z0-9_]{3,30}$/).required().messages({
              'string.empty': 'Username tidak boleh kosong.',
              'string.pattern.base': 'Username hanya boleh berisi huruf, angka, underscore, panjang 3-30 karakter.',
              'any.required': 'Field username wajib diisi.',
            }),
            password: Joi.string().min(6).required().messages({
              'string.min': 'Password minimal 6 karakter.',
              'any.required': 'Field password wajib diisi.',
            }),
          }),
          // Jangan kirim detail error Joi yang teknis:
          failAction: (request, h, err) => {
            const detail = err.details && err.details.length ? err.details[0].message : 'Payload tidak valid';
            throw Boom.badRequest(detail);
          },
        },
        description: 'Register user baru dengan name, username, dan password',
        notes: 'Mengecek keunikan username, menyimpan ke Firestore dengan ID numeric otomatis',
        tags: ['api', 'auth'],
      },
      handler: async (request, h) => {
        try {
          const { name, username, password } = request.payload;
          const newUser = await registerUser({ name, username, password });
          return h.response({
            success: true,
            message: 'Registrasi berhasil.',
            data: newUser,
          }).code(201);
        } catch (err) {
          console.error('Error di register handler:', err);
          // Jika error custom dari authService, biasanya lempar Error dengan message.
          // Kita kembalikan 400 dengan pesan tersebut. Untuk error tak terduga, bisa beri 500.
          const isValidationError = err.message && (
            err.message.includes('wajib') ||
            err.message.includes('minimal') ||
            err.message.includes('Username sudah digunakan')
          );
          const statusCode = isValidationError ? 400 : 500;
          const msg = err.message || 'Gagal registrasi.';
          return h.response({
            success: false,
            message: msg,
          }).code(statusCode);
        }
      }
    });
  }
};
