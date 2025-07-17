'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
});

const BUCKET_NAME = 'tamplate-audit-riksauji';

const getCheckmark = (status) => (status ? 'V' : '-');

const createLaporanGondola = async (data) => {
    const templatePath = 'paa/gondola/laporanGondola.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Gondola:', error);
        throw new Error('Template dokumen Laporan Gondola tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, nullGetter: () => "" });
    
    const renderData = {
        // MAIN
        examinationType: data.examinationType,
        inspectionType: data.inspectionType,
        subInspectionType: data.subInspectionType,
        reportNumber: data.reportNumber,
        
        // GENERAL DATA
        ownerName: data.generalData.ownerName,
        ownerAddress: data.generalData.ownerAddress,
        userInCharge: data.generalData.userInCharge,
        subcontractorPersonInCharge: data.generalData.subcontractorPersonInCharge,
        unitLocation: data.generalData.unitLocation,
        operatorName: data.generalData.operatorName,
        equipmentType: data.generalData.equipmentType,
        manufacturer: data.generalData.manufacturer,
        brandType: data.generalData.brandType,
        locationAndYearOfManufacture: data.generalData.locationAndYearOfManufacture,
        serialNumberUnitNumber: data.generalData.serialNumberUnitNumber,
        capacityWorkingLoad: data.generalData.capacityWorkingLoad,
        intendedUse: data.generalData.intendedUse,
        usagePermitNumber: data.generalData.usagePermitNumber,
        operatorCertificate: data.generalData.operatorCertificate,
        inspectionDate: data.inspectionDate,

        // TECHNICAL DATA
        gondolaSpecificationSupportMastHeight: data.technicalData.gondolaSpecification.supportMastHeight,
        gondolaSpecificationFrontBeamLength: data.technicalData.gondolaSpecification.frontBeamLength,
        gondolaSpecificationMiddleBeamLength: data.technicalData.gondolaSpecification.middleBeamLength,
        gondolaSpecificationRearBeamLength: data.technicalData.gondolaSpecification.rearBeamLength,
        gondolaSpecificationBalanceWeightDistance: data.technicalData.gondolaSpecification.balanceWeightDistance,
        gondolaSpecificationCapacity: data.technicalData.gondolaSpecification.capacity,
        gondolaSpecificationSpeed: data.technicalData.gondolaSpecification.speed,
        gondolaSpecificationPlatformSize: data.technicalData.gondolaSpecification.platformSize,
        gondolaSpecificationWireRopeDiameter: data.technicalData.gondolaSpecification.wireRopeDiameter,
        hoistModel: data.technicalData.hoist.model,
        hoistLiftingCapacity: data.technicalData.hoist.liftingCapacity,
        hoistlElectricMotorType: data.technicalData.hoist.electricMotor.type,
        hoistElectricMotorPower: data.technicalData.hoist.electricMotor.power,
        hoistElectricMotorVoltage: data.technicalData.hoist.electricMotor.voltage,
        hoistElectricMotorVoltageHz: data.technicalData.hoist.electricMotor.voltageHz,
        safetyLockType: data.technicalData.safetyLockType,
        brakeType: data.technicalData.brake.type,
        brakeModel: data.technicalData.brake.model,
        brakeCapacity: data.technicalData.brake.capacity,
        suspensionMechanicalSupportMastHeight: data.technicalData.suspensionMechanical.supportMastHeight,
        suspensionMechanicalFrontBeamLength: data.technicalData.suspensionMechanical.frontBeamLength,
        suspensionMechanicalMaterial: data.technicalData.suspensionMechanical.material,
        machineWeightTotalPlatformWeight: data.technicalData.machineWeight.totalPlatformWeight,
        machineWeightSuspensionMechanicalWeight: data.technicalData.machineWeight.suspensionMechanicalWeight,
        machineWeightBalanceWeight: data.technicalData.machineWeight.balanceWeight,
        machineWeightTotalMachineWeight: data.technicalData.machineWeight.totalMachineWeight,

        // VISUAL INSPECTION
        suspensionStructureFrontBeamMemenuhi: getCheckmark(data.visualInspection.suspensionStructure.frontBeam.status),
        suspensionStructureFrontBeamTidakMemenuhi: getCheckmark(!data.visualInspection.suspensionStructure.frontBeam.status),
        suspensionStructureFrontBeamResult: data.visualInspection.suspensionStructure.frontBeam.result,
        
        // ... (lanjutkan untuk semua item visual inspection)
        
        // NDT
        nonDestructiveTestWireRopeItems: data.nonDestructiveTesting.steelCableRope.items.map(item => ({
            nonDestructiveTestWireRopeUsage: item.usage,
            nonDestructiveTestWireRopeSpecDiameter: item.specDiameter,
            nonDestructiveTestWireRopeActualDiameter: item.actualDiameter,
            nonDestructiveTestWireRopeConstruction: item.construction,
            nonDestructiveTestWireRopeType: item.type,
            nonDestructiveTestWireRopeLength: item.length,
            nonDestructiveTestWireRopeAge: item.age,
            nonDestructiveTestWireRopeDefectTrue: getCheckmark(item.defectFound),
            nonDestructiveTestWireRopeDefectFalse: getCheckmark(!item.defectFound),
            nonDestructiveTestWireRopeResult: item.result,
        })),
        nonDestructiveTestWireRopeNdtType: data.nonDestructiveTesting.steelCableRope.ndtType,
        suspensionStructureItems: data.nonDestructiveTesting.suspensionStructure.items.map(item => ({
            suspensionStructurePart: item.part,
            suspensionStructureLocation: item.location,
            suspensionStructureDefectTrue: getCheckmark(item.defectFound),
            suspensionStructureDefectFalse: getCheckmark(!item.defectFound),
            suspensionStructureResult: item.result
        })),
        suspensionStructureType: data.nonDestructiveTesting.suspensionStructure.ndtType,
        gondolaCageItems: data.nonDestructiveTesting.gondolaCage.items.map(item => ({
            gondolaCagePart: item.part,
            gondolaCageLocation: item.location,
            gondolaCageDefectTrue: getCheckmark(item.defectFound),
            gondolaCageDefectFalse: getCheckmark(!item.defectFound),
            gondolaCageResult: item.result
        })),
        gondolaCageType: data.nonDestructiveTesting.gondolaCage.ndtType,
        clamsItems: data.nonDestructiveTesting.clamps.items.map(item => ({
            clamsPartCheck: item.partCheck,
            partLocation: item.location,
            defectAda: getCheckmark(item.defectFound),
            defectTidakAda: getCheckmark(!item.defectFound),
            partResult: item.result
        })),

        // TESTING
        dynamicLoadTestLoadItems: data.testing.dynamicLoadTest.items.map(item => ({
            dynamicLoadTestLoadPercentage: item.loadPercentage,
            dynamicLoadTestLoadDetails: item.loadDetails,
            dynamicLoadTestRemarks: item.remarks,
            dynamicLoadTestResult: item.result
        })),
        dynamicLoadTestNotOrHappensNote: data.testing.dynamicLoadTest.note,
        staticLoadTestLoadItems: data.testing.staticLoadTest.items.map(item => ({
            staticLoadTestLoadPercentage: item.loadPercentage,
            staticLoadTestLoadDetails: item.loadDetails,
            staticLoadTestRemarks: item.remarks,
            staticLoadTestResult: item.result
        })),
        staticLoadTestNotOrHappensNote: data.testing.staticLoadTest.note,
        
        // CONCLUSION & RECOMMENDATION
        conclusion: data.conclusion,
        recomendation: data.recommendation,

    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    const ownerName = (data.generalData.ownerName || 'UnknownOwner').replace(/[^\w.-]/g, '_');
    const fileName = `Laporan-Gondola-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanGondola,
};