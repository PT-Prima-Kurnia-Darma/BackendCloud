'use strict';

const bcrypt = require('bcrypt');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const config = require('../../config');

const register = async (firestore, payload) => {
  const { name, username, password } = payload;
  const usersRef = firestore.collection('users');

  // 1. Cek apakah username sudah terdaftar
  const querySnap = await usersRef.where('username', '==', username).limit(1).get();
  if (!querySnap.empty) {
    throw Boom.conflict('Username sudah terdaftar');
  }

  // 2. Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Simpan data user
  const newDocRef = usersRef.doc();
  const userId = newDocRef.id;

  const createdAt = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString();
  const userData = {
    name,
    username,
    passwordHash: hashedPassword,
    userId,
    createdAt,
  };

  await newDocRef.set(userData);

  return {
    id: userId,
    name,
    username,
    createdAt,
  };
};

const login = async (firestore, { username, password }) => {
  const usersRef = firestore.collection('users');
  const querySnap = await usersRef.where('username', '==', username).limit(1).get();
  if (querySnap.empty) {
    throw Boom.unauthorized('Username atau password salah');
  }
  const doc = querySnap.docs[0];
  const data = doc.data();

  const match = await bcrypt.compare(password, data.passwordHash);
  if (!match) {
    throw Boom.unauthorized('Username atau password salah');
  }

  const payload = {
    id: doc.id,
    username: data.username,
    name: data.name,
  };

  // Generate JWT dengan exp 7 hari
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });

  return { user: payload, token };
};

const updateProfile = async (firestore, userId, { name, username, oldPassword, newPassword }) => {
  const userRef = firestore.collection('users').doc(userId);
  const doc = await userRef.get();
  if (!doc.exists) {
    throw Boom.notFound('User tidak ditemukan');
  }
  const data = doc.data();

  const isNameSame = name && name === data.name;
  const isUsernameSame = username && username === data.username;

  if (isNameSame && isUsernameSame) {
    throw Boom.badRequest('Data pengguna tidak boleh sama seperti sebelumnya');
  }
  if (isNameSame) {
    throw Boom.badRequest('Name sama seperti sebelumnya');
  }
  if (isUsernameSame) {
    throw Boom.badRequest('Username sama seperti sebelumnya');
  }
  
  if (oldPassword && oldPassword.length < 6) {
    throw Boom.badRequest('Password minimal 6 karakter');
  }
  if (newPassword && newPassword.length < 6) {
    throw Boom.badRequest('Password minimal 6 karakter');
  }

  if (oldPassword && newPassword) {
    if (oldPassword === newPassword) {
      throw Boom.badRequest('Password lama dan baru tidak bole sama');
    }
    const match = await bcrypt.compare(oldPassword, data.passwordHash);
    if (!match) {
      throw Boom.unauthorized('Password lama salah');
    }
  } else if (newPassword && !oldPassword) {
  
      throw Boom.badRequest('Password lama harus diisi untuk mengubah password');
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (username) {

    const usersRef = firestore.collection('users');
    const exists = await usersRef.where('username', '==', username).limit(1).get();
    if (!exists.empty && exists.docs[0].id !== userId) {
      throw Boom.conflict('Username sudah digunakan');
    }
    updateData.username = username;
  }
  if (newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    updateData.passwordHash = hashed;
  }

  if (Object.keys(updateData).length === 0) {
      throw Boom.badRequest('Tidak ada data yang diperbarui');
  }

  // --- LAKUKAN UPDATE ---
  await userRef.update(updateData);

  const updatedDoc = await userRef.get();
  const updatedData = updatedDoc.data();

  return {
    id: updatedDoc.id,
    name: updatedData.name,
    username: updatedData.username,
  };
}

const logout = async (firestore, token) => {
  // decode tanpa verifikasi supaya bisa dapat exp
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) {
    throw Boom.badRequest('Token tidak valid');
  }

  const blacklistRef = firestore.collection('token_blacklist').doc(token);
  // simpan dengan field exp (sebagai UNIX timestamp)
  await blacklistRef.set({ exp: decoded.exp });
};

const deleteUser = async (firestore, id) => {
  const userRef = firestore.collection('users').doc(id);
  const doc = await userRef.get();
  if (!doc.exists) {
    throw Boom.notFound('User tidak ditemukan');
  }
  await userRef.delete();
  return;
};

const validateToken = async (firestore, token) => {
  try {

    jwt.verify(token, config.JWT_SECRET);

    const blackDoc = await firestore.collection('token_blacklist').doc(token).get();
    if (blackDoc.exists) {
      throw Boom.unauthorized('Token invalid');
    }

    return true;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw Boom.unauthorized('Token kadaluarsa');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw Boom.unauthorized('token invalid');
    }
    throw error;
  }
};

module.exports = {
  register,
  deleteUser,
  login,
  updateProfile,
  logout,
  validateToken
};