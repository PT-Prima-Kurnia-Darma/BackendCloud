'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../config');

const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
});
const BUCKET_NAME = 'tamplate-audit-riksauji';

const formatBooleanToText = (value, options) => {
    if (value === true) return options.true;
    if (value === false) return options.false;
    return `${options.true} / ${options.false}`;
};

const createBapProteksiKebakaran = async (data) => {
    const templatePath = 'proteksiKebakaran/bapProteksiKebakaran.docx'; // Pastikan path ini benar di GCS

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP Proteksi Kebakaran:', error);
        throw new Error('Template dokumen BAP Proteksi Kebakaran tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const res = data.testResults || {};
    const v = res.visualInspection || {};
    const f = res.functionalTests || {};

    const renderData = {
        // HEADER
        examinationType: data.examinationType,
        inspectionDate: data.inspectionDate,
        
        // DATA UMUM
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        usageLocation: g.usageLocation,
        addressUsageLocation: g.addressUsageLocation,

        // DATA TEKNIS
        ...t,

        // HASIL RIKSA UJI
        // PEMERIKSAAN VISUAL
        visualInspectionAparStatusAvailable: formatBooleanToText(v.isAparAvailable, { true: 'Tersedia', false: 'Tidak Tersedia' }),
        visualInspectionAparStatusGoodCondition: formatBooleanToText(v.isAparInGoodCondition, { true: 'Baik', false: 'Tidak Baik' }),
        isHydrantPanelGoodCondition: formatBooleanToText(v.isHydrantPanelInGoodCondition, { true: 'Baik', false: 'Tidak Baik' }),
        visualInspectionPumpStatusAvailable: formatBooleanToText(v.arePumpsAvailable, { true: 'Tersedia', false: 'Tidak Tersedia' }),
        visualInspectionPumpStatusGoodCondition: formatBooleanToText(v.arePumpsInGoodCondition, { true: 'Baik', false: 'Tidak Baik' }),
        sprinklerSystemStatusAvailable: formatBooleanToText(v.isSprinklerSystemAvailable, { true: 'Tersedia', false: 'Tidak Tersedia' }),
        sprinklerSystemStatusGoodCondition: formatBooleanToText(v.isSprinklerSystemInGoodCondition, { true: 'Baik', false: 'Tidak Baik' }),
        detectorSystemStatusAvailable: formatBooleanToText(v.isDetectorSystemAvailable, { true: 'Tersedia', false: 'Tidak Tersedia' }),
        detectorSystemStatusGoodCondition: formatBooleanToText(v.isDetectorSystemInGoodCondition, { true: 'Baik', false: 'Tidak Baik' }),

        // PENGUJIAN
        testingisAparFunctional: formatBooleanToText(f.isAparFunctional, { true: 'Berfungsi', false: 'Tidak Berfungsi' }),
        pumpTestResults: formatBooleanToText(f.arePumpsFunctional, { true: 'Berfungsi', false: 'Tidak Berfungsi' }),
        isSprinklerFunctional: formatBooleanToText(f.isSprinklerFunctional, { true: 'Berfungsi', false: 'Tidak Berfungsi' }),
        detectorTestResultsIsFunctional: formatBooleanToText(f.isDetectorFunctional, { true: 'Berfungsi', false: 'Tidak Berfungsi' }),
        detectorTestResultsIsConnectedToMcfa: formatBooleanToText(f.isDetectorConnectedToMcfa, { true: 'Terkoneksi', false: 'Tidak Terkoneksi' })
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyNameSafe = g.companyName?.replace(/\s+/g, '-') || 'UnknownCompany';
    const fileName = `BAP-Proteksi-Kebakaran-${companyNameSafe}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapProteksiKebakaran };