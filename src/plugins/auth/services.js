'use strict';

const bcrypt = require('bcrypt');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

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
  const createdAt = new Date().toISOString();
  const userData = {
    name,
    username,
    passwordHash: hashedPassword,
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

  // Payload minimal untuk token
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

  // 1. Verifikasi oldPassword jika user ingin mengganti password
  if (oldPassword && newPassword) {
    const match = await bcrypt.compare(oldPassword, data.passwordHash);
    if (!match) {
      throw Boom.unauthorized('Password lama salah');
    }
  }

  // 2. Persiapkan update object
  const updateData = {};
  if (name) updateData.name = name;
  if (username) {
    // Cek duplikasi username
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

  // 3. Lakukan update
  await userRef.update(updateData);
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

module.exports = {
  register,
  deleteUser,
  login,
  updateProfile
};
