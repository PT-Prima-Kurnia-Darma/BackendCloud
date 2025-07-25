'use strict';

const Joi = require('joi');

// Skema untuk item inspeksi yang berulang (status boolean dan teks hasil)
const inspectionItemSchema = Joi.object({
    status: Joi.boolean().allow(null),
    result: Joi.string().allow('', null).optional()
});

// Skema untuk hasil pengujian NDT dan Safety Device
const testResultSchema = Joi.object({
    remarks: Joi.string().allow('', null).optional(),
    result: Joi.string().allow('', null).optional()
});

const laporanPtpDieselPayload = Joi.object({
    examinationType: Joi.string().allow('').optional(),
    subInspectionType: Joi.string().valid('MOTOR DIESEL').required(),
    extraId: Joi.number().allow(null).optional(),
    createdAt: Joi.string().allow('').optional(),
    inspectionType: Joi.string().allow('').optional(),

    generalData: Joi.object({
        companyName: Joi.string().allow('').optional(),
        companyLocation: Joi.string().allow('').optional(),
        userInCharge: Joi.string().allow('').optional(),
        userAddressInCharge: Joi.string().allow('').optional(),
        subcontractorPersonInCharge: Joi.string().allow('').optional(),
        unitLocation: Joi.string().allow('').optional(),
        equipmentType: Joi.string().allow('').optional(),
        brandType: Joi.string().allow('').optional(),
        serialNumberUnitNumber: Joi.string().allow('').optional(),
        manufacturer: Joi.string().allow('').optional(),
        locationAndYearOfManufacture: Joi.string().allow('').optional(),
        capacityWorkingLoad: Joi.string().allow('').optional(),
        intendedUse: Joi.string().allow('').optional(),
        pjk3SkpNo: Joi.string().allow('').optional(),
        ak3SkpNo: Joi.string().allow('').optional(),
        portableOrStationer: Joi.string().allow('').optional(),
        usagePermitNumber: Joi.string().allow('').optional(),
        operatorName: Joi.string().allow('').optional(),
        equipmentHistory: Joi.string().allow('').optional()
    }).optional(),

    technicalData: Joi.object({
        dieselMotor: Joi.object({
            brandModel: Joi.string().allow('').optional(),
            manufacturer: Joi.string().allow('').optional(),
            classification: Joi.string().allow('').optional(),
            serialNumber: Joi.string().allow('').optional(),
            powerRpm: Joi.string().allow('').optional(),
            startingPower: Joi.string().allow('').optional(),
            cylinderCount: Joi.string().allow('').optional()
        }).optional(),
        generator: Joi.object({
            brandType: Joi.string().allow('').optional(),
            manufacturer: Joi.string().allow('').optional(),
            serialNumber: Joi.string().allow('').optional(),
            power: Joi.string().allow('').optional(),
            frequency: Joi.string().allow('').optional(),
            rpm: Joi.string().allow('').optional(),
            voltage: Joi.string().allow('').optional(),
            powerFactor: Joi.string().allow('').optional(),
            current: Joi.string().allow('').optional()
        }).optional()
    }).optional(),

    visualChecks: Joi.object({
        basicConstruction: Joi.object({
            foundation: inspectionItemSchema,
            dieselHousing: inspectionItemSchema,
            support: inspectionItemSchema,
            anchorBolt: inspectionItemSchema
        }).optional(),
        structuralConstruction: Joi.object({
            dailyTank: inspectionItemSchema,
            muffler: inspectionItemSchema,
            airVessel: inspectionItemSchema,
            panel: inspectionItemSchema
        }).optional(),
        lubricationSystem: Joi.object({
            oil: inspectionItemSchema,
            oilStrainer: inspectionItemSchema,
            oilCooler: inspectionItemSchema,
            oilFilter: inspectionItemSchema,
            byPassFilter: inspectionItemSchema,
            safetyValve: inspectionItemSchema,
            packing: inspectionItemSchema
        }).optional(),
        fuelSystem: Joi.object({
            dailyTank: inspectionItemSchema,
            fuelInjector: inspectionItemSchema,
            connections: inspectionItemSchema,
            floatTank: inspectionItemSchema,
            fuelFilter: inspectionItemSchema,
            fuelPump: inspectionItemSchema,
            magneticScreen: inspectionItemSchema,
            governor: inspectionItemSchema,
            throttleShaft: inspectionItemSchema,
            regulator: inspectionItemSchema,
            shutOffValve: inspectionItemSchema
        }).optional(),
        startingAid: Joi.object({
            feedPump: inspectionItemSchema,
            fuelValve: inspectionItemSchema,
            primingPump: inspectionItemSchema,
            heaterPlug: inspectionItemSchema,
            heaterSwitch: inspectionItemSchema,
            preHeater: inspectionItemSchema,
            waterSignal: inspectionItemSchema,
            startingSwitch: inspectionItemSchema,
            batteryPoles: inspectionItemSchema,
            thermostartTank: inspectionItemSchema,
            thermostart: inspectionItemSchema,
            heaterSignal: inspectionItemSchema,
            thermostartSwitch: inspectionItemSchema,
            glowPlug: inspectionItemSchema,
            speedSensor: inspectionItemSchema,
            serviceMeter: inspectionItemSchema,
            tempSensor: inspectionItemSchema,
            startingMotor: inspectionItemSchema
        }).optional(),
        coolingSystem: Joi.object({
            coolingWater: inspectionItemSchema,
            bolts: inspectionItemSchema,
            clamps: inspectionItemSchema,
            radiator: inspectionItemSchema,
            thermostat: inspectionItemSchema,
            fan: inspectionItemSchema,
            fanGuard: inspectionItemSchema,
            fanRotation: inspectionItemSchema,
            bearing: inspectionItemSchema
        }).optional(),
        airCirculationSystem: Joi.object({
            preCleaner: inspectionItemSchema,
            dustIndicator: inspectionItemSchema,
            airCleaner: inspectionItemSchema,
            turboCharger: inspectionItemSchema,
            clamps: inspectionItemSchema,
            afterCooler: inspectionItemSchema,
            muffler: inspectionItemSchema,
            silencer: inspectionItemSchema,
            heatDamper: inspectionItemSchema,
            bolts: inspectionItemSchema
        }).optional(),
        mainParts: Joi.object({
            damperBolts: inspectionItemSchema,
            support: inspectionItemSchema,
            flyWheelHousing: inspectionItemSchema,
            flyWheel: inspectionItemSchema,
            vibrationDamper: inspectionItemSchema,
            beltAndPulley: inspectionItemSchema,
            crankshaft: inspectionItemSchema
        }).optional(),
        generatorParts: Joi.object({
            terminal: inspectionItemSchema,
            cable: inspectionItemSchema,
            panel: inspectionItemSchema,
            ampereMeter: inspectionItemSchema,
            voltMeter: inspectionItemSchema,
            frequencyMeter: inspectionItemSchema,
            circuitBreaker: inspectionItemSchema,
            onOffSwitch: inspectionItemSchema
        }).optional(),
        transmission: Joi.object({
            gear: inspectionItemSchema,
            belt: inspectionItemSchema,
            chain: inspectionItemSchema
        }).optional(),
        mdp: Joi.object({
            cable: inspectionItemSchema,
            condition: inspectionItemSchema,
            ampereMeter: inspectionItemSchema,
            voltMeter: inspectionItemSchema,
            mainCircuitBreaker: inspectionItemSchema
        }).optional(),
        safetyDevice: Joi.object({
            grounding: inspectionItemSchema,
            lightningArrester: inspectionItemSchema,
            emergencyStop: inspectionItemSchema,
            governor: inspectionItemSchema,
            thermostat: inspectionItemSchema,
            waterSignal: inspectionItemSchema,
            fanGuard: inspectionItemSchema,
            silencer: inspectionItemSchema,
            vibrationDamper: inspectionItemSchema,
            circuitBreaker: inspectionItemSchema,
            avr: inspectionItemSchema
        }).optional()
    }).optional(),

    tests: Joi.object({
        ndt: Joi.object({
            shaftRpm: testResultSchema,
            weldJoint: testResultSchema,
            noise: testResultSchema,
            lighting: testResultSchema,
            loadTest: testResultSchema
        }).optional(),
        safetyDevice: Joi.object({
            governor: testResultSchema,
            emergencyStop: testResultSchema,
            grounding: testResultSchema,
            indicatorPanel: testResultSchema,
            pressureGauge: testResultSchema,
            tempIndicator: testResultSchema,
            waterIndicator: testResultSchema,
            safetyValves: testResultSchema,
            radiator: testResultSchema
        }).optional()
    }).optional(),

    electricalComponents: Joi.object({
        panelControl: Joi.object({
            ka: Joi.string().allow('').optional(),
            voltage: Joi.object({
                rs: Joi.number().allow(null).optional(),
                rt: Joi.number().allow(null).optional(),
                st: Joi.number().allow(null).optional(),
                rn: Joi.number().allow(null).optional(),
                rg: Joi.number().allow(null).optional(),
                ng: Joi.number().allow(null).optional()
            }).optional(),
            powerInfo: Joi.object({
                frequency: Joi.string().allow('').optional(),
                cosQ: Joi.number().allow(null).optional(),
                ampere: Joi.object({
                    r: Joi.number().allow(null).optional(),
                    s: Joi.number().allow(null).optional(),
                    t: Joi.number().allow(null).optional()
                }).optional(),
                result: Joi.string().allow('').optional()
            }).optional()
        }).optional()
    }).optional(),

    conclusion: Joi.string().allow('').optional(),
    recommendations: Joi.string().allow('').optional(),
    inspectionDate: Joi.string().allow('').optional(),

    mcbCalculation: Joi.object({
        phase: Joi.number().allow(null).optional(),
        voltage: Joi.string().allow('').optional(),
        cosQ: Joi.number().allow(null).optional(),
        generatorPowerKva: Joi.number().allow(null).optional(),
        generatorPowerKw: Joi.number().allow(null).optional(),
        resultCalculation: Joi.number().allow(null).optional(),
        requirementCalculation: Joi.number().allow(null).optional(),
        conclusion: Joi.string().allow('').optional()
    }).optional(),

    noiseMeasurement: Joi.object({
        pointA: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
        pointB: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
        pointC: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
        pointD: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional()
    }).optional(),

    lightingMeasurement: Joi.object({
        pointA: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
        pointB: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
        pointC: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional(),
        pointD: Joi.object({ result: Joi.number().allow(null).optional(), status: Joi.string().allow('').optional() }).optional()
    }).optional()
}).min(1).unknown(false);

module.exports = {
    laporanPtpDieselPayload
};