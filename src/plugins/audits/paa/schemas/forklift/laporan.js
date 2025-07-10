'use strict';

const Joi = require('joi');

// Skema untuk setiap item inspeksi (result dan status boolean)
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null),
    result: Joi.string().allow('', null).optional()
});

// Skema untuk setiap baris pada tabel inspeksi rantai
const chainInspectionItemSchema = Joi.object({
    inspectedPart: Joi.string().allow('').optional(),
    constructionType: Joi.string().allow('').optional(),
    standardPitch: Joi.string().allow('').optional(),
    measuredPitch: Joi.string().allow('').optional(),
    standardPin: Joi.string().allow('').optional(),
    measuredPin: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
});

// Skema untuk setiap baris pada tabel NDT
const nonDestructiveTestItemSchema = Joi.object({
    inspectedPart: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    defectFound: Joi.string().allow('').optional(),
    defectNotFound: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
});

// Skema untuk setiap baris pada tabel uji beban
const loadTestItemSchema = Joi.object({
    liftingHeight: Joi.string().allow('').optional(),
    testLoad: Joi.string().allow('').optional(),
    speed: Joi.string().allow('').optional(),
    movement: Joi.string().allow('').optional(),
    remarks: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
});

// Skema Utama Laporan Forklift (Struktur Final)
const laporanForkliftPayload = Joi.object({
    inspectionType: Joi.string().allow('').optional(),
    equipmentType: Joi.string().allow('').optional(), // Diganti dari subInspectionType
    inspectionDate: Joi.string().allow('').optional(), // inspectionDate dipindah ke root

    generalData: Joi.object({
        ownerNamwe: Joi.string().allow('').optional(), // Typo 'ownerNamwe' dipertahankan sesuai template
        ownerAddress: Joi.string().allow('').optional(),
        userInCharge: Joi.string().allow('').optional(),
        subcontractorPersonInCharge: Joi.string().allow('').optional(),
        unitLocation: Joi.string().allow('').optional(),
        operatorName: Joi.string().allow('').optional(),
        equipmentType: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        brandType: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        intendedUse: Joi.string().allow('').optional(),
        certificateNumber: Joi.string().allow('').optional(),
        equipmentHistory: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        specificationSerialNumber: Joi.string().allow('').optional(),
        specificationCapacity: Joi.string().allow('').optional(),
        specificationAttachment: Joi.string().allow('').optional(),
        specificationForkDimensions: Joi.string().allow('').optional(),
        specificationSpeedLifting: Joi.string().allow('').optional(),
        specificationSpeedLowering: Joi.string().allow('').optional(),
        specificationSpeedTravelling: Joi.string().allow('').optional(),
        primeMoverBrandType: Joi.string().allow('').optional(),
        primeMoverSerialNumber: Joi.string().allow('').optional(),
        primeMoverYearOfManufacture: Joi.string().allow('').optional(),
        primeMoverRevolution: Joi.string().allow('').optional(),
        primeMoverPower: Joi.string().allow('').optional(),
        primeMoverNumberOfCylinders: Joi.string().allow('').optional(),
        dimensionLength: Joi.string().allow('').optional(),
        dimensionWidth: Joi.string().allow('').optional(),
        dimensionHeight: Joi.string().allow('').optional(),
        dimensionForkLiftingHeight: Joi.string().allow('').optional(),
        tirePressureDriveWheel: Joi.string().allow('').optional(),
        tirePressureSteeringWheel: Joi.string().allow('').optional(),
        driveWheelSize: Joi.string().allow('').optional(),
        driveWheelType: Joi.string().allow('').optional(),
        steeringWheelSize: Joi.string().allow('').optional(),
        steeringWheelType: Joi.string().allow('').optional(),
        travellingBrakeSize: Joi.string().allow('').optional(),
        travellingBrakeType: Joi.string().allow('').optional(),
        hydraulicPumpPressure: Joi.string().allow('').optional(),
        hydraulicPumpType: Joi.string().allow('').optional(),
        hydraulicPumpReliefValve: Joi.string().allow('').optional()
    }).optional(),

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
        }).optional(),
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
        }).optional(),
        dashboard: Joi.object({
            tempIndicatorResult: inspectionItemSchema,
            oilPressureResult: inspectionItemSchema,
            hydraulicPressureResult: inspectionItemSchema,
            hourMeterResult: inspectionItemSchema,
            glowPlugResult: inspectionItemSchema,
            fuelIndicatorResult: inspectionItemSchema,
            loadIndicatorResult: inspectionItemSchema,
            loadChartResult: inspectionItemSchema
        }).optional(),
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
        }).optional(),
        attachments: Joi.object({
            mastWearResult: inspectionItemSchema,
            mastCracksResult: inspectionItemSchema,
            mastDeformationResult: inspectionItemSchema,
            mastLubeResult: inspectionItemSchema,
            mastShaftBearingResult: inspectionItemSchema,
            liftChainConditionResult: inspectionItemSchema,
            liftChainDeformationResult: inspectionItemSchema,
            liftChainLubeResult: inspectionItemSchema
        }).optional(),
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
        }).optional(),
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
        }).optional(),
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
        }).optional()
    }).optional(),

    testingForklift: Joi.object({
        liftingChainInspection: Joi.array().items(chainInspectionItemSchema).optional(),
        nonDestructiveTesting: Joi.object({
            ndtType: Joi.string().allow('').optional(),
            results: Joi.array().items(nonDestructiveTestItemSchema).optional()
        }).optional(),
        loadTesting: Joi.array().items(loadTestItemSchema).optional()
    }).optional(),
    
    conclusion: Joi.string().allow('').optional(),
    recommendation: Joi.string().allow('').optional()
    
}).min(1).unknown(true);

module.exports = {
    laporanForkliftPayload,
};