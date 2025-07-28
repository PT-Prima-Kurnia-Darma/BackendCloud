'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { storage, BUCKET_NAME } = require('../../../../../utils/storage');

// Helper function to convert boolean to specific Indonesian text
const formatBooleanToText = (value, trueText, falseText) => {
    if (value === true) return trueText;
    if (value === false) return falseText;
    return `${trueText} / ${falseText}`; // Default if null or undefined
};

const createBapPetir = async (data) => {
    const templatePath = 'petirListrik/instalasiPetir/bapPetir.docx';

    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error('Gagal mengunduh template BAP Petir:', error);
        throw new Error('Template dokumen BAP Petir tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    const g = data.generalData || {};
    const t = data.technicalData || {};
    const res = data.testResults || {};
    const v = res.visualInspection || {};
    const m = res.measurement || {};

    const renderData = {
        examinationType: data.examinationType,
        inspectionDate: data.inspectionDate,
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        usageLocation: g.usageLocation,
        addressUsageLocation: g.addressUsageLocation,
        conductorType: t.conductorType,
        serialNumber: t.serialNumber,
        buildingHeight: t.buildingHeight,
        buildingArea: t.buildingArea,
        receiverHeight: t.receiverHeight,
        receiverCount: t.receiverCount,
        groundElectrodeCount: t.groundElectrodeCount,
        conductorDescription: t.conductorDescription,
        installer: t.installer,
        groundingResistance: t.groundingResistance,

        // --- NEW LOGIC FOR BOOLEAN HANDLING ---
        isSystemOverallGood: formatBooleanToText(v.isSystemOverallGood, 'Baik', 'Tidak Baik'),
        isReceiverConditionGood: formatBooleanToText(v.isReceiverConditionGood, 'Baik', 'Tidak Baik'),
        isReceiverPoleConditionGood: formatBooleanToText(v.isReceiverPoleConditionGood, 'Baik', 'Tidak Baik'),
        isConductorInsulated: formatBooleanToText(v.isConductorInsulated, 'terisolasi', 'tidak terisolasi'),
        isControlBoxAvailable: formatBooleanToText(v.isControlBoxAvailable, 'Tersedia', 'Tidak tersedia'),
        isControlBoxConditionGood: formatBooleanToText(v.isControlBoxConditionGood, 'Baik', 'Tidak baik'),

        conductorContinuityResult: m.conductorContinuityResult,
        measuredGroundingResistance: m.measuredGroundingResistance,
        measuredGroundingResistanceResult: formatBooleanToText(m.measuredGroundingResistanceResult, '(memenuhi syarat karena kurang dari 5 Ohm)', '(tidak memenuhi syarat karena lebih dari 5 Ohm)')
    };

    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const companyName = g.companyName?.replace(/\s+/g, '-') || 'Tidak Ada Nama Perusahaan';
    const fileName = `BAP Instalasi Penyalur Petir-${companyName}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapPetir };