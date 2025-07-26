# 1. Gunakan base image Node.js yang sesuai dengan versi pengembangan
FROM node:22-slim

# 2. Tetapkan direktori kerja di dalam container
WORKDIR /usr/src/app

# 3. Salin package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# 4. Instal semua dependency proyek
RUN npm install

# 5. Salin seluruh sisa kode aplikasi ke direktori kerja
COPY . .

# 6. Buka port yang digunakan oleh aplikasi Hapi.js Anda
EXPOSE 8080

# 7. Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "npm", "start" ]