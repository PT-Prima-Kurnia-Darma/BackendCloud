'use strict';

const Joi = require('joi');

// Skema untuk format status baru { status: boolean, result: string }
const inspectionResultSchema = Joi.object({
    status: Joi.boolean().allow(true, false).required(),
    result: Joi.string().allow('').required()
});

// Skema untuk sub-objek di dalam 'visual'
const visualSectionSchema = (fields) => {
    const schema = {};
    fields.forEach(field => {
        schema[field] = inspectionResultSchema.required();
    });
    return Joi.object(schema);
};

// Skema untuk item dalam tabel NDT (Non-Destructive Testing) dinamis
const ndtSteelWireRopeItemSchema = Joi.object({
    usageAt: Joi.string().allow('').required(),
    specDiameter: Joi.string().allow('').required(),
    actualDiameter: Joi.string().allow('').required(),
    construction: Joi.string().allow('').required(),
    type: Joi.string().allow('').required(),
    length: Joi.string().allow('').required(),
    age: Joi.string().allow('').required(),
    result: inspectionResultSchema.required()
});

const ndtBoomInspectionItemSchema = Joi.object({
    part: Joi.string().allow('').required(),
    location: Joi.string().allow('').required(),
    result: inspectionResultSchema.required()
});

// Skema untuk item dalam tabel uji beban
const loadTestItemSchema = Joi.object({
    boomLength: Joi.string().allow('').required(),
    radius: Joi.string().allow('').required(),
    boomAngle: Joi.string().allow('').required(),
    testLoad: Joi.string().allow('').required(),
    safeWorkingLoad: Joi.string().allow('').required(),
    result: Joi.string().allow('').required()
});

// Skema untuk NDT Hook, Drum, dan Pulley
const ndtMeasurementSchema = (hasTolerance = false) => {
    const schema = {
        ndtType: Joi.string().allow('').required(),
        capacity: Joi.string().allow('').required(),
        specification: Joi.object({
            a: Joi.string().allow('').required(),
            b: Joi.string().allow('').required(),
            c: Joi.string().allow('').required(),
            d: Joi.string().allow('').required(),
            e: Joi.string().allow('').required(),
            f: Joi.string().allow('').required(),
            g: Joi.string().allow('').required(),
            h: Joi.string().allow('').required(),
            result: inspectionResultSchema.required()
        }).required(),
        measurementResults: Joi.object({
            a: Joi.string().allow('').required(),
            b: Joi.string().allow('').required(),
            c: Joi.string().allow('').required(),
            d: Joi.string().allow('').required(),
            e: Joi.string().allow('').required(),
            f: Joi.string().allow('').required(),
            g: Joi.string().allow('').required(),
            h: Joi.string().allow('').required(),
            result: inspectionResultSchema.required()
        }).required(),
    };
    if (hasTolerance) {
        schema.toleranceMeasure = Joi.object({
            a: Joi.string().allow('').required(),
            b: Joi.string().allow('').required(),
            c: Joi.string().allow('').required(),
            d: Joi.string().allow('').required(),
            e: Joi.string().allow('').required(),
            f: Joi.string().allow('').required(),
            g: Joi.string().allow('').required(),
            h: Joi.string().allow('').required(),
            result: inspectionResultSchema.required()
        }).required();
    }
    return Joi.object(schema);
};


