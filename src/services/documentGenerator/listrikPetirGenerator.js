'use strict';

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');

// Fungsi ini akan menjadi "pabrik" untuk Laporan Petir
const createLaporanPetir = (data) => {
    // 1. Tentukan path ke file template
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

    // 5. Set data yang akan di-render ke template

    try {
        // 6. Lakukan rendering (mengganti placeholder dengan data)
        doc.render(data);
    } catch (error) {
        // Tangani error, misalnya jika ada placeholder yang tidak ditemukan
        console.error("Error rendering document:", error);
        throw error;
    }

    // 7. Generate file sebagai nodebuffer
    const docxBuffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });

    // Buat nama file yang dinamis
    const fileName = `Laporan-Petir-${data.companyName.replace(/\s+/g, '-')}-${data.id}.docx`;

    return { docxBuffer, fileName };
};

module.exports = {
    createLaporanPetir,
};