'use strict';

const Joi = require('joi');

// Skema untuk status dan keterangan yang berulang
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false).required(),
    remarks: Joi.string().allow('').required()
});

// Skema untuk item dinamis pada tabel rantai (chain)
const chainItemSchema = Joi.object({
    chainLocaton: Joi.string().allow('').required(),
    specDimension: Joi.string().allow('').required(),
    resultDimension: Joi.string().allow('').required(),
    extendLengthMax: Joi.string().allow('').required(),
    wearMax: Joi.string().allow('').required(),
    safetyFactor: Joi.string().allow('').required(),
    defectAda: Joi.boolean().allow(true, false).required(),
    defectTidakAda: Joi.boolean().allow(true, false).required(),
    description: Joi.string().allow('').required()
});

// Skema untuk pengujian dinamis
const dynamicTestItemSchema = Joi.object({
    test: Joi.string().allow('').required(),
    shouldBe: Joi.string().allow('').required(),
    testedOrMeasured: Joi.string().allow('').required(),
    remarks: Joi.string().allow('').required()
});

const dynamicTestWithLoadItemSchema = Joi.object({
    load: Joi.string().allow('').required(),
    hoist: Joi.string().allow('').required(),
    traversing: Joi.string().allow('').required(),
    traveling: Joi.string().allow('').required(),
    brakeSystem: Joi.string().allow('').required(),
    remarks: Joi.string().allow('').required()
});

