'use strict';

const Joi = require('joi');

const bapProteksiKebakaranPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraid: Joi.number().required(),
    inspectionType: Joi.string().allow('').required(),
    equipmentType: Joi.string().allow('').required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        usageLocation: Joi.string().allow('').required(),
        addressUsageLocation: Joi.string().allow('').required(),
    }).required(),

    technicalData: Joi.object({
        landArea: Joi.string().allow('').required(),
        buildingArea: Joi.string().allow('').required(),
        buildingHeight: Joi.string().allow('').required(),
        floorCount: Joi.string().allow('').required(),
        pillarAndOutdoorHydrant: Joi.string().allow('').required(),
        totalHydrantBuilding: Joi.string().allow('').required(),
        totalHoseRell: Joi.string().allow('').required(),
        totalSpinkler: Joi.string().allow('').required(),
        totalHeatDetector: Joi.string().allow('').required(),
        totalSmokeDetector: Joi.string().allow('').required(),
        totalFlameDetector: Joi.string().allow('').required(),
        totalGasDetector: Joi.string().allow('').required(),
        manualButton: Joi.string().allow('').required(),
        alarmBell: Joi.string().allow('').required(),
        signalAlarmLamp: Joi.string().allow('').required(),
        emergencyExit: Joi.string().allow('').required(),
        apar: Joi.string().allow('').required(),
        certificateNumber: Joi.string().allow('').required(),
    }).required(),

    testResults: Joi.object({
        visualInspection: Joi.object({
            isAparAvailable: Joi.boolean().allow(true, false).required(),
            isAparInGoodCondition: Joi.boolean().allow(true, false).required(),
            isHydrantPanelInGoodCondition: Joi.boolean().allow(true, false).required(),
            isPumpsAvailable: Joi.boolean().allow(true, false).required(),
            isPumpsInGoodCondition: Joi.boolean().allow(true, false).required(),
            isSprinklerSystemAvailable: Joi.boolean().allow(true, false).required(),
            isSprinklerSystemInGoodCondition: Joi.boolean().allow(true, false).required(),
            isDetectorSystemAvailable: Joi.boolean().allow(true, false).required(),
            isDetectorSystemInGoodCondition: Joi.boolean().allow(true, false).required(),
        }).required(),
        functionalTests: Joi.object({
            isAparFunctional: Joi.boolean().allow(true, false).required(),
            arePumpsFunctional: Joi.boolean().allow(true, false).required(),
            isSprinklerFunctional: Joi.boolean().allow(true, false).required(),
            isDetectorFunctional: Joi.boolean().allow(true, false).required(),
            isDetectorConnectedToMcfa: Joi.boolean().allow(true, false).required(),
        }).required(),
    }).required(),

});

module.exports = {
    bapProteksiKebakaranPayload,
};