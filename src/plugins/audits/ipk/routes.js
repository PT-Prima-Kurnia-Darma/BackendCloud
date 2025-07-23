'use strict';

const Joi = require('joi');
const { proteksiKebakaranHandlers } = require('./handlers');
const { laporanProteksiKebakaranPayload } = require('./schemas/laporan');
const { bapProteksiKebakaranPayload } = require('./schemas/bap');

const LAPORAN_PROTEKSI_KEBAKARAN_PREFIX = '/proteksiKebakaran/laporan';
const BAP_PROTEKSI_KEBAKARAN_PREFIX = '/proteksiKebakaran/bap';

module.exports = [
    // ENDPOINT LAPORAN PROTEKSI KEBAKARAN
    {
        method: 'POST',
        path: LAPORAN_PROTEKSI_KEBAKARAN_PREFIX,
        handler: proteksiKebakaranHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'Proteksi Kebakaran - Laporan'],
            validate: { payload: laporanProteksiKebakaranPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PROTEKSI_KEBAKARAN_PREFIX,
        handler: proteksiKebakaranHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'Proteksi Kebakaran - Laporan'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PROTEKSI_KEBAKARAN_PREFIX}/{id}`,
        handler: proteksiKebakaranHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PROTEKSI_KEBAKARAN_PREFIX}/{id}`,
        handler: proteksiKebakaranHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - Laporan'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanProteksiKebakaranPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_PROTEKSI_KEBAKARAN_PREFIX}/{id}`,
        handler: proteksiKebakaranHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PROTEKSI_KEBAKARAN_PREFIX}/download/{id}`,
        handler: proteksiKebakaranHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - Laporan'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },

    // ENDPOINT BAP PROTEKSI KEBAKARAN
    {
        method: 'GET',
        path: `${BAP_PROTEKSI_KEBAKARAN_PREFIX}/prefill/{laporanId}`,
        handler: proteksiKebakaranHandlers.bap.prefill,
        options: {
            auth: 'jwt',
            tags: ['api', 'Proteksi Kebakaran - BAP'],
            validate: { params: Joi.object({ laporanId: Joi.string().required() }) }
        },
    },
    {
        method: 'POST',
        path: BAP_PROTEKSI_KEBAKARAN_PREFIX,
        handler: proteksiKebakaranHandlers.bap.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'Proteksi Kebakaran - BAP'],
            validate: { payload: bapProteksiKebakaranPayload }
        },
    },
    {
        method: 'GET',
        path: BAP_PROTEKSI_KEBAKARAN_PREFIX,
        handler: proteksiKebakaranHandlers.bap.getAll,
        options: { auth: 'jwt', tags: ['api', 'Proteksi Kebakaran - BAP'] },
    },
    {
        method: 'GET',
        path: `${BAP_PROTEKSI_KEBAKARAN_PREFIX}/{id}`,
        handler: proteksiKebakaranHandlers.bap.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${BAP_PROTEKSI_KEBAKARAN_PREFIX}/{id}`,
        handler: proteksiKebakaranHandlers.bap.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - BAP'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: bapProteksiKebakaranPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${BAP_PROTEKSI_KEBAKARAN_PREFIX}/{id}`,
        handler: proteksiKebakaranHandlers.bap.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${BAP_PROTEKSI_KEBAKARAN_PREFIX}/download/{id}`,
        handler: proteksiKebakaranHandlers.bap.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'Proteksi Kebakaran - BAP'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];