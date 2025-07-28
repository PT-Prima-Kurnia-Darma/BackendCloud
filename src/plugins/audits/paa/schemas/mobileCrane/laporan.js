'use strict';

const Joi = require('joi');

// Skema untuk format status baru { status: boolean, result: string }
const inspectionResultSchema = Joi.object({
    status: Joi.boolean().required(),
    result: Joi.string().allow('', null).optional()
});

// Skema untuk sub-objek di dalam 'visual'
const visualSectionSchema = (fields) => {
    const schema = {};
    fields.forEach(field => {
        schema[field] = inspectionResultSchema.optional();
    });
    return Joi.object(schema);
};

// Skema untuk item dalam tabel NDT (Non-Destructive Testing) dinamis
const ndtSteelWireRopeItemSchema = Joi.object({
    usageAt: Joi.string().allow('').optional(),
    specDiameter: Joi.string().allow('').optional(),
    actualDiameter: Joi.string().allow('').optional(),
    construction: Joi.string().allow('').optional(),
    type: Joi.string().allow('').optional(),
    length: Joi.string().allow('').optional(),
    age: Joi.string().allow('').optional(),
    result: inspectionResultSchema.optional()
});

const ndtBoomInspectionItemSchema = Joi.object({
    part: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    result: inspectionResultSchema.optional()
});

// Skema untuk item dalam tabel uji beban
const loadTestItemSchema = Joi.object({
    boomLength: Joi.string().allow('').optional(),
    radius: Joi.string().allow('').optional(),
    boomAngle: Joi.string().allow('').optional(),
    testLoad: Joi.string().allow('').optional(),
    safeWorkingLoad: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
});

// Skema untuk NDT Hook, Drum, dan Pulley
const ndtMeasurementSchema = (hasTolerance = false) => {
    const schema = {
        ndtType: Joi.string().allow('').optional(),
        capacity: Joi.string().allow('').optional(),
        specification: Joi.object({
            a: Joi.string().allow('', null).optional(),
            b: Joi.string().allow('', null).optional(),
            c: Joi.string().allow('', null).optional(),
            d: Joi.string().allow('', null).optional(),
            e: Joi.string().allow('', null).optional(),
            f: Joi.string().allow('', null).optional(),
            g: Joi.string().allow('', null).optional(),
            h: Joi.string().allow('', null).optional(),
            result: inspectionResultSchema.optional()
        }).optional(),
        measurementResults: Joi.object({
            a: Joi.string().allow('', null).optional(),
            b: Joi.string().allow('', null).optional(),
            c: Joi.string().allow('', null).optional(),
            d: Joi.string().allow('', null).optional(),
            e: Joi.string().allow('', null).optional(),
            f: Joi.string().allow('', null).optional(),
            g: Joi.string().allow('', null).optional(),
            h: Joi.string().allow('', null).optional(),
            result: inspectionResultSchema.optional()
        }).optional(),
    };
    if (hasTolerance) {
        schema.toleranceMeasure = Joi.object({
            a: Joi.string().allow('', null).optional(),
            b: Joi.string().allow('', null).optional(),
            c: Joi.string().allow('', null).optional(),
            d: Joi.string().allow('', null).optional(),
            e: Joi.string().allow('', null).optional(),
            f: Joi.string().allow('', null).optional(),
            g: Joi.string().allow('', null).optional(),
            h: Joi.string().allow('', null).optional(),
            result: inspectionResultSchema.optional()
        }).optional();
    }
    return Joi.object(schema);
};


