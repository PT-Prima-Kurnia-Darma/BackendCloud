// src/plugins/documents/handlers.js

'use strict';

const Boom = require('@hapi/boom');
const auditService = require('../audits/services');
const { createLaporanPetir } = require('../../services/documentGenerator/listrikPetirGenerator');
const { createLaporanElevator } = require('../../services/documentGenerator/elevatorEskalatorGenerator'); // Impor generator baru

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
            result = await createLaporanPetir(auditData); 
            break;
        case 'laporan_elevator': // Tambahkan case baru
            result = await createLaporanElevator(auditData);
            break;
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