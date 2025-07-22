'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

let privateKey = config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n');
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: { client_email: config.FIRESTORE_CLIENT_EMAIL, private_key: privateKey },
});
const BUCKET_NAME = 'tamplate-audit-riksauji';

const formatBooleanToText = (value, trueText, falseText) => {
    if (value === true) return trueText;
    if (value === false) return falseText;
    // Mengembalikan string kosong jika datanya null/undefined agar tidak menampilkan "trueText / falseText"
    return ''; 
};

const createBapListrik = async (data) => {
    const templatePath = 'petirListrik/InstalasiListrik/bapListrik.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP Listrik:', error);
        throw new Error('Template dokumen BAP Listrik tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const v = data.visualInspection || {};
    const test = data.testing || {};

    const renderData = {
        // DATA HEADER (jika ada di template)
        examinationType: data.examinationType,
        equipmentType: data.equipmentType,
        inspectionDate: data.inspectionDate,
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        usageLocation: g.usageLocation,
        addressUsageLocation: g.addressUsageLocation,

        // DATA TEKNIS (Nama key disesuaikan dengan placeholder)
        technicalDataPlnPower: t.technicalDataPlnPower,
        technicalDataGeneratorPower: t.technicalDataGeneratorPower,
        technicalDataLightingPower: t.technicalDataLightingPower,
        technicalDataPowerLoad: t.technicalDataPowerLoad,
        serialNumber: t.serialNumber,

        // HASIL RIKSA UJI (Nama key disesuaikan dengan placeholder)
        visualInspectionpanelRoomConditionisRoomClean: formatBooleanToText(v.isRoomClean, 'Bersih', 'Tidak Bersih'),
        visualInspectionpanelRoomConditionisRoomClearItems: formatBooleanToText(v.isRoomClearItems, 'Tidak Terdapat', 'Terdapat'),
        hasSingleLineDiagram: formatBooleanToText(v.hasSingleLineDiagram, 'Memiliki', 'Tidak memiliki'),
        hasProtectiveCover: formatBooleanToText(v.hasProtectiveCover, 'Tersedia', 'Tidak Tersedia'),
        isLabelingComplete: formatBooleanToText(v.isLabelingComplete, 'Sudah', 'Belum dilakukan'),
        isFireExtinguisherAvailable: formatBooleanToText(v.isFireExtinguisherAvailable, 'Tersedia', 'Tidak tersedia'),
        isThermographTestOk: formatBooleanToText(test.isThermographTestOk, 'Baik', 'Tidak Baik'),
        areSafetyDevicesFunctional: formatBooleanToText(test.areSafetyDevicesFunctional, 'Baik', 'Tidak Baik'),
        isVoltageBetweenPhasesNormal: formatBooleanToText(test.isVoltageBetweenPhasesNormal, 'normal', 'tidak normal'),
        isPhaseLoadBalanced: formatBooleanToText(test.isPhaseLoadBalanced, 'Seimbang', 'Tidak Seimbang'),
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyName = g.companyName?.replace(/\s+/g, '-') || 'UnknownCompany';
    const fileName = `BAP-Instalasi-Listrik-${companyName}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapListrik };