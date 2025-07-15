'use strict';

const Joi = require('joi');

const bapMobileCranePayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').optional(),
    subInspectionType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.number().allow('').optional(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').optional(),
        ownerAddress: Joi.string().allow('').optional(),
        userAddress: Joi.string().allow('').optional(),
    }).optional(),

    technicalData: Joi.object({
        manufacturer: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        maxLiftingHeight: Joi.string().allow('').optional(),
        materialCertificateNumber: Joi.string().allow('').optional(),
        liftingSpeedMpm: Joi.string().allow('').optional(),
    }).optional(),

    inspectionResult: Joi.object({
        visualCheck: Joi.object({
            hasBoomDefects: Joi.boolean().allow(null),
            isNameplateAttached: Joi.boolean().allow(null),
            areBoltsAndNutsSecure: Joi.boolean().allow(null),
            isSlingGoodCondition: Joi.boolean().allow(null),
            isHookGoodCondition: Joi.boolean().allow(null),
            isSafetyLatchInstalled: Joi.boolean().allow(null),
            isTireGoodCondition: Joi.boolean().allow(null),
            isWorkLampFunctional: Joi.boolean().allow(null),
        }).optional(),
        functionalTest: Joi.object({
            isForwardReverseFunctionOk: Joi.boolean().allow(null),
            isSwingFunctionOk: Joi.boolean().allow(null),
            isHoistingFunctionOk: Joi.boolean().allow(null),
            loadTest: Joi.object({
                loadKg: Joi.string().allow('').optional(),
                liftHeightMeters: Joi.string().allow('').optional(),
                holdTimeSeconds: Joi.string().allow('').optional(),
                isResultGood: Joi.boolean().allow(null),
            }).optional(),
            ndtTest: Joi.object({
                method: Joi.string().allow('').optional(),
                isResultGood: Joi.boolean().allow(null),
            }).optional(),
        }).optional(),
    }).optional(),

    signature: Joi.object({
        companyName: Joi.string().allow('').optional(),
    }).optional(),

}).min(1).unknown(true);

module.exports = {
    bapMobileCranePayload,
};