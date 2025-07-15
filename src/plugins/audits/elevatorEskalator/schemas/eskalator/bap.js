'use strict';

const Joi = require('joi');

const bapEskalatorPayload = Joi.object({
    // ID dari laporan utama untuk sinkronisasi data
    laporanId: Joi.string().required(),
    
    // Data utama BAP
    examinationType: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow('').optional(),

    // Data Umum
    generalData: Joi.object({
        ownerName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        nameUsageLocation: Joi.string().allow('').optional(),
        locationUsageLocation: Joi.string().allow('').optional()
    }).optional(),

    // Data Teknis
    technicalData: Joi.object({
        equipmentType: Joi.string().allow('').optional(),
        technicalDatamanufacturer: Joi.string().allow('').optional(),
        technicalDatabrand: Joi.string().allow('').optional(),
        technicalDatacountryAndYear: Joi.string().allow('').optional(),
        technicalDataserialNumber: Joi.string().allow('').optional(),
        technicalDatacapacity: Joi.string().allow('').optional(),
        technicalDataspeed: Joi.string().allow('').optional(),
        technicalDatatransports: Joi.string().allow('').optional()
    }).optional(),

    // Hasil Pemeriksaan Visual
    visualInspection: Joi.object({
        isMachineRoomConditionAcceptable: Joi.boolean().optional(),
        isPanelConditionAcceptable: Joi.boolean().optional(),
        islightingConditionisPitLightAcceptable: Joi.boolean().optional(),
        areSafetySignsAvailable: Joi.boolean().optional()
    }).optional(),

    // Hasil Pengujian
    testing: Joi.object({
        testingisNdtThermographPanel: Joi.boolean().optional(),
        testingareSafetyDevicesFunctional: Joi.boolean().optional(),
        testingisLimitSwitchFunctional: Joi.boolean().optional(),
        testingisDoorSwitchFunctiona: Joi.boolean().optional(),
        testingpitEmergencyStopStatusisAvailable: Joi.boolean().optional(),
        testingpitEmergencyStopStatusisFunctional: Joi.boolean().optional(),
        isEscalatorFunctionOk: Joi.boolean().optional()
    }).optional()

}).min(1); // Menolak payload kosong

module.exports = {
    bapEskalatorPayload,
};