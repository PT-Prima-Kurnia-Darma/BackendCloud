'use strict';

const Joi = require('joi');

// Skema untuk status dan keterangan yang berulang
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null).optional(),
    remarks: Joi.string().allow('', null).optional()
});

// Skema untuk item dinamis pada tabel rantai (chain)
const chainItemSchema = Joi.object({
    chainLocaton: Joi.string().allow('', null).optional(),
    specDimension: Joi.string().allow('', null).optional(),
    resultDimension: Joi.string().allow(null).optional(),
    extendLengthMax: Joi.string().allow('', null).optional(),
    wearMax: Joi.string().allow('', null).optional(),
    safetyFactor: Joi.string().allow('', null).optional(),
    defectAda: Joi.boolean().allow(null).optional(),
    defectTidakAda: Joi.boolean().allow(null).optional(),
    description: Joi.string().allow('', null).optional()
});

// Skema untuk pengujian dinamis
const dynamicTestItemSchema = Joi.object({
    test: Joi.string().allow('', null).optional(),
    shouldBe: Joi.string().allow('', null).optional(),
    testedOrMeasured: Joi.string().allow('', null).optional(),
    remarks: Joi.string().allow('', null).optional()
});

const dynamicTestWithLoadItemSchema = Joi.object({
    load: Joi.string().allow('', null).optional(),
    hoist: Joi.string().allow('', null).optional(),
    traversing: Joi.string().allow('', null).optional(),
    traveling: Joi.string().allow('', null).optional(),
    brakeSystem: Joi.string().allow('', null).optional(),
    remarks: Joi.string().allow('', null).optional()
});

