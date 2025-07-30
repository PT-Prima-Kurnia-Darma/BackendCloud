'use strict';

const Joi = require('joi');

const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(true, false),
    result: Joi.string().allow('').required()
});

const laporanPubtPayload = Joi.object({
    examinationType: Joi.string().allow('').required(),
    inspectionType: Joi.string().allow('').required(),
    createdAt: Joi.string().required(),
    extraId: Joi.number().required(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').required(),
        companyLocation: Joi.string().allow('').required(),
        userUsage: Joi.string().allow('').required(),
        userAddress: Joi.string().allow('').required(),
        operatorName: Joi.string().allow('').required(),
        equipmentType: Joi.string().allow('').required(),
        manufacturer: Joi.string().allow('').required(),
        brandType: Joi.string().allow('').required(),
        countryAndYearOfManufacture: Joi.string().allow('').required(),
        serialNumberUnitNumber: Joi.string().allow('').required(),
        designPressure: Joi.string().allow('').required(),
        maxAllowableWorkingPressure: Joi.string().allow('').required(),
        capacityWorkingLoad: Joi.string().allow('').required(),
        steamTemperature: Joi.string().allow('').required(),
        operatingPressure: Joi.string().allow('').required(),
        fuelType: Joi.string().allow('').required(),
        intendedUse: Joi.string().allow('').required(),
        permitNumber: Joi.string().allow('').required(),
        operatorCertificate: Joi.string().allow('').required(),
        equipmentHistory: Joi.string().allow('').required(),
        inspectionDate: Joi.string().allow('').required()
    }).required(),

    technicalData: Joi.object({
        shell: Joi.object({
            numberOfRounds: Joi.string().allow('').required(),
            connectionMethod: Joi.string().allow('').required(),
            material: Joi.string().allow('').required(),
            pipeDiameter: Joi.string().allow('').required(),
            thickness: Joi.string().allow('').required(),
            bodyLength: Joi.string().allow('').required(),
            heads: Joi.object({
                top: Joi.object({
                    diameter: Joi.string().allow('').required(),
                    thickness: Joi.string().allow('').required()
                }).required(),
                rear: Joi.object({
                    diameter: Joi.string().allow('').required(),
                    thickness: Joi.string().allow('').required()
                }).required()
            }).required(),
            tubePlate: Joi.object({
                front: Joi.object({
                    dim1: Joi.string().allow('').required(),
                    dim2: Joi.string().allow('').required()
                }).required(),
                rear: Joi.object({
                    dim1: Joi.string().allow('').required(),
                    dim2: Joi.string().allow('').required()
                }).required()
            }).required()
        }).required(),
        furnace: Joi.object({
            type: Joi.string().allow('').required(),
            material: Joi.string().allow('').required(),
            outerDiameter: Joi.string().allow('').required(),
            innerDiameter: Joi.string().allow('').required(),
            thickness: Joi.string().allow('').required()
        }).required(),
        waterTubes: Joi.object({
            firstPass: Joi.object({
                diameter: Joi.string().allow('').required(),
                thickness: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                quantity: Joi.string().allow('').required()
            }).required(),
            secondPass: Joi.object({
                diameter: Joi.string().allow('').required(),
                thickness: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                quantity: Joi.string().allow('').required()
            }).required(),
            stayTube: Joi.object({
                diameter: Joi.string().allow('').required(),
                thickness: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                quantity: Joi.string().allow('').required()
            }).required(),
            material: Joi.object({
                diameter: Joi.string().allow('').required(),
                thickness: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                quantity: Joi.string().allow('').required()
            }).required()
        }).required(),
        tubePlateSplicing: Joi.string().allow('').required()
    }).required(),

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
            }).required(),
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
            }).required(),
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
            }).required()
        }).required(),
        materialThickness: Joi.object({
            bodyShell: Joi.object({
                thickness: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                thicknessResult: Joi.string().allow('').required(),
                diameterResult: Joi.string().allow('').required()
            }).required(),
            vaporReceiverHeader: Joi.object({
                thickness: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                thicknessResult: Joi.string().allow('').required(),
                diameterResult: Joi.string().allow('').required(),
                lengthResult: Joi.string().allow('').required()
            }).required(),
            fireHallFurnance1: Joi.object({
                thickness: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                thicknessResult: Joi.string().allow('').required(),
                diameterResult: Joi.string().allow('').required(),
                lengthResult: Joi.string().allow('').required()
            }).required(),
             fireHallFurnance2: Joi.object({
                thickness: Joi.string().allow('').required(),
                diameter: Joi.string().allow('').required(),
                length: Joi.string().allow('').required(),
                thicknessResult: Joi.string().allow('').required(),
                diameterResult: Joi.string().allow('').required(),
                lengthResult: Joi.string().allow('').required()
            }).required()
        }).required(),
        thicknessMeasurementSetup: Joi.object({
            owner: Joi.string().allow('').required(),
            inspectionDate: Joi.string().allow('').required(),
            project: Joi.string().allow('').required(),
            objectType: Joi.string().allow('').required(),
            workOrderNo: Joi.string().allow('').required(),
            equipmentUsed: Joi.string().allow('').required(),
            methodUsed: Joi.string().allow('').required(),
            probeType: Joi.string().allow('').required(),
            materialType: Joi.string().allow('').required(),
            probeStyle: Joi.string().allow('').required(),
            operatingTemp: Joi.string().allow('').required(),
            surfaceCondition: Joi.string().allow('').required(),
            weldingProcess: Joi.string().allow('').required(),
            laminatingCheck: Joi.string().allow('').required(),
            couplantUsed: Joi.string().allow('').required()
        }).required(),
        measurementResults: Joi.object({
            topHead: Joi.object({
                nominal: Joi.string().allow('').required(),
                point1: Joi.string().allow('').required(),
                point2: Joi.string().allow('').required(),
                point3: Joi.string().allow('').required(),
                minimum: Joi.string().allow('').required(),
                maximum: Joi.string().allow('').required()
            }).required(),
            shell: Joi.object({
                nominal: Joi.string().allow('').required(),
                point1: Joi.string().allow('').required(),
                point2: Joi.string().allow('').required(),
                point3: Joi.string().allow('').required(),
                minimum: Joi.string().allow('').required(),
                maximum: Joi.string().allow('').required()
            }).required(),
            buttonHead: Joi.object({
                nominal: Joi.string().allow('').required(),
                point1: Joi.string().allow('').required(),
                point2: Joi.string().allow('').required(),
                point3: Joi.string().allow('').required(),
                minimum: Joi.string().allow('').required(),
                maximum: Joi.string().allow('').required()
            }).required()
        }).required(),
        ndt: Joi.object({
            shell: Joi.object({
                testMethod: Joi.string().allow('').required(),
                longitudinalWeldJoint: Joi.object({
                    location: Joi.string().allow('').required(),
                    status: Joi.boolean().allow(true, false).required(),
                    result: Joi.string().allow('').required()
                }).required(),
                circumferentialWeldJoint: Joi.object({
                    location: Joi.string().allow('').required(),
                    status: Joi.boolean().allow(true, false).required(),
                    result: Joi.string().allow('').required()
                }).required()
            }).required(),
            furnace: Joi.object({
                testMethod: Joi.string().allow('').required(),
                longitudinalWeldJoint: Joi.object({
                    location: Joi.string().allow('').required(),
                    status: Joi.boolean().allow(true, false).required(),
                    result: Joi.string().allow('').required()
                }).required(),
                circumferentialWeldJoint: Joi.object({
                    location: Joi.string().allow('').required(),
                    status: Joi.boolean().allow(true, false).required(),
                    result: Joi.string().allow('').required()
                }).required()
            }).required(),
            fireTubes: Joi.object({
                testMethod: Joi.string().allow('').required(),
                weldJointFront: Joi.object({
                    location: Joi.string().allow('').required(),
                    status: Joi.boolean().allow(true, false).required(),
                    result: Joi.string().allow('').required()
                }).required(),
                weldJointRear: Joi.object({
                    location: Joi.string().allow('').required(),
                    status: Joi.boolean().allow(true, false).required(),
                    result: Joi.string().allow('').required()
                }).required()
            }).required()
        }).required(),
        hydrotest: Joi.object({
            testPressure: Joi.string().allow('').required(),
            mawp: Joi.string().allow('').required(),
            testMedium: Joi.string().allow('').required(),
            testDate: Joi.string().allow('').required(),
            testResult: Joi.string().allow('').required()
        }).required(),
        appendagesCheck: Joi.object({
            workingPressureGauge: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            manHole: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            safetyValveFullOpen: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            mainSteamValve: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            levelGlassIndicator: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            blowdownValve: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            feedwaterStopValve: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            feedwaterInletValve: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            steamDrier: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            waterPump: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            controlPanel: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required(),
            nameplate: Joi.object({
                quantity: Joi.string().allow('').required(),
                status: Joi.boolean().allow(true, false).required(),
                result: Joi.string().allow('').required()
            }).required()
        }).required(),
        safetyValveTest: Joi.object({
            header: Joi.string().allow('').required(),
            startsToOpen: Joi.string().allow('').required(),
            valveInfo: Joi.string().allow('').required()
        }).required()
    }).required(),
    conclusion: Joi.string().allow('').required(),
    recommendations: Joi.string().allow('').required()
});

module.exports = {
    laporanPubtPayload
};