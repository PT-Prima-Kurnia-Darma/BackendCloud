'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi koneksi ke Google Cloud Storage
let privateKey = config.FIRESTORE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

const storage = new Storage({
    projectId: config.FIRESTORE_PROJECT_ID,
    credentials: {
      client_email: config.FIRESTORE_CLIENT_EMAIL,
      private_key: privateKey,
    },
});

const bucketName = 'tamplate-audit-riksauji';

/**
 * Membuat dokumen BAP (Berita Acara Pemeriksaan) elevator dari template.
 * @param {object} data - Objek data BAP lengkap dari Firestore.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>} Buffer dokumen dan nama filenya.
 */
const createBapElevator = async (data) => {
    const templatePathInBucket = 'elevatorEskalator/elevator/bapElevator.docx'; // Sesuaikan dengan path template Anda di GCS

    let content;
    try {
        console.log(`Mengunduh template BAP: gs://${bucketName}/${templatePathInBucket}`);
        const [fileBuffer] = await storage.bucket(bucketName).file(templatePathInBucket).download();
        content = fileBuffer;
        console.log('Template BAP berhasil diunduh.');
    } catch (error) {
        console.error(`Gagal mengunduh template BAP dari GCS:`, error);
        throw new Error('Template dokumen BAP tidak dapat diakses dari Cloud Storage.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => "", // Ganti tag yang tidak ada datanya dengan string kosong
    });

    // Menyiapkan data untuk dirender ke dalam template docx.
    // Penggunaan optional chaining (?.) memastikan kode tidak error jika ada objek atau properti yang hilang.
    const renderData = {
        examinationType: data?.examinationType,
        equipmentType: data?.equipmentType,
        inspectionDate: data?.inspectionDate,

        // Data Umum
        ownerName: data.generalData?.ownerName,
        ownerAddress: data.generalData?.ownerAddress,
        nameUsageLocation: data.generalData?.nameUsageLocation,
        addressUsageLocation: data.generalData?.addressUsageLocation,

        // Data Teknis
        elevatorType: data.technicalData?.elevatorType,
        manufacturerOrInstaller: data.technicalData?.manufacturerOrInstaller,
        brandOrType: data.technicalData?.brandOrType,
        countryAndYear: data.technicalData?.countryAndYear,
        serialNumber: data.technicalData?.serialNumber,
        capacity: data.technicalData?.capacity,
        speed: data.technicalData?.speed,
        floorsServed: data.technicalData?.floorsServed,

        // Pemeriksaan Visual
        isMachineRoomConditionAcceptable: data.visualInspection?.isMachineRoomConditionAcceptable,
        isPanelGoodCondition: data.visualInspection?.isPanelGoodCondition,
        isAparAvailableInPanelRoom: data.visualInspection?.isAparAvailableInPanelRoom,
        lightingCondition: data.visualInspection?.lightingCondition,
        isPitLadderAvailable: data.visualInspection?.isPitLadderAvailable,

        // Pengujian
        isNdtThermographPanelOk: data.testing?.isNdtThermographPanelOk,
        isArdFunctional: data.testing?.isArdFunctional,
        isGovernorFunctional: data.testing?.isGovernorFunctional,
        isSlingConditionOkByTester: data.testing?.isSlingConditionOkByTester,
        limitSwitchTest: data.testing?.limitSwitchTest,
        isDoorSwitchFunctional: data.testing?.isDoorSwitchFunctional,
        pitEmergencyStopStatus: data.testing?.pitEmergencyStopStatus,
        isIntercomFunctional: data.testing?.isIntercomFunctional,
        isFiremanSwitchFunctional: data.testing?.isFiremanSwitchFunctional,
    };

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN BAP:", error.message);
        const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({error: e}));
        throw error;
    }

    const docxBuffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    // Membuat nama file yang aman
    const ownerName = data.generalData?.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `BAP-Elevator-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createBapElevator,
};