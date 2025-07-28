'use strict';

const Joi = require('joi');

const bapMobileCranePayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),
    extraId: Joi.number().required(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        userAddress: Joi.string().allow('').required(),
         inspectionType: Joi.string().allow('').required(),
    }).required(),

    technicalData: Joi.object({
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        maxLiftingHeight: Joi.string().allow('').required(),
        materialCertificateNumber: Joi.string().allow('').required(),
        liftingSpeedMpm: Joi.string().allow('').required(),
    }).required(),

    inspectionResult: Joi.object({
        visualCheck: Joi.object({
            hasBoomDefects: Joi.boolean().allow(true, false),
            isNameplateAttached: Joi.boolean().allow(true, false),
            areBoltsAndNutsSecure: Joi.boolean().allow(true, false),
            isSlingGoodCondition: Joi.boolean().allow(true, false),
            isHookGoodCondition: Joi.boolean().allow(true, false),
            isSafetyLatchInstalled: Joi.boolean().allow(true, false),
            isTireGoodCondition: Joi.boolean().allow(true, false),
            isWorkLampFunctional: Joi.boolean().allow(true, false),
        }).required(),
        functionalTest: Joi.object({
            isForwardReverseFunctionOk: Joi.boolean().allow(true, false),
            isSwingFunctionOk: Joi.boolean().allow(true, false),
            isHoistingFunctionOk: Joi.boolean().allow(true, false),
            loadTest: Joi.object({
                loadKg: Joi.string().allow('').required(),
                liftHeightMeters: Joi.string().allow('').required(),
                holdTimeSeconds: Joi.string().allow('').required(),
                isResultGood: Joi.boolean().allow(true, false),
            }).required(),
            ndtTest: Joi.object({
                method: Joi.string().allow('').required(),
                isResultGood: Joi.boolean().allow(true, false),
            }).required(),
        }).required(),
    }).required(),

});

module.exports = {
    bapMobileCranePayload,
};