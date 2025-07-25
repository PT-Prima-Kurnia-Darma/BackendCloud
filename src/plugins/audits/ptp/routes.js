'use strict';

const Joi = require('joi');
const { ptpHandlers } = require('./handlers');
const { laporanPtpDieselPayload } = require('./schemas/laporan');

const LAPORAN_PTP_DIESEL_PREFIX = '/ptp/motorDiesel/laporan';

module.exports = [
    // ENDPOINT LAPORAN MOTOR DIESEL
    {
        method: 'POST',
        path: LAPORAN_PTP_DIESEL_PREFIX,
        handler: ptpHandlers.laporan.create,
        options: {
            auth: 'jwt',
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { payload: laporanPtpDieselPayload }
        },
    },
    {
        method: 'GET',
        path: LAPORAN_PTP_DIESEL_PREFIX,
        handler: ptpHandlers.laporan.getAll,
        options: { auth: 'jwt', tags: ['api', 'PTP - Laporan Motor Diesel'] },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: ptpHandlers.laporan.getById,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) }
        },
    },
    {
        method: 'PUT',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/{id}`,
        handler: ptpHandlers.laporan.update,
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
        handler: ptpHandlers.laporan.delete,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
    {
        method: 'GET',
        path: `${LAPORAN_PTP_DIESEL_PREFIX}/download/{id}`,
        handler: ptpHandlers.laporan.download,
        options: { 
            auth: 'jwt', 
            tags: ['api', 'PTP - Laporan Motor Diesel'],
            validate: { params: Joi.object({ id: Joi.string().required() }) } 
        },
    },
];