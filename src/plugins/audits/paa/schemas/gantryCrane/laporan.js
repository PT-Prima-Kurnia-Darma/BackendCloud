'use strict';

const Joi = require('joi');

// Skema dasar untuk item pemeriksaan visual (status dan hasil)
// Catatan: inspectionItemSchema tidak digunakan langsung di laporanGantryCranePayload
// namun mendefinisikan struktur objek yang mungkin.
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null).optional(),
    result: Joi.string().allow('', null).optional()
}).optional();

// Reusable schema generator for a section of inspection items
const sectionSchema = (items) => Joi.object(
    Object.keys(items).reduce((acc, key) => {
        acc[key] = inspectionItemSchema;
        return acc;
    }, {})
).optional();

// Skema untuk setiap baris pada tabel Wirerope (dinamis)
const wireropeItemSchema = Joi.object({
    wireropeNumber: Joi.string().allow('').optional(),
    wireropeUsed: Joi.string().allow('').optional(),
    dimensionSpec: Joi.string().allow('').optional(),
    dimensionResult: Joi.string().allow('').optional(),
    construction: Joi.string().allow('').optional(),
    type: Joi.string().allow('').optional(),
    length: Joi.string().allow('').optional(),
    age: Joi.string().allow('').optional(),
    defectAda: Joi.boolean().optional(),
    defectTidakAda: Joi.boolean().optional(),
    description: Joi.string().allow('').optional()
}).optional();

// Skema untuk setiap baris pada tabel Girder (dinamis)
const girderItemSchema = Joi.object({
    griderNumber: Joi.string().allow('').optional(),
    griderLocation: Joi.string().allow('').optional(),
    griderAda: Joi.boolean().optional(),
    griderTidakAda: Joi.boolean().optional(),
    griderDesc: Joi.string().allow('').optional()
}).optional();

// Skema untuk setiap baris pada tabel Defleksi (dinamis)
const defleksiItemSchema = Joi.object({
    defleksiPosision: Joi.string().allow('').optional(),
    defleksiMeasuraments: Joi.string().allow('').optional(),
    defleksiStandard: Joi.string().allow('').optional(),
    defleksiDesc: Joi.string().allow('').optional()
}).optional();

