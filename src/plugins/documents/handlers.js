'use strict';

const Boom = require('@hapi/boom');
const auditService = require('../audits/services'); // Memanggil service dari plugin audits
const { createLaporanPetir } = require('../../services/documentGenerator/listrikPetirGenerator');

const generateDocumentHandler = async (request, h) => {
    const { id } = request.params;
    const { docType } = request.payload; // mis: 'laporan_petir', 'bap_petir'

    // 1. Ambil data audit lengkap dari Firestore
    const auditData = await auditService.getAuditById(id);
    if (!auditData) {
        return Boom.notFound('Audit data not found for this ID');
    }

    let result;

    // 2. Tentukan generator mana yang akan digunakan berdasarkan docType
    switch (docType) {
        case 'laporan_petir':
            result = createLaporanPetir(auditData);
            break;
        // case 'bap_petir':
        //     result = createBapPetir(auditData); // Untuk nanti
        //     break;
        default:
            return Boom.badRequest('Invalid document type requested');
    }

    const { docxBuffer, fileName } = result;

    // 3. Kirim file ke pengguna sebagai response untuk diunduh
    return h.response(docxBuffer)
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .header('Content-Disposition', `attachment; filename=${fileName}`);
};

module.exports = {
    generateDocumentHandler,
};