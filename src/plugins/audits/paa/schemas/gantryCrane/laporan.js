'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false).required(),
    result: Joi.string().allow('').required()
}).required();

// Reusable schema generator for a section of inspection items
const sectionSchema = (items) => Joi.object(
    Object.keys(items).reduce((acc, key) => {
        acc[key] = inspectionItemSchema;
        return acc;
    }, {})
).required();

// Skema untuk setiap baris pada tabel Wirerope (dinamis)
const wireropeItemSchema = Joi.object({
    wireropeNumber: Joi.string().allow('').required(),
    wireropeUsed: Joi.string().allow('').required(),
    dimensionSpec: Joi.string().allow('').required(),
    dimensionResult: Joi.string().allow('').required(),
    construction: Joi.string().allow('').required(),
    type: Joi.string().allow('').required(),
    length: Joi.string().allow('').required(),
    age: Joi.string().allow('').required(),
    defectAda: Joi.boolean().allow(true, false).required(),
    defectTidakAda: Joi.boolean().allow(true, false).required(),
    description: Joi.string().allow('').required()
}).required();

// Skema untuk setiap baris pada tabel Girder (dinamis)
const girderItemSchema = Joi.object({
    griderNumber: Joi.string().allow('').required(),
    griderLocation: Joi.string().allow('').required(),
    griderAda: Joi.boolean().allow(true, false).required(),
    griderTidakAda: Joi.boolean().allow(true, false).required(),
    griderDesc: Joi.string().allow('').required()
}).required();

// Skema untuk setiap baris pada tabel Defleksi (dinamis)
const defleksiItemSchema = Joi.object({
    defleksiPosision: Joi.string().allow('').required(),
    defleksiMeasuraments: Joi.string().allow('').required(),
    defleksiStandard: Joi.string().allow('').required(),
    defleksiDesc: Joi.string().allow('').required()
}).required();

