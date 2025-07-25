'use strict';

const Joi = require('joi');
const { motorDieselHandlers } = require('./handlers');
const { laporanPtpDieselPayload } = require('./schemas/laporan');

const LAPORAN_PTP_DIESEL_PREFIX = '/ptp/motorDiesel/laporan';

module.exports = [
    // ENDPOINT LAPORAN MOTOR DIESEL
    {
        method: 'POST',
        path: LAPORAN_PTP_DIESEL_PREFIX,
        handler: motorDieselHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { payload: laporanPtpDieselPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PTP_DIESEL_PREFIX,
        handler: motorDieselHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PTP - Laporan Motor Diesel'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.laporan.update,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { 
                params: Joi.object({ id: Joi.string().required() }), 
                payload: laporanPtpDieselPayload
            } 
        },
    },
    {
        method: 'DELETE',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: motorDieselHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/download/{id}`,
        handler: motorDieselHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];