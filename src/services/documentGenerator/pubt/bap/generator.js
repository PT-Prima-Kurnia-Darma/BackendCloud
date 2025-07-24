'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../config');

// Inisialisasi GCS
let privateKey = config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n');
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: { client_email: config.FIRESTORE_CLIENT_EMAIL, private_key: privateKey },
});
const BUCKET_NAME = 'tamplate-audit-riksauji';

// Helper function untuk memformat boolean sesuai gambar
const formatCondition = (status, choices) => {
    if (status === true) return choices[0];
    if (status === false) return choices[1];
    return `${choices[0]} / ${choices[1]}`;
};

const createBapPubt = async (data) => {
    const templatePath = 'pubt/bapPubt.docx'; // Path ke template di GCS

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP PUBT:', error);
        throw new Error('Template dokumen BAP PUBT tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualInspection || {};
    const test = data.testing || {};

    const renderData = {
        // Header & Data Umum
        examinationType: data.examinationType,
        inspectionType: data.inspectionType,
        inspectionDate: data.inspectionDate,
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        userUsage: g.userUsage,
        userAddress: g.userAddress,

        // Data Teknis
        brandType: t.brandType,
        manufacturer: t.manufacturer,
        countryAndYearOfManufacture: t.countryAndYearOfManufacture,
        serialNumberUnitNumber: t.serialNumberUnitNumber,
        fuelType: t.fuelType,
        operatingPressure: t.operatingPressure,
        designPressureKgCm2: t.designPressureKgCm2,
        maxAllowableWorkingPressure: t.maxAllowableWorkingPressure,
        technicalDataShellMaterial: t.technicalDataShellMaterial,
        safetyValveType: t.safetyValveType,
        volumeLiters: t.volumeLiters,

        // Hasil Riksa Uji - Visual
        fondationCondition: formatCondition(v.foundationCondition, ['baik', 'tidak baik']),
        safetyValveIsInstalled: formatCondition(v.safetyValveIsInstalled, ['terpasang', 'tidak terpasang']),
        safetyValveCondition: formatCondition(v.safetyValveCondition, ['baik', 'tidak baik']),
        aparAvailable: formatCondition(v.aparAvailable, ['tersedia', 'tidak tersedia']),
        aparCondition: formatCondition(v.aparCondition, ['baik', 'tidak']),
        wheelCondition: formatCondition(v.wheelCondition, ['baik', 'tidak baik']),
        pipeCondition: formatCondition(v.pipeCondition, ['baik', 'tidak baik']),

        // Hasil Riksa Uji - Pengujian
        ndtTestingFulfilled: formatCondition(test.ndtTestingFulfilled, ['memenuhi', 'tidak memenuhi']),
        thicknessTestingComply: formatCondition(test.thicknessTestingComply, ['sesuai', 'tidak sesuai']),
        pneumaticTestingCondition: formatCondition(test.pneumaticTestingCondition, ['baik', 'tidak']),
        hydroTestingFullFilled: formatCondition(test.hydroTestingFullFilled, ['memenuhi', 'tidak memenuhi']),
        safetyValveTestingCondition: formatCondition(test.safetyValveTestingCondition, ['baik', 'tidak baik']),
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyNameSafe = g.companyName?.replace(/\s+/g, '-') || 'UnknownCompany';
    const fileName = `BAP-PUBT-${companyNameSafe}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapPubt };