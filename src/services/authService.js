const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

let firestoreInitialized = false;

/**
 * Inisialisasi Firebase Admin SDK untuk Firestore.
 * Mendukung:
 * - Metode A: tiga variabel terpisah di env: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * - Metode B: satu var JSON string di env: FIREBASE_SERVICE_ACCOUNT
 */
function initializeFirestore() {
  if (firestoreInitialized) return;

  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_SERVICE_ACCOUNT,
  } = process.env;

  let credential;
  if (FIREBASE_SERVICE_ACCOUNT) {
    // Pendekatan B: parse JSON string
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      console.error('Gagal parse FIREBASE_SERVICE_ACCOUNT:', err);
      throw new Error('Format FIREBASE_SERVICE_ACCOUNT tidak valid. Pastikan JSON string valid di env.');
    }
    credential = admin.credential.cert(serviceAccount);
  } else if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    // Pendekatan A: variabel terpisah
    // PRIVATE_KEY di env umumnya berisi literal "\n", ganti menjadi newline actual:
    const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const serviceAccount = {
      project_id: FIREBASE_PROJECT_ID,
      client_email: FIREBASE_CLIENT_EMAIL,
      private_key: privateKey,
    };
    credential = admin.credential.cert(serviceAccount);
  } else {
    throw new Error('Kredensial Firebase belum di-set di env. Set FIREBASE_SERVICE_ACCOUNT atau ketiga variabel FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
  }

  admin.initializeApp({ credential });
  firestoreInitialized = true;
}


async function registerUser({ name, username, password }) {
  initializeFirestore();
  const db = admin.firestore();

  // Validasi basic
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Error('Field "name" wajib diisi dan tidak boleh kosong.');
  }
  if (!username || typeof username !== 'string' || !username.trim()) {
    throw new Error('Field "username" wajib diisi dan tidak boleh kosong.');
  }
  if (!password || typeof password !== 'string') {
    throw new Error('Field "password" wajib diisi.');
  }
  // Trim whitespace
  const nameTrimmed = name.trim();
  const usernameTrimmed = username.trim();
  // Panjang minimal password
  if (password.length < 6) {
    throw new Error('Password minimal 6 karakter.');
  }
  // Validasi format username: misal hanya huruf, angka, underscore, minimal 3 karakter
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(usernameTrimmed)) {
    throw new Error('Username hanya boleh berisi huruf, angka, underscore, panjang 3-30 karakter.');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const counterRef = db.collection('counters').doc('users');
  let newUserId;

  // Transaction: cek unik username, increment counter, simpan user
  await db.runTransaction(async (t) => {
    // 1. Cek apakah username sudah ada:
    const usersCollection = db.collection('users');
    const queryUsername = usersCollection.where('username', '==', usernameTrimmed).limit(1);
    const querySnap = await t.get(queryUsername);
    if (!querySnap.empty) {
      throw new Error('Username sudah digunakan. Silakan pilih username lain.');
    }

    // 2. Ambil counter
    const counterDoc = await t.get(counterRef);
    let current = 0;
    if (counterDoc.exists) {
      const data = counterDoc.data();
      if (typeof data.current === 'number') {
        current = data.current;
      }
    }
    newUserId = current + 1;
    // Update counter
    t.set(counterRef, { current: newUserId }, { merge: true });

    // 3. Simpan user baru
    const userRef = usersCollection.doc(newUserId.toString());
    const userData = {
      userId: newUserId,
      name: nameTrimmed,
      username: usernameTrimmed,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    t.set(userRef, userData);
  });

  // Kembalikan informasi minimal (tanpa password)
  return {
    userId: newUserId,
    name: nameTrimmed,
    username: usernameTrimmed,
  };
}

module.exports = {
  registerUser,
};
