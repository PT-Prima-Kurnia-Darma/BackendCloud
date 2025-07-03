'use strict';

const Boom = require('@hapi/boom');
const auditService = require('../audits/services'); // Memanggil service dari plugin audits
const { createLaporanPetir } = require('../../services/documentGenerator/listrikPetirGenerator');

const generateDocumentHandler = async (request, h) => {
    const { id } = request.params;
    const { docType } = request.payload; 

    const auditData = await auditService.getAuditById(id);
    if (!auditData) {
        return Boom.notFound('Audit data not found for this ID');
    }

    let result;

    switch (docType) {
        case 'laporan_petir':
            // TAMBAHKAN 'await' di sini karena createLaporanPetir sekarang async
            result = await createLaporanPetir(auditData); 
            break;
        // case 'bap_petir': ...
        default:
            return Boom.badRequest('Invalid document type requested');
    }

    const { docxBuffer, fileName } = result;

    return h.response(docxBuffer)
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .header('Content-Disposition', `attachment; filename=${fileName}`);
};

module.exports = {
    generateDocumentHandler,
};