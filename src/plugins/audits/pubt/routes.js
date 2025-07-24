'use strict';

const Joi = require('joi');
const { pubtHandlers } = require('./handlers');
const { laporanPubtPayload } = require('./schemas/laporan');

const LAPORAN_PUBT_PREFIX = '/pubt/laporan';

module.exports = [
    // ENDPOINT LAPORAN PUBT
    {
        method: 'POST',
        path: LAPORAN_PUBT_PREFIX,
        handler: pubtHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PUBT - Laporan'],
            validate: { payload: laporanPubtPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PUBT_PREFIX,
        handler: pubtHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PUBT - Laporan'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PUBT_PREFIX}/{id}`,
        handler: pubtHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PUBT_PREFIX}/{id}`,
        handler: pubtHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - Laporan'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanPubtPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_PUBT_PREFIX}/{id}`,
        handler: pubtHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PUBT_PREFIX}/download/{id}`,
        handler: pubtHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];