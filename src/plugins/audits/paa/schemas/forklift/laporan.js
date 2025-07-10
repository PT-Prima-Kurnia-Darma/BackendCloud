'use strict';

const Joi = require('joi');

// Skema kecil untuk item pemeriksaan
const inspectionCheckSchema = Joi.object({
    status: Joi.boolean().allow(null, ''),
    result: Joi.string().allow('', null).optional()
}).unknown(true); // Allow other properties if needed

// Skema untuk baris data tabel
const chainInspectionItemSchema = Joi.object({
    inspectedPart: Joi.string().allow('').optional(),
    constructionType: Joi.string().allow('').optional(),
    standardPitch: Joi.string().allow('').optional(),
    measuredPitch: Joi.string().allow('').optional(),
    standardPin: Joi.string().allow('').optional(),
    measuredPin: Joi.string().allow('').optional(),
    inspectResult: Joi.string().allow('').optional()
}).unknown(true);

const nonDestructiveTestItemSchema = Joi.object({
    inspectedPart: Joi.string().allow('').optional(),
    location: Joi.string().allow('').optional(),
    defect: Joi.boolean().allow(null),
    result: Joi.string().allow('').optional()
}).unknown(true);

const loadTestItemSchema = Joi.object({
    liftingHeight: Joi.string().allow('').optional(),
    testLoad: Joi.string().allow('').optional(),
    speed: Joi.string().allow('').optional(),
    movement: Joi.string().allow('').optional(),
    remarks: Joi.string().allow('').optional(),
    result: Joi.string().allow('').optional()
}).unknown(true);

