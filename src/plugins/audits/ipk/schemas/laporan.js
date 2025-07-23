'use strict';

const Joi = require('joi');

    const documentChecklistItemSchema = Joi.object({
        available: Joi.boolean().allow(null).optional(),
        notes: Joi.string().allow('').optional()
    });

    const alarmInstallationItemSchema = Joi.object({
        location: Joi.string().allow('').optional(),
        zone: Joi.string().allow('').optional(),
        ror: Joi.string().allow('').optional(),
        fixed: Joi.string().allow('').optional(),
        smoke: Joi.string().allow('').optional(),
        tpm: Joi.string().allow('').optional(),
        flsw: Joi.string().allow('').optional(),
        bell: Joi.string().allow('').optional(),
        lamp: Joi.string().allow('').optional(),
        status: Joi.string().allow('').optional()
    });

    const pumpFunctionTestItemSchema = Joi.object({
        pumpType: Joi.string().allow('').optional(),
        start: Joi.string().allow('').optional(),
        stop: Joi.string().allow('').optional()
    });

    const hydrantOperationalTestItemSchema = Joi.object({
        test: Joi.string().allow('').optional(),
        pressure: Joi.string().allow('').optional(),
        transmitPower: Joi.string().allow('').optional(),
        nozzlePosition: Joi.string().allow('').optional(),
        status: Joi.string().allow('').optional(),
        description: Joi.string().allow('').optional()
    });

    const laporanProteksiKebakaranPayload = Joi.object({
        examinationType: Joi.string().allow('').optional(),
        extraid: Joi.number().allow('').optional(),
        createdAt: Joi.string().allow('').optional(),
        inspectionType: Joi.string().allow('').optional(),
        equipmentType: Joi.string().allow('').optional(),
        documentChecklist: Joi.object({
            technicalDrawing: documentChecklistItemSchema,
            previousTestDocumentation: documentChecklistItemSchema,
            requestLetter: documentChecklistItemSchema,
            specificationDocument: documentChecklistItemSchema
        }).optional(),
        generalData: Joi.object({
            companyName: Joi.string().allow('').optional(),
            companyLocation: Joi.string().allow('').optional(),
            usageLocation: Joi.string().allow('').optional(),
            certificateNumber: Joi.string().allow('').optional(),
            k3Object: Joi.string().allow('').optional(),
            inspectionDate: Joi.string().allow('').optional()
        }).optional(),
        buildingData: Joi.object({
            landArea: Joi.string().allow('').optional(),
            buildingArea: Joi.string().allow('').optional(),
            buildingHeight: Joi.string().allow('').optional(),
            floorCount: Joi.string().allow('').optional(),
            construction: Joi.object({
                mainStructure: Joi.string().allow('').optional(),
                floorStructure: Joi.string().allow('').optional(),
                exteriorWalls: Joi.string().allow('').optional(),
                interiorWalls: Joi.string().allow('').optional(),
                ceilingFrame: Joi.string().allow('').optional(),
                ceilingCover: Joi.string().allow('').optional(),
                roofFrame: Joi.string().allow('').optional(),
                roofCover: Joi.string().allow('').optional()
            }).optional(),
            yearBuilt: Joi.string().allow('').optional(),
            fireProtectionEquipment: Joi.object({
                portableExtinguishers: Joi.string().allow('').optional(),
                indoorHydrantBox: Joi.string().allow('').optional(),
                pillarAndOutdoorHydrant: Joi.string().allow('').optional(),
                siameseConnection: Joi.string().allow('').optional(),
                sprinklerSystem: Joi.string().allow('').optional(),
                heatAndSmokeDetectors: Joi.string().allow('').optional(),
                exitSigns: Joi.string().allow('').optional(),
                emergencyStairs: Joi.string().allow('').optional(),
                assemblyPoint: Joi.string().allow('').optional()
            }).optional()
        }).optional(),
        technicalSpecifications: Joi.object({
            mcfa: Joi.object({
                brandOrType: Joi.string().allow('').optional(),
                result: Joi.string().allow('').optional(),
                ledAnnunciator: Joi.string().allow('').optional(),
                type: Joi.string().allow('').optional(),
                serialNumber: Joi.string().allow('').optional()
            }).optional(),
            heatDetector: Joi.object({
                brandOrType: Joi.string().allow('').optional(),
                result: Joi.string().allow('').optional(),
                pointCount: Joi.string().allow('').optional(),
                spacing: Joi.string().allow('').optional(),
                operatingTemperature: Joi.string().allow('').optional()
            }).optional(),
            smokeDetector: Joi.object({
                brandOrType: Joi.string().allow('').optional(),
                result: Joi.string().allow('').optional(),
                pointCount: Joi.string().allow('').optional(),
                spacing: Joi.string().allow('').optional(),
                operatingTemperature: Joi.string().allow('').optional()
            }).optional(),
            apar: Joi.object({
                brandOrType: Joi.string().allow('').optional(),
                result: Joi.string().allow('').optional(),
                count: Joi.string().allow('').optional(),
                spacing: Joi.string().allow('').optional(),
                placement: Joi.string().allow('').optional()
            }).optional()
        }).optional(),
        resultAlarmInstallation: Joi.string().allow('').optional(),
        totalAlarmInstallation: Joi.string().allow('').optional(),
        alarmInstallationData: Joi.array().items(alarmInstallationItemSchema).optional(),
        alarmTestResults: Joi.object({
            panelFunction: Joi.string().allow('').optional(),
            alarmTest: Joi.string().allow('').optional(),
            faultTest: Joi.string().allow('').optional(),
            interconnectionTest: Joi.string().allow('').optional()
        }).optional(),
        hydrantSystem: Joi.object({
            waterSource: Joi.object({
                specification: Joi.string().allow('').optional(),
                status: Joi.string().allow('').optional(),
                note: Joi.string().allow('').optional()
            }).optional(),
            groundReservoir: Joi.object({
                backupSpec: Joi.string().allow('').optional(),
                backupStatus: Joi.string().allow('').optional(),
                backupResult: Joi.string().allow('').optional()
            }).optional(),
            gravitationTank: Joi.object({
                spec: Joi.string().allow('').optional(),
                status: Joi.string().allow('').optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            siameseConnection: Joi.object({
                spec: Joi.string().allow('').optional(),
                status: Joi.string().allow('').optional(),
                result: Joi.string().allow('').optional()
            }).optional(),
            pumps: Joi.object({
                jockey: Joi.object({
                    quantity: Joi.string().allow('').optional(),
                    headM: Joi.string().allow('').optional(),
                    autoStart: Joi.string().allow('').optional(),
                    autoStop: Joi.string().allow('').optional()
                }).optional(),
                electric: Joi.object({
                    quantity: Joi.string().allow('').optional(),
                    headM: Joi.string().allow('').optional(),
                    autoStart: Joi.string().allow('').optional(),
                    stop: Joi.string().allow('').optional()
                }).optional(),
                diesel: Joi.object({
                    quantity: Joi.string().allow('').optional(),
                    headM: Joi.string().allow('').optional(),
                    autoStart: Joi.string().allow('').optional(),
                    stop: Joi.string().allow('').optional()
                }).optional()
            }).optional(),
            indoorHydrant: Joi.object({
                points: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                hoseLength: Joi.string().allow('').optional(),
                placement: Joi.string().allow('').optional()
            }).optional(),
            landingValve: Joi.object({
                points: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                clutchType: Joi.string().allow('').optional(),
                placement: Joi.string().allow('').optional()
            }).optional(),
            outdoorHydrant: Joi.object({
                points: Joi.string().allow('').optional(),
                diameter: Joi.string().allow('').optional(),
                hoseLength: Joi.string().allow('').optional(),
                nozzleDiameter: Joi.string().allow('').optional(),
                placement: Joi.string().allow('').optional()
            }).optional(),
            fireServiceConnection: Joi.object({
                points: Joi.string().allow('').optional(),
                inletDiameter: Joi.string().allow('').optional(),
                outletDiameter: Joi.string().allow('').optional(),
                clutchType: Joi.string().allow('').optional(),
                condition: Joi.string().allow('').optional(),
                placement: Joi.string().allow('').optional()
            }).optional(),
            pipingAndValves: Joi.object({
                pressureReliefValve: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                testValve: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                suctionPipe: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                mainPipe: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                standPipe: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                hydrantPillar: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                innerHydrant: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional(),
                hoseReel: Joi.object({ spec: Joi.string().allow('').optional(), status: Joi.string().allow('').optional(), remarks: Joi.string().allow('').optional() }).optional()
            }).optional()
        }).optional(),
        pumpFunctionTest: Joi.array().items(pumpFunctionTestItemSchema).optional(),
        hydrantOperationalTest: Joi.array().items(hydrantOperationalTestItemSchema).optional(),
        summary: Joi.string().allow('').optional(),
        recommendations: Joi.string().allow('').optional(),
        conclusion: Joi.string().allow('').optional(),
});

module.exports = {
    laporanProteksiKebakaranPayload,
};