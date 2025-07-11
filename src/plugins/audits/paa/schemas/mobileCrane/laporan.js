'use strict';

const Joi = require('joi');

const laporanMobileCranePayload = Joi.object({
    inspectionType: Joi.string().allow('', null).optional(),
    equipmentType: Joi.string().allow('', null).optional(),
    examinationType: Joi.string().allow('', null).optional(),
    subInspectionType: Joi.string().allow('', null).optional(),

    generalData: Joi.object().unknown(true).optional(), // Izinkan semua field di dalam generalData

    technicalData: Joi.object().unknown(true).optional(), // Izinkan semua field di dalam technicalData

    // --- PERBAIKAN UTAMA DI SINI ---
    // Izinkan objek 'inspectionAndTesting' memiliki kunci dan nilai apa pun di dalamnya.
    inspectionAndTesting: Joi.object().unknown(true).optional(),
    
    conclusion: Joi.string().allow('', null).optional(),
    recommendation: Joi.string().allow('', null).optional()

}).min(1);

module.exports = {
    laporanMobileCranePayload,
};