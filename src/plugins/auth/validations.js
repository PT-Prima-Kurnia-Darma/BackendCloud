'use strict';

const Joi = require('@hapi/joi');

const registerPayload = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Name harus berupa teks',
    'string.empty': 'Name tidak boleh kosong',
    'string.min': 'Name minimal {#limit} karakter',
    'string.max': 'Name maksimal {#limit} karakter',
    'any.required': 'Name wajib diisi',
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Username harus berupa teks alfanumerik',
    'string.alphanum': 'Username hanya boleh berisi huruf dan angka tanpa spasi',
    'string.empty': 'Username tidak boleh kosong',
    'string.min': 'Username minimal {#limit} karakter',
    'string.max': 'Username maksimal {#limit} karakter',
    'any.required': 'Username wajib diisi',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password harus berupa teks',
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal {#limit} karakter',
    'any.required': 'Password wajib diisi',
  }),
});

const deletePayload = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  registerPayload,
  deletePayload
};
