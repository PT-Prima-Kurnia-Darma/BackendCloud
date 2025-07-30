'use strict';

const Joi = require('joi');

// Skema untuk setiap item inspeksi (result dan status boolean)
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false),
    result: Joi.string().allow('').required()
});

// Skema untuk setiap baris pada tabel inspeksi rantai
const chainInspectionItemSchema = Joi.object({
    inspectedPart: Joi.string().allow('').required(),
    constructionType: Joi.string().allow('').required(),
    standardPitch: Joi.string().allow('').required(),
    measuredPitch: Joi.string().allow('').required(),
    standardPin: Joi.string().allow('').required(),
    measuredPin: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

// Skema untuk setiap baris pada tabel NDT
const nonDestructiveTestItemSchema = Joi.object({
    inspectedPart: Joi.string().allow('').required(),
    location: Joi.string().allow('').required(),
    defectFound: Joi.string().allow('').required(),
    defectNotFound: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

// Skema untuk setiap baris pada tabel uji beban
const loadTestItemSchema = Joi.object({
    liftingHeight: Joi.string().allow('').required(),
    testLoad: Joi.string().allow('').required(),
    speed: Joi.string().allow('').required(),
    movement: Joi.string().allow('').required(),
    remarks: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

// Skema Utama Laporan Forklift (Struktur Final)
const laporanForkliftPayload = Joi.object({
    inspectionType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().allow('').required(),
    examinationType: Joi.string().allow('').required(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(), 
        ownerAddress: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        subcontractorPersonInCharge: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        operatorName: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        certificateNumber: Joi.string().allow('').required(),
        equipmentHistory: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        specificationSerialNumber: Joi.string().allow('').required(),
        specificationCapacity: Joi.string().allow('').required(),
        specificationAttachment: Joi.string().allow('').required(),
        specificationForkDimensions: Joi.string().allow('').required(),
        specificationSpeedLifting: Joi.string().allow('').required(),
        specificationSpeedLowering: Joi.string().allow('').required(),
        specificationSpeedTravelling: Joi.string().allow('').required(),
        primeMoverBrandType: Joi.string().allow('').required(),
        primeMoverSerialNumber: Joi.string().allow('').required(),
        primeMoverYearOfManufacture: Joi.string().allow('').required(),
        primeMoverRevolution: Joi.string().allow('').required(),
        primeMoverPower: Joi.string().allow('').required(),
        primeMoverNumberOfCylinders: Joi.string().allow('').required(),
        dimensionLength: Joi.string().allow('').required(),
        dimensionWidth: Joi.string().allow('').required(),
        dimensionHeight: Joi.string().allow('').required(),
        dimensionForkLiftingHeight: Joi.string().allow('').required(),
        tirePressureDriveWheel: Joi.string().allow('').required(),
        tirePressureSteeringWheel: Joi.string().allow('').required(),
        driveWheelSize: Joi.string().allow('').required(),
        driveWheelType: Joi.string().allow('').required(),
        steeringWheelSize: Joi.string().allow('').required(),
        steeringWheelType: Joi.string().allow('').required(),
        travellingBrakeSize: Joi.string().allow('').required(),
        travellingBrakeType: Joi.string().allow('').required(),
        hydraulicPumpPressure: Joi.string().allow('').required(),
        hydraulicPumpType: Joi.string().allow('').required(),
        hydraulicPumpReliefValve: Joi.string().allow('').required()
    }).required(),

    inspectionAndTesting: Joi.object({
        mainFrameAndChassis: Joi.object({
            reinforcingFrameCorrosionResult: inspectionItemSchema,
            reinforcingFrameCracksResult: inspectionItemSchema,
            reinforcingFrameDeformationResult: inspectionItemSchema,
            counterweightCorrosionResult: inspectionItemSchema,
            counterweightConditionResult: inspectionItemSchema,
            otherEquipmentFloorDeckResult: inspectionItemSchema,
            otherEquipmentStairsStepsResult: inspectionItemSchema,
            otherEquipmentFasteningBoltsResult: inspectionItemSchema,
            otherEquipmentOperatorSeatResult: inspectionItemSchema
        }).required(),
        primeMover: Joi.object({
            systemCoolingResult: inspectionItemSchema,
            systemLubricationResult: inspectionItemSchema,
            systemFuelResult: inspectionItemSchema,
            systemAirIntakeResult: inspectionItemSchema,
            systemExhaustGasResult: inspectionItemSchema,
            systemStarterResult: inspectionItemSchema,
            electricalBatteryResult: inspectionItemSchema,
            electricalStartingDynamoResult: inspectionItemSchema,
            electricalAlternatorResult: inspectionItemSchema,
            electricalBatteryCableResult: inspectionItemSchema,
            electricalInstallationCableResult: inspectionItemSchema,
            electricalLightingLampsResult: inspectionItemSchema,
            electricalSafetyLampsResult: inspectionItemSchema,
            electricalHornResult: inspectionItemSchema,
            electricalFuseResult: inspectionItemSchema
        }).required(),
        dashboard: Joi.object({
            tempIndicatorResult: inspectionItemSchema,
            oilPressureResult: inspectionItemSchema,
            hydraulicPressureResult: inspectionItemSchema,
            hourMeterResult: inspectionItemSchema,
            glowPlugResult: inspectionItemSchema,
            fuelIndicatorResult: inspectionItemSchema,
            loadIndicatorResult: inspectionItemSchema,
            loadChartResult: inspectionItemSchema
        }).required(),
        powerTrain: Joi.object({
            starterDynamoResult: inspectionItemSchema,
            steeringWheelResult: inspectionItemSchema,
            steeringRodResult: inspectionItemSchema,
            steeringGearBoxResult: inspectionItemSchema,
            steeringPitmanResult: inspectionItemSchema,
            steeringDragLinkResult: inspectionItemSchema,
            steeringTieRodResult: inspectionItemSchema,
            steeringLubeResult: inspectionItemSchema,
            wheelsFrontResult: inspectionItemSchema,
            wheelsRearResult: inspectionItemSchema,
            wheelsBoltsResult: inspectionItemSchema,
            wheelsDrumResult: inspectionItemSchema,
            wheelsLubeResult: inspectionItemSchema,
            wheelsMechanicalResult: inspectionItemSchema,
            clutchHousingResult: inspectionItemSchema,
            clutchConditionResult: inspectionItemSchema,
            clutchTransOilResult: inspectionItemSchema,
            clutchTransLeakResult: inspectionItemSchema,
            clutchShaftResult: inspectionItemSchema,
            clutchMechanicalResult: inspectionItemSchema,
            diffHousingResult: inspectionItemSchema,
            diffConditionResult: inspectionItemSchema,
            diffOilResult: inspectionItemSchema,
            diffLeakResult: inspectionItemSchema,
            diffShaftResult: inspectionItemSchema,
            brakesMainResult: inspectionItemSchema,
            brakesHandResult: inspectionItemSchema,
            brakesEmergencyResult: inspectionItemSchema,
            brakesLeakResult: inspectionItemSchema,
            brakesMechanicalResult: inspectionItemSchema,
            transHousingResult: inspectionItemSchema,
            transOilResult: inspectionItemSchema,
            transLeakResult: inspectionItemSchema,
            transMechanicalResult: inspectionItemSchema
        }).required(),
        attachments: Joi.object({
            mastWearResult: inspectionItemSchema,
            mastCracksResult: inspectionItemSchema,
            mastDeformationResult: inspectionItemSchema,
            mastLubeResult: inspectionItemSchema,
            mastShaftBearingResult: inspectionItemSchema,
            liftChainConditionResult: inspectionItemSchema,
            liftChainDeformationResult: inspectionItemSchema,
            liftChainLubeResult: inspectionItemSchema
        }).required(),
        personalBasketAndHandrail: Joi.object({
            basketFloorCorrosionResult: inspectionItemSchema,
            basketFloorCracksResult: inspectionItemSchema,
            basketFloorDeformationResult: inspectionItemSchema,
            basketFloorFasteningResult: inspectionItemSchema,
            basketFrameCorrosionResult: inspectionItemSchema,
            basketFrameCracksResult: inspectionItemSchema,
            basketFrameDeformationResult: inspectionItemSchema,
            basketFrameCrossBracingResult: inspectionItemSchema,
            basketFrameDiagonalBracingResult: inspectionItemSchema,
            basketBoltsCorrosionResult: inspectionItemSchema,
            basketBoltsCracksResult: inspectionItemSchema,
            basketBoltsDeformationResult: inspectionItemSchema,
            basketBoltsFasteningResult: inspectionItemSchema,
            basketDoorCorrosionResult: inspectionItemSchema,
            basketDoorCracksResult: inspectionItemSchema,
            basketDoorDeformationResult: inspectionItemSchema,
            basketDoorFasteningResult: inspectionItemSchema,
            handrailCracksResult: inspectionItemSchema,
            handrailWearResult: inspectionItemSchema,
            handrailCracks2Result: inspectionItemSchema,
            handrailRailStraightnessResult: inspectionItemSchema,
            handrailRailJointsResult: inspectionItemSchema,
            handrailInterRailStraightnessResult: inspectionItemSchema,
            handrailRailJointGapResult: inspectionItemSchema,
            handrailRailFastenersResult: inspectionItemSchema,
            handrailRailStopperResult: inspectionItemSchema
        }).required(),
        hydraulicComponents: Joi.object({
            tankLeakageResult: inspectionItemSchema,
            tankOilLevelResult: inspectionItemSchema,
            tankOilConditionResult: inspectionItemSchema,
            tankSuctionLineResult: inspectionItemSchema,
            tankReturnLineResult: inspectionItemSchema,
            pumpLeakageResult: inspectionItemSchema,
            pumpSuctionLineResult: inspectionItemSchema,
            pumpPressureLineResult: inspectionItemSchema,
            pumpFunctionResult: inspectionItemSchema,
            pumpNoiseResult: inspectionItemSchema,
            valveLeakageResult: inspectionItemSchema,
            valveLineConditionResult: inspectionItemSchema,
            valveReliefFunctionResult: inspectionItemSchema,
            valveNoiseResult: inspectionItemSchema,
            valveLiftCylinderResult: inspectionItemSchema,
            valveTiltCylinderResult: inspectionItemSchema,
            valveSteeringCylinderResult: inspectionItemSchema,
            actuatorLeakageResult: inspectionItemSchema,
            actuatorLineConditionResult: inspectionItemSchema,
            actuatorNoiseResult: inspectionItemSchema
        }).required(),
        engineOnChecks: Joi.object({
            starterDynamoResult: inspectionItemSchema,
            instrumentResult: inspectionItemSchema,
            electricalResult: inspectionItemSchema,
            leakageEngineOilResult: inspectionItemSchema,
            leakageFuelResult: inspectionItemSchema,
            leakageCoolantResult: inspectionItemSchema,
            leakageHydraulicOilResult: inspectionItemSchema,
            leakageTransmissionOilResult: inspectionItemSchema,
            leakageFinalDriveOilResult: inspectionItemSchema,
            leakageBrakeFluidResult: inspectionItemSchema,
            clutchResult: inspectionItemSchema,
            transmissionResult: inspectionItemSchema,
            brakeResult: inspectionItemSchema,
            hornAlarmResult: inspectionItemSchema,
            lampsResult: inspectionItemSchema,
            hydraulicMotorResult: inspectionItemSchema,
            steeringCylinderResult: inspectionItemSchema,
            liftingCylinderResult: inspectionItemSchema,
            tiltingCylinderResult: inspectionItemSchema,
            exhaustGasResult: inspectionItemSchema,
            controlLeversResult: inspectionItemSchema,
            noiseEngineResult: inspectionItemSchema,
            noiseTurbochargerResult: inspectionItemSchema,
            noiseTransmissionResult: inspectionItemSchema,
            noiseHydraulicPumpResult: inspectionItemSchema,
            noiseProtectiveCoverResult: inspectionItemSchema
        }).required()
    }).required(),

    testingForklift: Joi.object({
        liftingChainInspection: Joi.array().items(chainInspectionItemSchema).required(),
        nonDestructiveTesting: Joi.object({
            ndtType: Joi.string().allow('').required(),
            results: Joi.array().items(nonDestructiveTestItemSchema).required()
        }).required(),
        loadTesting: Joi.array().items(loadTestItemSchema).required()
    }).required(),
    
    conclusion: Joi.string().allow('').required(),
    recommendation: Joi.string().allow('').required()
    
});

module.exports = {
    laporanForkliftPayload,
};