'use strict';

const Joi = require('joi');

const bapEskalatorPayload = Joi.object({
    // ID dari laporan utama untuk sinkronisasi data
    laporanId: Joi.string().required(),
    
    // Data utama BAP
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),
    extraId: Joi.number().required(),

    // Data Umum
    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        nameUsageLocation: Joi.string().allow('').required(),
        locationUsageLocation: Joi.string().allow('').required()
    }).required(),

    // Data Teknis
    technicalData: Joi.object({
        equipmentType: Joi.string().allow('').required(),
        technicalDatamanufacturer: Joi.string().allow('').required(),
        technicalDatabrand: Joi.string().allow('').required(),
        technicalDatacountryAndYear: Joi.string().allow('').required(),
        technicalDataserialNumber: Joi.string().allow('').required(),
        technicalDatacapacity: Joi.string().allow('').required(),
        technicalDataspeed: Joi.string().allow('').required(),
        technicalDatatransports: Joi.string().allow('').required()
    }).required(),

    // Hasil Pemeriksaan Visual
    visualInspection: Joi.object({
        isMachineRoomConditionAcceptable: Joi.boolean().allow(true, false).required(),
        isPanelConditionAcceptable: Joi.boolean().allow(true, false).required(),
        islightingConditionisPitLightAcceptable: Joi.boolean().allow(true, false).required(),
        areSafetySignsAvailable: Joi.boolean().allow(true, false).required()
    }).required(),

    // Hasil Pengujian
    testing: Joi.object({
        testingisNdtThermographPanel: Joi.boolean().allow(true, false).required(),
        testingareSafetyDevicesFunctional: Joi.boolean().allow(true, false).required(),
        testingisLimitSwitchFunctional: Joi.boolean().allow(true, false).required(),
        testingisDoorSwitchFunctiona: Joi.boolean().allow(true, false).required(),
        testingpitEmergencyStopStatusisAvailable: Joi.boolean().allow(true, false).required(),
        testingpitEmergencyStopStatusisFunctional: Joi.boolean().allow(true, false).required(),
        isEscalatorFunctionOk: Joi.boolean().allow(true, false).required()
    }).required()

});

module.exports = {
    bapEskalatorPayload,
};