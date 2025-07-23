'use strict';

const Joi = require('joi');
const { proteksiKebakaranHandlers } = require('./handlers');
const { laporanProteksiKebakaranPayload } = require('./schemas/laporan');

const LAPORAN_PROTEKSI_KEBAKARAN_PREFIX = '/proteksiKebakaran/laporan';

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
];