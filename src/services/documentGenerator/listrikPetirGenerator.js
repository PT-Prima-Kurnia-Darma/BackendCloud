'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../config'); // Impor konfigurasi

// Logika untuk memformat private key, konsisten dengan file firestore.js
let privateKey = config.FIRESTORE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

// Inisialisasi GCS dengan kredensial dari Service Account yang sama
const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: privateKey,
    },
});

// Ganti dengan nama bucket Anda yang sebenarnya
const bucketName = 'tamplate-audit-riksauji'; 

/**
 * Membuat dokumen laporan instalasi petir dari template di GCS.
 * @param {object} data - Objek data lengkap hasil audit dari Firestore.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>}
 */
const createLaporanPetir = async (data) => {
    // Path lengkap ke file template di dalam GCS Bucket.
    const templatePathInBucket = 'listrikdanPetir/petir/LaporanPenyaluranPetir.docx';

    let content;
    try {
        console.log(`Mengunduh template dari: gs://${bucketName}/${templatePathInBucket}`);
        const [fileBuffer] = await storage.bucket(bucketName).file(templatePathInBucket).download();
        content = fileBuffer;
        console.log('Template berhasil diunduh.');
    } catch (error) {
        console.error(`Gagal mengunduh template dari GCS. Pastikan path dan izin sudah benar.`, error);
        throw new Error('Template dokumen tidak dapat diakses dari Cloud Storage.');
    }

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    
    // PERSIAPKAN DATA RATA (FLAT) SECARA EKSPLISIT
    // Ini memastikan data yang dikirim ke template memiliki struktur yang pasti dan sederhana,
    // sehingga placeholder di Word cukup menggunakan nama yang simpel (e.g., {height}).
    const renderData = {
        // Data utama disalin langsung
        ...data,

        // Data dari nested objects diratakan
        typeTerminalWater: data.terminal_water.typeTerminalWater,
        height: data.terminal_water.protectedBuilding.height,
        size: data.terminal_water.protectedBuilding.size,
        total: data.terminal_water.total,
        visualConditionWaterTerminal: data.terminal_water.visualConditionWaterTerminal,
        heightReceiver: data.terminal_water.heightReceiver,
        
        typeDownConductor: data.down_conductor.typeDownConductor,
        totalDownConductor: data.down_conductor.totalDownConductor,
        sizeDownConductor: data.down_conductor.sizeDownConductor,
        
        typeEarthElectrode: data.earth_electrode.typeEarthElectrode,
        sizeEarthElectrode: data.earth_electrode.sizeEarthElectrode
    };

    try {
        // Render menggunakan data yang sudah diratakan
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN:", error.message);
        throw error;
    }

    const docxBuffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    const fileName = `Laporan-Petir-${data.companyName.replace(/\s+/g, '-')}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanPetir,
};