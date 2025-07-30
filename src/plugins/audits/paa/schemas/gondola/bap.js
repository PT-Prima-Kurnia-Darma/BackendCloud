'use strict';

const Joi = require('joi');

const bapGondolaPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        maxLiftingHeightMeters: Joi.string().allow('').required()
    }).required(),

    inspectionResult: Joi.object({
        visualCheck: Joi.object({
            isSlingDiameterAcceptable: Joi.boolean().allow(true, false).required(),
            isBumperInstalled: Joi.boolean().allow(true, false).required(),
            isCapacityMarkingDisplayed: Joi.boolean().allow(true, false).required(),
            isPlatformConditionAcceptable: Joi.boolean().allow(true, false).required(),
            driveMotorCondition: Joi.object({
                isGoodCondition: Joi.boolean().allow(true, false).required(),
                hasOilLeak: Joi.boolean().allow(true, false).required()
            }).required(),
            isControlPanelClean: Joi.boolean().allow(true, false).required(),
            isBodyHarnessAvailable: Joi.boolean().allow(true, false).required(),
            isLifelineAvailable: Joi.boolean().allow(true, false).required(),
            isButtonLabelsDisplayed: Joi.boolean().allow(true, false).required()
        }).required(),
        functionalTest: Joi.object({
            isWireRopeMeasurementOk: Joi.boolean().allow(true, false).required(),
            isUpDownFunctionOk: Joi.boolean().allow(true, false).required(),
            isDriveMotorFunctionOk: Joi.boolean().allow(true, false).required(),
            isEmergencyStopFunctional: Joi.boolean().allow(true, false).required(),
            isSafetyLifelineFunctional: Joi.boolean().allow(true, false).required(),
            ndtTest: Joi.object({
                method: Joi.string().allow('').required(),
                isResultGood: Joi.boolean().allow(true, false).required(),
                hasCrackIndication: Joi.boolean().allow(true, false).required()
            }).required()
        }).required()
    }).required()
});

module.exports = {
    bapGondolaPayload,
};