// handlers.js

const Boom = require('@hapi/boom');
const { getCombinedAudits } = require('./services');

const getAllAuditsHandler = async (request, h) => {
  try {

    const { page, size } = request.query;

    const result = await getCombinedAudits({ page, size });
    
    return h.response({
      status: 'success',
      message: 'Semua data audit berhasil diambil',
      data: result.audits,
      paging: result.pagination,
    }).code(200);

  } catch (error) {
    if (Boom.isBoom(error)) {
      return error;
    }
    console.error('Unhandled error in getAllAuditsHandler:', err);
    throw Boom.internal('Terjadi kesalahan pada server.');
  }
};

module.exports = { getAllAuditsHandler };