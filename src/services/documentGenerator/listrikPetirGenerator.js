'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

const createLaporanPetir = (data) => {
    // 1. Path ke template tetap sama
    const templatePath = path.resolve(__dirname, '../../templates/listrikdanpetir/petir/LaporanPenyaluranPetir.docx');
    
    // 2. Baca file template
    const content = fs.readFileSync(templatePath, 'binary');

    // 3. Buat instance PizZip
    const zip = new PizZip(content);

    // 4. Buat instance Docxtemplater
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    // 5. MEMPERSIAPKAN DATA DENGAN STRUKTUR YANG SESUAI UNTUK TEMPLATE
    // Meskipun docxtemplater bisa menangani nested object, kita akan meratakannya
    // agar sesuai dengan placeholder yang sudah ada di template Anda.
    // Ini adalah cara paling aman untuk memastikan semua data terisi.
    const renderData = {
        // Data utama
        ...data,

        // Data dari nested objects
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
        // 6. Lakukan rendering dengan data yang sudah disiapkan
        doc.render(renderData);
    } catch (error) {
        console.error("Error rendering document:", error);
        throw error;
    }

    // 7. Generate file
    const docxBuffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    // Buat nama file dinamis
    const fileName = `Laporan-Petir-${data.companyName.replace(/\s+/g, '-')}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanPetir,
};