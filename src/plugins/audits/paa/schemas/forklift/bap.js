'use strict';

const Joi = require('joi');

const bapForkliftPayload = Joi.object({
    // ID laporan utama untuk sinkronisasi data
    laporanId: Joi.string().required(),

    // Data utama BAP
    examinationType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),
    extraId: Joi.number().required(),
    inspectionType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),

    // Data Umum
    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required()
    }).required(),

    // Data Teknis
    technicalData: Joi.object({
        brandType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        liftingHeightMeters: Joi.string().allow('').required()
    }).required(),

    // Hasil Pemeriksaan (menggunakan boolean)
    inspectionResult: Joi.object({
        visualCheck: Joi.object({
            hasForkDefects: Joi.boolean().allow(true, false),
            isNameplateAttached: Joi.boolean().allow(true, false),
            isAparAvailable: Joi.boolean().allow(true, false),
            isCapacityMarkingDisplayed: Joi.boolean().allow(true, false),
            hasHydraulicLeak: Joi.boolean().allow(true, false),
            isChainGoodCondition: Joi.boolean().allow(true, false)
        }).required(),
        functionalTest: Joi.object({
            loadKg: Joi.string().allow('').required(),
            liftHeightMeters: Joi.string().allow('').required(),
            isAbleToLiftAndHold: Joi.boolean().allow(true, false),
            isFunctioningWell: Joi.boolean().allow(true, false),
            hasCrackIndication: Joi.boolean().allow(true, false),
            isEmergencyStopFunctional: Joi.boolean().allow(true, false),
            isWarningLampHornFunctional: Joi.boolean().allow(true, false)
        }).required()
    }).required(),

});

module.exports = {
    bapForkliftPayload,
};