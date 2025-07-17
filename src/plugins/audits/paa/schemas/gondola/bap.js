'use strict';

const Joi = require('joi');

const bapGondolaPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().required(),
    inspectionType: Joi.string().required(),
    inspectionDate: Joi.string().required(),
    equipmentType: Joi.string().required(),
    createdAt: Joi.string().optional(),
    extraId: Joi.number().optional(),

    generalData: Joi.object({
        companyName: Joi.string().required(),
        companyLocation: Joi.string().required(),
        userInCharge: Joi.string().required(),
        ownerAddress: Joi.string().required()
    }).required(),

    technicalData: Joi.object({
        manufacturer: Joi.string().required(),
        locationAndYearOfManufacture: Joi.string().required(),
        serialNumberUnitNumber: Joi.string().required(),
        intendedUse: Joi.string().required(),
        capacityWorkingLoad: Joi.string().required(),
        maxLiftingHeightMeters: Joi.string().required()
    }).required(),

    inspectionResult: Joi.object({
        visualCheck: Joi.object({
            isSlingDiameterAcceptable: Joi.boolean().required(),
            isBumperInstalled: Joi.boolean().required(),
            isCapacityMarkingDisplayed: Joi.boolean().required(),
            isPlatformConditionAcceptable: Joi.boolean().required(),
            driveMotorCondition: Joi.object({
                isGoodCondition: Joi.boolean().required(),
                hasOilLeak: Joi.boolean().required()
            }).required(),
            isControlPanelClean: Joi.boolean().required(),
            isBodyHarnessAvailable: Joi.boolean().required(),
            isLifelineAvailable: Joi.boolean().required(),
            isButtonLabelsDisplayed: Joi.boolean().required()
        }).required(),
        functionalTest: Joi.object({
            isWireRopeMeasurementOk: Joi.boolean().required(),
            isUpDownFunctionOk: Joi.boolean().required(),
            isDriveMotorFunctionOk: Joi.boolean().required(),
            isEmergencyStopFunctional: Joi.boolean().required(),
            isSafetyLifelineFunctional: Joi.boolean().required(),
            ndtTest: Joi.object({
                method: Joi.string().required(),
                isResultGood: Joi.boolean().required(),
                hasCrackIndication: Joi.boolean().required()
            }).required()
        }).required()
    }).required()
}).min(1).unknown(false);

module.exports = {
    bapGondolaPayload,
};