// --- Skema Utama ---
const laporanOverheadCranePayload = Joi.object({
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    inspectionDate: Joi.string().allow('').required(),
    extraId: Joi.number().allow('').required(),
    createdAt: Joi.string().allow('').required(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('').required(),
        ownerAddress: Joi.string().allow('').required(),
        userInCharge: Joi.string().allow('').required(),
        subcontractorPersonInCharge: Joi.string().allow('').required(),
        unitLocation: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        yearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        capacityWorkingLoadKg: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        usagePermitNumber: Joi.string().allow('').required(),
        operatorCertificate: Joi.string().allow('').required(),
        technicalOrManualData: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        specifications: Joi.object({
            liftingHeight: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            girderLength: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            speed_m_per_min: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required(),
        driveMotor: Joi.object({
            capacity_ton: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            power_kw: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            type: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            revolution_rpm: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            voltage_v: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            current_a: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            frequency_hz: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required(),
        startingResistor: Joi.object({
            type: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            voltage_v: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            current_a: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required(),
        brake: Joi.object({
            kind: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            type: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required(),
        controllerBrake: Joi.object({
            kind: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            type: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required(),
        hook: Joi.object({
            type: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            capacity: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            material: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required(),
        chain: Joi.object({
            type: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            construction: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            diameter: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required(),
            length: Joi.object({ hoisting: Joi.string().allow('').required(), traveling: Joi.string().allow('').required(), traversing: Joi.string().allow('').required() }).required()
        }).required()
    }).required(),

    visualInspection: Joi.object({
        foundation: Joi.object({ bolts: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).required() }).required(),
        columnFrame: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema, crossBracing: inspectionItemSchema, diagonalBracing: inspectionItemSchema }).required(),
        stairs: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).required(),
        platform: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).required(),
        railSupportBeam: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).required(),
        travelingRail: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, joints: inspectionItemSchema, straightness: inspectionItemSchema, interRailStraightness: inspectionItemSchema, interRailEvenness: inspectionItemSchema, jointGap: inspectionItemSchema, fasteners: inspectionItemSchema, stopper: inspectionItemSchema }).required(),
        traversingRail: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, joints: inspectionItemSchema, straightness: inspectionItemSchema, interRailStraightness: inspectionItemSchema, interRailEvenness: inspectionItemSchema, jointGap: inspectionItemSchema, fasteners: inspectionItemSchema, stopper: inspectionItemSchema }).required(),
        girder: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, camber: inspectionItemSchema, joints: inspectionItemSchema, endJoints: inspectionItemSchema, truckMount: inspectionItemSchema }).required(),
        travelingGearbox: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, lubricant: inspectionItemSchema, oilSeal: inspectionItemSchema }).required(),
        driveWheel: Joi.object({ wear: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema, chain: inspectionItemSchema }).required(),
        idleWheel: Joi.object({ security: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema }).required(),
        wheelConnector: Joi.object({ straightness: inspectionItemSchema, crossJoint: inspectionItemSchema, lubrication: inspectionItemSchema }).required(),
        girderBumper: Joi.object({ condition: inspectionItemSchema, reinforcement: inspectionItemSchema }).required(),
        trolleyGearbox: Joi.object({ fastening: inspectionItemSchema, corrosion: inspectionItemSchema, cracks: inspectionItemSchema, lubricant: inspectionItemSchema, oilSeal: inspectionItemSchema }).required(),
        trolleyDriveWheel: Joi.object({ wear: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema, chain: inspectionItemSchema }).required(),
        trolleyIdleWheel: Joi.object({ wear: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema }).required(),
        trolleyWheelConnector: Joi.object({ straightness: inspectionItemSchema, crossJoint: inspectionItemSchema, lubrication: inspectionItemSchema }).required(),
        trolleyBumper: Joi.object({ condition: inspectionItemSchema, reinforcement: inspectionItemSchema }).required(),
        drum: Joi.object({ groove: inspectionItemSchema, grooveLip: inspectionItemSchema, flanges: inspectionItemSchema }).required(),
        brakeVisual: Joi.object({ wear: inspectionItemSchema, adjustment: inspectionItemSchema }).required(),
        hoistGearBox: Joi.object({ lubrication: inspectionItemSchema, oilSeal: inspectionItemSchema }).required(),
        pulleyChainSprocket: Joi.object({ pulleyGroove: inspectionItemSchema, pulleyLip: inspectionItemSchema, pulleyPin: inspectionItemSchema, pulleyBearing: inspectionItemSchema, pulleyGuard: inspectionItemSchema, ropeChainGuard: inspectionItemSchema }).required(),
        mainHook: Joi.object({ wear: inspectionItemSchema, throatOpening: inspectionItemSchema, swivel: inspectionItemSchema, trunnion: inspectionItemSchema }).required(),
        auxHook: Joi.object({ wear: inspectionItemSchema, throatOpening: inspectionItemSchema, swivel: inspectionItemSchema, trunnion: inspectionItemSchema }).required(),
        mainWireRope: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, broken: inspectionItemSchema, deformation: inspectionItemSchema }).required(),
        auxWireRope: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, broken: inspectionItemSchema, deformation: inspectionItemSchema }).required(),
        mainChain: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, cracksBroken: inspectionItemSchema, deformation: inspectionItemSchema }).required(),
        auxChain: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, cracksBroken: inspectionItemSchema, deformation: inspectionItemSchema }).required(),
        limitSwitch: Joi.object({ longTraveling: inspectionItemSchema, crossTraveling: inspectionItemSchema, lifting: inspectionItemSchema }).required(),
        operatorCabin: Joi.object({ safetyStairs: inspectionItemSchema, door: inspectionItemSchema, window: inspectionItemSchema, fanAc: inspectionItemSchema, controlLevers: inspectionItemSchema, pendantControl: inspectionItemSchema, lighting: inspectionItemSchema, horn: inspectionItemSchema, fuse: inspectionItemSchema, commTool: inspectionItemSchema, fireExtinguisher: inspectionItemSchema, operatingSigns: inspectionItemSchema, masterSwitch: inspectionItemSchema }).required(),
        electricalComponents: Joi.object({ panelConnector: inspectionItemSchema, conductorGuard: inspectionItemSchema, motorSafetySystem: inspectionItemSchema, groundingSystem: inspectionItemSchema, installation: inspectionItemSchema }).required()
    }).required(),

    nonDestructiveExamination: Joi.object({
        chain: Joi.object({
            method: Joi.string().allow('').required(),
            items: Joi.array().items(chainItemSchema).required()
        }).required(),
        mainHook: Joi.object({
            method: Joi.string().allow('').required(),
            measurements: Joi.object().pattern(Joi.string(), Joi.string().allow('').required()).required(),
            tolerances: Joi.object().pattern(Joi.string(), Joi.string().allow('').required()).required(),
            result: Joi.string().allow('').required()
        }).required()
    }).required(),

    testing: Joi.object({
        dynamicTest: Joi.object({
            withoutLoad: Joi.array().items(dynamicTestItemSchema).required(),
            withLoad: Joi.array().items(dynamicTestWithLoadItemSchema).required()
        }).required(),
        staticTest: Joi.object({
            testLoad: Joi.string().allow('').required(),
            deflection: Joi.object({
                singleGirder: Joi.object({ measurement: Joi.string().allow('').required(), description: Joi.string().allow('').required() }).required(),
                doubleGirder: Joi.object({ measurement: Joi.string().allow('').required(), description: Joi.string().allow('').required() }).required()
            }).required(),
            singleGirder: Joi.object({ design_mm: Joi.string().allow('').required(), span_mm: Joi.string().allow('').required(), result: Joi.boolean().allow(true, false).required() }).required(),
            doubleGirder: Joi.object({ design_mm: Joi.string().allow('').required(), span_mm: Joi.string().allow('').required(), result: Joi.boolean().allow(true, false).required() }).required(),
            notes: Joi.string().allow('').required()
        }).required()
    }).required(),

    conclusion: Joi.string().allow('').required(),
    recommendations: Joi.string().allow('').required()

});

module.exports = {
    laporanOverheadCranePayload,
};