// --- Skema Utama ---
const laporanOverheadCranePayload = Joi.object({
    examinationType: Joi.string().allow('', null).optional(),
    inspectionType: Joi.string().allow('', null).optional(),
    inspectionDate: Joi.string().allow('', null).optional(),
    extraId: Joi.number().allow('', null).optional(),
    createdAt: Joi.string().allow('', null).optional(),

    generalData: Joi.object({
        ownerName: Joi.string().allow('', null).optional(),
        ownerAddress: Joi.string().allow('', null).optional(),
        userInCharge: Joi.string().allow('', null).optional(),
        subcontractorPersonInCharge: Joi.string().allow('', null).optional(),
        unitLocation: Joi.string().allow('', null).optional(),
        equipmentType: Joi.string().allow('', null).optional(),
        manufacturer: Joi.string().allow('', null).optional(),
        brandType: Joi.string().allow('', null).optional(),
        yearOfManufacture: Joi.string().allow('', null).optional(),
        serialNumberUnitNumber: Joi.string().allow('', null).optional(),
        capacityWorkingLoadKg: Joi.string().allow(null).optional(),
        intendedUse: Joi.string().allow('', null).optional(),
        usagePermitNumber: Joi.string().allow('', null).optional(),
        operatorCertificate: Joi.string().allow('', null).optional(),
        technicalOrManualData: Joi.string().allow('', null).optional()
    }).optional(),

    technicalData: Joi.object({
        specifications: Joi.object({
            liftingHeight: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            girderLength: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            speed_m_per_min: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional(),
        driveMotor: Joi.object({
            capacity_ton: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            power_kw: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            type: Joi.object({ hoisting: Joi.string().allow('', '', null).optional(), traveling: Joi.string().allow('', '', null).optional(), traversing: Joi.string().allow('', '', null).optional() }).optional(),
            revolution_rpm: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            voltage_v: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            current_a: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            frequency_hz: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional(),
        startingResistor: Joi.object({
            type: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            voltage_v: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            current_a: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional(),
        brake: Joi.object({
            kind: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            type: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional(),
        controllerBrake: Joi.object({
            kind: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            type: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional(),
        hook: Joi.object({
            type: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            capacity: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            material: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional(),
        chain: Joi.object({
            type: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            construction: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            diameter: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional(),
            length: Joi.object({ hoisting: Joi.string().allow('', null).optional(), traveling: Joi.string().allow('', null).optional(), traversing: Joi.string().allow('', null).optional() }).optional()
        }).optional()
    }).optional(),

    visualInspection: Joi.object({
        foundation: Joi.object({ bolts: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).optional() }).optional(),
        columnFrame: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema, crossBracing: inspectionItemSchema, diagonalBracing: inspectionItemSchema }).optional(),
        stairs: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).optional(),
        platform: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).optional(),
        railSupportBeam: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, fastening: inspectionItemSchema }).optional(),
        travelingRail: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, joints: inspectionItemSchema, straightness: inspectionItemSchema, interRailStraightness: inspectionItemSchema, interRailEvenness: inspectionItemSchema, jointGap: inspectionItemSchema, fasteners: inspectionItemSchema, stopper: inspectionItemSchema }).optional(),
        traversingRail: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, joints: inspectionItemSchema, straightness: inspectionItemSchema, interRailStraightness: inspectionItemSchema, interRailEvenness: inspectionItemSchema, jointGap: inspectionItemSchema, fasteners: inspectionItemSchema, stopper: inspectionItemSchema }).optional(),
        girder: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, camber: inspectionItemSchema, joints: inspectionItemSchema, endJoints: inspectionItemSchema, truckMount: inspectionItemSchema }).optional(),
        travelingGearbox: Joi.object({ corrosion: inspectionItemSchema, cracks: inspectionItemSchema, lubricant: inspectionItemSchema, oilSeal: inspectionItemSchema }).optional(),
        driveWheel: Joi.object({ wear: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema, chain: inspectionItemSchema }).optional(),
        idleWheel: Joi.object({ security: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema }).optional(),
        wheelConnector: Joi.object({ straightness: inspectionItemSchema, crossJoint: inspectionItemSchema, lubrication: inspectionItemSchema }).optional(),
        girderBumper: Joi.object({ condition: inspectionItemSchema, reinforcement: inspectionItemSchema }).optional(),
        trolleyGearbox: Joi.object({ fastening: inspectionItemSchema, corrosion: inspectionItemSchema, cracks: inspectionItemSchema, lubricant: inspectionItemSchema, oilSeal: inspectionItemSchema }).optional(),
        trolleyDriveWheel: Joi.object({ wear: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema, chain: inspectionItemSchema }).optional(),
        trolleyIdleWheel: Joi.object({ wear: inspectionItemSchema, cracks: inspectionItemSchema, deformation: inspectionItemSchema, flange: inspectionItemSchema }).optional(),
        trolleyWheelConnector: Joi.object({ straightness: inspectionItemSchema, crossJoint: inspectionItemSchema, lubrication: inspectionItemSchema }).optional(),
        trolleyBumper: Joi.object({ condition: inspectionItemSchema, reinforcement: inspectionItemSchema }).optional(),
        drum: Joi.object({ groove: inspectionItemSchema, grooveLip: inspectionItemSchema, flanges: inspectionItemSchema }).optional(),
        brakeVisual: Joi.object({ wear: inspectionItemSchema, adjustment: inspectionItemSchema }).optional(),
        hoistGearBox: Joi.object({ lubrication: inspectionItemSchema, oilSeal: inspectionItemSchema }).optional(),
        pulleyChainSprocket: Joi.object({ pulleyGroove: inspectionItemSchema, pulleyLip: inspectionItemSchema, pulleyPin: inspectionItemSchema, pulleyBearing: inspectionItemSchema, pulleyGuard: inspectionItemSchema, ropeChainGuard: inspectionItemSchema }).optional(),
        mainHook: Joi.object({ wear: inspectionItemSchema, throatOpening: inspectionItemSchema, swivel: inspectionItemSchema, trunnion: inspectionItemSchema }).optional(),
        auxHook: Joi.object({ wear: inspectionItemSchema, throatOpening: inspectionItemSchema, swivel: inspectionItemSchema, trunnion: inspectionItemSchema }).optional(),
        mainWireRope: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, broken: inspectionItemSchema, deformation: inspectionItemSchema }).optional(),
        auxWireRope: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, broken: inspectionItemSchema, deformation: inspectionItemSchema }).optional(),
        mainChain: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, cracksBroken: inspectionItemSchema, deformation: inspectionItemSchema }).optional(),
        auxChain: Joi.object({ corrosion: inspectionItemSchema, wear: inspectionItemSchema, cracksBroken: inspectionItemSchema, deformation: inspectionItemSchema }).optional(),
        limitSwitch: Joi.object({ longTraveling: inspectionItemSchema, crossTraveling: inspectionItemSchema, lifting: inspectionItemSchema }).optional(),
        operatorCabin: Joi.object({ safetyStairs: inspectionItemSchema, door: inspectionItemSchema, window: inspectionItemSchema, fanAc: inspectionItemSchema, controlLevers: inspectionItemSchema, pendantControl: inspectionItemSchema, lighting: inspectionItemSchema, horn: inspectionItemSchema, fuse: inspectionItemSchema, commTool: inspectionItemSchema, fireExtinguisher: inspectionItemSchema, operatingSigns: inspectionItemSchema, masterSwitch: inspectionItemSchema }).optional(),
        electricalComponents: Joi.object({ panelConnector: inspectionItemSchema, conductorGuard: inspectionItemSchema, motorSafetySystem: inspectionItemSchema, groundingSystem: inspectionItemSchema, installation: inspectionItemSchema }).optional()
    }).optional(),

    nonDestructiveExamination: Joi.object({
        chain: Joi.object({
            method: Joi.string().allow('', null).optional(),
            items: Joi.array().items(chainItemSchema).optional()
        }).optional(),
        mainHook: Joi.object({
            method: Joi.string().allow('', null).optional(),
            measurements: Joi.object().pattern(Joi.string(), Joi.string().allow('', null).optional()).optional(),
            tolerances: Joi.object().pattern(Joi.string(), Joi.string().allow('', null).optional()).optional(),
            result: Joi.string().allow('', null).optional()
        }).optional()
    }).optional(),

    testing: Joi.object({
        dynamicTest: Joi.object({
            withoutLoad: Joi.array().items(dynamicTestItemSchema).optional(),
            withLoad: Joi.array().items(dynamicTestWithLoadItemSchema).optional()
        }).optional(),
        staticTest: Joi.object({
            testLoad: Joi.string().allow('', null).optional(),
            deflection: Joi.object({
                singleGirder: Joi.object({ measurement: Joi.string().allow('', null).optional(), description: Joi.string().allow('', null).optional() }).optional(),
                doubleGirder: Joi.object({ measurement: Joi.string().allow('', null).optional(), description: Joi.string().allow('', null).optional() }).optional()
            }).optional(),
            singleGirder: Joi.object({ design_mm: Joi.string().allow('', null).optional(), span_mm: Joi.string().allow('', null).optional(), result: Joi.boolean().allow('', null).optional() }).optional(),
            doubleGirder: Joi.object({ design_mm: Joi.string().allow('', null).optional(), span_mm: Joi.string().allow('', null).optional(), result: Joi.boolean().allow('', null).optional() }).optional(),
            notes: Joi.string().allow('', null).optional()
        }).optional()
    }).optional(),

    conclusion: Joi.string().allow('', null).optional(),
    recommendations: Joi.string().allow('', null).optional()

}).min(1);

module.exports = {
    laporanOverheadCranePayload,
};