// Skema Utama untuk Laporan Forklift (STRUKTUR FINAL & EKSPLISIT)
const laporanForkliftPayload = Joi.object({
    examinationType: Joi.string().allow('').optional(),
    subInspectionType: Joi.string().allow('').optional(),
    
    generalData: Joi.object({
        ownerName: Joi.string().allow('').optional(), // Typo diperbaiki
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
        equipmentHistory: Joi.string().allow('').optional(),
        inspectionDate: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        specification: Joi.object({
            serialNumber: Joi.string().allow('').optional(),
            capacity: Joi.string().allow('').optional(),
            attachment: Joi.string().allow('').optional(),
            forkDimensions: Joi.string().allow('').optional()
        }).optional(),
        speed: Joi.object({
            lifting: Joi.string().allow('').optional(),
            lowering: Joi.string().allow('').optional(),
            travelling: Joi.string().allow('').optional()
        }).optional(),
        primeMover: Joi.object({
            brandType: Joi.string().allow('').optional(),
            serialNumber: Joi.string().allow('').optional(),
            yearOfManufacture: Joi.string().allow('').optional(),
            revolution: Joi.string().allow('').optional(),
            power: Joi.string().allow('').optional(),
            numberOfCylinders: Joi.string().allow('').optional()
        }).optional(),
        dimension: Joi.object({
            length: Joi.string().allow('').optional(),
            width: Joi.string().allow('').optional(),
            height: Joi.string().allow('').optional(),
            forkLiftingHeight: Joi.string().allow('').optional()
        }).optional(),
        tirePressure: Joi.object({
            driveWheel: Joi.string().allow('').optional(),
            steeringWheel: Joi.string().allow('').optional()
        }).optional(),
        driveWheel: Joi.object({
            size: Joi.string().allow('').optional(),
            type: Joi.string().allow('').optional()
        }).optional(),
        steeringWheel: Joi.object({
            size: Joi.string().allow('').optional(),
            type: Joi.string().allow('').optional()
        }).optional(),
        travellingBrake: Joi.object({
            size: Joi.string().allow('').optional(),
            type: Joi.string().allow('').optional()
        }).optional(),
        hydraulicPump: Joi.object({
            pressure: Joi.string().allow('').optional(),
            type: Joi.string().allow('').optional(),
            reliefValve: Joi.string().allow('').optional()
        }).optional()
    }).optional(),

    visualAndFunctionCheck: Joi.object({
        mainFrameChassis: Joi.object({
            reinforcingFrame: Joi.object({
                corrosion: inspectionCheckSchema,
                cracks: inspectionCheckSchema,
                deformation: inspectionCheckSchema
            }).optional()
        }).optional(),
        counterweight: Joi.object({
            corrosion: inspectionCheckSchema,
            condition: inspectionCheckSchema
        }).optional(),
        otherEquipment: Joi.object({
            floorDeck: inspectionCheckSchema,
            stairsSteps: inspectionCheckSchema,
            fasteningBolts: inspectionCheckSchema,
            operatorSeat: inspectionCheckSchema
        }).optional(),
        primeMover: Joi.object({
            system: Joi.object({
                cooling: inspectionCheckSchema,
                lubrication: inspectionCheckSchema,
                fuel: inspectionCheckSchema,
                airIntake: inspectionCheckSchema,
                exhaustGas: inspectionCheckSchema,
                starter: inspectionCheckSchema
            }).optional(),
            electrical: Joi.object({
                battery: inspectionCheckSchema,
                startingDynamo: inspectionCheckSchema,
                alternator: inspectionCheckSchema,
                batteryCable: inspectionCheckSchema,
                installationCable: inspectionCheckSchema,
                lightingLamps: inspectionCheckSchema,
                safetySignalLamps: inspectionCheckSchema,
                horn: inspectionCheckSchema,
                fuse: inspectionCheckSchema
            }).optional()
        }).optional(),
        dashboard: Joi.object({
            temperatureIndicator: inspectionCheckSchema,
            engineOilPressure: inspectionCheckSchema,
            hydraulicPressure: inspectionCheckSchema,
            hourMeter: inspectionCheckSchema,
            glowPlug: inspectionCheckSchema,
            fuelIndicator: inspectionCheckSchema,
            loadIndicator: inspectionCheckSchema,
            loadChart: inspectionCheckSchema
        }).optional(),
        powerTrain: Joi.object({
            steeringSystem: Joi.object({
                starterDynamo: inspectionCheckSchema,
                wheelSteering: inspectionCheckSchema,
                steeringRod: inspectionCheckSchema,
                gearBox: inspectionCheckSchema,
                pitmanArm: inspectionCheckSchema,
                dragLink: inspectionCheckSchema,
                tieRod: inspectionCheckSchema,
                lubrication: inspectionCheckSchema
            }).optional(),
            wheels: Joi.object({
                frontDriveWheel: inspectionCheckSchema,
                rearSteeringWheel: inspectionCheckSchema,
                fasteningBolts: inspectionCheckSchema,
                drumHub: inspectionCheckSchema,
                lubrication: inspectionCheckSchema,
                mechanicalParts: inspectionCheckSchema
            }).optional(),
            clutch: Joi.object({
                clutchHousing: inspectionCheckSchema,
                clutchCondition: inspectionCheckSchema,
                transmissionOil: inspectionCheckSchema,
                transmissionLeakage: inspectionCheckSchema,
                connectingShaft: inspectionCheckSchema,
                mechanicalParts: inspectionCheckSchema
            }).optional(),
            differential: Joi.object({
                differentialHousing: inspectionCheckSchema,
                differentialCondition: inspectionCheckSchema,
                differentialOil: inspectionCheckSchema,
                differentialLeakage: inspectionCheckSchema,
                connectingShaft: inspectionCheckSchema
            }).optional(),
            brakes: Joi.object({
                mainBrake: inspectionCheckSchema,
                handBrake: inspectionCheckSchema,
                emergencyBrake: inspectionCheckSchema,
                leakage: inspectionCheckSchema,
                mechanicalComponents: inspectionCheckSchema
            }).optional(),
            transmission: Joi.object({
                transmissionHousing: inspectionCheckSchema,
                transmissionOil: inspectionCheckSchema,
                transmissionLeakage: inspectionCheckSchema,
                mechanicalParts: inspectionCheckSchema
            }).optional()
        }).optional()
    }).optional(),

    attachments: Joi.object({
        mast: Joi.object({
            wear: inspectionCheckSchema,
            cracks: inspectionCheckSchema,
            deformation: inspectionCheckSchema,
            lubrication: inspectionCheckSchema,
            shaftAndBearings: inspectionCheckSchema
        }).optional(),
        liftChain: Joi.object({
            chainCondition: inspectionCheckSchema,
            deformation: inspectionCheckSchema,
            chainLubrication: inspectionCheckSchema
        }).optional(),
        personalBasket: Joi.object({
            workingFloor: Joi.object({
                corrosion: inspectionCheckSchema,
                cracks: inspectionCheckSchema,
                deformation: inspectionCheckSchema,
                fastening: inspectionCheckSchema
            }).optional(),
            basketFrame: Joi.object({
                corrosion: inspectionCheckSchema,
                cracks: inspectionCheckSchema,
                deformation: inspectionCheckSchema,
                crossBracing: inspectionCheckSchema,
                diagonalBracing: inspectionCheckSchema
            }).optional(),
            fasteningBolts: Joi.object({
                corrosion: inspectionCheckSchema,
                cracks: inspectionCheckSchema,
                deformation: inspectionCheckSchema,
                fastening: inspectionCheckSchema
            }).optional(),
            door: Joi.object({
                corrosion: inspectionCheckSchema,
                cracks: inspectionCheckSchema,
                deformation: inspectionCheckSchema,
                fastening: inspectionCheckSchema
            }).optional()
        }).optional(),
        handRail: Joi.object({
            cracks: inspectionCheckSchema,
            wear: inspectionCheckSchema,
            cracks2: inspectionCheckSchema,
            railStraightness: inspectionCheckSchema,
            railJoints: inspectionCheckSchema,
            interRailStraightness: inspectionCheckSchema,
            railJointGap: inspectionCheckSchema,
            railFasteners: inspectionCheckSchema,
            railStopper: inspectionCheckSchema
        }).optional()
    }).optional(),

    hydraulicComponents: Joi.object({
        tank: Joi.object({
            leakage: inspectionCheckSchema,
            oilLevel: inspectionCheckSchema,
            oilCondition: inspectionCheckSchema,
            suctionLineCondition: inspectionCheckSchema,
            returnLineCondition: inspectionCheckSchema
        }).optional(),
        pump: Joi.object({
            leakage: inspectionCheckSchema,
            suctionLineCondition: inspectionCheckSchema,
            pressureLineCondition: inspectionCheckSchema,
            function: inspectionCheckSchema,
            abnormalNoise: inspectionCheckSchema
        }).optional(),
        controlValve: Joi.object({
            leakage: inspectionCheckSchema,
            lineCondition: inspectionCheckSchema,
            reliefValveFunction: inspectionCheckSchema,
            abnormalNoise: inspectionCheckSchema,
            liftCylinderValveFunction: inspectionCheckSchema,
            tiltCylinderValveFunction: inspectionCheckSchema,
            steeringCylinderValveFunction: inspectionCheckSchema
        }).optional(),
        actuator: Joi.object({
            leakage: inspectionCheckSchema,
            lineCondition: inspectionCheckSchema,
            abnormalNoise: inspectionCheckSchema
        }).optional()
    }).optional(),

    engineOnCheck: Joi.object({
        starterDynamo: inspectionCheckSchema,
        instrumentFunction: inspectionCheckSchema,
        electricalFunction: inspectionCheckSchema,
        leakage: Joi.object({
            engineOil: inspectionCheckSchema,
            fuel: inspectionCheckSchema,
            coolant: inspectionCheckSchema,
            hydraulicOil: inspectionCheckSchema,
            transmissionOil: inspectionCheckSchema,
            finalDriveOil: inspectionCheckSchema,
            brakeFluid: inspectionCheckSchema
        }).optional(),
        clutchFunction: inspectionCheckSchema,
        transmissionFunction: inspectionCheckSchema,
        brakeFunction: inspectionCheckSchema,
        hornAndAlarmFunction: inspectionCheckSchema,
        lampsFunction: inspectionCheckSchema,
        hydraulicMotorFunction: inspectionCheckSchema,
        steeringCylinderFunction: inspectionCheckSchema,
        liftingCylinderFunction: inspectionCheckSchema,
        tiltingCylinderFunction: inspectionCheckSchema,
        exhaustGasCondition: inspectionCheckSchema,
        controlLeversFunction: inspectionCheckSchema,
        abnormalNoise: Joi.object({
            fromEngine: inspectionCheckSchema,
            fromTurbocharger: inspectionCheckSchema,
            fromTransmission: inspectionCheckSchema,
            fromHydraulicPump: inspectionCheckSchema,
            fromProtectiveCover: inspectionCheckSchema
        }).optional()
    }).optional(),

    chainInspection: Joi.array().items(chainInspectionItemSchema).optional(),
    nonDestructiveTest: Joi.object({
        ndtType: Joi.string().allow('').optional(),
        inspectedParts: Joi.array().items(nonDestructiveTestItemSchema).optional()
    }).optional(),
    loadTest: Joi.array().items(loadTestItemSchema).optional(),
    
    conclusion: Joi.string().allow('').optional(),
    recommendations: Joi.string().allow('').optional(),
    
}).min(1).unknown(true); // .unknown(true) untuk sementara mengizinkan field lain

module.exports = {
    laporanForkliftPayload,
};