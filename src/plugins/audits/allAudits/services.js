// services.js

const db = require('../../../utils/firestore');
const Boom = require('@hapi/boom');

const AUDIT_COLLECTIONS = [
  'paa',
  'petirListrik',
  'elevatorEskalator',
  'proteksiKebakaran',
  'ptp',
  'pubt'
];

// FUNGSI YANG DIMODIFIKASI
const fetchCollectionData = async (collectionName, limit) => {
  try {
    // Gunakan orderBy dan limit untuk efisiensi
    const snapshot = await db.collection(collectionName)
      .orderBy('createdAt', 'desc') // Urutkan di Firestore (menggunakan index)
      .limit(limit) // Batasi jumlah dokumen yang diambil
      .get();
      
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
};

// FUNGSI YANG DIMODIFIKASI
const getCombinedAudits = async ({ page, size }) => {
  try {
    // Tentukan batas pengambilan data dari setiap koleksi.
    // Kita ambil lebih banyak dari 'size' untuk memastikan data terbaru tidak terlewat
    // saat menggabungkan dari berbagai koleksi.
    const limitPerCollection = (page * size) + 20; // Ambil data hingga halaman saat ini + buffer 20 item

    const promises = AUDIT_COLLECTIONS.map(collection => fetchCollectionData(collection, limitPerCollection));
    const resultsFromCollections = await Promise.all(promises);

    const allAudits = resultsFromCollections.flat();

    // Urutkan kembali di memory (karena data berasal dari koleksi berbeda)
    allAudits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalItems = allAudits.length; // Perhatikan: totalItems di sini adalah total dari yang di-fetch, bukan total di DB
    const totalPages = Math.ceil(totalItems / size) || 1;
    const startIndex = (page - 1) * size;

    if (page > totalPages && totalItems > 0) {
      throw Boom.badRequest(`Halaman yang diminta (${page}) melebihi total halaman yang tersedia (${totalPages}).`);
    }
    
    const paginatedAudits = allAudits.slice(startIndex, startIndex + size);

    // CATATAN: Karena kita tidak mengambil SEMUA data, `totalItems` dan `totalPages` di sini
    // mungkin tidak merepresentasikan jumlah total sebenarnya di database,
    // namun ini adalah pendekatan paling efisien tanpa mengubah struktur database.
    return {
      audits: paginatedAudits,
      pagination: {
        currentPage: page,
        pageSize: size,
        // Untuk totalItems yang akurat, Anda perlu melakukan query count terpisah yang bisa jadi mahal.
        // Untuk saat ini, kita bisa menyajikan total berdasarkan data yang diambil.
        totalItems: totalItems, 
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