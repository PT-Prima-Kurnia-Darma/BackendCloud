'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null),
    result: Joi.string().allow('', null).optional()
});

const laporanPubtPayload = Joi.object({
    examinationType: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),
    createdAt: Joi.string().allow('').optional(),
    extraId: Joi.string().allow('').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        userUsage: Joi.string().allow('').optional(),
        userAddress: Joi.string().allow('').optional(),
        operatorName: Joi.string().allow('').optional(),
        equipmentType: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        brandType: Joi.string().allow('').optional(),
        countryAndYearOfManufacture: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        designPressure: Joi.number().allow(null).optional(),
        maxAllowableWorkingPressure: Joi.number().allow(null).optional(),
        capacityWorkingLoad: Joi.number().allow(null).optional(),
        steamTemperature: Joi.string().allow('').optional(),
        operatingPressure: Joi.number().allow(null).optional(),
        fuelType: Joi.string().allow('').optional(),
        intendedUse: Joi.string().allow('').optional(),
        permitNumber: Joi.string().allow('').optional(),
        operatorCertificate: Joi.string().allow('').optional(),
        equipmentHistory: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        shell: Joi.object({
            numberOfRounds: Joi.any().allow(null).optional(),
            connectionMethod: Joi.string().allow('').optional(),
            material: Joi.string().allow('').optional(),
            pipeDiameter: Joi.any().allow(null).optional(),
            thickness: Joi.number().allow(null).optional(),
            bodyLength: Joi.number().allow(null).optional(),
            heads: Joi.object({
                top: Joi.object({
                    diameter: Joi.number().allow(null).optional(),
                    thickness: Joi.number().allow(null).optional()
                }).optional(),
                rear: Joi.object({
                    diameter: Joi.number().allow(null).optional(),
                    thickness: Joi.number().allow(null).optional()
                }).optional()
            }).optional(),
            tubePlate: Joi.object({
                front: Joi.object({
                    dim1: Joi.string().allow('').optional(),
                    dim2: Joi.string().allow('').optional()
                }).optional(),
                rear: Joi.object({
                    dim1: Joi.string().allow('').optional(),
                    dim2: Joi.string().allow('').optional()
                }).optional()
            }).optional()
        }).optional(),
        furnace: Joi.object({
            type: Joi.string().allow('').optional(),
            material: Joi.string().allow('').optional(),
            outerDiameter: Joi.any().allow(null).optional(),
            innerDiameter: Joi.any().allow(null).optional(),
            thickness: Joi.any().allow(null).optional()
        }).optional(),
        waterTubes: Joi.object({
            firstPass: Joi.object({
                diameter: Joi.number().allow(null).optional(),
                thickness: Joi.number().allow(null).optional(),
                length: Joi.number().allow(null).optional(),
                quantity: Joi.number().allow(null).optional()
            }).optional(),
            secondPass: Joi.object({
                diameter: Joi.any().allow(null).optional(),
                thickness: Joi.any().allow(null).optional(),
                length: Joi.any().allow(null).optional(),
                quantity: Joi.any().allow(null).optional()
            }).optional(),
            stayTube: Joi.object({
                diameter: Joi.any().allow(null).optional(),
                thickness: Joi.any().allow(null).optional(),
                length: Joi.any().allow(null).optional(),
                quantity: Joi.any().allow(null).optional()
            }).optional(),
            material: Joi.object({
                diameter: Joi.any().allow(null).optional(),
                thickness: Joi.any().allow(null).optional(),
                length: Joi.any().allow(null).optional(),
                quantity: Joi.any().allow(null).optional()
            }).optional()
        }).optional(),
        tubePlateSplicing: Joi.string().allow('').optional()
    }).optional(),

    inspectionAndMeasurement: Joi.object({
        visualChecks: Joi.object({
            steamEquipment: Joi.object({
                shellDrum: inspectionItemSchema,
                bouileur: inspectionItemSchema,
                furnace: inspectionItemSchema,
                fireChamber: inspectionItemSchema,
                refractory: inspectionItemSchema,
                combustionChamber: inspectionItemSchema,
                fireTubes: inspectionItemSchema,
                superHeater: inspectionItemSchema,
                reheater: inspectionItemSchema,
                economizer: inspectionItemSchema
            }).optional(),
            boilerDetails: Joi.object({
                grate: inspectionItemSchema,
                burner: inspectionItemSchema,
                fdf: inspectionItemSchema,
                idf: inspectionItemSchema,
                airHeater: inspectionItemSchema,
                airDuct: inspectionItemSchema,
                gasDuct: inspectionItemSchema,
                ashCatcher: inspectionItemSchema,
                chimney: inspectionItemSchema,
                stairs: inspectionItemSchema,
                insulation: inspectionItemSchema
            }).optional(),
            safetyDevices: Joi.object({
                safetyValveRing: inspectionItemSchema,
                safetyValvePipe: inspectionItemSchema,
                safetyValveExhaust: inspectionItemSchema,
                pressureGaugeMark: inspectionItemSchema,
                pressureGaugeSiphon: inspectionItemSchema,
                pressureGaugeCock: inspectionItemSchema,
                gaugeGlassTryCocks: inspectionItemSchema,
                gaugeGlassBlowdown: inspectionItemSchema,
                waterLevelLowestMark: inspectionItemSchema,
                waterLevelPosition: inspectionItemSchema,
                feedwaterPump: inspectionItemSchema,
                feedwaterCapacity: inspectionItemSchema,
                feedwaterMotor: inspectionItemSchema,
                feedwaterCheckValve: inspectionItemSchema,
                controlBlacksFluit: inspectionItemSchema,
                controlFusiblePlug: inspectionItemSchema,
                controlWaterLevel: inspectionItemSchema,
                controlSteamPressure: inspectionItemSchema,
                blowdownDesc: inspectionItemSchema,
                blowdownMaterial: inspectionItemSchema,
                manholeManhole: inspectionItemSchema,
                manholeInspectionHole: inspectionItemSchema,
                idMarkNameplate: inspectionItemSchema,
                idMarkDataMatch: inspectionItemSchema,
                idMarkForm9Stamp: inspectionItemSchema
            }).optional()
        }).optional(),
        materialThickness: Joi.object({
            bodyShell: Joi.object({
                thickness: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                thicknessResult: Joi.string().allow('').optional(),
                diameterResult: Joi.string().allow('').optional()
            }).optional(),
            vaporReceiverHeader: Joi.object({
                thickness: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                length: Joi.string().allow('').optional(),
                thicknessResult: Joi.string().allow('').optional(),
                diameterResult: Joi.string().allow('').optional(),
                lengthResult: Joi.string().allow('').optional()
            }).optional(),
            fireHallFurnance1: Joi.object({
                thickness: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                length: Joi.string().allow('').optional(),
                thicknessResult: Joi.string().allow('').optional(),
                diameterResult: Joi.string().allow('').optional(),
                lengthResult: Joi.string().allow('').optional()
            }).optional(),
             fireHallFurnance2: Joi.object({
                thickness: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                length: Joi.string().allow('').optional(),
                thicknessResult: Joi.string().allow('').optional(),
                diameterResult: Joi.string().allow('').optional(),
                lengthResult: Joi.string().allow('').optional()
            }).optional()
        }).optional(),
        thicknessMeasurementSetup: Joi.object({
            owner: Joi.string().allow('').optional(),
            inspectionDate: Joi.string().allow('').optional(),
            project: Joi.string().allow('').optional(),
            objectType: Joi.string().allow('').optional(),
            workOrderNo: Joi.string().allow('').optional(),
            equipmentUsed: Joi.string().allow('').optional(),
            methodUsed: Joi.string().allow('').optional(),
            probeType: Joi.string().allow('').optional(),
            materialType: Joi.string().allow('').optional(),
            probeStyle: Joi.string().allow('').optional(),
            operatingTemp: Joi.string().allow('').optional(),
            surfaceCondition: Joi.string().allow('').optional(),
            weldingProcess: Joi.string().allow('').optional(),
            laminatingCheck: Joi.string().allow('').optional(),
            couplantUsed: Joi.string().allow('').optional()
        }).optional(),
        measurementResults: Joi.object({
            topHead: Joi.object({
                nominal: Joi.any().allow(null).optional(),
                point1: Joi.number().allow(null).optional(),
                point2: Joi.number().allow(null).optional(),
                point3: Joi.number().allow(null).optional(),
                minimum: Joi.number().allow(null).optional(),
                maximum: Joi.any().allow(null).optional()
            }).optional(),
            shell: Joi.object({
                nominal: Joi.any().allow(null).optional(),
                point1: Joi.number().allow(null).optional(),
                point2: Joi.number().allow(null).optional(),
                point3: Joi.number().allow(null).optional(),
                minimum: Joi.number().allow(null).optional(),
                maximum: Joi.any().allow(null).optional()
            }).optional(),
            buttonHead: Joi.object({
                nominal: Joi.any().allow(null).optional(),
                point1: Joi.number().allow(null).optional(),
                point2: Joi.number().allow(null).optional(),
                point3: Joi.number().allow(null).optional(),
                minimum: Joi.number().allow(null).optional(),
                maximum: Joi.any().allow(null).optional()
            }).optional()
        }).optional(),
        ndt: Joi.object({
            shell: Joi.object({
                testMethod: Joi.string().allow('').optional(),
                longitudinalWeldJoint: Joi.object({
                    location: Joi.string().allow('').optional(),
                    status: Joi.boolean().allow(null).optional(),
                    result: Joi.string().allow('').optional()
                }).optional(),
                circumferentialWeldJoint: Joi.object({
                    location: Joi.string().allow('').optional(),
                    status: Joi.boolean().allow(null).optional(),
                    result: Joi.string().allow('').optional()
                }).optional()
            }).optional(),
            furnace: Joi.object({
                testMethod: Joi.string().allow('').optional(),
                longitudinalWeldJoint: Joi.object({
                    location: Joi.string().allow('').optional(),
                    status: Joi.boolean().allow(null).optional(),
                    result: Joi.string().allow('').optional()
                }).optional(),
                circumferentialWeldJoint: Joi.object({
                    location: Joi.string().allow('').optional(),
                    status: Joi.boolean().allow(null).optional(),
                    result: Joi.string().allow('').optional()
                }).optional()
            }).optional(),
            fireTubes: Joi.object({
                testMethod: Joi.string().allow('').optional(),
                weldJointFront: Joi.object({
                    location: Joi.string().allow('').optional(),
                    status: Joi.boolean().allow(null).optional(),
                    result: Joi.string().allow('').optional()
                }).optional(),
                weldJointRear: Joi.object({
                    location: Joi.string().allow('').optional(),
                    status: Joi.boolean().allow(null).optional(),
                    result: Joi.string().allow('').optional()
                }).optional()
            }).optional()
        }).optional(),
        hydrotest: Joi.object({
            testPressure: Joi.number().allow(null).optional(),
            mawp: Joi.number().allow(null).optional(),
            testMedium: Joi.string().allow('').optional(),
            testDate: Joi.string().allow('').optional(),
            testResult: Joi.string().allow('').optional()
        }).optional(),
        appendagesCheck: Joi.object({
            workingPressureGauge: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            manHole: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            safetyValveFullOpen: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            mainSteamValve: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            levelGlassIndicator: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            blowdownValve: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            feedwaterStopValve: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            feedwaterInletValve: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            steamDrier: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            waterPump: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            controlPanel: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            nameplate: Joi.object({
                quantity: Joi.number().allow(null).optional(),
                status: Joi.boolean().allow(null).optional(),
                result: Joi.string().allow('').optional()
            }).optional()
        }).optional(),
        safetyValveTest: Joi.object({
            header: Joi.string().allow('').optional(),
            startsToOpen: Joi.number().allow(null).optional(),
            valveInfo: Joi.string().allow('').optional()
        }).optional()
    }).optional(),
    conclusion: Joi.string().allow('').optional(),
    recommendations: Joi.string().allow('').optional()
}).min(1).unknown(false);

module.exports = {
    laporanPubtPayload
};