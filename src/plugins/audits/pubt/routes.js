'use strict';

const Joi = require('joi');
const { pubtHandlers } = require('./handlers');
const { laporanPubtPayload } = require('./schemas/laporan');
const { bapPubtPayload } = require('./schemas/bap'); 

const LAPORAN_PUBT_PREFIX = '/pubt/laporan';
const BAP_PUBT_PREFIX = '/pubt/bap';

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

    // ENDPOINT BAP PUBT (Baru ditambahkan)
    {
        method: 'GET',
        path: `${BAP_PUBT_PREFIX}/prefill/{laporanId}`,
        handler: pubtHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'PUBT - BAP'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: BAP_PUBT_PREFIX,
        handler: pubtHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PUBT - BAP'],
            validate: { payload: bapPubtPayload }
        },
    },
    {
        method: 'GET',
        path: BAP_PUBT_PREFIX,
        handler: pubtHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'PUBT - BAP'] },
    },
    {
        method: 'GET',
        path: `${BAP_PUBT_PREFIX}/{id}`,
        handler: pubtHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${BAP_PUBT_PREFIX}/{id}`,
        handler: pubtHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - BAP'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapPubtPayload 
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${BAP_PUBT_PREFIX}/{id}`,
        handler: pubtHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${BAP_PUBT_PREFIX}/download/{id}`,
        handler: pubtHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PUBT - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];