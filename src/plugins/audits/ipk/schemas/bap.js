'use strict';

const Joi = require('joi');

const bapProteksiKebakaranPayload = Joi.object({
    laporanId: Joi.string().required(),
    examinationType: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraid: Joi.number().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        usageLocation: Joi.string().allow('').optional(),
        addressUsageLocation: Joi.string().allow('').optional(),
    }).optional(),

    technicalData: Joi.object({
        landArea: Joi.string().allow('').optional(),
        buildingArea: Joi.string().allow('').optional(),
        buildingHeight: Joi.string().allow('').optional(),
        floorCount: Joi.string().allow('').optional(),
        pillarAndOutdoorHydrant: Joi.string().allow('').optional(),
        totalHydrantBuilding: Joi.string().allow('').optional(),
        totalHoseRell: Joi.string().allow('').optional(),
        totalSpinkler: Joi.string().allow('').optional(),
        totalHeatDetector: Joi.string().allow('').optional(),
        totalSmokeDetector: Joi.string().allow('').optional(),
        totalFlameDetector: Joi.string().allow('').optional(),
        totalGasDetector: Joi.string().allow('').optional(),
        manualButton: Joi.string().allow('').optional(),
        alarmBell: Joi.string().allow('').optional(),
        signalAlarmLamp: Joi.string().allow('').optional(),
        emergencyExit: Joi.string().allow('').optional(),
        apar: Joi.string().allow('').optional(),
        certificateNumber: Joi.string().allow('').optional(),
    }).optional(),

    testResults: Joi.object({
        visualInspection: Joi.object({
            isAparAvailable: Joi.boolean().allow(null).optional(),
            isAparInGoodCondition: Joi.boolean().allow(null).optional(),
            isHydrantPanelInGoodCondition: Joi.boolean().allow(null).optional(),
            isPumpsAvailable: Joi.boolean().allow(null).optional(),
            isPumpsInGoodCondition: Joi.boolean().allow(null).optional(),
            isSprinklerSystemAvailable: Joi.boolean().allow(null).optional(),
            isSprinklerSystemInGoodCondition: Joi.boolean().allow(null).optional(),
            isDetectorSystemAvailable: Joi.boolean().allow(null).optional(),
            isDetectorSystemInGoodCondition: Joi.boolean().allow(null).optional(),
        }).optional(),
        functionalTests: Joi.object({
            isAparFunctional: Joi.boolean().allow(null).optional(),
            arePumpsFunctional: Joi.boolean().allow(null).optional(),
            isSprinklerFunctional: Joi.boolean().allow(null).optional(),
            isDetectorFunctional: Joi.boolean().allow(null).optional(),
            isDetectorConnectedToMcfa: Joi.boolean().allow(null).optional(),
        }).optional(),
    }).optional(),

}).min(1).unknown(false);

module.exports = {
    bapProteksiKebakaranPayload,
};