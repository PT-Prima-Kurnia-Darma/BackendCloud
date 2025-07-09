'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Storage } = require('@google-cloud/storage');
const config = require('../../../../../config');

// Inisialisasi koneksi ke Google Cloud Storage (sama seperti generator elevator)
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

const BUCKET_NAME = 'tamplate-audit-riksauji'; // Pastikan nama bucket ini benar

// =================================================================================
// FUNGSI BANTUAN (Sama seperti generator elevator)
// =================================================================================

/**
 * Mengubah boolean menjadi teks 'Memenuhi Syarat' atau 'Tidak Memenuhi Syarat'.
 * @param {boolean} status - Nilai status dari item inspeksi.
 * @returns {string}
 */
function getSyaratStatus(status) {
    if (status === true) return 'Memenuhi Syarat';
    if (status === false) return 'Tidak Memenuhi Syarat';
    return ''; // Kembalikan string kosong jika data tidak ada
}

/**
 * Memformat objek inspeksi tunggal menjadi format yang siap dirender.
 * Di dalam template .docx, Anda akan menggunakan {placeholder.res} dan {placeholder.stat}.
 * @param {object} item - Objek inspeksi dengan properti 'result' dan 'status'.
 * @returns {{res: string, stat: string}}
 */
function formatItem(item) {
    // Jika item tidak ada, kembalikan objek dengan nilai default kosong
    if (!item) {
        return { res: '', stat: '' };
    }
    return {
        res: item.result || '',
        stat: getSyaratStatus(item.status),
    };
}


// =================================================================================
// FUNGSI GENERATOR UTAMA
// =================================================================================

/**
 * Membuat dokumen laporan eskalator dari template di GCS.
 * @param {object} data - Objek data audit eskalator lengkap dari Firestore.
 * @returns {Promise<{docxBuffer: Buffer, fileName: string}>} Buffer dokumen dan nama filenya.
 */
