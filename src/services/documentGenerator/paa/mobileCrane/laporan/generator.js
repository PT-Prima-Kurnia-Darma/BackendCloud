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
const BUCKET_NAME = 'tamplate-audit-riksauji';

// Fungsi bantuan untuk mengubah status boolean menjadi simbol centang (√) atau string kosong
const getCheckmark = (status) => (status === true ? '√' : '');
const getOppositeCheckmark = (status) => (status === false ? '√' : '');

const createLaporanMobileCrane = async (data) => {
    // Pastikan path ini sesuai dengan lokasi template di GCS Anda
    const templatePath = 'paa/mobileCrane/laporanMobileCrane.docx';

    let content;
    try {
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePath).download();
        content = fileBuffer;
    } catch (error) {
        console.error('Gagal mengunduh template Laporan Mobile Crane:', error);
        throw new Error('Template dokumen Laporan Mobile Crane tidak dapat diakses.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => "", // Ganti nilai null/undefined dengan string kosong
    });
    
    // Siapkan data untuk dirender
    const i = data.inspectionAndTesting || {};
    const renderData = {
        // Header & Data Umum
        ...data.generalData,
        ...data,

        // Data Teknis
        ...data.technicalData,
    };

    // Loop melalui semua kunci di inspectionAndTesting untuk memetakan status ke simbol centang
    for (const key in i) {
        if (Object.hasOwnProperty.call(i, key) && i[key] && typeof i[key] === 'object') {
            renderData[`${key}Memenuhi`] = getCheckmark(i[key].status);
            renderData[`${key}TidakMemenuhi`] = getOppositeCheckmark(i[key].status);
            renderData[`${key}Result`] = i[key].result || '';
        }
    }

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN:", error.message);
        // Log error yang lebih detail untuk debugging
        const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        throw error;
    }

    const docxBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    const ownerName = data.generalData?.generalDataOwnerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `Laporan-MobileCrane-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanMobileCrane,
};