// === SKEMA UTAMA UNTUK PAYLOAD LAPORAN MOBILE CRANE ===
const laporanMobileCranePayload = Joi.object({
    inspectionType: Joi.string().required(),
    createdAt: Joi.date().iso().optional(),
    extraId: Joi.number().optional(),
    equipmentType: Joi.string().required(),
    examinationType: Joi.string().required(),

    generalData: Joi.object({
        ownerName: Joi.string().required(),
        ownerAddress: Joi.string().allow('').optional(),
        userSubcontractorPersonInCharge: Joi.string().allow('').optional(),
        userAddress: Joi.string().allow('').optional(),
        unitLocation: Joi.string().allow('').optional(),
        operatorName: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        brandType: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        intendedUse: Joi.string().allow('').optional(),
        usagePermitNumber: Joi.string().allow('').optional(),
        operatorCertificate: Joi.string().allow('').optional(),
        equipmentHistory: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().required(),
    }).required(),

    technicalData: Joi.object({
        maximumWorkingLoadCapacity: Joi.string().allow('').optional(),
        boomLength: Joi.string().allow('').optional(),
        maximumJibLength: Joi.string().allow('').optional(),
        maximumJibWorkingLoad: Joi.string().allow('').optional(),
        maxBoomJibLength: Joi.string().allow('').optional(),
        craneWeight: Joi.string().allow('').optional(),
        maxLiftingHeight: Joi.string().allow('').optional(),
        boomWorkingAngle: Joi.string().allow('').optional(),
        engineNumber: Joi.string().allow('').optional(),
        type: Joi.string().allow('').optional(),
        numberOfCylinders: Joi.string().allow('').optional(),
        netPower: Joi.string().allow('').optional(),
        brandYearOfManufacture: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        mainHookType: Joi.string().allow('').optional(),
        mainHookCapacity: Joi.string().allow('').optional(),
        mainHookMaterial: Joi.string().allow('').optional(),
        mainHookSerialNumber: Joi.string().allow('').optional(),
        auxiliaryHookType: Joi.string().allow('').optional(),
        auxiliaryHookCapacity: Joi.string().allow('').optional(),
        auxiliaryHookMaterial: Joi.string().allow('').optional(),
        auxiliaryHookSerialNumber: Joi.string().allow('').optional(),
        wireRopeMainLoadHoistDrumDiameter: Joi.string().allow('').optional(),
        wireRopeMainLoadHoistDrumType: Joi.string().allow('').optional(),
        wireRopeMainLoadHoistDrumConstruction: Joi.string().allow('').optional(),
        wireRopeMainLoadHoistDrumBreakingStrength: Joi.string().allow('').optional(),
        wireRopeMainLoadHoistDrumLength: Joi.string().allow('').optional(),
        wireRopeAuxiliaryLoadHoistDrumDiameter: Joi.string().allow('').optional(),
        wireRopeAuxiliaryLoadHoistDrumType: Joi.string().allow('').optional(),
        wireRopeAuxiliaryLoadHoistDrumConstruction: Joi.string().allow('').optional(),
        wireRopeAuxiliaryLoadHoistDrumLength: Joi.string().allow('').optional(),
        wireRopeAuxiliaryLoadHoistDrumBreakingStrength: Joi.string().allow('').optional(),
        wireRopeBoomHoistDrumDiameter: Joi.string().allow('').optional(),
        wireRopeBoomHoistDrumType: Joi.string().allow('').optional(),
        wireRopeBoomHoistDrumConstruction: Joi.string().allow('').optional(),
        wireRopeBoomHoistDrumLength: Joi.string().allow('').optional(),
        wireRopeBoomHoistDrumBreakingStrength: Joi.string().allow('').optional(),
    }).required(),

    inspectionAndTesting: Joi.object({
        visualFoundationAndBolts: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'tightness']).optional(),
        visualFrameColumnsOnFoundation: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'fastening', 'transverseReinforcement', 'diagonalReinforcement']).optional(),
        visualLadder: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'fastening']).optional(),
        visualWorkingPlatform: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'fastening']).optional(),
        visualOutriggers: visualSectionSchema(['outriggerArmHousing', 'outriggerArms', 'jack', 'outriggerPads', 'housingConnectionToChassis', 'outriggerSafetyLocks']).optional(),
        visualTurntable: visualSectionSchema(['slewingRollerBearing', 'brakeHousing', 'brakeLiningsAndShoes', 'drumSurface', 'pressureCylinder', 'drumAxle', 'leversPinsBolts', 'guard']).optional(),
        visualLatticeBoom: visualSectionSchema(['mainBoom', 'boomSection', 'topPulley', 'pulleyGuard', 'wireRopeGuard', 'pulleyGrooveLip', 'pivotPin', 'wireRopeGuidePulley']).optional(),
        visualSteering: visualSectionSchema(['mainClutch', 'transmission', 'frontWheel', 'middleWheel', 'rearWheel']).optional(),
        visualBrake: visualSectionSchema(['serviceBrake', 'parkingBrake', 'brakeHousing', 'brakeLiningsAndShoes', 'drumSurface', 'leversPinsBolts', 'guard']).optional(),
        visualTravelDrum: visualSectionSchema(['clutchHousing', 'clutchLining', 'clutchDrumSurface', 'leversPinsBolts', 'guard']).optional(),
        visualMainWinch: visualSectionSchema(['drumMounting', 'windingDrumSurface', 'brakeLiningsAndShoes', 'brakeDrumSurface', 'brakeHousing', 'clutchLiningsAndShoes', 'clutchDrumSurface', 'groove', 'grooveLip', 'flanges', 'brakeActuatorLeversPinsAndBolts']).optional(),
        visualAuxiliaryWinch: visualSectionSchema(['drumMounting', 'windingDrumSurface', 'brakeLiningsAndShoes', 'brakeDrumSurface', 'brakeHousing', 'clutchLiningsAndShoes', 'clutchDrumSurface', 'groove', 'grooveLip', 'flanges', 'brakeActuatorLeversPinsAndBolts']).optional(),
        visualHoistGearBlock: visualSectionSchema(['lubrication', 'oilSeal']).optional(),
        visualMainPulley: visualSectionSchema(['pulleyGroove', 'pulleyGrooveLip', 'pulleyPin', 'bearing', 'pulleyGuard', 'wireRopeGuard']).optional(),
        visualMainHook: visualSectionSchema(['swivelNutAndBearing', 'trunnion', 'safetyLatch']).optional(),
        visualAuxiliaryHook: visualSectionSchema(['freeFallWeight', 'swivelNutAndBearing', 'safetyLatch']).optional(),
        visualMainWireRope: visualSectionSchema(['corrosion', 'wear', 'breakage', 'deformation']).optional(),
        visualAuxiliaryWireRope: visualSectionSchema(['corrosion', 'wear', 'breakage', 'deformation']).optional(),
        visualLimitSwitch: visualSectionSchema(['longTravel', 'crossTravel', 'hoisting']).optional(),
        visualInternalCombustionEngine: visualSectionSchema(['coolingSystem', 'lubricationSystem', 'engineMounting', 'safetyGuardEquipment', 'exhaustSystem', 'fuelSystem', 'powerTransmissionSystem', 'battery', 'starterMotor', 'wiringInstallation', 'turbocharger']).optional(),
        visualHydraulic: visualSectionSchema(['pump', 'lines', 'filter', 'tank', 'mainWinchMotor', 'auxiliaryWinchMotor', 'boomWinchMotor', 'swingMotor']).optional(),
        visualControlValve: visualSectionSchema(['reliefValve', 'mainWinchValve', 'auxiliaryWinchValve', 'boomWinchValve', 'boomMovementValve', 'steeringCylinderValve', 'axleOscillationValve', 'outriggerMovementValve']).optional(),
        visualHydraulicCylinder: visualSectionSchema(['boomMovementCylinder', 'outriggerCylinder', 'steeringWheelCylinder', 'axleOscillationCylinder', 'telescopicCylinder']).optional(),
        visualPneumatic: visualSectionSchema(['compressor', 'tankAndSafetyValve', 'pressurizedAirLines', 'airFilter', 'controlValve']).optional(),
        visualOperatorCabin: visualSectionSchema(['safetyLadder', 'door', 'window', 'fanAc', 'controlLeversButtons', 'pendantControl', 'lighting', 'hornSignalAlarm', 'fuse', 'communicationDevice', 'fireExtinguisher', 'operatingSigns', 'ignitionKeyMasterSwitch', 'buttonsHandlesLevers']).optional(),
        visualElectricalComponents: visualSectionSchema(['panelConductorConnector', 'conductorProtection', 'motorInstallationSafetySystem', 'groundingSystem', 'installation']).optional(),
        visualSafetyDevices: visualSectionSchema([
            'ladderHandrail', 'engineOilLubricantPressure', 'hydraulicOilPressure', 'airPressure', 'amperemeter', 'voltage', 'engineTemperature', 'transmissionTemperature', 
            'converterOilTemperaturePressure', 'converterSpeedometerIndicator', 'converterRotaryLamp', 'converterMainHoistRopeUpDownLimit', 'converterAuxiliaryHoistRopeUpDownLimit', 
            'converterSwingMotionLimit', 'converterLevelIndicator', 'converterLoadWeightIndicator', 'converterLoadChart', 'converterAnemometerWindSpeed', 'converterBoomAngleIndicator', 
            'converterAirPressureIndicator', 'converterHydraulicPressureIndicator', 'converterSafetyValves', 'converterMainWindingDrumSafetyLock', 'converterAuxiliaryWindingDrumSafetyLock', 
            'converterTelescopicMotionLimit', 'converterLightningArrester', 'converterLiftingHeightIndicator'
        ]).optional(),
        
        ndtSteelWireRope: Joi.object({
            ndtType: Joi.string().allow('').optional(),
            ropes: Joi.array().items(ndtSteelWireRopeItemSchema).optional()
        }).optional(),
        ndtBoom: Joi.object({
            boomType: Joi.string().allow('').optional(),
            ndtType: Joi.string().allow('').optional(),
            inspections: Joi.array().items(ndtBoomInspectionItemSchema).optional()
        }).optional(),
        ndtMainHook: ndtMeasurementSchema(true).optional(),
        ndtAuxiliaryHook: ndtMeasurementSchema(true).optional(),
        ndtMainDrum: ndtMeasurementSchema(false).optional(),
        ndtAuxiliaryDrum: ndtMeasurementSchema(false).optional(),
        ndtMainPulley: ndtMeasurementSchema(false).optional(),
        ndtAuxiliaryPulley: ndtMeasurementSchema(false).optional(),
        
        testingFunction: visualSectionSchema([
            'hoistingLowering', 'extendedRetractedBoom', 'extendedRetractedOutrigger', 'swingSlewing', 'antiTwoBlock', 'boomStop', 'anemometerWindSpeed', 'brakeLockingDevice', 
            'loadMomentIndicator', 'turnSignal', 'drivingLights', 'loadIndicatorLight', 'rotaryLamp', 'horn', 'swingAlarm', 'reverseAlarm', 'overloadAlarm'
        ]).optional(),
        dynamicMainHookTests: Joi.array().items(loadTestItemSchema).optional(),
        dynamicAuxiliaryHookTests: Joi.array().items(loadTestItemSchema).optional(),
        staticMainHookTests: Joi.array().items(loadTestItemSchema).optional(),
        staticAuxiliaryHookTests: Joi.array().items(loadTestItemSchema).optional(),

    }).required(),

    conclusion: Joi.string().allow('').optional(),
    recommendation: Joi.string().allow('').optional(),

}).min(1).unknown(false);

module.exports = {
    laporanMobileCranePayload,
};