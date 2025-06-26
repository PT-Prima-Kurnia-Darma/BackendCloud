'use strict';

const bcrypt = require('bcrypt');
const Boom = require('@hapi/boom');

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
  deleteUser
};
