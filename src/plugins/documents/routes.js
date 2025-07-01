'use strict';

const Joi = require('joi');
const handlers = require('./handlers');

module.exports = [
    {
        method: 'POST',
        path: '/audits/{id}/documents',
        handler: handlers.generateDocumentHandler,
        options: {
            description: 'Generate and download a document based on audit data',
            tags: ['api', 'documents'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
                payload: Joi.object({
                    // docType akan menentukan file mana yang dibuat (Laporan/BAP/Sertifikat)
                    docType: Joi.string().required().example('laporan_petir'),
                }),
            },
        },
    },
];