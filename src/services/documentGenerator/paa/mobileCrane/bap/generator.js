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

// Helper untuk mengubah boolean menjadi teks yang sesuai untuk BAP
const formatBooleanToText = (status, trueText, falseText) => {
    if (status === true) return trueText;
    if (status === false) return falseText;
    return `${trueText} / ${falseText}`; // Default jika null atau undefined
};

const createBapMobileCrane = async (data) => {
    const templatePath = 'paa/mobileCrane/bapMobileCrane.docx';
    
    let content;
    try {
        [content] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
    } catch (error) {
        console.error(`Gagal mengunduh template BAP Mobile Crane:`, error);
        throw new Error('Template dokumen BAP Mobile Crane tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { nullGetter: () => "" });

    // Dekonstruksi data agar lebih aman
    const g = data.generalData || {};
    const t = data.technicalData || {};
    const res = data.inspectionResult || {};
    const vis = res.visualCheck || {};
    const fun = res.functionalTest || {};
    const load = fun.loadTest || {};
    const ndt = fun.ndtTest || {};

    const renderData = {
        // Data Utama
        examinationType: data.examinationType,
        subInspectionType: data.subInspectionType,
        inspectionDate: data.inspectionDate,
        
        // Data Umum
        ownerName: g.ownerName,
        ownerAddress: g.ownerAddress,
        userAddress: g.userAddress,
        
        // Data Teknis
        manufacturer: t.manufacturer,
        locationAndYearOfManufacture: t.locationAndYearOfManufacture,
        serialNumberUnitNumber: t.serialNumberUnitNumber,
        materialCertificateNumber: t.materialCertificateNumber,
        capacityWorkingLoad: t.capacityWorkingLoad,
        maxLiftingHeight: t.maxLiftingHeight,
        liftingSpeedMpm: t.liftingSpeedMpm,

        // Pemeriksaan Visual (dengan format teks)
        hasBoomDefects: formatBooleanToText(vis.hasBoomDefects, 'Terdapat', 'Tidak terdapat'),
        isNameplateAttached: formatBooleanToText(vis.isNameplateAttached, 'terpasang', 'tidak terpasang'),
        areBoltsAndNutsSecure: formatBooleanToText(vis.areBoltsAndNutsSecure, 'terpasang kokoh', 'tidak kokoh'),
        isSlingGoodCondition: formatBooleanToText(vis.isSlingGoodCondition, 'kondisi baik', 'tidak baik'),
        isHookGoodCondition: formatBooleanToText(vis.isHookGoodCondition, 'kondisi baik', 'tidak baik'),
        isSafetyLatchInstalled: formatBooleanToText(vis.isSafetyLatchInstalled, 'terpasang', 'tidak terpasang'),
        isTireGoodCondition: formatBooleanToText(vis.isTireGoodCondition, 'kondisi baik', 'tidak baik'),
        isWorkLampFunctional: formatBooleanToText(vis.isWorkLampFunctional, 'menyala', 'tidak menyala'),
        
        // Pengujian (dengan format teks)
        isForwardReverseFunctionOk: formatBooleanToText(fun.isForwardReverseFunctionOk, 'Baik', 'Tidak Baik'),
        isSwingFunctionOk: formatBooleanToText(fun.isSwingFunctionOk, 'Baik', 'Tidak Baik'),
        isHoistingFunctionOk: formatBooleanToText(fun.isHoistingFunctionOk, 'Baik', 'Tidak Baik'),
        
        // Uji Beban
        loadKg: load.loadKg,
        liftHeightMeters: load.liftHeightMeters,
        holdTimeSeconds: load.holdTimeSeconds,
        isResultGood: formatBooleanToText(load.isResultGood, 'Baik', 'Tidak Baik'), // Ganti nama variabel agar tidak bentrok
        
        // Uji NDT
        method: ndt.method,
        isNdtResultGood: formatBooleanToText(ndt.isResultGood, 'Baik', 'Tidak Baik'), // Ganti nama variabel agar tidak bentrok
    };

    // Di template .docx, ubah {isResultGood} pada baris NDT menjadi {isNdtResultGood}
    
    doc.render(renderData);

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer' });
    const ownerName = g.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `BAP-MobileCrane-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = { createBapMobileCrane };