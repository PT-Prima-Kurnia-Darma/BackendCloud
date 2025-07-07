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

// BARU: Helper function untuk mengubah boolean menjadi teks yang sesuai.
/**
 * @param {boolean | null | undefined} status Nilai boolean dari database.
 * @param {string} trueText Teks untuk ditampilkan jika statusnya true.
 * @param {string} falseText Teks untuk ditampilkan jika statusnya false.
 * @param {string} defaultText Teks untuk ditampilkan jika statusnya null atau undefined.
 * @returns {string}
 */
const formatBoolean = (status, trueText, falseText, defaultText) => {
    if (status === true) return trueText;
    if (status === false) return falseText;
    return defaultText;
};


/**
 * Membuat dokumen BAP (Berita Acara Pemeriksaan) elevator dari template.
 * @param {object} data - Objek data BAP lengkap dari Firestore.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>} Buffer dokumen dan nama filenya.
 */
const createBapElevator = async (data) => {
    const templatePathInBucket = 'elevatorEskalator/elevator/bapElevator.docx';

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
        nullGetter: () => "",
    });

    const renderData = {
        examinationType: data?.examinationType,
        equipmentType: data?.equipmentType,
        inspectionDate: data?.inspectionDate,

        ownerName: data.generalData?.ownerName,
        ownerAddress: data.generalData?.ownerAddress,
        nameUsageLocation: data.generalData?.nameUsageLocation,
        addressUsageLocation: data.generalData?.addressUsageLocation,

        elevatorType: data.technicalData?.elevatorType,
        manufacturerOrInstaller: data.technicalData?.manufacturerOrInstaller,
        brandOrType: data.technicalData?.brandOrType,
        countryAndYear: data.technicalData?.countryAndYear,
        serialNumber: data.technicalData?.serialNumber,
        capacity: data.technicalData?.capacity,
        speed: data.technicalData?.speed,
        floorsServed: data.technicalData?.floorsServed,

        // DIUBAH: Menggunakan helper 'formatBoolean' untuk mengubah boolean ke teks.
        isMachineRoomConditionAcceptable: formatBoolean(data.visualInspection?.isMachineRoomConditionAcceptable, 'layak', 'tidak layak', 'layak / tidak layak'),
        isPanelGoodCondition: formatBoolean(data.visualInspection?.isPanelGoodCondition, 'baik', 'tidak baik', 'baik / tidak baik'),
        isAparAvailableInPanelRoom: formatBoolean(data.visualInspection?.isAparAvailableInPanelRoom, 'Tersedia', 'Tidak tersedia', 'Tersedia / Tidak tersedia'),
        lightingCondition: formatBoolean(data.visualInspection?.lightingCondition, 'baik', 'tidak baik', 'baik / tidak baik'),
        isPitLadderAvailable: formatBoolean(data.visualInspection?.isPitLadderAvailable, 'tersedia', 'tidak tersedia', 'tersedia / tidak tersedia'),

        isNdtThermographPanelOk: formatBoolean(data.testing?.isNdtThermographPanelOk, 'Baik', 'Tidak Baik', 'Baik / Tidak Baik'),
        isArdFunctional: formatBoolean(data.testing?.isArdFunctional, 'berfungsi', 'tidak berfungsi', 'berfungsi / tidak berfungsi'),
        isGovernorFunctional: formatBoolean(data.testing?.isGovernorFunctional, 'berfungsi dengan baik', 'tidak baik', 'berfungsi dengan baik / tidak baik'),
        isSlingConditionOkByTester: formatBoolean(data.testing?.isSlingConditionOkByTester, 'Kondisi Baik', 'Kondisi Tidak Baik', 'Kondisi Baik / Tidak Baik'),
        limitSwitchTest: formatBoolean(data.testing?.limitSwitchTest, 'berfungsi', 'tidak berfungsi', 'berfungsi / tidak berfungsi'),
        isDoorSwitchFunctional: formatBoolean(data.testing?.isDoorSwitchFunctional, 'berfungsi dengan baik', 'tidak baik', 'berfungsi dengan baik / tidak baik'),
        pitEmergencyStopStatus: formatBoolean(data.testing?.pitEmergencyStopStatus, 'tersedia dan berfungsi dengan baik', 'tidak tersedia / tidak berfungsi', 'tersedia dan berfungsi dengan baik / tidak tersedia atau tidak berfungsi'),
        isIntercomFunctional: formatBoolean(data.testing?.isIntercomFunctional, 'berfungsi dengan baik', 'tidak baik', 'berfungsi dengan baik / tidak baik'),
        isFiremanSwitchFunctional: formatBoolean(data.testing?.isFiremanSwitchFunctional, 'berfungsi dengan baik', 'tidak baik', 'berfungsi dengan baik / tidak baik'),
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

    const ownerName = data.generalData?.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `BAP-Elevator-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createBapElevator,
};