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

const BUCKET_NAME = 'audit-riksauji';

const getChoice = (condition, choices) => (condition ? choices[0] : choices[1]);

const createBapGondola = async (data) => {
    const templatePath = 'paa/gondola/bapGondola.docx'; // Sesuaikan path ke template BAP Anda

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP Gondola:', error);
        throw new Error('Template dokumen BAP Gondola tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => ""
    });
    
    const { visualCheck, functionalTest } = data.inspectionResult;

    const renderData = {
        // --- HEADER ---
        examinationType: data.examinationType.toUpperCase(),
        inspectionType: data.inspectionType.toUpperCase(),
        subInspectionType: data.equipmentType.toUpperCase(),
        inspectionDate: data.inspectionDate,
        
        // --- DATA UMUM ---
        companyName: data.generalData.companyName,
        companyLocation: data.generalData.companyLocation,
        userInCharge: data.generalData.userInCharge,
        ownerAddress: data.generalData.ownerAddress,

        // --- DATA TEKNIS ---
        manufacturer: data.technicalData.manufacturer,
        locationAndYearOfManufacture: data.technicalData.locationAndYearOfManufacture,
        serialNumberUnitNumber: data.technicalData.serialNumberUnitNumber,
        intendedUse: data.technicalData.intendedUse,
        capacityWorkingLoad: data.technicalData.capacityWorkingLoad,
        maxLiftingHeightMeters: data.technicalData.maxLiftingHeightMeters,

        // --- HASIL PEMERIKSAAN & PENGUJIAN ---
        // Visual
        isSlingDiameterAcceptable: getChoice(visualCheck.isSlingDiameterAcceptable, ['layak', 'tidak layak']),
        isBumperInstalled: getChoice(visualCheck.isBumperInstalled, ['terpasang', 'tidak terpasang']),
        isCapacityMarkingDisplayed: getChoice(visualCheck.isCapacityMarkingDisplayed, ['terpasang', 'tidak terpasang']),
        isPlatformConditionAcceptable: getChoice(visualCheck.isPlatformConditionAcceptable, ['layak', 'tidak layak']),
        driveMotorConditionisGoodCondition: getChoice(visualCheck.driveMotorCondition.isGoodCondition, ['baik', 'tidak baik']),
        driveMotorConditionhasOilLeak: getChoice(visualCheck.driveMotorCondition.hasOilLeak, ['terdapat', 'tidak terdapat']),
        isControlPanelClean: getChoice(visualCheck.isControlPanelClean, ['bersih', 'tidak bersih']),
        isBodyHarnessAvailable: getChoice(visualCheck.isBodyHarnessAvailable, ['tersedia', 'tidak tersedia']),
        isLifelineAvailable: getChoice(visualCheck.isLifelineAvailable, ['tersedia', 'tidak tersedia']),
        isButtonLabelsDisplayed: getChoice(visualCheck.isButtonLabelsDisplayed, ['terpasang', 'tidak terpasang']),
        
        // Pengujian
        isWireRopeMeasurementOk: getChoice(functionalTest.isWireRopeMeasurementOk, ['baik', 'tidak baik']),
        isUpDownFunctionOk: getChoice(functionalTest.isUpDownFunctionOk, ['baik', 'tidak baik']),
        isDriveMotorFunctionOk: getChoice(functionalTest.isDriveMotorFunctionOk, ['baik', 'tidak baik']),
        isEmergencyStopFunctional: getChoice(functionalTest.isEmergencyStopFunctional, ['berfungsi', 'tidak berfungsi']),
        isSafetyLifelineFunctional: getChoice(functionalTest.isSafetyLifelineFunctional, ['berfungsi', 'tidak berfungsi']),
        ndtTestmethod: functionalTest.ndtTest.method,
        ndtTestisResultGood: getChoice(functionalTest.ndtTest.isResultGood, ['baik', 'tidak baik']),
        ndtTesthasCrackIndication: getChoice(functionalTest.ndtTest.hasCrackIndication, ['ditemukan', 'tidak ditemukan']),
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    const companyName = (data.generalData.companyName || 'UnknownCompany').replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_');
    const fileName = `BAP-Gondola-${companyName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createBapGondola,
};