// === SKEMA UTAMA UNTUK PAYLOAD LAPORAN MOBILE CRANE ===
const laporanMobileCranePayload = Joi.object({
    inspectionType: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),
    equipmentType: Joi.string().allow('').required(),
    examinationType: Joi.string().allow('').required(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        userSubcontractorPersonInCharge: Joi.string().allow('').required(),
        userAddress: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        operatorName: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        locationAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        usagePermitNumber: Joi.string().allow('').required(),
        operatorCertificate: Joi.string().allow('').required(),
        equipmentHistory: Joi.string().allow('').required(),
        inspectionDate: Joi.string().allow('').required(),
    }).required(),

    technicalData: Joi.object({
        maximumWorkingLoadCapacity: Joi.string().allow('').required(),
        boomLength: Joi.string().allow('').required(),
        maximumJibLength: Joi.string().allow('').required(),
        maximumJibWorkingLoad: Joi.string().allow('').required(),
        maxBoomJibLength: Joi.string().allow('').required(),
        craneWeight: Joi.string().allow('').required(),
        maxLiftingHeight: Joi.string().allow('').required(),
        boomWorkingAngle: Joi.string().allow('').required(),
        engineNumber: Joi.string().allow('').required(),
        type: Joi.string().allow('').required(),
        numberOfCylinders: Joi.string().allow('').required(),
        netPower: Joi.string().allow('').required(),
        brandYearOfManufacture: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        mainHookType: Joi.string().allow('').required(),
        mainHookCapacity: Joi.string().allow('').required(),
        mainHookMaterial: Joi.string().allow('').required(),
        mainHookSerialNumber: Joi.string().allow('').required(),
        auxiliaryHookType: Joi.string().allow('').required(),
        auxiliaryHookCapacity: Joi.string().allow('').required(),
        auxiliaryHookMaterial: Joi.string().allow('').required(),
        auxiliaryHookSerialNumber: Joi.string().allow('').required(),
        wireRopeMainLoadHoistDrumDiameter: Joi.string().allow('').required(),
        wireRopeMainLoadHoistDrumType: Joi.string().allow('').required(),
        wireRopeMainLoadHoistDrumConstruction: Joi.string().allow('').required(),
        wireRopeMainLoadHoistDrumBreakingStrength: Joi.string().allow('').required(),
        wireRopeMainLoadHoistDrumLength: Joi.string().allow('').required(),
        wireRopeAuxiliaryLoadHoistDrumDiameter: Joi.string().allow('').required(),
        wireRopeAuxiliaryLoadHoistDrumType: Joi.string().allow('').required(),
        wireRopeAuxiliaryLoadHoistDrumConstruction: Joi.string().allow('').required(),
        wireRopeAuxiliaryLoadHoistDrumLength: Joi.string().allow('').required(),
        wireRopeAuxiliaryLoadHoistDrumBreakingStrength: Joi.string().allow('').required(),
        wireRopeBoomHoistDrumDiameter: Joi.string().allow('').required(),
        wireRopeBoomHoistDrumType: Joi.string().allow('').required(),
        wireRopeBoomHoistDrumConstruction: Joi.string().allow('').required(),
        wireRopeBoomHoistDrumLength: Joi.string().allow('').required(),
        wireRopeBoomHoistDrumBreakingStrength: Joi.string().allow('').required(),
    }).required(),

    inspectionAndTesting: Joi.object({
        visualFoundationAndBolts: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'tightness']).required(),
        visualFrameColumnsOnFoundation: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'fastening', 'transverseReinforcement', 'diagonalReinforcement']).required(),
        visualLadder: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'fastening']).required(),
        visualWorkingPlatform: visualSectionSchema(['corrosion', 'cracks', 'deformation', 'fastening']).required(),
        visualOutriggers: visualSectionSchema(['outriggerArmHousing', 'outriggerArms', 'jack', 'outriggerPads', 'housingConnectionToChassis', 'outriggerSafetyLocks']).required(),
        visualTurntable: visualSectionSchema(['slewingRollerBearing', 'brakeHousing', 'brakeLiningsAndShoes', 'drumSurface', 'pressureCylinder', 'drumAxle', 'leversPinsBolts', 'guard']).required(),
        visualLatticeBoom: visualSectionSchema(['mainBoom', 'boomSection', 'topPulley', 'pulleyGuard', 'wireRopeGuard', 'pulleyGrooveLip', 'pivotPin', 'wireRopeGuidePulley']).required(),
        visualSteering: visualSectionSchema(['mainClutch', 'transmission', 'frontWheel', 'middleWheel', 'rearWheel']).required(),
        visualBrake: visualSectionSchema(['serviceBrake', 'parkingBrake', 'brakeHousing', 'brakeLiningsAndShoes', 'drumSurface', 'leversPinsBolts', 'guard']).required(),
        visualTravelDrum: visualSectionSchema(['clutchHousing', 'clutchLining', 'clutchDrumSurface', 'leversPinsBolts', 'guard']).required(),
        visualMainWinch: visualSectionSchema(['drumMounting', 'windingDrumSurface', 'brakeLiningsAndShoes', 'brakeDrumSurface', 'brakeHousing', 'clutchLiningsAndShoes', 'clutchDrumSurface', 'groove', 'grooveLip', 'flanges', 'brakeActuatorLeversPinsAndBolts']).required(),
        visualAuxiliaryWinch: visualSectionSchema(['drumMounting', 'windingDrumSurface', 'brakeLiningsAndShoes', 'brakeDrumSurface', 'brakeHousing', 'clutchLiningsAndShoes', 'clutchDrumSurface', 'groove', 'grooveLip', 'flanges', 'brakeActuatorLeversPinsAndBolts']).required(),
        visualHoistGearBlock: visualSectionSchema(['lubrication', 'oilSeal']).required(),
        visualMainPulley: visualSectionSchema(['pulleyGroove', 'pulleyGrooveLip', 'pulleyPin', 'bearing', 'pulleyGuard', 'wireRopeGuard']).required(),
        visualMainHook: visualSectionSchema(['swivelNutAndBearing', 'trunnion', 'safetyLatch']).required(),
        visualAuxiliaryHook: visualSectionSchema(['freeFallWeight', 'swivelNutAndBearing', 'safetyLatch']).required(),
        visualMainWireRope: visualSectionSchema(['corrosion', 'wear', 'breakage', 'deformation']).required(),
        visualAuxiliaryWireRope: visualSectionSchema(['corrosion', 'wear', 'breakage', 'deformation']).required(),
        visualLimitSwitch: visualSectionSchema(['longTravel', 'crossTravel', 'hoisting']).required(),
        visualInternalCombustionEngine: visualSectionSchema(['coolingSystem', 'lubricationSystem', 'engineMounting', 'safetyGuardEquipment', 'exhaustSystem', 'fuelSystem', 'powerTransmissionSystem', 'battery', 'starterMotor', 'wiringInstallation', 'turbocharger']).required(),
        visualHydraulic: visualSectionSchema(['pump', 'lines', 'filter', 'tank', 'mainWinchMotor', 'auxiliaryWinchMotor', 'boomWinchMotor', 'swingMotor']).required(),
        visualControlValve: visualSectionSchema(['reliefValve', 'mainWinchValve', 'auxiliaryWinchValve', 'boomWinchValve', 'boomMovementValve', 'steeringCylinderValve', 'axleOscillationValve', 'outriggerMovementValve']).required(),
        visualHydraulicCylinder: visualSectionSchema(['boomMovementCylinder', 'outriggerCylinder', 'steeringWheelCylinder', 'axleOscillationCylinder', 'telescopicCylinder']).required(),
        visualPneumatic: visualSectionSchema(['compressor', 'tankAndSafetyValve', 'pressurizedAirLines', 'airFilter', 'controlValve']).required(),
        visualOperatorCabin: visualSectionSchema(['safetyLadder', 'door', 'window', 'fanAc', 'controlLeversButtons', 'pendantControl', 'lighting', 'hornSignalAlarm', 'fuse', 'communicationDevice', 'fireExtinguisher', 'operatingSigns', 'ignitionKeyMasterSwitch', 'buttonsHandlesLevers']).required(),
        visualElectricalComponents: visualSectionSchema(['panelConductorConnector', 'conductorProtection', 'motorInstallationSafetySystem', 'groundingSystem', 'installation']).required(),
        visualSafetyDevices: visualSectionSchema([
            'ladderHandrail', 'engineOilLubricantPressure', 'hydraulicOilPressure', 'airPressure', 'amperemeter', 'voltage', 'engineTemperature', 'transmissionTemperature', 
            'converterOilTemperaturePressure', 'converterSpeedometerIndicator', 'converterRotaryLamp', 'converterMainHoistRopeUpDownLimit', 'converterAuxiliaryHoistRopeUpDownLimit', 
            'converterSwingMotionLimit', 'converterLevelIndicator', 'converterLoadWeightIndicator', 'converterLoadChart', 'converterAnemometerWindSpeed', 'converterBoomAngleIndicator', 
            'converterAirPressureIndicator', 'converterHydraulicPressureIndicator', 'converterSafetyValves', 'converterMainWindingDrumSafetyLock', 'converterAuxiliaryWindingDrumSafetyLock', 
            'converterTelescopicMotionLimit', 'converterLightningArrester', 'converterLiftingHeightIndicator'
        ]).required(),
        
        ndtSteelWireRope: Joi.object({
            ndtType: Joi.string().allow('').required(),
            ropes: Joi.array().items(ndtSteelWireRopeItemSchema).required()
        }).required(),
        ndtBoom: Joi.object({
            boomType: Joi.string().allow('').required(),
            ndtType: Joi.string().allow('').required(),
            inspections: Joi.array().items(ndtBoomInspectionItemSchema).required()
        }).required(),
        ndtMainHook: ndtMeasurementSchema(true).required(),
        ndtAuxiliaryHook: ndtMeasurementSchema(true).required(),
        ndtMainDrum: ndtMeasurementSchema(false).required(),
        ndtAuxiliaryDrum: ndtMeasurementSchema(false).required(),
        ndtMainPulley: ndtMeasurementSchema(false).required(),
        ndtAuxiliaryPulley: ndtMeasurementSchema(false).required(),
        
        testingFunction: visualSectionSchema([
            'hoistingLowering', 'extendedRetractedBoom', 'extendedRetractedOutrigger', 'swingSlewing', 'antiTwoBlock', 'boomStop', 'anemometerWindSpeed', 'brakeLockingDevice', 
            'loadMomentIndicator', 'turnSignal', 'drivingLights', 'loadIndicatorLight', 'rotaryLamp', 'horn', 'swingAlarm', 'reverseAlarm', 'overloadAlarm'
        ]).required(),
        dynamicMainHookTests: Joi.array().items(loadTestItemSchema).required(),
        dynamicAuxiliaryHookTests: Joi.array().items(loadTestItemSchema).required(),
        staticMainHookTests: Joi.array().items(loadTestItemSchema).required(),
        staticAuxiliaryHookTests: Joi.array().items(loadTestItemSchema).required(),

    }).required(),

    conclusion: Joi.string().allow('').required(),
    recommendation: Joi.string().allow('').required(),

});

module.exports = {
    laporanMobileCranePayload,
};