'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi GCS
let privateKey = config.FIRESTORE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: { client_email: config.FIRESTORE_CLIENT_EMAIL, private_key: privateKey },
});
const BUCKET_NAME = 'audit-riksauji';

/**
 * Helper untuk mengubah boolean menjadi teks yang sesuai untuk BAP.
 * @param {boolean} status - Nilai boolean.
 * @param {string} trueText - Teks jika true.
 * @param {string} falseText - Teks jika false.
 * @returns {string}
 */
const formatBooleanToText = (status, trueText, falseText) => {
    if (status === true) return trueText;
    if (status === false) return falseText;
    return `${trueText} / ${falseText}`; // Default jika null/undefined
};

/**
 * Membuat dokumen BAP Eskalator dari data.
 * @param {object} data - Data BAP lengkap dari Firestore.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>}
 */
const createBapEskalator = async (data) => {
    const templatePath = 'elevatorEskalator/eskalator/bapEskalator.docx';
    
    let content;
    try {
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
        content = fileBuffer;
    } catch (error) {
        console.error(`Gagal mengunduh template BAP Eskalator dari GCS:`, error);
        throw new Error('Template dokumen BAP Eskalator tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const v = data.visualInspection || {};
    const t = data.testing || {};
    
const renderData = {
        // Data Utama & Umum
        ...data.generalData,
        examinationType: data.examinationType,
        inspectionType: data.inspectionType,
        inspectionDate: data.inspectionDate,

        // Data Teknis (Ditulis secara eksplisit untuk kejelasan)
        equipmentType: data.technicalData?.equipmentType,
        technicalDatamanufacturer: data.technicalData?.technicalDatamanufacturer,
        technicalDatabrand: data.technicalData?.technicalDatabrand,
        technicalDatacountryAndYear: data.technicalData?.technicalDatacountryAndYear,
        technicalDataserialNumber: data.technicalData?.technicalDataserialNumber,
        technicalDatacapacity: data.technicalData?.technicalDatacapacity,
        technicalDataspeed: data.technicalData?.technicalDataspeed,
        technicalDatatransports: data.technicalData?.technicalDatatransports,

        // Pemeriksaan Visual
        isMachineRoomConditionAcceptable: formatBooleanToText(v.isMachineRoomConditionAcceptable, 'layak', 'tidak layak'),
        isPanelConditionAcceptable: formatBooleanToText(v.isPanelConditionAcceptable, 'baik', 'tidak baik'),
        islightingConditionisPitLightAcceptable: formatBooleanToText(v.islightingConditionisPitLightAcceptable, 'baik', 'tidak baik'),
        areSafetySignsAvailable: formatBooleanToText(v.areSafetySignsAvailable, 'tersedia', 'tidak tersedia'),

        // Pengujian
        testingisNdtThermographPanel: formatBooleanToText(t.testingisNdtThermographPanel, 'Baik', 'Tidak Baik'),
        testingareSafetyDevicesFunctional: formatBooleanToText(t.testingareSafetyDevicesFunctional, 'berfungsi', 'tidak berfungsi'),
        testingisLimitSwitchFunctional: formatBooleanToText(t.testingisLimitSwitchFunctional, 'berfungsi', 'tidak berfungsi'),
        testingisDoorSwitchFunctiona: formatBooleanToText(t.testingisDoorSwitchFunctiona, 'baik', 'tidak'),
        testingpitEmergencyStopStatusisAvailable: formatBooleanToText(t.testingpitEmergencyStopStatusisAvailable, 'tersedia', 'tidak tersedia'),
        testingpitEmergencyStopStatusisFunctional: formatBooleanToText(t.testingpitEmergencyStopStatusisFunctional, 'berfungsi dengan baik', 'tidak berfungsi dengan baik'),
        isEscalatorFunctionOk: formatBooleanToText(t.isEscalatorFunctionOk, 'baik', 'tidak baik'),
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    const ownerName = data.generalData?.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `BAP-Eskalator-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapEskalator };