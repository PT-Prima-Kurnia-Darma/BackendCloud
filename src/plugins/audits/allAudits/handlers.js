// src/plugins/audits/allAudits/handlers.js
'use strict';

const Boom = require('@hapi/boom');
const services = require('./services');

/**
 * Handler untuk memproses permintaan GET /audits/all.
 */
const getAllAuditsHandler = async (request, h) => {
  try {
    // Ambil query params dari URL, dengan nilai default jika tidak ada.
    const { page = 1, size = 10 } = request.query;

    const result = await services.getCombinedAudits({
      page: parseInt(page, 10),
      size: parseInt(size, 10),
    });

    return h.response({
      status: 'success',
      message: 'Semua data audit berhasil diambil',
      data: result.audits,
      paging: result.pagination,
    }).code(200);

  } catch (err) {
    // Jika error sudah dalam format Boom, lempar kembali.
    if (Boom.isBoom(err)) {
      throw err;
    }
    // Untuk error tak terduga, kembalikan response 500.
    console.error('Unhandled error in getAllAuditsHandler:', err);
    throw Boom.internal('Terjadi kesalahan pada server.');
  }
};

module.exports = { getAllAuditsHandler };