const createLaporanEskalator = async (data) => {
    // Path menuju template laporan eskalator di dalam bucket
    const templatePathInBucket = 'elevatorEskalator/eskalator/laporanEskalator.docx';

    let content;
    try {
        console.log(`Mengunduh template: gs://${BUCKET_NAME}/${templatePathInBucket}`);
        const [fileBuffer] = await storage.bucket(BUCKET_NAME).file(templatePathInBucket).download();
        content = fileBuffer;
        console.log('Template laporan eskalator berhasil diunduh.');
    } catch (error) {
        console.error(`Gagal mengunduh template eskalator dari GCS:`, error);
        throw new Error('Template dokumen eskalator tidak dapat diakses dari Cloud Storage.');
    }

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        // Jika tag tidak ditemukan, diganti string kosong agar tidak error
        nullGetter: () => "",
    });

    // Siapkan data untuk dirender.
    // Penggunaan optional chaining (?.) sangat penting untuk mencegah error
    // jika ada bagian data yang tidak lengkap di Firestore.
    const renderData = {
        // Data Umum
        ownerName: data?.ownerName,
        nameUsageLocation: data?.nameUsageLocation,
        permitNumber: data?.permitNumber,
        inspectionDate: data?.inspectionDate,
        equipmentType: data?.equipmentType,
        safetyObjectTypeAndNumber: data?.safetyObjectTypeAndNumber,
        examinationType: data?.examinationType,
        intendedUse: data?.intendedUse,

        // Data Teknis
        ...data?.technicalData,

        // Frame and Machine Room
        fmr_frame: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoomframeresult),
        fmr_support_beams: formatItem(data.inspectionAndTestingframeAndMachineRoom?.['inspectionAndTestingframeAndMachineRoomsupportBeams iresults']),
        fmr_room_condition: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomConditionresult),
        fmr_room_clearance: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomClearanceresult),
        fmr_room_lighting: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineRoomLightingresult),
        fmr_cover_plate: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoommachineCoverPlateresult),
        fmr_pit_condition: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitConditionresult),
        fmr_pit_clearance: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitClearanceresult),
        fmr_pit_step_cover: formatItem(data.inspectionAndTestingframeAndMachineRoom?.inspectionAndTestingframeAndMachineRoompitStepCoverPlateresult),
        
        // Drive Equipment
        de_drive_machine: formatItem(data.driveEquipment?.driveEquipmentdriveMachineresult),
        de_speed_under_30: formatItem(data.driveEquipment?.driveEquipmentspeedUnder30Degreesresult),
        de_speed_30_35: formatItem(data.driveEquipment?.driveEquipmentspeed30to35Degreesresult),
        de_travelator_speed: formatItem(data.driveEquipment?.driveEquipmenttravelatorSpeedresult),
        de_stop_dist_05: formatItem(data.driveEquipment?.driveEquipmentstoppingDistance0_5result),
        de_stop_dist_075: formatItem(data.driveEquipment?.driveEquipmentstoppingDistance0_75result),
        de_stop_dist_090: formatItem(data.driveEquipment?.driveEquipmentstoppingDistance0_90result),
        de_drive_chain: formatItem(data.driveEquipment?.driveEquipmentdriveChainresult),
        de_chain_strength: formatItem(data.driveEquipment?.driveEquipmentchainBreakingStrengthresult),

        // Steps or Pallets
        sp_step_material: formatItem(data.stepsOrPallets?.stepsOrPalletsstepMaterialresult),
        sp_step_dims: formatItem(data.stepsOrPallets?.stepsOrPalletsstepDimensionsresult),
        sp_pallet_dims: formatItem(data.stepsOrPallets?.stepsOrPalletspalletDimensionsresult),
        sp_step_surface: formatItem(data.stepsOrPallets?.stepsOrPalletsstepSurfaceresult),
        sp_step_levelness: formatItem(data.stepsOrPallets?.stepsOrPalletsstepLevelnessresult),
        sp_skirt_brush: formatItem(data.stepsOrPallets?.stepsOrPalletsskirtBrushresult),
        sp_step_wheels: formatItem(data.stepsOrPallets?.stepsOrPalletsstepWheelsresult),
        
        // Landing Area
        la_landing_plates: formatItem(data.landingArea?.landingArealandingPlatesresult),
        la_comb_teeth: formatItem(data.landingArea?.landingAreacombTeethresult),
        la_comb_condition: formatItem(data.landingArea?.landingAreacombConditionresult),
        la_landing_cover: formatItem(data.landingArea?.landingArealandingCoverresult),
        la_access_area: formatItem(data.landingArea?.landingArealandingAccessArearesult),

        // Balustrade
        b_panel_material: formatItem(data.balustrade?.balustradebalustradePanelmaterialresult),
        b_panel_height: formatItem(data.balustrade?.balustradebalustradePanelheightresult),
        b_side_pressure: formatItem(data.balustrade?.balustradebalustradePanelsidePressureresult),
        b_vertical_pressure: formatItem(data.balustrade?.balustradebalustradePanelverticalPressureresult),
        b_skirt_panel: formatItem(data.balustrade?.balustradeskirtPanelresult),
        b_skirt_flex: formatItem(data.balustrade?.balustradeskirtPanelFlexibilityresult),
        b_step_skirt_clearance: formatItem(data.balustrade?.balustradestepToSkirtClearanceresult),

        // Handrail
        h_condition: formatItem(data.handrail?.handrailhandrailConditionresult),
        h_speed_sync: formatItem(data.handrail?.handrailhandrailSpeedSynchronizationresult),
        h_width: formatItem(data.handrail?.handrailhandrailWidthresult),
        
        // Runway
        r_beam_strength: formatItem(data.runway?.runwaybeamStrengthAndPositionresult),
        r_pit_wall: formatItem(data.runway?.runwaypitWallConditionresult),
        r_frame_enclosure: formatItem(data.runway?.runwayescalatorFrameEnclosureresult),
        r_lighting: formatItem(data.runway?.runwaylightingresult),
        r_headroom: formatItem(data.runway?.runwayheadroomClearanceresult),
        r_balustrade_clearance: formatItem(data.runway?.runwaybalustradeToObjectClearanceresult),
        r_anti_climb: formatItem(data.runway?.runwayantiClimbDeviceHeightresult),
        r_ornament: formatItem(data.runway?.runwayornamentPlacementresult),
        r_outdoor_clearance: formatItem(data.runway?.runwayoutdoorClearanceresult),

        // Safety Equipment
        se_op_key: formatItem(data.safetyEquipment?.safetyEquipmentoperationControlKeyresult),
        se_emergency_stop: formatItem(data.safetyEquipment?.safetyEquipmentemergencyStopSwitchresult),
        se_step_chain: formatItem(data.safetyEquipment?.safetyEquipmentstepChainSafetyDeviceresult),
        se_drive_chain: formatItem(data.safetyEquipment?.safetyEquipmentdriveChainSafetyDeviceresult),
        se_step_safety: formatItem(data.safetyEquipment?.safetyEquipmentstepSafetyDeviceresult),
        se_handrail_safety: formatItem(data.safetyEquipment?.safetyEquipmenthandrailSafetyDeviceresult),
        se_reversal_stop: formatItem(data.safetyEquipment?.safetyEquipmentreversalStopDeviceresult),
        se_handrail_entry: formatItem(data.safetyEquipment?.safetyEquipmenthandrailEntryGuardresult),
        se_comb_plate: formatItem(data.safetyEquipment?.safetyEquipmentcombPlateSafetyDeviceresult),
        se_decking_brush: formatItem(data.safetyEquipment?.safetyEquipmentinnerDeckingBrushresult),
        se_stop_buttons: formatItem(data.safetyEquipment?.safetyEquipmentstopButtonsresult),

        // Electrical Installation
        ei_install_std: formatItem(data.electricalInstallation?.electricalInstallationinstallationStandardresult),
        ei_panel: formatItem(data.electricalInstallation?.electricalInstallationelectricalPanelresult),
        ei_grounding: formatItem(data.electricalInstallation?.electricalInstallationgroundingCableresult),
        ei_fire_alarm: formatItem(data.electricalInstallation?.electricalInstallationfireAlarmConnectionresult),

        // Outdoor Specifics
        os_water_pump: formatItem(data.outdoorSpecifics?.outdoorSpecificspitWaterPumpresult),
        os_weatherproof: formatItem(data.outdoorSpecifics?.outdoorSpecificsweatherproofComponentsresult),

        // User Safety
        us_no_bulky: formatItem(data.userSafety?.userSafetySignagenoBulkyItemsresult),
        us_no_jump: formatItem(data.userSafety?.userSafetySignagenoJumpingresult),
        us_unattended: formatItem(data.userSafety?.userSafetySignageunattendedChildrenresult),
        us_no_trolley: formatItem(data.userSafety?.userSafetySignagenoTrolleysOrStrollersresult),
        us_no_lean: formatItem(data.userSafety?.userSafetySignagenoLeaningresult),
        us_no_step_skirt: formatItem(data.userSafety?.userSafetySignagenoSteppingOnSkirtresult),
        us_soft_sole: formatItem(data.userSafety?.userSafetySignagesoftSoleFootwearWarningresult),
        us_no_sit: formatItem(data.userSafety?.userSafetySignagenoSittingOnStepsresult),
        us_hold_handrail: formatItem(data.userSafety?.userSafetySignageholdHandrailresult),

        // Kesimpulan
        testingEscalator: data?.testingEscalator,
        conclusion: data?.conclusion,
    };

    try {
        doc.render(renderData);
    } catch (error) {
        console.error("GAGAL RENDER DOKUMEN ESKALATOR:", error.message);
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

    // Membuat nama file yang dinamis dan aman
    const ownerName = data.ownerName?.replace(/\s+/g, '-') || 'UnknownOwner';
    const fileName = `Laporan-Eskalator-${ownerName}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanEskalator,
};