const laporanGantryCranePayload = Joi.object({
    examinationType: Joi.string().required(),
    inspectionType: Joi.string().required(),
    createdAt: Joi.date().iso().required(), 
    extraId: Joi.number().required(),
    equipmentType: Joi.string().required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        usageLocation: Joi.string().allow('').required(),
        location: Joi.string().allow('').required(),
        manufacturerHoist: Joi.string().allow('').required(),
        manufacturerStructure: Joi.string().allow('').required(),
        brandOrType: Joi.string().allow('').required(),
        manufactureYear: Joi.string().allow('').required(),
        serialNumber: Joi.string().allow('').required(),
        maxLiftingCapacityKg: Joi.string().allow('').required(),
        usagePermitNumber: Joi.string().allow('').required(),
        operatorcertificateStatus: Joi.string().allow('').required(),
        technicalDataManualStatus: Joi.string().allow('').required(),
        inspectionDate: Joi.string().required()
    }).required(),

    technicalData: Joi.object({
        liftHeight: Joi.string().allow('').required(),
        girderLength: Joi.string().allow('').required(),
        hoistingSpeed: Joi.string().allow('').required(),
        travelingSpeed: Joi.string().allow('').required(),
        traversingSpeed: Joi.string().allow('').required(),
        driveMotorcapacity: Joi.string().allow('').required(),
        hoistingpowerKw: Joi.string().allow('').required(),
        travelingpowerKw: Joi.string().allow('').required(),
        traversingpowerKw: Joi.string().allow('').required(),
        hoistingtype: Joi.string().allow('').required(),
        travelingtype: Joi.string().allow('').required(),
        traversingtype: Joi.string().allow('').required(),
        hoistingrpm: Joi.string().allow('').required(),
        travelingrpm: Joi.string().allow('').required(),
        traversingrpm: Joi.string().allow('').required(),
        hoistingvoltageV: Joi.string().allow('').required(),
        travelingvoltageV: Joi.string().allow('').required(),
        traversingvoltageV: Joi.string().allow('').required(),
        hoistingcurrentA: Joi.string().allow('').required(),
        travelingcurrentA: Joi.string().allow('').required(),
        traversingcurrentA: Joi.string().allow('').required(),
        hoistingfrequencyHz: Joi.string().allow('').required(),
        travelingfrequencyHz: Joi.string().allow('').required(),
        traversingfrequencyHz: Joi.string().allow('').required(),
        hoistingphase: Joi.string().allow('').required(),
        travelingphase: Joi.string().allow('').required(),
        traversingphase: Joi.string().allow('').required(),
        hoistingpowerSupply: Joi.string().allow('').required(),
        travelingpowerSupply: Joi.string().allow('').required(),
        traversingpowerSupply: Joi.string().allow('').required(),
        braketype: Joi.string().allow('').required(),
        brakemodel: Joi.string().allow('').required(),
        controlBrakehoistingtype: Joi.string().allow('').required(),
        controlBraketravelingtype: Joi.string().allow('').required(),
        controlBraketraversingtype: Joi.string().allow('').required(),
        controlBrakehoistingmodel: Joi.string().allow('').required(),
        controlBraketravelingmodel: Joi.string().allow('').required(),
        controlBraketraversingmodel: Joi.string().allow('').required(),
        hookhoistingtype: Joi.string().allow('').required(),
        hooktravelingtype: Joi.string().allow('').required(),
        hooktraversingtype: Joi.string().allow('').required(),
        hookhoistingcapacity: Joi.string().allow('').required(),
        hooktravelingcapacity: Joi.string().allow('').required(),
        hooktraversingcapacity: Joi.string().allow('').required(),
        hookhoistingmaterial: Joi.string().allow('').required(),
        hooktravelingmaterial: Joi.string().allow('').required(),
        hooktraversingmaterial: Joi.string().allow('').required(),
        wireRopeOrChainmediumType: Joi.string().allow('').required(),
        mediumTypehoistingtype: Joi.string().allow('').required(),
        mediumTypetravelingtype: Joi.string().allow('').required(),
        mediumTypetraversingtype: Joi.string().allow('').required(),
        mediumTypehoistingconstruction: Joi.string().allow('').required(),
        mediumTypetravelingconstruction: Joi.string().allow('').required(),
        mediumTypetraversingconstruction: Joi.string().allow('').required(),
        mediumTypehoistingdiameter: Joi.string().allow('').required(),
        mediumTypetravelingdiameter: Joi.string().allow('').required(),
        mediumTypetraversingdiameter: Joi.string().allow('').required(),
        mediumTypehoistinglength: Joi.string().allow('').required(),
        mediumTypetravelinglength: Joi.string().allow('').required(),
        mediumTypetraversinglength: Joi.string().allow('').required()
    }).required(),

    visualInspection: Joi.object({
        foundationAndStructure: Joi.object({
            anchorBolts: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
            columnFrame: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '', transverseReinforcement: '', diagonalReinforcement: '' }),
            ladder: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
            workingFloor: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
        }).required(),
        mechanismAndRail: Joi.object({
            railSupportBeam: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
            travelingRail: sectionSchema({ corrosion: '', cracks: '', railConnection: '', railAlignment: '', interRailAlignment: '', interRailFlatness: '', railConnectionGap: '', railFastener: '', railStopper: '' }),
            traversingRail: sectionSchema({ corrosion: '', cracks: '', railConnection: '', railAlignment: '', interRailAlignment: '', interRailFlatness: '', railConnectionGap: '', railFastener: '', railStopper: '' }),
        }).required(),
        girderAndTrolley: Joi.object({
            girder: sectionSchema({ corrosion: '', cracks: '', camber: '', connection: '', endGirderConnection: '', truckMountingOnGirder: '' }),
            travelingGearbox: sectionSchema({ corrosion: '', cracks: '', lubricatingOil: '', oilSeal: '' }),
            driveWheels: sectionSchema({ wear: '', cracks: '', deformation: '', flangeCondition: '', chainCondition: '' }),
            idleWheels: sectionSchema({ safety: '', cracks: '', deformation: '', flangeCondition: '' }),
            wheelConnector: sectionSchema({ alignment: '', crossJoint: '', lubrication: '' }),
            girderStopper: sectionSchema({ condition: '', reinforcement: '' }),
        }).required(),
        trolleyMechanism: Joi.object({
            trolleyTraversingGearbox: sectionSchema({ fastening: '', corrosion: '', cracks: '', lubricatingOil: '', oilSeal: '' }),
            trolleyDriveWheels: sectionSchema({ wear: '', cracks: '', deformation: '', flangeCondition: '', chainCondition: '' }),
            trolleyIdleWheels: sectionSchema({ wear: '', cracks: '', deformation: '', flangeCondition: '' }),
            trolleyWheelConnector: sectionSchema({ alignment: '', crossJoint: '', lubrication: '' }),
            trolleyGirderStopper: sectionSchema({ condition: '', reinforcement: '' }),
        }).required(),
        liftingEquipment: Joi.object({
            windingDrum: sectionSchema({ groove: '', grooveLip: '', flanges: '' }),
            visualBrakeInspection: sectionSchema({ wear: '', adjustment: '' }),
            hoistGearbox: sectionSchema({ lubrication: '', oilSeal: '' }),
            pulleySprocket: sectionSchema({ pulleyGroove: '', pulleyLip: '', pulleyPin: '', bearing: '', pulleyGuard: '', ropeChainGuard: '' }),
            mainHook: sectionSchema({ wear: '', hookOpeningGap: '', swivelNutAndBearing: '', trunnion: '' }),
            auxiliaryHook: sectionSchema({ wear: '', hookOpeningGap: '', swivelNutAndBearing: '', trunnion: '' }),
            mainWireRope: sectionSchema({ corrosion: '', wear: '', breakage: '', deformation: '' }),
            auxiliaryWireRope: sectionSchema({ corrosion: '', wear: '', breakage: '', deformation: '' }),
            mainChain: sectionSchema({ corrosion: '', wear: '', crackOrBreakage: '', deformation: '' }),
            auxiliaryChain: sectionSchema({ corrosion: '', wear: '', crackOrBreakage: '', deformation: '' }),
        }).required(),
        controlAndSafetySystem: Joi.object({
            limitSwitch: sectionSchema({ longTravel: '', crossTravel: '', hoist: '' }),
            operatorCabin: sectionSchema({ safetyLadder: '', door: '', window: '', fanOrAC: '', controlLeversOrButtons: '', pendantControl: '', lighting: '', horn: '', fuseProtection: '', communicationDevice: '', fireExtinguisher: '', operationalSigns: '', ignitionOrMasterSwitch: '' }),
            electricalComponents: sectionSchema({ panelConductorConnector: '', conductorProtection: '', motorInstallationSafetySystem: '', groundingSystem: '', installation: '' }),
        }).required(),
    }).required(),

    ndt: Joi.object({
        wireropeMethod: Joi.string().allow('').required(),
        wireropeNumber: Joi.array().items(wireropeItemSchema).required(), // Perubahan nama kunci array
        HookspecA: Joi.string().allow('').required(),
        HookspecB: Joi.string().allow('').required(),
        HookspecC: Joi.string().allow('').required(),
        HookspecD: Joi.string().allow('').required(),
        HookspecE: Joi.string().allow('').required(),
        HookspecF: Joi.string().allow('').required(),
        HookspecG: Joi.string().allow('').required(),
        HookspecH: Joi.string().allow('').required(),
        HookspecBaik: Joi.boolean().allow(true, false).required(),
        HookspecTidakBaik: Joi.boolean().allow(true, false).required(),
        HookspecDesc: Joi.string().allow('').required(),
        measurementResultsA: Joi.string().allow('').required(),
        measurementResultsB: Joi.string().allow('').required(),
        measurementResultsC: Joi.string().allow('').required(),
        measurementResultsD: Joi.string().allow('').required(),
        measurementResultsE: Joi.string().allow('').required(),
        measurementResultsF: Joi.string().allow('').required(),
        measurementResultsG: Joi.string().allow('').required(),
        measurementResultsH: Joi.string().allow('').required(),
        measurementResultsBaik: Joi.boolean().allow(true, false).required(),
        measurementResultsTidakBaik: Joi.boolean().allow(true, false).required(),
        measurementResultsDesc: Joi.string().allow('').required(),
        toleranceA: Joi.string().allow('').required(),
        toleranceB: Joi.string().allow('').required(),
        toleranceC: Joi.string().allow('').required(),
        toleranceD: Joi.string().allow('').required(),
        toleranceE: Joi.string().allow('').required(),
        toleranceF: Joi.string().allow('').required(),
        toleranceG: Joi.string().allow('').required(),
        toleranceH: Joi.string().allow('').required(),
        toleranceBaik: Joi.boolean().allow(true, false).required(),
        toleranceTidakBaik: Joi.boolean().allow(true, false).required(),
        toleranceDesc: Joi.string().allow('').required(),
        griderMethod: Joi.string().allow('').required(),
        griderNumber: Joi.array().items(girderItemSchema).required()
    }).required(),

    dynamicTesting: Joi.object({
        travellingStatus: Joi.string().allow('').required(),
        travellingDesc: Joi.string().allow('').required(),
        traversingStatus: Joi.string().allow('').required(),
        traversingDesc: Joi.string().allow('').required(),
        hoistingStatus: Joi.string().allow('').required(),
        hoistingDesc: Joi.string().allow('').required(),
        safetyDeviceStatus: Joi.string().allow('').required(),
        safetyDeviceDesc: Joi.string().allow('').required(),
        brakeSwitchStatus: Joi.string().allow('').required(),
        brakeSwitchDesc: Joi.string().allow('').required(),
        brakeLockingStatus: Joi.string().allow('').required(),
        brakeLockingDesc: Joi.string().allow('').required(),
        instalasionElectricStatus: Joi.string().allow('').required(),
        instalasionElectricDesc: Joi.string().allow('').required(),
        hoist25: Joi.string().allow('').required(),
        travesing25: Joi.string().allow('').required(),
        travelling25: Joi.string().allow('').required(),
        brakeSystem25: Joi.string().allow('').required(),
        desc25: Joi.string().allow('').required(),
        hoist50: Joi.string().allow('').required(),
        travesing50: Joi.string().allow('').required(),
        travelling50: Joi.string().allow('').required(),
        brakeSystem50: Joi.string().allow('').required(),
        desc50: Joi.string().allow('').required(),
        hoist75: Joi.string().allow('').required(),
        travesing75: Joi.string().allow('').required(),
        travelling75: Joi.string().allow('').required(),
        brakeSystem75: Joi.string().allow('').required(),
        desc75: Joi.string().allow('').required(),
        hoist100: Joi.string().allow('').required(),
        travesing100: Joi.string().allow('').required(),
        travelling100: Joi.string().allow('').required(),
        brakeSystem100: Joi.string().allow('').required(),
        desc100: Joi.string().allow('').required()
    }).required(),

    staticTesting: Joi.object({
        loadTest: Joi.string().allow('').required(),
        basedDesign: Joi.string().allow('').required(),
        lengthSpan: Joi.string().allow('').required(),
        xspan: Joi.string().allow('').required(),
        resultDefleksi: Joi.boolean().allow(true, false).required(),
        defleksiPosision: Joi.array().items(defleksiItemSchema).required() 
    }).required(),

    conclusion: Joi.string().allow('').required(),
    recomendation: Joi.string().allow('').required()

});

module.exports = {
    laporanGantryCranePayload,
};