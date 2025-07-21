'use strict';


const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');

const AUDIT_COLLECTIONS = [
  'paa',
  'petirListrik',
  'elevatorEskalator'
];

const fetchCollectionData = async (collectionName) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) {
      return [];
    }
    // Menambahkan field `id` dan `tipeAudit` ke setiap dokumen.
    return snapshot.docs.map(doc => ({
      id: doc.id,
      tipeAudit: collectionName,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    // Mengembalikan array kosong jika satu koleksi gagal, agar tidak menghentikan semua.
    return [];
  }
};

const getCombinedAudits = async ({ page, size }) => {
  try {
    // 1. Ambil data dari semua koleksi secara paralel untuk efisiensi.
    const promises = AUDIT_COLLECTIONS.map(collection => fetchCollectionData(collection));
    const resultsFromCollections = await Promise.all(promises);

    // 2. Gabungkan semua data menjadi satu array besar.
    const allAudits = resultsFromCollections.flat();

    // 3. Urutkan berdasarkan field `createdAt` (dari terbaru ke terlama).
    allAudits.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
    });

    const totalItems = allAudits.length;
    const totalPages = Math.ceil(totalItems / size) || 1; // Jika 0 item, tetap 1 halaman
    const startIndex = (page - 1) * size;

    // Cek jika halaman yang diminta melebihi total halaman yang ada
    if (page > totalPages && totalItems > 0) {
      throw Boom.badRequest(`Halaman yang diminta (${page}) melebihi total halaman yang tersedia (${totalPages}).`);
    }
    
    const paginatedAudits = allAudits.slice(startIndex, startIndex + size);

    return {
      audits: paginatedAudits,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalItems,
        totalPages,
      }
    };
  } catch (error) {
    if (Boom.isBoom(error)) {
      throw error;
    }
    console.error('Error in getCombinedAudits service:', error);
    throw Boom.internal('Terjadi kesalahan internal saat memproses data audit.');
  }
};

module.exports = { getCombinedAudits };