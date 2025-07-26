'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi GCS
let privateKey = config.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n');
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: { client_email: config.FIRESTORE_CLIENT_EMAIL, private_key: privateKey },
});
const BUCKET_NAME = 'audit-riksauji';

// Fungsi helper untuk mengubah boolean menjadi teks yang sesuai
const formatBooleanToText = (status, trueText, falseText) => {
    if (status === true) return trueText;
    if (status === false) return falseText;
    return `${trueText} / ${falseText}`; // Default jika null
};

const createBapGantryCrane = async (data) => {
    const templatePath = 'paa/gantryCrane/bapGantryCrane.docx';
    
    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error(`Gagal mengunduh template BAP Gantry Crane:`, error);
        throw new Error('Template dokumen BAP Gantry Crane tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    // Dekonstruksi data agar lebih aman
    const g = data.generalData || {};
    const t = data.technicalData || {};
    const res = data.inspectionResult || {};
    const v = res.visualCheck || {};
    const f = res.functionalTest || {};
    const ndt = res.ndtTest || {};
    const load = res.loadTest || {};

    const renderData = {
        // Data Utama
        examinationType: data.examinationType,
        inspectionType: data.inspectionType,
        subInspectionType: data.subInspectionType,
        inspectionDate: data.inspectionDate,
        
        // Data Umum
        companyName: g.companyName,
        companyLocation: g.companyLocation,
        usageLocation: g.usageLocation,
        location: g.location,
        
        // Data Teknis
        brandOrType: t.brandOrType,
        manufacturerHoist: t.manufacturerHoist,
        manufactureStructure: t.manufactureStructure,
        manufactureYear: t.manufactureYear,
        manufactureCountry: t.manufactureCountry,
        serialNumber: t.serialNumber,
        maxLiftingCapacityKg: t.maxLiftingCapacityKg,
        liftingSpeedMpm: t.liftingSpeedMpm,

        // Pemeriksaan Visual (dengan format teks)
        isMainStructureGood: formatBooleanToText(v.isMainStructureGood, 'tidak terdapat', 'terdapat'),
        areBoltsAndNutsSecure: formatBooleanToText(v.areBoltsAndNutsSecure, 'kokoh', 'tidak kokoh'),
        isWireRopeGoodCondition: formatBooleanToText(v.isWireRopeGoodCondition, 'baik', 'tidak baik'),
        isHookGoodCondition: formatBooleanToText(v.isHookGoodCondition, 'baik', 'tidak baik'),
        isGoodCondition: formatBooleanToText(v.isGearboxGoodCondition, 'baik', 'tidak baik'),
        hasOilLeak: formatBooleanToText(v.hasGearboxOilLeak, 'terdapat', 'tidak terdapat'),
        isWarningLampGoodCondition: formatBooleanToText(v.isWarningLampGoodCondition, 'baik', 'tidak baik'),
        isCapacityMarkingDisplayed: formatBooleanToText(v.isCapacityMarkingDisplayed, 'terpasang', 'tidak terpasang'),
        
        // Pengujian (dengan format teks)
        isForwardReverseFunctionOk: formatBooleanToText(f.isForwardReverseFunctionOk, 'baik', 'tidak baik'),
        isHoistingFunctionOk: formatBooleanToText(f.isHoistingFunctionOk, 'baik', 'tidak baik'),
        isLimitSwitchFunctional: formatBooleanToText(f.isLimitSwitchFunctional, 'berfungsi', 'tidak berfungsi'),
        
        // Uji NDT
        method: ndt.method,
        isResultGood: formatBooleanToText(ndt.isNdtResultGood, 'Baik', 'Tidak Baik'), // Placeholder {isResultGood} pertama
        
        // Uji Beban
        loadKg: load.loadKg,
        liftHeightMeters: load.liftHeightMeters,
        holdTimeSeconds: load.holdTimeSeconds,
        // Placeholder {isResultGood} kedua. Docxtemplater akan mengisi keduanya dengan nilai yang sama.
        // Jika perlu nilai berbeda, placeholder di template harus dibedakan.
    };
    
    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const ownerName = g.companyName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `BAP-GantryCrane-${ownerName}-${data.id || 'new'}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapGantryCrane };