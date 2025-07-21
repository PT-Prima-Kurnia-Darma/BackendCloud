'use strict';

const Joi = require('joi');

const bapForkliftPayload = Joi.object({
    // ID laporan utama untuk sinkronisasi data
    laporanId: Joi.string().required(),

    // Data utama BAP
    examinationType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),

    // Data Umum
    generalData: Joi.object({
        ownerName: Joi.string().allow('').optional(),
        ownerAddress: Joi.string().allow('').optional(),
        userInCharge: Joi.string().allow('').optional()
    }).optional(),

    // Data Teknis
    technicalData: Joi.object({
        brandType: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        liftingHeightMeters: Joi.string().allow('').optional()
    }).optional(),

    // Hasil Pemeriksaan (menggunakan boolean)
    inspectionResult: Joi.object({
        visualCheck: Joi.object({
            hasForkDefects: Joi.boolean().allow(null),
            isNameplateAttached: Joi.boolean().allow(null),
            isAparAvailable: Joi.boolean().allow(null),
            isCapacityMarkingDisplayed: Joi.boolean().allow(null),
            hasHydraulicLeak: Joi.boolean().allow(null),
            isChainGoodCondition: Joi.boolean().allow(null)
        }).optional(),
        functionalTest: Joi.object({
            loadKg: Joi.string().allow('').optional(),
            liftHeightMeters: Joi.string().allow('').optional(),
            isAbleToLiftAndHold: Joi.boolean().allow(null),
            isFunctioningWell: Joi.boolean().allow(null),
            hasCrackIndication: Joi.boolean().allow(null),
            isEmergencyStopFunctional: Joi.boolean().allow(null),
            isWarningLampHornFunctional: Joi.boolean().allow(null)
        }).optional()
    }).optional(),

}).min(1).unknown(false);

module.exports = {
    bapForkliftPayload,
};