const laporanGantryCranePayload = Joi.object({
    examinationType: Joi.string().required(),
    inspectionType: Joi.string().required(),
    createdAt: Joi.date().iso().optional(), // Menggunakan .iso() untuk format ISO 8601
    extraId: Joi.number().allow('', null).optional(),
    equipmentType: Joi.string().required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        usageLocation: Joi.string().allow('').optional(),
        location: Joi.string().allow('').optional(),
        manufacturerHoist: Joi.string().allow('').optional(),
        manufacturerStructure: Joi.string().allow('').optional(),
        brandOrType: Joi.string().allow('').optional(),
        manufactureYear: Joi.string().allow('').optional(),
        serialNumber: Joi.string().allow('').optional(),
        maxLiftingCapacityKg: Joi.string().allow('').optional(),
        usagePermitNumber: Joi.string().allow('').optional(),
        operatorcertificateStatus: Joi.string().allow('').optional(),
        technicalDataManualStatus: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().required()
    }).required(),

    technicalData: Joi.object({
        liftHeight: Joi.string().allow('').optional(),
        girderLength: Joi.string().allow('').optional(),
        hoistingSpeed: Joi.string().allow('').optional(),
        travelingSpeed: Joi.string().allow('').optional(),
        traversingSpeed: Joi.string().allow('').optional(),
        driveMotorcapacity: Joi.string().allow('').optional(),
        hoistingpowerKw: Joi.string().allow('').optional(),
        travelingpowerKw: Joi.string().allow('').optional(),
        traversingpowerKw: Joi.string().allow('').optional(),
        hoistingtype: Joi.string().allow('').optional(),
        travelingtype: Joi.string().allow('').optional(),
        traversingtype: Joi.string().allow('').optional(),
        hoistingrpm: Joi.string().allow('').optional(),
        travelingrpm: Joi.string().allow('').optional(),
        traversingrpm: Joi.string().allow('').optional(),
        hoistingvoltageV: Joi.string().allow('').optional(),
        travelingvoltageV: Joi.string().allow('').optional(),
        traversingvoltageV: Joi.string().allow('').optional(),
        hoistingcurrentA: Joi.string().allow('').optional(),
        travelingcurrentA: Joi.string().allow('').optional(),
        traversingcurrentA: Joi.string().allow('').optional(),
        hoistingfrequencyHz: Joi.string().allow('').optional(),
        travelingfrequencyHz: Joi.string().allow('').optional(),
        traversingfrequencyHz: Joi.string().allow('').optional(),
        hoistingphase: Joi.string().allow('').optional(),
        travelingphase: Joi.string().allow('').optional(),
        traversingphase: Joi.string().allow('').optional(),
        hoistingpowerSupply: Joi.string().allow('').optional(),
        travelingpowerSupply: Joi.string().allow('').optional(),
        traversingpowerSupply: Joi.string().allow('').optional(),
        braketype: Joi.string().allow('').optional(),
        brakemodel: Joi.string().allow('').optional(),
        controlBrakehoistingtype: Joi.string().allow('').optional(),
        controlBraketravelingtype: Joi.string().allow('').optional(),
        controlBraketraversingtype: Joi.string().allow('').optional(),
        controlBrakehoistingmodel: Joi.string().allow('').optional(),
        controlBraketravelingmodel: Joi.string().allow('').optional(),
        controlBraketraversingmodel: Joi.string().allow('').optional(),
        hookhoistingtype: Joi.string().allow('').optional(),
        hooktravelingtype: Joi.string().allow('').optional(),
        hooktraversingtype: Joi.string().allow('').optional(),
        hookhoistingcapacity: Joi.string().allow('').optional(),
        hooktravelingcapacity: Joi.string().allow('').optional(),
        hooktraversingcapacity: Joi.string().allow('').optional(),
        hookhoistingmaterial: Joi.string().allow('').optional(),
        hooktravelingmaterial: Joi.string().allow('').optional(),
        hooktraversingmaterial: Joi.string().allow('').optional(),
        wireRopeOrChainmediumType: Joi.string().allow('').optional(),
        mediumTypehoistingtype: Joi.string().allow('').optional(),
        mediumTypetravelingtype: Joi.string().allow('').optional(),
        mediumTypetraversingtype: Joi.string().allow('').optional(),
        mediumTypehoistingconstruction: Joi.string().allow('').optional(),
        mediumTypetravelingconstruction: Joi.string().allow('').optional(),
        mediumTypetraversingconstruction: Joi.string().allow('').optional(),
        mediumTypehoistingdiameter: Joi.string().allow('').optional(),
        mediumTypetravelingdiameter: Joi.string().allow('').optional(),
        mediumTypetraversingdiameter: Joi.string().allow('').optional(),
        mediumTypehoistinglength: Joi.string().allow('').optional(),
        mediumTypetravelinglength: Joi.string().allow('').optional(),
        mediumTypetraversinglength: Joi.string().allow('').optional()
    }).optional(),

    visualInspection: Joi.object({
        foundationAndStructure: Joi.object({
            anchorBolts: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
            columnFrame: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '', transverseReinforcement: '', diagonalReinforcement: '' }),
            ladder: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
            workingFloor: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
        }).optional(),
        mechanismAndRail: Joi.object({
            railSupportBeam: sectionSchema({ corrosion: '', cracks: '', deformation: '', fastening: '' }),
            travelingRail: sectionSchema({ corrosion: '', cracks: '', railConnection: '', railAlignment: '', interRailAlignment: '', interRailFlatness: '', railConnectionGap: '', railFastener: '', railStopper: '' }),
            traversingRail: sectionSchema({ corrosion: '', cracks: '', railConnection: '', railAlignment: '', interRailAlignment: '', interRailFlatness: '', railConnectionGap: '', railFastener: '', railStopper: '' }),
        }).optional(),
        girderAndTrolley: Joi.object({
            girder: sectionSchema({ corrosion: '', cracks: '', camber: '', connection: '', endGirderConnection: '', truckMountingOnGirder: '' }),
            travelingGearbox: sectionSchema({ corrosion: '', cracks: '', lubricatingOil: '', oilSeal: '' }),
            driveWheels: sectionSchema({ wear: '', cracks: '', deformation: '', flangeCondition: '', chainCondition: '' }),
            idleWheels: sectionSchema({ safety: '', cracks: '', deformation: '', flangeCondition: '' }),
            wheelConnector: sectionSchema({ alignment: '', crossJoint: '', lubrication: '' }),
            girderStopper: sectionSchema({ condition: '', reinforcement: '' }),
        }).optional(),
        trolleyMechanism: Joi.object({
            trolleyTraversingGearbox: sectionSchema({ fastening: '', corrosion: '', cracks: '', lubricatingOil: '', oilSeal: '' }),
            trolleyDriveWheels: sectionSchema({ wear: '', cracks: '', deformation: '', flangeCondition: '', chainCondition: '' }),
            trolleyIdleWheels: sectionSchema({ wear: '', cracks: '', deformation: '', flangeCondition: '' }),
            trolleyWheelConnector: sectionSchema({ alignment: '', crossJoint: '', lubrication: '' }),
            trolleyGirderStopper: sectionSchema({ condition: '', reinforcement: '' }),
        }).optional(),
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
        }).optional(),
        controlAndSafetySystem: Joi.object({
            limitSwitch: sectionSchema({ longTravel: '', crossTravel: '', hoist: '' }),
            operatorCabin: sectionSchema({ safetyLadder: '', door: '', window: '', fanOrAC: '', controlLeversOrButtons: '', pendantControl: '', lighting: '', horn: '', fuseProtection: '', communicationDevice: '', fireExtinguisher: '', operationalSigns: '', ignitionOrMasterSwitch: '' }),
            electricalComponents: sectionSchema({ panelConductorConnector: '', conductorProtection: '', motorInstallationSafetySystem: '', groundingSystem: '', installation: '' }),
        }).optional(),
    }).optional(),

    ndt: Joi.object({
        wireropeMethod: Joi.string().allow('').optional(),
        wireropeNumber: Joi.array().items(wireropeItemSchema).optional(), // Perubahan nama kunci array
        HookspecA: Joi.string().allow('').optional(),
        HookspecB: Joi.string().allow('').optional(),
        HookspecC: Joi.string().allow('').optional(),
        HookspecD: Joi.string().allow('').optional(),
        HookspecE: Joi.string().allow('').optional(),
        HookspecF: Joi.string().allow('').optional(),
        HookspecG: Joi.string().allow('').optional(),
        HookspecH: Joi.string().allow('').optional(),
        HookspecBaik: Joi.boolean().optional(),
        HookspecTidakBaik: Joi.boolean().optional(),
        HookspecDesc: Joi.string().allow('').optional(),
        measurementResultsA: Joi.string().allow('').optional(),
        measurementResultsB: Joi.string().allow('').optional(),
        measurementResultsC: Joi.string().allow('').optional(),
        measurementResultsD: Joi.string().allow('').optional(),
        measurementResultsE: Joi.string().allow('').optional(),
        measurementResultsF: Joi.string().allow('').optional(),
        measurementResultsG: Joi.string().allow('').optional(),
        measurementResultsH: Joi.string().allow('').optional(),
        measurementResultsBaik: Joi.boolean().optional(),
        measurementResultsTidakBaik: Joi.boolean().optional(),
        measurementResultsDesc: Joi.string().allow('').optional(),
        toleranceA: Joi.string().allow('').optional(),
        toleranceB: Joi.string().allow('').optional(),
        toleranceC: Joi.string().allow('').optional(),
        toleranceD: Joi.string().allow('').optional(),
        toleranceE: Joi.string().allow('').optional(),
        toleranceF: Joi.string().allow('').optional(),
        toleranceG: Joi.string().allow('').optional(),
        toleranceH: Joi.string().allow('').optional(),
        toleranceBaik: Joi.boolean().optional(),
        toleranceTidakBaik: Joi.boolean().optional(),
        toleranceDesc: Joi.string().allow('').optional(),
        griderMethod: Joi.string().allow('').optional(),
        griderNumber: Joi.array().items(girderItemSchema).optional() // Perubahan nama kunci array
    }).optional(),

    dynamicTesting: Joi.object({
        travellingStatus: Joi.string().allow('').optional(),
        travellingDesc: Joi.string().allow('').optional(),
        traversingStatus: Joi.string().allow('').optional(),
        traversingDesc: Joi.string().allow('').optional(),
        hoistingStatus: Joi.string().allow('').optional(),
        hoistingDesc: Joi.string().allow('').optional(),
        safetyDeviceStatus: Joi.string().allow('').optional(),
        safetyDeviceDesc: Joi.string().allow('').optional(),
        brakeSwitchStatus: Joi.string().allow('').optional(),
        brakeSwitchDesc: Joi.string().allow('').optional(),
        brakeLockingStatus: Joi.string().allow('').optional(),
        brakeLockingDesc: Joi.string().allow('').optional(),
        instalasionElectricStatus: Joi.string().allow('').optional(),
        instalasionElectricDesc: Joi.string().allow('').optional(),
        hoist25: Joi.string().allow('').optional(),
        travesing25: Joi.string().allow('').optional(),
        travelling25: Joi.string().allow('').optional(),
        brakeSystem25: Joi.string().allow('').optional(),
        desc25: Joi.string().allow('').optional(),
        hoist50: Joi.string().allow('').optional(),
        travesing50: Joi.string().allow('').optional(),
        travelling50: Joi.string().allow('').optional(),
        brakeSystem50: Joi.string().allow('').optional(),
        desc50: Joi.string().allow('').optional(),
        hoist75: Joi.string().allow('').optional(),
        travesing75: Joi.string().allow('').optional(),
        travelling75: Joi.string().allow('').optional(),
        brakeSystem75: Joi.string().allow('').optional(),
        desc75: Joi.string().allow('').optional(),
        hoist100: Joi.string().allow('').optional(),
        travesing100: Joi.string().allow('').optional(),
        travelling100: Joi.string().allow('').optional(),
        brakeSystem100: Joi.string().allow('').optional(),
        desc100: Joi.string().allow('').optional()
    }).optional(),

    staticTesting: Joi.object({
        loadTest: Joi.string().allow('').optional(),
        basedDesign: Joi.string().allow('').optional(),
        lengthSpan: Joi.string().allow('').optional(),
        xspan: Joi.string().allow('').optional(),
        resultDefleksi: Joi.boolean().optional(),
        defleksiPosision: Joi.array().items(defleksiItemSchema).optional() // Perubahan nama kunci array
    }).optional(),

    conclusion: Joi.string().allow('').optional(),
    recomendation: Joi.string().allow('').optional()

}).min(1).unknown(false);

module.exports = {
    laporanGantryCranePayload,
};