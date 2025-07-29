// src/plugins/audits/allAudits/routes.js
'use strict';

const Joi = require('joi');
const handlers = require('./handlers');

// Definisikan path yang jelas dan tidak berkonflik.
const ALL_AUDITS_PREFIX = '/audits/all';

module.exports = [
  {
    method: 'GET',
    path: ALL_AUDITS_PREFIX,
    handler: handlers.getAllAuditsHandler,
    options: {
      // Sesuaikan autentikasi sesuai kebutuhan, 'jwt' jika perlu login.
      auth: 'jwt',
      description: 'Mengambil semua data audit dari semua koleksi dengan sistem paging',
      notes: 'Mengembalikan daftar data audit yang sudah digabung dan diurutkan berdasarkan tanggal terbaru.',
      tags: ['api', 'Audits-Combined'],
      cache: false,
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1)
            .description('Nomor halaman yang ingin ditampilkan.'),
          size: Joi.number().integer().min(1).max(30).default(10)
            .description('Jumlah item per halaman (maksimal 100).')
        })
      }
    }
  }
];