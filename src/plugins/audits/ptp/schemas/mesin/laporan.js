'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null),
    result: Joi.string().allow('', null).optional()
});

const laporanPtpMesinPayload = Joi.object({
    examinationType: Joi.string().allow('').optional(),
    extraId: Joi.number().allow(null).optional(),
    inspectionType: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        userInCharge: Joi.string().allow('').optional(),
        userAddressInCharge: Joi.string().allow('').optional(),
        subcontractorPersonInCharge: Joi.string().allow('').optional(),
        unitLocation: Joi.string().allow('').optional(),
        equipmentType: Joi.string().allow('').optional(),
        brandType: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        technicalDataDieselMotorPowerRpm: Joi.string().allow('').optional(),
        intendedUse: Joi.string().allow('').optional(),
        pjk3SkpNo: Joi.string().allow('').optional(),
        ak3SkpNo: Joi.string().allow('').optional(),
        usagePermitNumber: Joi.string().allow('').optional(),
        operatorName: Joi.string().allow('').optional(),
        equipmentHistory: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        machineSpecification: Joi.object({
            brandType: Joi.string().allow('').optional(),
            technicalDataMaxFeederSpeed: Joi.number().allow(null).optional(),
            technicalDataMaxPlateWidth: Joi.number().allow(null).optional(),
            technicalDataPlateThickness: Joi.number().allow(null).optional(),
            technicalDataMaxPlateWeight: Joi.number().allow(null).optional(),
            technicalDataMaxInnerCoilDiameter: Joi.number().allow(null).optional(),
            technicalDataMaxOuterCoilDiameter: Joi.number().allow(null).optional(),
            technicalDataDriveMotor: Joi.string().allow('').optional(),
            technicalDataDieselMotorPowerRpm: Joi.number().allow(null).optional(),
            serialNumberUnitNumber: Joi.string().allow('').optional(),
            locationAndYearOfManufacture: Joi.string().allow('').optional(),
            technicalDataMachineWeight: Joi.number().allow(null).optional(),
            technicalDataOverallDimension: Joi.string().allow('').optional()
        }).optional(),
        foundationDimension: Joi.object({
            technicalDataFoundationDim: Joi.string().allow('').optional(),
            technicalDataFoundationDistance: Joi.string().allow('').optional(),
            technicalDataVibrationDamperType: Joi.string().allow('').optional(),
            technicalDataFoundationWeight1: Joi.number().allow(null).optional(),
            technicalDataFoundationWeight2: Joi.number().allow(null).optional()
        }).optional()
    }).optional(),

    visualInspection: Joi.object({
        foundation: inspectionItemSchema,
        foundationBearing: inspectionItemSchema,
        machineFrame: Joi.object({
            mainFrame: inspectionItemSchema,
            braceFrame: inspectionItemSchema
        }).optional(),
        roller: inspectionItemSchema,
        controlPanel: inspectionItemSchema,
        display: inspectionItemSchema,
        operationButtons: inspectionItemSchema,
        electricalComponents: Joi.object({
            measurements: Joi.object({
                electricVoltage: Joi.number().allow(null).optional(),
                electricPhase: Joi.number().allow(null).optional(),
                electricFrequency: Joi.number().allow(null).optional(),
                electricAmper: Joi.number().allow(null).optional()
            }).optional(),
            voltage: inspectionItemSchema,
            power: inspectionItemSchema,
            phase: inspectionItemSchema,
            frequency: inspectionItemSchema,
            current: inspectionItemSchema,
            electricalPanel: inspectionItemSchema,
            conductor: inspectionItemSchema,
            insulation: inspectionItemSchema
        }).optional(),
        safetyDevices: Joi.object({
            limitSwitchUp: inspectionItemSchema,
            limitSwitchDown: inspectionItemSchema,
            grounding: inspectionItemSchema,
            safetyGuard: inspectionItemSchema,
            stampLock: inspectionItemSchema,
            pressureIndicator: inspectionItemSchema,
            emergencyStop: inspectionItemSchema,
            handSensor: inspectionItemSchema
        }).optional(),
        hydraulic: Joi.object({
            pump: inspectionItemSchema,
            hose: inspectionItemSchema
        }).optional()
    }).optional(),

    testingAndMeasurement: Joi.object({
        safetyDeviceTest: Joi.object({
            grounding: inspectionItemSchema,
            safetyGuard: inspectionItemSchema,
            roller: inspectionItemSchema,
            emergencyStop: inspectionItemSchema
        }).optional(),
        speedTest: inspectionItemSchema,
        functionTest: inspectionItemSchema,
        weldJointTest: inspectionItemSchema,
        vibrationTest: inspectionItemSchema,
        lightingTest: inspectionItemSchema,
        noiseTest: inspectionItemSchema
    }).optional(),

    electricalPanelComponents: Joi.object({
        ka: Joi.string().allow('').optional(),
        voltage: Joi.object({
            rs: Joi.number().allow(null).optional(),
            rt: Joi.number().allow(null).optional(),
            st: Joi.number().allow(null).optional(),
            rn: Joi.number().allow(null).optional(),
            rg: Joi.number().allow(null).optional(),
            ng: Joi.number().allow(null).optional()
        }).optional(),
        powerInfo: Joi.object({
            frequency: Joi.number().allow(null).optional(),
            cosQ: Joi.number().allow(null).optional(),
            ampere: Joi.object({
                r: Joi.number().allow(null).optional(),
                s: Joi.number().allow(null).optional(),
                t: Joi.number().allow(null).optional()
            }).optional(),
            result: Joi.string().allow('').optional()
        }).optional()
    }).optional(),

    conclusionAndRecommendation: Joi.object({
        conclusion: Joi.string().allow('').optional(),
        recommendations: Joi.string().allow('').optional()
    }).optional(),

    administration: Joi.object({
        inspectionDate: Joi.string().allow('').optional()
    }).optional(),

    foundationAnalysis: Joi.object({
        actualWeight: Joi.number().allow(null).optional(),
        additionalMeterials: Joi.number().allow(null).optional(),
        totalWeight: Joi.number().allow(null).optional(),
        minimumFoundationWeight: Joi.number().allow(null).optional(),
        totalMinimumFoundationWeight: Joi.number().allow(null).optional(),
        foundationWeight: Joi.number().allow(null).optional(),
        heightFoundation: Joi.number().allow(null).optional(),
        foundationAnalysisResult: Joi.string().allow('').optional()
    }).optional(),

    environmentalMeasurement: Joi.object({
        noise: Joi.object({
            pointA: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
            pointB: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
            pointC: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
            pointD: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional()
        }).optional(),
        lighting: Joi.object({
            pointA: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
            pointB: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
            pointC: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
            pointD: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional()
        }).optional()
    }).optional()

}).min(1).unknown(false);

module.exports = {
    laporanPtpMesinPayload
};