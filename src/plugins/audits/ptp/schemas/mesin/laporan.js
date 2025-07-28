'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false).required(),
    result: Joi.string().allow('').required()
});

const laporanPtpMesinPayload = Joi.object({
    examinationType: Joi.string().allow('').required(),
    extraId: Joi.number().required(),
    inspectionType: Joi.string().allow('').required(),
    createdAt: Joi.string().allow('').required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        userAddressInCharge: Joi.string().allow('').required(),
        subcontractorPersonInCharge: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        technicalDataDieselMotorPowerRpm: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        pjk3SkpNo: Joi.string().allow('').required(),
        ak3SkpNo: Joi.string().allow('').required(),
        usagePermitNumber: Joi.string().allow('').required(),
        operatorName: Joi.string().allow('').required(),
        equipmentHistory: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        machineSpecification: Joi.object({
            brandType: Joi.string().allow('').required(),
            technicalDataMaxFeederSpeed: Joi.string().allow('').required(),
            technicalDataMaxPlateWidth: Joi.string().allow('').required(),
            technicalDataPlateThickness: Joi.string().allow('').required(),
            technicalDataMaxPlateWeight: Joi.string().allow('').required(),
            technicalDataMaxInnerCoilDiameter: Joi.string().allow('').required(),
            technicalDataMaxOuterCoilDiameter: Joi.string().allow('').required(),
            technicalDataDriveMotor: Joi.string().allow('').required(),
            technicalDataDieselMotorPowerRpm: Joi.string().allow('').required(),
            serialNumberUnitNumber: Joi.string().allow('').required(),
            locationAndYearOfManufacture: Joi.string().allow('').required(),
            technicalDataMachineWeight: Joi.string().allow('').required(),
            technicalDataOverallDimension: Joi.string().allow('').required()
        }).required(),
        foundationDimension: Joi.object({
            technicalDataFoundationDim: Joi.string().allow('').required(),
            technicalDataFoundationDistance: Joi.string().allow('').required(),
            technicalDataVibrationDamperType: Joi.string().allow('').required(),
            technicalDataFoundationWeight1: Joi.string().allow('').required(),
            technicalDataFoundationWeight2: Joi.string().allow('').required()
        }).required()
    }).required(),

    visualInspection: Joi.object({
        foundation: inspectionItemSchema,
        foundationBearing: inspectionItemSchema,
        machineFrame: Joi.object({
            mainFrame: inspectionItemSchema,
            braceFrame: inspectionItemSchema
        }).required(),
        roller: inspectionItemSchema,
        controlPanel: inspectionItemSchema,
        display: inspectionItemSchema,
        operationButtons: inspectionItemSchema,
        electricalComponents: Joi.object({
            measurements: Joi.object({
                electricVoltage: Joi.string().allow('').required(),
                electricPhase: Joi.string().allow('').required(),
                electricFrequency: Joi.string().allow('').required(),
                electricAmper: Joi.string().allow('').required()
            }).required(),
            voltage: inspectionItemSchema,
            power: inspectionItemSchema,
            phase: inspectionItemSchema,
            frequency: inspectionItemSchema,
            current: inspectionItemSchema,
            electricalPanel: inspectionItemSchema,
            conductor: inspectionItemSchema,
            insulation: inspectionItemSchema
        }).required(),
        safetyDevices: Joi.object({
            limitSwitchUp: inspectionItemSchema,
            limitSwitchDown: inspectionItemSchema,
            grounding: inspectionItemSchema,
            safetyGuard: inspectionItemSchema,
            stampLock: inspectionItemSchema,
            pressureIndicator: inspectionItemSchema,
            emergencyStop: inspectionItemSchema,
            handSensor: inspectionItemSchema
        }).required(),
        hydraulic: Joi.object({
            pump: inspectionItemSchema,
            hose: inspectionItemSchema
        }).required()
    }).required(),

    testingAndMeasurement: Joi.object({
        safetyDeviceTest: Joi.object({
            grounding: inspectionItemSchema,
            safetyGuard: inspectionItemSchema,
            roller: inspectionItemSchema,
            emergencyStop: inspectionItemSchema
        }).required(),
        speedTest: inspectionItemSchema,
        functionTest: inspectionItemSchema,
        weldJointTest: inspectionItemSchema,
        vibrationTest: inspectionItemSchema,
        lightingTest: inspectionItemSchema,
        noiseTest: inspectionItemSchema
    }).required(),

    electricalPanelComponents: Joi.object({
        ka: Joi.string().allow('').required(),
        voltage: Joi.object({
            rs: Joi.string().allow('').required(),
            rt: Joi.string().allow('').required(),
            st: Joi.string().allow('').required(),
            rn: Joi.string().allow('').required(),
            rg: Joi.string().allow('').required(),
            ng: Joi.string().allow('').required()
        }).required(),
        powerInfo: Joi.object({
            frequency: Joi.string().allow('').required(),
            cosQ: Joi.string().allow('').required(),
            ampere: Joi.object({
                r: Joi.string().allow('').required(),
                s: Joi.string().allow('').required(),
                t: Joi.string().allow('').required()
            }).required(),
            result: Joi.string().allow('').required()
        }).required()
    }).required(),

    conclusionAndRecommendation: Joi.object({
        conclusion: Joi.string().allow('').required(),
        recommendations: Joi.string().allow('').required()
    }).required(),

    administration: Joi.object({
        inspectionDate: Joi.string().allow('').required()
    }).required(),

    foundationAnalysis: Joi.object({
        actualWeight: Joi.string().allow('').required(),
        additionalMeterials: Joi.string().allow('').required(),
        totalWeight: Joi.string().allow('').required(),
        minimumFoundationWeight: Joi.string().allow('').required(),
        totalMinimumFoundationWeight: Joi.string().allow('').required(),
        foundationWeight: Joi.string().allow('').required(),
        heightFoundation: Joi.string().allow('').required(),
        foundationAnalysisResult: Joi.string().allow('').required()
    }).required(),

    environmentalMeasurement: Joi.object({
        noise: Joi.object({
            pointA: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
            pointB: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
            pointC: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
            pointD: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required()
        }).required(),
        lighting: Joi.object({
            pointA: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
            pointB: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
            pointC: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required(),
            pointD: Joi.object({ result: Joi.string().allow('').required(), status: Joi.string().allow('').required() }).required()
        }).required()
    }).required()

});

module.exports = {
    laporanPtpMesinPayload
};