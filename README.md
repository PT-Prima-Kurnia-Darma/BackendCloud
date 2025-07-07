# Sistem Backend Audit Riksa Uji PT Prima Kurnia Darma

Sistem ini menggunakan **Node.js** dengan framework **Hapi.js** serta database **FireStore** untuk mengelola data sistem Manajemen Audit Riksa Uji.

## Fitur

- Register Pengguna
- Login Pengguna
- Logout Pengguna
- Delete Pengguna
- Modifikasi Data Pengguna
- Validasi JWT
- CRUD Elevator dan Eskalator (Laporan dan BAP)

## Start Project

**Install Dependecies**

```json
npm i
```

## File Configuration

**.env**

```json
# Server Configuration
PORT=
HOST=
JWT_SECRET=
LLM_API_KEY

# Firestore service account credentials
FIRESTORE_PROJECT_ID=
FIRESTORE_CLIENT_EMAIL=
FIRESTORE_PRIVATE_KEY=
```

## API EndPoint

### Fitur Autentifikasi

#### Register

**URL:**
`/auth/register`
**Method:**
`POST`

**Body Request**

```json
{
  "name": "Nama Lengkap",
  "username": "usernamebaru",
  "password": "passwordrahasia"
}
```

**Response:**

- **Success:**

  ```json
  {
    "status": "success",
    "message": "Registrasi berhasil",
    "data": {
      "id": "userIdBaru",
      "name": "Nama Lengkap",
      "username": "usernamebaru",
      "createdAt": "2023-10-27T10:00:00.000Z"
    }
  }
  ```

- **Failur (409 Conflict - Username sudah ada)**

  ```json
  {
    "status": "error",
    "message": "Username sudah terdaftar"
  }
  ```

- **Failure (400 Bad Request - Validasi gagal)**
  ```json
  {
    "status": "error",
    "message": "Name minimal 3 karakter"
  }
  ```

#### Login

**URL:**
`/auth/login`
**Method:**
`POST`

**Body Request**

```json
{
  "username": "usernamebaru",
  "password": "passwordrahasia"
}
```

**Response:**

- **Success (200 OK)**

  ```json
  {
    "status": "success",
    "message": "Login berhasil",
    "data": {
      "user": {
        "id": "userId",
        "username": "usernamebaru",
        "name": "Nama Lengkap"
      },
      "token": "jwt.token.panjang"
    }
  }
  ```

- **Failur (401 Unauthorized - Kredensial salah)**
  ```json
  {
    "status": "error",
    "message": "Username atau password salah"
  }
  ```

#### Logout

**URL:**
`/auth/logout`
**Method:**
`POST`
**Headers**
`Authorization: Bearer jwt.token.panjang`

**Response:**

- **Success (200 OK)**

  ```json
  {
    "status": "success",
    "message": "Logout berhasil"
  }
  ```

- **Failur (401 Unauthorized - Kredensial salah)**
  ```json
  {
    "status": "error",
    "message": "Missing authentication"
  }
  ```

#### Modifikasi Pengguna

**URL:**
`/auth/change`
**Method:**
`PUT`
**Headers**
`Authorization: Bearer jwt.token.panjang`

**Body Request**

```json
{
  "name": "Nama Baru",
  "username": "usernamebaru_diubah",
  "oldPassword": "pasword lama",
  "newPassword": "password baru"
}
```

**Response:**

- **Success (200 OK - Update seluruh data)**

  ```json
  {
    "status": "success",
    "message": "Profil berhasil diperbarui",
    "data": {
      "username": "username new",
      "name": "name new",
      "userId": "id"
    }
  }
  ```

- **Success (200 OK - Update Username)**

  ```json
  {
    "status": "success",
    "message": "Profil berhasil diperbarui",
    "data": {
      "username": "name",
      "userId": "id"
    }
  }
  ```

- **Success (200 OK - Update Name)**

  ```json
  {
    "status": "success",
    "message": "Profil berhasil diperbarui",
    "data": {
      "name": "name",
      "userId": "id"
    }
  }
  ```

- **Success (200 OK - Update Password)**

  ```json
  {
    "status": "success",
    "message": "Profil berhasil diperbarui",
    "data": {
      "userId": "id"
    }
  }
  ```

- **Failur (401 Unauthorized - Kata sandi lama salah)**

  ```json
  {
    "status": "error",
    "message": "Password lama salah"
  }
  ```

- **Failur (409 Conflict - Username baru sudah digunakan)**

  ```json
  {
    "status": "error",
    "message": "Username sudah digunakan"
  }
  ```

- **Failur (404 Not Found - Pengguna tidak ditemukan)**

  ```json
  {
    "status": "error",
    "message": "User tidak ditemukan"
  }
  ```

- **Failur (400 Bad Request - Password tidak boleh sama)**

  ```json
  {
    "status": "error",
    "message": "Password lama dan baru tidak bole sama"
  }
  ```

- **Failur (400 Bad Request - Data tidak boleh sama)**

  ```json
  {
    "status": "error",
    "message": "Data pengguna tidak boleh sama seperti sebelumnya"
  }
  ```

- **Failur (400 Bad Request - Username tidak boleh sama)**

  ```json
  {
    "status": "error",
    "message": "Username tidak boleh sama seperti sebelumnya"
  }
  ```

- **Failur (400 Bad Request - Name tidak boleh sama)**

  ```json
  {
    "status": "error",
    "message": "Name tidak boleh sama seperti sebelumnya"
  }
  ```

- **Failur (400 Bad Request - Password minimal 6 karakter)**
  ```json
  {
    "status": "error",
    "message": "Name tidak boleh sama seperti sebelumnya"
  }
  ```

#### Delete Pengguna

**URL:**
`/auth/delete{id}`
**Method:**
`DELETE`

**Response:**

- **Success (200 OK)**

  ```json
  {
    "status": "success",
    "message": "User berhasil dihapus"
  }
  ```

- **Failure (404 Not Found - Pengguna tidak ditemukan)**
  ```json
  {
    "status": "error",
    "message": "User tidak ditemukan"
  }
  ```

#### Validasi Token

**URL:**
`/auth/validateToken`
**Method:**
`POST`

**Body Request**

```json
{
  "token": "jwt token"
}
```

**Response:**

- **Success (200 OK)**

  ```json
  {
    "status": "success",
    "message": "token valid"
  }
  ```

- **Failure (404 Not Found - Pengguna tidak ditemukan)**

  ```json
  {
   "status": "error",
   "message": "token invalid"
  }
  ```



### CRUD Audit

#### CRUD Elevator dan Eskalator (Laporan dan BAP)

##### Laporan Elevator

##### POST Laporan
**URL:**
`/elevatorEskalator/elevator/laporan`
**Method:**
`POST`

**Body Request**

  ```json
  {
    "inspectionType": "Elevator dan Eskalator",
    "subInspectionType": "Elevator",
    "examinationType": "Pemeriksaan dan Pengujian Berkala",
    "equipmentType": "Elevator Penumpang",
    "generalData": {
      "ownerName": "PT ANJAY",
      "ownerAddress": "",
      "nameUsageLocation": "",
      "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
      "manufacturerOrInstaller": "PT Elevator Maju Jaya",
      "elevatorType": "Traction",
      "brandOrType": "MajuLift Pro-X",
      "countryAndYear": "Jepang / 2022",
      "serialNumber": "MLPX-2022-12345",
      "capacity": "1000 kg / 15 orang",
      "speed": "150 m/min",
      "floorsServed": "20 lantai (1-20)",
      "permitNumber": "SKP-ELEV-001/2022",
      "inspectionDate": "2024-07-15"
    },
    "technicalDocumentInspection": {
      "designDrawing": true,
      "technicalCalculation": true,
      "materialCertificate": true,
      "controlPanelDiagram": true,
      "asBuiltDrawing": true,
      "componentCertificates": true,
      "safeWorkProcedure": true
    },
    "inspectionAndTesting": {
      "machineRoomAndMachinery": {
        "machineMounting": { "result": "Tidak ada getaran berlebih", "status": true },
        "mechanicalBrake": { "result": "Berfungsi dengan baik", "status": true },
        "electricalBrake": { "result": "Switch berfungsi normal", "status": true },
        "machineRoomConstruction": { "result": "Kuat, bersih, dan tahan api", "status": true },
        "machineRoomClearance": { "result": "Sesuai standar", "status": true },
        "machineRoomImplementation": { "result": "Penerangan 150 lux di area kerja", "status": true },
        "ventilation": { "result": "Sirkulasi udara baik", "status": true },
        "machineRoomDoor": { "result": "Membuka keluar, tahan api", "status": true },
        "mainPowerPanelPosition": { "result": "Terpasang di dalam kamar mesin", "status": true },
        "rotatingPartsGuard": { "result": "Terpasang dengan baik", "status": true },
        "ropeHoleGuard": { "result": "Ketinggian 60mm, aman", "status": true },
        "machineRoomAccessLadder": { "result": "Permanen dan kokoh", "status": true },
        "floorLevelDifference": { "result": "Tidak ada perbedaan ketinggian", "status": true },
        "fireExtinguisher": { "result": "Tersedia APAR jenis CO2 5kg", "status": true },
        "machineRoomless": {
          "panelPlacement": { "result": "N/A", "status": true },
          "lightingWorkArea": { "result": "N/A", "status": true },
          "lightingBetweenWorkArea": { "result": "N/A", "status": true },
          "manualBrakeRelease": { "result": "N/A", "status": true },
          "fireExtinguisherPlacement": { "result": "N/A", "status": true }
        },
        "emergencyStopSwitch": { "result": "Berfungsi dengan baik", "status": true }
      },
      "suspensionRopesAndBelts": {
          "condition": { "result": "Tidak ada cacat atau karat", "status": true },
          "chainUsage": { "result": "Tidak menggunakan rantai", "status": true },
          "safetyFactor": { "result": "Sesuai standar (11.5x)", "status": true },
          "ropeWithCounterweight": { "result": "4 jalur, diameter 8mm", "status": true },
          "ropeWithoutCounterweight": { "result": "N/A", "status": true },
          "belt": { "result": "N/A", "status": true },
          "slackRopeDevice": { "result": "N/A", "status": true }
      },
      "drumsAndSheaves": {
          "drumGrooves": { "result": "Alur dalam kondisi baik", "status": true },
          "passengerDrumDiameter": { "result": "Rasio 42:1, sesuai", "status": true },
          "governorDrumDiameter": { "result": "Rasio 26:1, sesuai", "status": true }
      },
      "hoistwayAndPit": {
          "construction": { "result": "Struktur kokoh dan tertutup", "status": true },
          "walls": { "result": "Halus dan bebas tonjolan", "status": true },
          "inclinedElevatorTrackBed": { "result": "N/A", "status": true },
          "cleanliness": { "result": "Bersih dari debu dan oli", "status": true },
          "lighting": { "result": "Penerangan 120 lux", "status": true },
          "emergencyDoorNonStop": { "result": "Jarak antar pintu sesuai", "status": true },
          "emergencyDoorSize": { "result": "Ukuran sesuai standar", "status": true },
          "emergencyDoorSafetySwitch": { "result": "Berfungsi dengan baik", "status": true },
          "emergencyDoorBridge": { "result": "N/A", "status": true },
          "carTopClearance": { "result": "Ruang bebas 600mm", "status": true },
          "pitClearance": { "result": "Ruang bebas 600mm", "status": true },
          "pitLadder": { "result": "Tersedia dan kokoh", "status": true },
          "pitBelowWorkingArea": { "result": "Lantai kuat, tidak ada ruang kerja di bawah", "status": true },
          "pitAccessSwitch": { "result": "Saklar berfungsi", "status": true },
          "pitScreen": { "result": "N/A", "status": true },
          "hoistwayDoorLeaf": { "result": "Tahan api 2 jam", "status": true },
          "hoistwayDoorInterlock": { "result": "Bekerja dengan baik", "status": true },
          "floorLeveling": { "result": "Akurasi perataan lantai < 5mm", "status": true },
          "hoistwaySeparatorBeam": { "result": "N/A", "status": true },
          "inclinedElevatorStairs": { "result": "N/A", "status": true }
      },
      "car": {
          "frame": { "result": "Struktur rangka kokoh", "status": true },
          "body": { "result": "Tertutup penuh, interior baik", "status": true },
          "wallHeight": { "result": "2200mm", "status": true },
          "floorArea": { "result": "Sesuai kapasitas", "status": true },
          "carAreaExpansion": { "result": "Tidak ada perluasan", "status": true },
          "carDoor": { "result": "Otomatis, berfungsi mulus", "status": true },
          "carDoorSpecs": {
              "size": { "result": "800mm x 2100mm", "status": true },
              "lockAndSwitch": { "result": "Berfungsi dengan baik", "status": true },
              "sillClearance": { "result": "Celah 30mm, sesuai", "status": true }
          },
          "carToBeamClearance": { "result": "N/A", "status": true },
          "alarmBell": { "result": "Berbunyi nyaring", "status": true },
          "backupPowerARD": { "result": "Berfungsi saat tes, membawa ke lantai terdekat", "status": true },
          "intercom": { "result": "Komunikasi 2 arah jelas", "status": true },
          "ventilation": { "result": "Fan berfungsi baik", "status": true },
          "emergencyLighting": { "result": "Menyala otomatis saat listrik padam", "status": true },
          "operatingPanel": { "result": "Semua tombol berfungsi", "status": true },
          "carPositionIndicator": { "result": "Akurat", "status": true },
          "carSignage": {
              "manufacturerName": { "result": "Terpasang", "status": true },
              "loadCapacity": { "result": "Terpasang jelas", "status": true },
              "noSmokingSign": { "result": "Terpasang", "status": true },
              "overloadIndicator": { "result": "Buzzer dan indikator berfungsi", "status": true },
              "doorOpenCloseButtons": { "result": "Berfungsi", "status": true },
              "floorButtons": { "result": "Semua berfungsi", "status": true },
              "alarmButton": { "result": "Berfungsi", "status": true },
              "twoWayIntercom": { "result": "Berfungsi", "status": true }
          },
          "carRoofStrength": { "result": "Kuat, tidak ada deformasi", "status": true },
          "carTopEmergencyExit": { "result": "Saklar berfungsi, mudah dibuka dari luar", "status": true },
          "carSideEmergencyExit": { "result": "N/A", "status": true },
          "carTopGuardRail": { "result": "Ketinggian 1100mm, kokoh", "status": true },
          "guardRailHeight300to850": { "result": "N/A", "status": true },
          "guardRailHeightOver850": { "result": "Ketinggian 1100mm, sesuai", "status": true },
          "carTopLighting": { "result": "Penerangan 150 lux", "status": true },
          "manualOperationButtons": { "result": "Tombol inspeksi berfungsi", "status": true },
          "carInterior": { "result": "Bahan tidak mudah terbakar dan aman", "status": true }
      },
      "governorAndSafetyBrake": {
          "governorRopeClamp": { "result": "Berfungsi saat tes overspeed", "status": true },
          "governorSwitch": { "result": "Berfungsi", "status": true },
          "safetyBrakeSpeed": { "result": "Aktif pada 120% kecepatan normal", "status": true },
          "safetyBrakeType": { "result": "Tipe Progressive (Berangsur)", "status": true },
          "safetyBrakeMechanism": { "result": "Mekanikal, tidak menggunakan listrik/hidrolik", "status": true },
          "progressiveSafetyBrake": { "result": "Berfungsi dengan baik", "status": true },
          "instantaneousSafetyBrake": { "result": "N/A", "status": true },
          "safetyBrakeOperation": { "result": "Bekerja serempak pada kedua rel", "status": true },
          "electricalCutoutSwitch": { "result": "Berfungsi", "status": true },
          "limitSwitch": { "result": "Normal dan final limit berfungsi", "status": true },
          "overloadDevice": { "result": "Berfungsi pada beban 110%", "status": true }
      },
      "counterweightGuideRailsAndBuffers": {
          "counterweightMaterial": { "result": "Steel block", "status": true },
          "counterweightGuardScreen": { "result": "Terpasang dengan ketinggian 2.5m", "status": true },
          "guideRailConstruction": { "result": "Rel pemandu kokoh dan lurus", "status": true },
          "bufferType": { "result": "Tipe hidrolik", "status": true },
          "bufferFunction": { "result": "Bekerja dengan baik, meredam secara bertahap", "status": true },
          "bufferSafetySwitch": { "result": "Berfungsi saat buffer tertekan", "status": true }
      },
      "electricalInstallation": {
          "installationStandard": { "result": "Sesuai SNI dan PUIL", "status": true },
          "electricalPanel": { "result": "Panel khusus dan aman", "status": true },
          "backupPowerARD": { "result": "Tersedia dan berfungsi", "status": true },
          "groundingCable": { "result": "Penampang 12mm, resistansi 1.5 Ohm", "status": true },
          "fireAlarmConnection": { "result": "Terhubung ke sistem alarm gedung", "status": true },
          "fireServiceElevator": {
              "backupPower": { "result": "N/A", "status": true },
              "specialOperation": { "result": "N/A", "status": true },
              "fireSwitch": { "result": "N/A", "status": true },
              "label": { "result": "N/A", "status": true },
              "electricalFireResistance": { "result": "N/A", "status": true },
              "hoistwayWallFireResistance": { "result": "N/A", "status": true },
              "carSize": { "result": "N/A", "status": true },
              "doorSize": { "result": "N/A", "status": true },
              "travelTime": { "result": "N/A", "status": true },
              "evacuationFloor": { "result": "N/A", "status": true }
          },
          "accessibilityElevator": {
              "operatingPanel": { "result": "Terdapat huruf braile", "status": true },
              "panelHeight": { "result": "1000mm dari lantai", "status": true },
              "doorOpenTime": { "result": "Setting > 5 detik", "status": true },
              "doorWidth": { "result": "Bukaan 800mm", "status": true },
              "audioInformation": { "result": "Tersedia informasi suara untuk setiap lantai", "status": true },
              "label": { "result": "Tersedia label disabilitas", "status": true }
          },
          "seismicSensor": {
              "availability": { "result": "Tersedia", "status": true },
              "function": { "result": "Berfungsi saat disimulasikan", "status": true }
          }
      }
    },
    "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal."
  }
  ```

**Response:**

- **Success (201 Created)**

  ```json
  {
    "status": "success",
    "message": "Laporan elevator berhasil dibuat",
    "data": {
        "Laporan": {
            "id": "MQINrcOq7J6H5GfdAk2S",
            "inspectionType": "Elevator dan Eskalator",
            "subInspectionType": "Elevator",
            "examinationType": "Pemeriksaan dan Pengujian Berkala",
            "equipmentType": "Elevator Penumpang",
            "generalData": {
                "ownerName": "PT ANJAY",
                "ownerAddress": "",
                "nameUsageLocation": "",
                "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
                "manufacturerOrInstaller": "PT Elevator Maju Jaya",
                "elevatorType": "Traction",
                "brandOrType": "MajuLift Pro-X",
                "countryAndYear": "Jepang / 2022",
                "serialNumber": "MLPX-2022-12345",
                "capacity": "1000 kg / 15 orang",
                "speed": "150 m/min",
                "floorsServed": "20 lantai (1-20)",
                "permitNumber": "SKP-ELEV-001/2022",
                "inspectionDate": "2024-07-15"
            },
            "technicalDocumentInspection": {
                "designDrawing": true,
                "technicalCalculation": true,
                "materialCertificate": true,
                "controlPanelDiagram": true,
                "asBuiltDrawing": true,
                "componentCertificates": true,
                "safeWorkProcedure": true
            },
            "inspectionAndTesting": {
                "machineRoomAndMachinery": {
                    "machineMounting": {
                        "result": "Tidak ada getaran berlebih",
                        "status": true
                    },
                    "mechanicalBrake": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    },
                    "electricalBrake": {
                        "result": "Switch berfungsi normal",
                        "status": true
                    },
                    "machineRoomConstruction": {
                        "result": "Kuat, bersih, dan tahan api",
                        "status": true
                    },
                    "machineRoomClearance": {
                        "result": "Sesuai standar",
                        "status": true
                    },
                    "machineRoomImplementation": {
                        "result": "Penerangan 150 lux di area kerja",
                        "status": true
                    },
                    "ventilation": {
                        "result": "Sirkulasi udara baik",
                        "status": true
                    },
                    "machineRoomDoor": {
                        "result": "Membuka keluar, tahan api",
                        "status": true
                    },
                    "mainPowerPanelPosition": {
                        "result": "Terpasang di dalam kamar mesin",
                        "status": true
                    },
                    "rotatingPartsGuard": {
                        "result": "Terpasang dengan baik",
                        "status": true
                    },
                    "ropeHoleGuard": {
                        "result": "Ketinggian 60mm, aman",
                        "status": true
                    },
                    "machineRoomAccessLadder": {
                        "result": "Permanen dan kokoh",
                        "status": true
                    },
                    "floorLevelDifference": {
                        "result": "Tidak ada perbedaan ketinggian",
                        "status": true
                    },
                    "fireExtinguisher": {
                        "result": "Tersedia APAR jenis CO2 5kg",
                        "status": true
                    },
                    "machineRoomless": {
                        "panelPlacement": {
                            "result": "N/A",
                            "status": true
                        },
                        "lightingWorkArea": {
                            "result": "N/A",
                            "status": true
                        },
                        "lightingBetweenWorkArea": {
                            "result": "N/A",
                            "status": true
                        },
                        "manualBrakeRelease": {
                            "result": "N/A",
                            "status": true
                        },
                        "fireExtinguisherPlacement": {
                            "result": "N/A",
                            "status": true
                        }
                    },
                    "emergencyStopSwitch": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    }
                },
                "suspensionRopesAndBelts": {
                    "condition": {
                        "result": "Tidak ada cacat atau karat",
                        "status": true
                    },
                    "chainUsage": {
                        "result": "Tidak menggunakan rantai",
                        "status": true
                    },
                    "safetyFactor": {
                        "result": "Sesuai standar (11.5x)",
                        "status": true
                    },
                    "ropeWithCounterweight": {
                        "result": "4 jalur, diameter 8mm",
                        "status": true
                    },
                    "ropeWithoutCounterweight": {
                        "result": "N/A",
                        "status": true
                    },
                    "belt": {
                        "result": "N/A",
                        "status": true
                    },
                    "slackRopeDevice": {
                        "result": "N/A",
                        "status": true
                    }
                },
                "drumsAndSheaves": {
                    "drumGrooves": {
                        "result": "Alur dalam kondisi baik",
                        "status": true
                    },
                    "passengerDrumDiameter": {
                        "result": "Rasio 42:1, sesuai",
                        "status": true
                    },
                    "governorDrumDiameter": {
                        "result": "Rasio 26:1, sesuai",
                        "status": true
                    }
                },
                "hoistwayAndPit": {
                    "construction": {
                        "result": "Struktur kokoh dan tertutup",
                        "status": true
                    },
                    "walls": {
                        "result": "Halus dan bebas tonjolan",
                        "status": true
                    },
                    "inclinedElevatorTrackBed": {
                        "result": "N/A",
                        "status": true
                    },
                    "cleanliness": {
                        "result": "Bersih dari debu dan oli",
                        "status": true
                    },
                    "lighting": {
                        "result": "Penerangan 120 lux",
                        "status": true
                    },
                    "emergencyDoorNonStop": {
                        "result": "Jarak antar pintu sesuai",
                        "status": true
                    },
                    "emergencyDoorSize": {
                        "result": "Ukuran sesuai standar",
                        "status": true
                    },
                    "emergencyDoorSafetySwitch": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    },
                    "emergencyDoorBridge": {
                        "result": "N/A",
                        "status": true
                    },
                    "carTopClearance": {
                        "result": "Ruang bebas 600mm",
                        "status": true
                    },
                    "pitClearance": {
                        "result": "Ruang bebas 600mm",
                        "status": true
                    },
                    "pitLadder": {
                        "result": "Tersedia dan kokoh",
                        "status": true
                    },
                    "pitBelowWorkingArea": {
                        "result": "Lantai kuat, tidak ada ruang kerja di bawah",
                        "status": true
                    },
                    "pitAccessSwitch": {
                        "result": "Saklar berfungsi",
                        "status": true
                    },
                    "pitScreen": {
                        "result": "N/A",
                        "status": true
                    },
                    "hoistwayDoorLeaf": {
                        "result": "Tahan api 2 jam",
                        "status": true
                    },
                    "hoistwayDoorInterlock": {
                        "result": "Bekerja dengan baik",
                        "status": true
                    },
                    "floorLeveling": {
                        "result": "Akurasi perataan lantai < 5mm",
                        "status": true
                    },
                    "hoistwaySeparatorBeam": {
                        "result": "N/A",
                        "status": true
                    },
                    "inclinedElevatorStairs": {
                        "result": "N/A",
                        "status": true
                    }
                },
                "car": {
                    "frame": {
                        "result": "Struktur rangka kokoh",
                        "status": true
                    },
                    "body": {
                        "result": "Tertutup penuh, interior baik",
                        "status": true
                    },
                    "wallHeight": {
                        "result": "2200mm",
                        "status": true
                    },
                    "floorArea": {
                        "result": "Sesuai kapasitas",
                        "status": true
                    },
                    "carAreaExpansion": {
                        "result": "Tidak ada perluasan",
                        "status": true
                    },
                    "carDoor": {
                        "result": "Otomatis, berfungsi mulus",
                        "status": true
                    },
                    "carDoorSpecs": {
                        "size": {
                            "result": "800mm x 2100mm",
                            "status": true
                        },
                        "lockAndSwitch": {
                            "result": "Berfungsi dengan baik",
                            "status": true
                        },
                        "sillClearance": {
                            "result": "Celah 30mm, sesuai",
                            "status": true
                        }
                    },
                    "carToBeamClearance": {
                        "result": "N/A",
                        "status": true
                    },
                    "alarmBell": {
                        "result": "Berbunyi nyaring",
                        "status": true
                    },
                    "backupPowerARD": {
                        "result": "Berfungsi saat tes, membawa ke lantai terdekat",
                        "status": true
                    },
                    "intercom": {
                        "result": "Komunikasi 2 arah jelas",
                        "status": true
                    },
                    "ventilation": {
                        "result": "Fan berfungsi baik",
                        "status": true
                    },
                    "emergencyLighting": {
                        "result": "Menyala otomatis saat listrik padam",
                        "status": true
                    },
                    "operatingPanel": {
                        "result": "Semua tombol berfungsi",
                        "status": true
                    },
                    "carPositionIndicator": {
                        "result": "Akurat",
                        "status": true
                    },
                    "carSignage": {
                        "manufacturerName": {
                            "result": "Terpasang",
                            "status": true
                        },
                        "loadCapacity": {
                            "result": "Terpasang jelas",
                            "status": true
                        },
                        "noSmokingSign": {
                            "result": "Terpasang",
                            "status": true
                        },
                        "overloadIndicator": {
                            "result": "Buzzer dan indikator berfungsi",
                            "status": true
                        },
                        "doorOpenCloseButtons": {
                            "result": "Berfungsi",
                            "status": true
                        },
                        "floorButtons": {
                            "result": "Semua berfungsi",
                            "status": true
                        },
                        "alarmButton": {
                            "result": "Berfungsi",
                            "status": true
                        },
                        "twoWayIntercom": {
                            "result": "Berfungsi",
                            "status": true
                        }
                    },
                    "carRoofStrength": {
                        "result": "Kuat, tidak ada deformasi",
                        "status": true
                    },
                    "carTopEmergencyExit": {
                        "result": "Saklar berfungsi, mudah dibuka dari luar",
                        "status": true
                    },
                    "carSideEmergencyExit": {
                        "result": "N/A",
                        "status": true
                    },
                    "carTopGuardRail": {
                        "result": "Ketinggian 1100mm, kokoh",
                        "status": true
                    },
                    "guardRailHeight300to850": {
                        "result": "N/A",
                        "status": true
                    },
                    "guardRailHeightOver850": {
                        "result": "Ketinggian 1100mm, sesuai",
                        "status": true
                    },
                    "carTopLighting": {
                        "result": "Penerangan 150 lux",
                        "status": true
                    },
                    "manualOperationButtons": {
                        "result": "Tombol inspeksi berfungsi",
                        "status": true
                    },
                    "carInterior": {
                        "result": "Bahan tidak mudah terbakar dan aman",
                        "status": true
                    }
                },
                "governorAndSafetyBrake": {
                    "governorRopeClamp": {
                        "result": "Berfungsi saat tes overspeed",
                        "status": true
                    },
                    "governorSwitch": {
                        "result": "Berfungsi",
                        "status": true
                    },
                    "safetyBrakeSpeed": {
                        "result": "Aktif pada 120% kecepatan normal",
                        "status": true
                    },
                    "safetyBrakeType": {
                        "result": "Tipe Progressive (Berangsur)",
                        "status": true
                    },
                    "safetyBrakeMechanism": {
                        "result": "Mekanikal, tidak menggunakan listrik/hidrolik",
                        "status": true
                    },
                    "progressiveSafetyBrake": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    },
                    "instantaneousSafetyBrake": {
                        "result": "N/A",
                        "status": true
                    },
                    "safetyBrakeOperation": {
                        "result": "Bekerja serempak pada kedua rel",
                        "status": true
                    },
                    "electricalCutoutSwitch": {
                        "result": "Berfungsi",
                        "status": true
                    },
                    "limitSwitch": {
                        "result": "Normal dan final limit berfungsi",
                        "status": true
                    },
                    "overloadDevice": {
                        "result": "Berfungsi pada beban 110%",
                        "status": true
                    }
                },
                "counterweightGuideRailsAndBuffers": {
                    "counterweightMaterial": {
                        "result": "Steel block",
                        "status": true
                    },
                    "counterweightGuardScreen": {
                        "result": "Terpasang dengan ketinggian 2.5m",
                        "status": true
                    },
                    "guideRailConstruction": {
                        "result": "Rel pemandu kokoh dan lurus",
                        "status": true
                    },
                    "bufferType": {
                        "result": "Tipe hidrolik",
                        "status": true
                    },
                    "bufferFunction": {
                        "result": "Bekerja dengan baik, meredam secara bertahap",
                        "status": true
                    },
                    "bufferSafetySwitch": {
                        "result": "Berfungsi saat buffer tertekan",
                        "status": true
                    }
                },
                "electricalInstallation": {
                    "installationStandard": {
                        "result": "Sesuai SNI dan PUIL",
                        "status": true
                    },
                    "electricalPanel": {
                        "result": "Panel khusus dan aman",
                        "status": true
                    },
                    "backupPowerARD": {
                        "result": "Tersedia dan berfungsi",
                        "status": true
                    },
                    "groundingCable": {
                        "result": "Penampang 12mm, resistansi 1.5 Ohm",
                        "status": true
                    },
                    "fireAlarmConnection": {
                        "result": "Terhubung ke sistem alarm gedung",
                        "status": true
                    },
                    "fireServiceElevator": {
                        "backupPower": {
                            "result": "N/A",
                            "status": true
                        },
                        "specialOperation": {
                            "result": "N/A",
                            "status": true
                        },
                        "fireSwitch": {
                            "result": "N/A",
                            "status": true
                        },
                        "label": {
                            "result": "N/A",
                            "status": true
                        },
                        "electricalFireResistance": {
                            "result": "N/A",
                            "status": true
                        },
                        "hoistwayWallFireResistance": {
                            "result": "N/A",
                            "status": true
                        },
                        "carSize": {
                            "result": "N/A",
                            "status": true
                        },
                        "doorSize": {
                            "result": "N/A",
                            "status": true
                        },
                        "travelTime": {
                            "result": "N/A",
                            "status": true
                        },
                        "evacuationFloor": {
                            "result": "N/A",
                            "status": true
                        }
                    },
                    "accessibilityElevator": {
                        "operatingPanel": {
                            "result": "Terdapat huruf braile",
                            "status": true
                        },
                        "panelHeight": {
                            "result": "1000mm dari lantai",
                            "status": true
                        },
                        "doorOpenTime": {
                            "result": "Setting > 5 detik",
                            "status": true
                        },
                        "doorWidth": {
                            "result": "Bukaan 800mm",
                            "status": true
                        },
                        "audioInformation": {
                            "result": "Tersedia informasi suara untuk setiap lantai",
                            "status": true
                        },
                        "label": {
                            "result": "Tersedia label disabilitas",
                            "status": true
                        }
                    },
                    "seismicSensor": {
                        "availability": {
                            "result": "Tersedia",
                            "status": true
                        },
                        "function": {
                            "result": "Berfungsi saat disimulasikan",
                            "status": true
                        }
                    }
                }
            },
            "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal.",
            "documentType": "Laporan",
            "createdAt": "2025-07-07T03:36:47.176Z"
        }
    }
  }
  ```



- **Failure Response (500 Server Error)**

  ```json
    {
        "status": "error",
        "message": "Terjadi kesalahan pada server saat menyimpan laporan."
    }
  ```

##### GET Laporan By id

**URL:**
`/elevatorEskalator/elevator/laporan/{id}`
**Method:**
`GET`

**Response:**

- **Success (200 Ok)**

  ```json
  {
    "status": "success",
    "message": "Laporan elevator berhasil dibuat",
    "data": {
        "Laporan": {
            "id": "MQINrcOq7J6H5GfdAk2S",
            "inspectionType": "Elevator dan Eskalator",
            "subInspectionType": "Elevator",
            "examinationType": "Pemeriksaan dan Pengujian Berkala",
            "equipmentType": "Elevator Penumpang",
            "generalData": {
                "ownerName": "PT ANJAY",
                "ownerAddress": "",
                "nameUsageLocation": "",
                "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
                "manufacturerOrInstaller": "PT Elevator Maju Jaya",
                "elevatorType": "Traction",
                "brandOrType": "MajuLift Pro-X",
                "countryAndYear": "Jepang / 2022",
                "serialNumber": "MLPX-2022-12345",
                "capacity": "1000 kg / 15 orang",
                "speed": "150 m/min",
                "floorsServed": "20 lantai (1-20)",
                "permitNumber": "SKP-ELEV-001/2022",
                "inspectionDate": "2024-07-15"
            },
            "technicalDocumentInspection": {
                "designDrawing": true,
                "technicalCalculation": true,
                "materialCertificate": true,
                "controlPanelDiagram": true,
                "asBuiltDrawing": true,
                "componentCertificates": true,
                "safeWorkProcedure": true
            },
            "inspectionAndTesting": {
                "machineRoomAndMachinery": {
                    "machineMounting": {
                        "result": "Tidak ada getaran berlebih",
                        "status": true
                    },
                    "mechanicalBrake": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    },
                    "electricalBrake": {
                        "result": "Switch berfungsi normal",
                        "status": true
                    },
                    "machineRoomConstruction": {
                        "result": "Kuat, bersih, dan tahan api",
                        "status": true
                    },
                    "machineRoomClearance": {
                        "result": "Sesuai standar",
                        "status": true
                    },
                    "machineRoomImplementation": {
                        "result": "Penerangan 150 lux di area kerja",
                        "status": true
                    },
                    "ventilation": {
                        "result": "Sirkulasi udara baik",
                        "status": true
                    },
                    "machineRoomDoor": {
                        "result": "Membuka keluar, tahan api",
                        "status": true
                    },
                    "mainPowerPanelPosition": {
                        "result": "Terpasang di dalam kamar mesin",
                        "status": true
                    },
                    "rotatingPartsGuard": {
                        "result": "Terpasang dengan baik",
                        "status": true
                    },
                    "ropeHoleGuard": {
                        "result": "Ketinggian 60mm, aman",
                        "status": true
                    },
                    "machineRoomAccessLadder": {
                        "result": "Permanen dan kokoh",
                        "status": true
                    },
                    "floorLevelDifference": {
                        "result": "Tidak ada perbedaan ketinggian",
                        "status": true
                    },
                    "fireExtinguisher": {
                        "result": "Tersedia APAR jenis CO2 5kg",
                        "status": true
                    },
                    "machineRoomless": {
                        "panelPlacement": {
                            "result": "N/A",
                            "status": true
                        },
                        "lightingWorkArea": {
                            "result": "N/A",
                            "status": true
                        },
                        "lightingBetweenWorkArea": {
                            "result": "N/A",
                            "status": true
                        },
                        "manualBrakeRelease": {
                            "result": "N/A",
                            "status": true
                        },
                        "fireExtinguisherPlacement": {
                            "result": "N/A",
                            "status": true
                        }
                    },
                    "emergencyStopSwitch": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    }
                },
                "suspensionRopesAndBelts": {
                    "condition": {
                        "result": "Tidak ada cacat atau karat",
                        "status": true
                    },
                    "chainUsage": {
                        "result": "Tidak menggunakan rantai",
                        "status": true
                    },
                    "safetyFactor": {
                        "result": "Sesuai standar (11.5x)",
                        "status": true
                    },
                    "ropeWithCounterweight": {
                        "result": "4 jalur, diameter 8mm",
                        "status": true
                    },
                    "ropeWithoutCounterweight": {
                        "result": "N/A",
                        "status": true
                    },
                    "belt": {
                        "result": "N/A",
                        "status": true
                    },
                    "slackRopeDevice": {
                        "result": "N/A",
                        "status": true
                    }
                },
                "drumsAndSheaves": {
                    "drumGrooves": {
                        "result": "Alur dalam kondisi baik",
                        "status": true
                    },
                    "passengerDrumDiameter": {
                        "result": "Rasio 42:1, sesuai",
                        "status": true
                    },
                    "governorDrumDiameter": {
                        "result": "Rasio 26:1, sesuai",
                        "status": true
                    }
                },
                "hoistwayAndPit": {
                    "construction": {
                        "result": "Struktur kokoh dan tertutup",
                        "status": true
                    },
                    "walls": {
                        "result": "Halus dan bebas tonjolan",
                        "status": true
                    },
                    "inclinedElevatorTrackBed": {
                        "result": "N/A",
                        "status": true
                    },
                    "cleanliness": {
                        "result": "Bersih dari debu dan oli",
                        "status": true
                    },
                    "lighting": {
                        "result": "Penerangan 120 lux",
                        "status": true
                    },
                    "emergencyDoorNonStop": {
                        "result": "Jarak antar pintu sesuai",
                        "status": true
                    },
                    "emergencyDoorSize": {
                        "result": "Ukuran sesuai standar",
                        "status": true
                    },
                    "emergencyDoorSafetySwitch": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    },
                    "emergencyDoorBridge": {
                        "result": "N/A",
                        "status": true
                    },
                    "carTopClearance": {
                        "result": "Ruang bebas 600mm",
                        "status": true
                    },
                    "pitClearance": {
                        "result": "Ruang bebas 600mm",
                        "status": true
                    },
                    "pitLadder": {
                        "result": "Tersedia dan kokoh",
                        "status": true
                    },
                    "pitBelowWorkingArea": {
                        "result": "Lantai kuat, tidak ada ruang kerja di bawah",
                        "status": true
                    },
                    "pitAccessSwitch": {
                        "result": "Saklar berfungsi",
                        "status": true
                    },
                    "pitScreen": {
                        "result": "N/A",
                        "status": true
                    },
                    "hoistwayDoorLeaf": {
                        "result": "Tahan api 2 jam",
                        "status": true
                    },
                    "hoistwayDoorInterlock": {
                        "result": "Bekerja dengan baik",
                        "status": true
                    },
                    "floorLeveling": {
                        "result": "Akurasi perataan lantai < 5mm",
                        "status": true
                    },
                    "hoistwaySeparatorBeam": {
                        "result": "N/A",
                        "status": true
                    },
                    "inclinedElevatorStairs": {
                        "result": "N/A",
                        "status": true
                    }
                },
                "car": {
                    "frame": {
                        "result": "Struktur rangka kokoh",
                        "status": true
                    },
                    "body": {
                        "result": "Tertutup penuh, interior baik",
                        "status": true
                    },
                    "wallHeight": {
                        "result": "2200mm",
                        "status": true
                    },
                    "floorArea": {
                        "result": "Sesuai kapasitas",
                        "status": true
                    },
                    "carAreaExpansion": {
                        "result": "Tidak ada perluasan",
                        "status": true
                    },
                    "carDoor": {
                        "result": "Otomatis, berfungsi mulus",
                        "status": true
                    },
                    "carDoorSpecs": {
                        "size": {
                            "result": "800mm x 2100mm",
                            "status": true
                        },
                        "lockAndSwitch": {
                            "result": "Berfungsi dengan baik",
                            "status": true
                        },
                        "sillClearance": {
                            "result": "Celah 30mm, sesuai",
                            "status": true
                        }
                    },
                    "carToBeamClearance": {
                        "result": "N/A",
                        "status": true
                    },
                    "alarmBell": {
                        "result": "Berbunyi nyaring",
                        "status": true
                    },
                    "backupPowerARD": {
                        "result": "Berfungsi saat tes, membawa ke lantai terdekat",
                        "status": true
                    },
                    "intercom": {
                        "result": "Komunikasi 2 arah jelas",
                        "status": true
                    },
                    "ventilation": {
                        "result": "Fan berfungsi baik",
                        "status": true
                    },
                    "emergencyLighting": {
                        "result": "Menyala otomatis saat listrik padam",
                        "status": true
                    },
                    "operatingPanel": {
                        "result": "Semua tombol berfungsi",
                        "status": true
                    },
                    "carPositionIndicator": {
                        "result": "Akurat",
                        "status": true
                    },
                    "carSignage": {
                        "manufacturerName": {
                            "result": "Terpasang",
                            "status": true
                        },
                        "loadCapacity": {
                            "result": "Terpasang jelas",
                            "status": true
                        },
                        "noSmokingSign": {
                            "result": "Terpasang",
                            "status": true
                        },
                        "overloadIndicator": {
                            "result": "Buzzer dan indikator berfungsi",
                            "status": true
                        },
                        "doorOpenCloseButtons": {
                            "result": "Berfungsi",
                            "status": true
                        },
                        "floorButtons": {
                            "result": "Semua berfungsi",
                            "status": true
                        },
                        "alarmButton": {
                            "result": "Berfungsi",
                            "status": true
                        },
                        "twoWayIntercom": {
                            "result": "Berfungsi",
                            "status": true
                        }
                    },
                    "carRoofStrength": {
                        "result": "Kuat, tidak ada deformasi",
                        "status": true
                    },
                    "carTopEmergencyExit": {
                        "result": "Saklar berfungsi, mudah dibuka dari luar",
                        "status": true
                    },
                    "carSideEmergencyExit": {
                        "result": "N/A",
                        "status": true
                    },
                    "carTopGuardRail": {
                        "result": "Ketinggian 1100mm, kokoh",
                        "status": true
                    },
                    "guardRailHeight300to850": {
                        "result": "N/A",
                        "status": true
                    },
                    "guardRailHeightOver850": {
                        "result": "Ketinggian 1100mm, sesuai",
                        "status": true
                    },
                    "carTopLighting": {
                        "result": "Penerangan 150 lux",
                        "status": true
                    },
                    "manualOperationButtons": {
                        "result": "Tombol inspeksi berfungsi",
                        "status": true
                    },
                    "carInterior": {
                        "result": "Bahan tidak mudah terbakar dan aman",
                        "status": true
                    }
                },
                "governorAndSafetyBrake": {
                    "governorRopeClamp": {
                        "result": "Berfungsi saat tes overspeed",
                        "status": true
                    },
                    "governorSwitch": {
                        "result": "Berfungsi",
                        "status": true
                    },
                    "safetyBrakeSpeed": {
                        "result": "Aktif pada 120% kecepatan normal",
                        "status": true
                    },
                    "safetyBrakeType": {
                        "result": "Tipe Progressive (Berangsur)",
                        "status": true
                    },
                    "safetyBrakeMechanism": {
                        "result": "Mekanikal, tidak menggunakan listrik/hidrolik",
                        "status": true
                    },
                    "progressiveSafetyBrake": {
                        "result": "Berfungsi dengan baik",
                        "status": true
                    },
                    "instantaneousSafetyBrake": {
                        "result": "N/A",
                        "status": true
                    },
                    "safetyBrakeOperation": {
                        "result": "Bekerja serempak pada kedua rel",
                        "status": true
                    },
                    "electricalCutoutSwitch": {
                        "result": "Berfungsi",
                        "status": true
                    },
                    "limitSwitch": {
                        "result": "Normal dan final limit berfungsi",
                        "status": true
                    },
                    "overloadDevice": {
                        "result": "Berfungsi pada beban 110%",
                        "status": true
                    }
                },
                "counterweightGuideRailsAndBuffers": {
                    "counterweightMaterial": {
                        "result": "Steel block",
                        "status": true
                    },
                    "counterweightGuardScreen": {
                        "result": "Terpasang dengan ketinggian 2.5m",
                        "status": true
                    },
                    "guideRailConstruction": {
                        "result": "Rel pemandu kokoh dan lurus",
                        "status": true
                    },
                    "bufferType": {
                        "result": "Tipe hidrolik",
                        "status": true
                    },
                    "bufferFunction": {
                        "result": "Bekerja dengan baik, meredam secara bertahap",
                        "status": true
                    },
                    "bufferSafetySwitch": {
                        "result": "Berfungsi saat buffer tertekan",
                        "status": true
                    }
                },
                "electricalInstallation": {
                    "installationStandard": {
                        "result": "Sesuai SNI dan PUIL",
                        "status": true
                    },
                    "electricalPanel": {
                        "result": "Panel khusus dan aman",
                        "status": true
                    },
                    "backupPowerARD": {
                        "result": "Tersedia dan berfungsi",
                        "status": true
                    },
                    "groundingCable": {
                        "result": "Penampang 12mm, resistansi 1.5 Ohm",
                        "status": true
                    },
                    "fireAlarmConnection": {
                        "result": "Terhubung ke sistem alarm gedung",
                        "status": true
                    },
                    "fireServiceElevator": {
                        "backupPower": {
                            "result": "N/A",
                            "status": true
                        },
                        "specialOperation": {
                            "result": "N/A",
                            "status": true
                        },
                        "fireSwitch": {
                            "result": "N/A",
                            "status": true
                        },
                        "label": {
                            "result": "N/A",
                            "status": true
                        },
                        "electricalFireResistance": {
                            "result": "N/A",
                            "status": true
                        },
                        "hoistwayWallFireResistance": {
                            "result": "N/A",
                            "status": true
                        },
                        "carSize": {
                            "result": "N/A",
                            "status": true
                        },
                        "doorSize": {
                            "result": "N/A",
                            "status": true
                        },
                        "travelTime": {
                            "result": "N/A",
                            "status": true
                        },
                        "evacuationFloor": {
                            "result": "N/A",
                            "status": true
                        }
                    },
                    "accessibilityElevator": {
                        "operatingPanel": {
                            "result": "Terdapat huruf braile",
                            "status": true
                        },
                        "panelHeight": {
                            "result": "1000mm dari lantai",
                            "status": true
                        },
                        "doorOpenTime": {
                            "result": "Setting > 5 detik",
                            "status": true
                        },
                        "doorWidth": {
                            "result": "Bukaan 800mm",
                            "status": true
                        },
                        "audioInformation": {
                            "result": "Tersedia informasi suara untuk setiap lantai",
                            "status": true
                        },
                        "label": {
                            "result": "Tersedia label disabilitas",
                            "status": true
                        }
                    },
                    "seismicSensor": {
                        "availability": {
                            "result": "Tersedia",
                            "status": true
                        },
                        "function": {
                            "result": "Berfungsi saat disimulasikan",
                            "status": true
                        }
                    }
                }
            },
            "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal.",
            "documentType": "Laporan",
            "createdAt": "2025-07-07T03:36:47.176Z"
        }
    }
  }
  ```

- **Failure Response (500 Server Error)**

  ```json
  {
      "status": "error",
      "message": "Laporan elevator dengan ID tersebut tidak ditemukan."
  }
  ```

##### GET All Laporan
**URL:**
`/elevatorEskalator/elevator/laporan`
**Method:**
`GET`

**Response:**

  - **Success (200 Ok)**

    ```json
    {
        "status": "success",
        "data": {
            "Laporan": [
                {
                    "id": "MQINrcOq7J6H5GfdAk2S",
                    "inspectionType": "Elevator dan Eskalator",
                    "subInspectionType": "Elevator",
                    "examinationType": "Pemeriksaan dan Pengujian Berkala",
                    "equipmentType": "Elevator Penumpang",
                    "generalData": {
                        "ownerName": "PT ANJAY",
                        "ownerAddress": "",
                        "nameUsageLocation": "",
                        "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
                        "manufacturerOrInstaller": "PT Elevator Maju Jaya",
                        "elevatorType": "Traction",
                        "brandOrType": "MajuLift Pro-X",
                        "countryAndYear": "Jepang / 2022",
                        "serialNumber": "MLPX-2022-12345",
                        "capacity": "1000 kg / 15 orang",
                        "speed": "150 m/min",
                        "floorsServed": "20 lantai (1-20)",
                        "permitNumber": "SKP-ELEV-001/2022",
                        "inspectionDate": "2024-07-15"
                    },
                    "technicalDocumentInspection": {
                        "designDrawing": true,
                        "technicalCalculation": true,
                        "materialCertificate": true,
                        "controlPanelDiagram": true,
                        "asBuiltDrawing": true,
                        "componentCertificates": true,
                        "safeWorkProcedure": true
                    },
                    "inspectionAndTesting": {
                        "machineRoomAndMachinery": {
                            "machineMounting": {
                                "result": "Tidak ada getaran berlebih",
                                "status": true
                            },
                            "mechanicalBrake": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "electricalBrake": {
                                "result": "Switch berfungsi normal",
                                "status": true
                            },
                            "machineRoomConstruction": {
                                "result": "Kuat, bersih, dan tahan api",
                                "status": true
                            },
                            "machineRoomClearance": {
                                "result": "Sesuai standar",
                                "status": true
                            },
                            "machineRoomImplementation": {
                                "result": "Penerangan 150 lux di area kerja",
                                "status": true
                            },
                            "ventilation": {
                                "result": "Sirkulasi udara baik",
                                "status": true
                            },
                            "machineRoomDoor": {
                                "result": "Membuka keluar, tahan api",
                                "status": true
                            },
                            "mainPowerPanelPosition": {
                                "result": "Terpasang di dalam kamar mesin",
                                "status": true
                            },
                            "rotatingPartsGuard": {
                                "result": "Terpasang dengan baik",
                                "status": true
                            },
                            "ropeHoleGuard": {
                                "result": "Ketinggian 60mm, aman",
                                "status": true
                            },
                            "machineRoomAccessLadder": {
                                "result": "Permanen dan kokoh",
                                "status": true
                            },
                            "floorLevelDifference": {
                                "result": "Tidak ada perbedaan ketinggian",
                                "status": true
                            },
                            "fireExtinguisher": {
                                "result": "Tersedia APAR jenis CO2 5kg",
                                "status": true
                            },
                            "machineRoomless": {
                                "panelPlacement": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "lightingWorkArea": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "lightingBetweenWorkArea": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "manualBrakeRelease": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "fireExtinguisherPlacement": {
                                    "result": "N/A",
                                    "status": true
                                }
                            },
                            "emergencyStopSwitch": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            }
                        },
                        "suspensionRopesAndBelts": {
                            "condition": {
                                "result": "Tidak ada cacat atau karat",
                                "status": true
                            },
                            "chainUsage": {
                                "result": "Tidak menggunakan rantai",
                                "status": true
                            },
                            "safetyFactor": {
                                "result": "Sesuai standar (11.5x)",
                                "status": true
                            },
                            "ropeWithCounterweight": {
                                "result": "4 jalur, diameter 8mm",
                                "status": true
                            },
                            "ropeWithoutCounterweight": {
                                "result": "N/A",
                                "status": true
                            },
                            "belt": {
                                "result": "N/A",
                                "status": true
                            },
                            "slackRopeDevice": {
                                "result": "N/A",
                                "status": true
                            }
                        },
                        "drumsAndSheaves": {
                            "drumGrooves": {
                                "result": "Alur dalam kondisi baik",
                                "status": true
                            },
                            "passengerDrumDiameter": {
                                "result": "Rasio 42:1, sesuai",
                                "status": true
                            },
                            "governorDrumDiameter": {
                                "result": "Rasio 26:1, sesuai",
                                "status": true
                            }
                        },
                        "hoistwayAndPit": {
                            "construction": {
                                "result": "Struktur kokoh dan tertutup",
                                "status": true
                            },
                            "walls": {
                                "result": "Halus dan bebas tonjolan",
                                "status": true
                            },
                            "inclinedElevatorTrackBed": {
                                "result": "N/A",
                                "status": true
                            },
                            "cleanliness": {
                                "result": "Bersih dari debu dan oli",
                                "status": true
                            },
                            "lighting": {
                                "result": "Penerangan 120 lux",
                                "status": true
                            },
                            "emergencyDoorNonStop": {
                                "result": "Jarak antar pintu sesuai",
                                "status": true
                            },
                            "emergencyDoorSize": {
                                "result": "Ukuran sesuai standar",
                                "status": true
                            },
                            "emergencyDoorSafetySwitch": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "emergencyDoorBridge": {
                                "result": "N/A",
                                "status": true
                            },
                            "carTopClearance": {
                                "result": "Ruang bebas 600mm",
                                "status": true
                            },
                            "pitClearance": {
                                "result": "Ruang bebas 600mm",
                                "status": true
                            },
                            "pitLadder": {
                                "result": "Tersedia dan kokoh",
                                "status": true
                            },
                            "pitBelowWorkingArea": {
                                "result": "Lantai kuat, tidak ada ruang kerja di bawah",
                                "status": true
                            },
                            "pitAccessSwitch": {
                                "result": "Saklar berfungsi",
                                "status": true
                            },
                            "pitScreen": {
                                "result": "N/A",
                                "status": true
                            },
                            "hoistwayDoorLeaf": {
                                "result": "Tahan api 2 jam",
                                "status": true
                            },
                            "hoistwayDoorInterlock": {
                                "result": "Bekerja dengan baik",
                                "status": true
                            },
                            "floorLeveling": {
                                "result": "Akurasi perataan lantai < 5mm",
                                "status": true
                            },
                            "hoistwaySeparatorBeam": {
                                "result": "N/A",
                                "status": true
                            },
                            "inclinedElevatorStairs": {
                                "result": "N/A",
                                "status": true
                            }
                        },
                        "car": {
                            "frame": {
                                "result": "Struktur rangka kokoh",
                                "status": true
                            },
                            "body": {
                                "result": "Tertutup penuh, interior baik",
                                "status": true
                            },
                            "wallHeight": {
                                "result": "2200mm",
                                "status": true
                            },
                            "floorArea": {
                                "result": "Sesuai kapasitas",
                                "status": true
                            },
                            "carAreaExpansion": {
                                "result": "Tidak ada perluasan",
                                "status": true
                            },
                            "carDoor": {
                                "result": "Otomatis, berfungsi mulus",
                                "status": true
                            },
                            "carDoorSpecs": {
                                "size": {
                                    "result": "800mm x 2100mm",
                                    "status": true
                                },
                                "lockAndSwitch": {
                                    "result": "Berfungsi dengan baik",
                                    "status": true
                                },
                                "sillClearance": {
                                    "result": "Celah 30mm, sesuai",
                                    "status": true
                                }
                            },
                            "carToBeamClearance": {
                                "result": "N/A",
                                "status": true
                            },
                            "alarmBell": {
                                "result": "Berbunyi nyaring",
                                "status": true
                            },
                            "backupPowerARD": {
                                "result": "Berfungsi saat tes, membawa ke lantai terdekat",
                                "status": true
                            },
                            "intercom": {
                                "result": "Komunikasi 2 arah jelas",
                                "status": true
                            },
                            "ventilation": {
                                "result": "Fan berfungsi baik",
                                "status": true
                            },
                            "emergencyLighting": {
                                "result": "Menyala otomatis saat listrik padam",
                                "status": true
                            },
                            "operatingPanel": {
                                "result": "Semua tombol berfungsi",
                                "status": true
                            },
                            "carPositionIndicator": {
                                "result": "Akurat",
                                "status": true
                            },
                            "carSignage": {
                                "manufacturerName": {
                                    "result": "Terpasang",
                                    "status": true
                                },
                                "loadCapacity": {
                                    "result": "Terpasang jelas",
                                    "status": true
                                },
                                "noSmokingSign": {
                                    "result": "Terpasang",
                                    "status": true
                                },
                                "overloadIndicator": {
                                    "result": "Buzzer dan indikator berfungsi",
                                    "status": true
                                },
                                "doorOpenCloseButtons": {
                                    "result": "Berfungsi",
                                    "status": true
                                },
                                "floorButtons": {
                                    "result": "Semua berfungsi",
                                    "status": true
                                },
                                "alarmButton": {
                                    "result": "Berfungsi",
                                    "status": true
                                },
                                "twoWayIntercom": {
                                    "result": "Berfungsi",
                                    "status": true
                                }
                            },
                            "carRoofStrength": {
                                "result": "Kuat, tidak ada deformasi",
                                "status": true
                            },
                            "carTopEmergencyExit": {
                                "result": "Saklar berfungsi, mudah dibuka dari luar",
                                "status": true
                            },
                            "carSideEmergencyExit": {
                                "result": "N/A",
                                "status": true
                            },
                            "carTopGuardRail": {
                                "result": "Ketinggian 1100mm, kokoh",
                                "status": true
                            },
                            "guardRailHeight300to850": {
                                "result": "N/A",
                                "status": true
                            },
                            "guardRailHeightOver850": {
                                "result": "Ketinggian 1100mm, sesuai",
                                "status": true
                            },
                            "carTopLighting": {
                                "result": "Penerangan 150 lux",
                                "status": true
                            },
                            "manualOperationButtons": {
                                "result": "Tombol inspeksi berfungsi",
                                "status": true
                            },
                            "carInterior": {
                                "result": "Bahan tidak mudah terbakar dan aman",
                                "status": true
                            }
                        },
                        "governorAndSafetyBrake": {
                            "governorRopeClamp": {
                                "result": "Berfungsi saat tes overspeed",
                                "status": true
                            },
                            "governorSwitch": {
                                "result": "Berfungsi",
                                "status": true
                            },
                            "safetyBrakeSpeed": {
                                "result": "Aktif pada 120% kecepatan normal",
                                "status": true
                            },
                            "safetyBrakeType": {
                                "result": "Tipe Progressive (Berangsur)",
                                "status": true
                            },
                            "safetyBrakeMechanism": {
                                "result": "Mekanikal, tidak menggunakan listrik/hidrolik",
                                "status": true
                            },
                            "progressiveSafetyBrake": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "instantaneousSafetyBrake": {
                                "result": "N/A",
                                "status": true
                            },
                            "safetyBrakeOperation": {
                                "result": "Bekerja serempak pada kedua rel",
                                "status": true
                            },
                            "electricalCutoutSwitch": {
                                "result": "Berfungsi",
                                "status": true
                            },
                            "limitSwitch": {
                                "result": "Normal dan final limit berfungsi",
                                "status": true
                            },
                            "overloadDevice": {
                                "result": "Berfungsi pada beban 110%",
                                "status": true
                            }
                        },
                        "counterweightGuideRailsAndBuffers": {
                            "counterweightMaterial": {
                                "result": "Steel block",
                                "status": true
                            },
                            "counterweightGuardScreen": {
                                "result": "Terpasang dengan ketinggian 2.5m",
                                "status": true
                            },
                            "guideRailConstruction": {
                                "result": "Rel pemandu kokoh dan lurus",
                                "status": true
                            },
                            "bufferType": {
                                "result": "Tipe hidrolik",
                                "status": true
                            },
                            "bufferFunction": {
                                "result": "Bekerja dengan baik, meredam secara bertahap",
                                "status": true
                            },
                            "bufferSafetySwitch": {
                                "result": "Berfungsi saat buffer tertekan",
                                "status": true
                            }
                        },
                        "electricalInstallation": {
                            "installationStandard": {
                                "result": "Sesuai SNI dan PUIL",
                                "status": true
                            },
                            "electricalPanel": {
                                "result": "Panel khusus dan aman",
                                "status": true
                            },
                            "backupPowerARD": {
                                "result": "Tersedia dan berfungsi",
                                "status": true
                            },
                            "groundingCable": {
                                "result": "Penampang 12mm, resistansi 1.5 Ohm",
                                "status": true
                            },
                            "fireAlarmConnection": {
                                "result": "Terhubung ke sistem alarm gedung",
                                "status": true
                            },
                            "fireServiceElevator": {
                                "backupPower": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "specialOperation": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "fireSwitch": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "label": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "electricalFireResistance": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "hoistwayWallFireResistance": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "carSize": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "doorSize": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "travelTime": {
                                    "result": "N/A",
                                    "status": true
                                },
                                "evacuationFloor": {
                                    "result": "N/A",
                                    "status": true
                                }
                            },
                            "accessibilityElevator": {
                                "operatingPanel": {
                                    "result": "Terdapat huruf braile",
                                    "status": true
                                },
                                "panelHeight": {
                                    "result": "1000mm dari lantai",
                                    "status": true
                                },
                                "doorOpenTime": {
                                    "result": "Setting > 5 detik",
                                    "status": true
                                },
                                "doorWidth": {
                                    "result": "Bukaan 800mm",
                                    "status": true
                                },
                                "audioInformation": {
                                    "result": "Tersedia informasi suara untuk setiap lantai",
                                    "status": true
                                },
                                "label": {
                                    "result": "Tersedia label disabilitas",
                                    "status": true
                                }
                            },
                            "seismicSensor": {
                                "availability": {
                                    "result": "Tersedia",
                                    "status": true
                                },
                                "function": {
                                    "result": "Berfungsi saat disimulasikan",
                                    "status": true
                                }
                            }
                        }
                    },
                    "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal.",
                    "documentType": "Laporan",
                    "createdAt": "2025-07-07T03:36:47.176Z"
                },
                {
                    "id": "tyoLG0AVftU5EaOyk3cE",
                    "inspectionType": "Elevator dan Eskalator",
                    "subInspectionType": "Elevator",
                    "examinationType": "Pemeriksaan dan Pengujian Berkala",
                    "equipmentType": "Elevator Penumpang",
                    "technicalDocumentInspection": {
                        "designDrawing": "Tersedia dan sesuai",
                        "technicalCalculation": "Lengkap",
                        "materialCertificate": "Lengkap",
                        "controlPanelDiagram": "Tersedia dan sesuai",
                        "asBuiltDrawing": "Tersedia",
                        "componentCertificates": "Lengkap",
                        "safeWorkProcedure": "Tersedia dan dipahami"
                    },
                    "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal.",
                    "documentType": "Laporan",
                    "createdAt": "2025-07-07T02:56:23.189Z",
                    "subNameOfInspectionType": "Elevator",
                    "typeInspection": "Pemeriksaan dan Pengujian Berkala",
                    "EskOrElevType": "Elevator Penumpang",
                    "generalData": {
                        "ownerName": "PT JOSSSSSSSSSSSS IPAN",
                        "ownerAddress": "Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan",
                        "nameUsageLocation": "Menara Perkantoran Sentral",
                        "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
                        "manufacturerOrInstaller": "PT Elevator Maju Jaya",
                        "elevatorType": "Traction",
                        "brandOrType": "MajuLift Pro-X",
                        "countryAndYear": "Jepang / 2022",
                        "serialNumber": "MLPX-2022-12345",
                        "capacity": "1000 kg / 15 orang",
                        "speed": "150 m/min",
                        "floorsServed": "20 lantai (1-20)",
                        "permitNumber": "SKP-ELEV-001/2022",
                        "inspectionDate": "2024-07-15"
                    },
                    "nameOfInspectionType": "Elevator dan Eskalator",
                    "inspectionAndTesting": {
                        "machineRoomAndMachinery": {
                            "machineMounting": {
                                "result": "Tidak ada getaran berlebih",
                                "status": true
                            },
                            "mechanicalBrake": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "electricalBrake": {
                                "result": "Switch berfungsi normal",
                                "status": true
                            },
                            "machineRoomConstruction": {
                                "result": "Kuat, bersih, dan tahan api",
                                "status": true
                            },
                            "machineRoomClearance": {
                                "result": "Sesuai standar",
                                "status": true
                            },
                            "machineRoomImplementation": {
                                "result": "Penerangan 150 lux di area kerja",
                                "status": true
                            },
                            "ventilation": {
                                "result": "Sirkulasi udara baik",
                                "status": true
                            },
                            "machineRoomDoor": {
                                "result": "Membuka keluar, tahan api",
                                "status": true
                            },
                            "mainPowerPanelPosition": {
                                "result": "Terpasang di dalam kamar mesin",
                                "status": true
                            },
                            "rotatingPartsGuard": {
                                "result": "Terpasang dengan baik",
                                "status": true
                            },
                            "ropeHoleGuard": {
                                "result": "Ketinggian 60mm, aman",
                                "status": true
                            },
                            "machineRoomAccessLadder": {
                                "result": "Permanen dan kokoh",
                                "status": true
                            },
                            "floorLevelDifference": {
                                "result": "Tidak ada perbedaan ketinggian",
                                "status": true
                            },
                            "fireExtinguisher": {
                                "result": "Tersedia APAR jenis CO2 5kg",
                                "status": true
                            },
                            "machineRoomless": {
                                "panelPlacement": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "lightingWorkArea": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "lightingBetweenWorkArea": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "manualBrakeRelease": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "fireExtinguisherPlacement": {
                                    "result": "bagus",
                                    "status": true
                                }
                            },
                            "emergencyStopSwitch": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            }
                        },
                        "suspensionRopesAndBelts": {
                            "condition": {
                                "result": "Tidak ada cacat atau karat",
                                "status": true
                            },
                            "chainUsage": {
                                "result": "Tidak menggunakan rantai",
                                "status": true
                            },
                            "safetyFactor": {
                                "result": "Sesuai standar (11.5x)",
                                "status": true
                            },
                            "ropeWithCounterweight": {
                                "result": "4 jalur, diameter 8mm",
                                "status": true
                            },
                            "ropeWithoutCounterweight": {
                                "result": "bagus",
                                "status": true
                            },
                            "belt": {
                                "result": "bagus",
                                "status": true
                            },
                            "slackRopeDevice": {
                                "result": "bagus",
                                "status": true
                            }
                        },
                        "drumsAndSheaves": {
                            "drumGrooves": {
                                "result": "Alur dalam kondisi baik",
                                "status": true
                            },
                            "passengerDrumDiameter": {
                                "result": "Rasio 42:1, sesuai",
                                "status": true
                            },
                            "governorDrumDiameter": {
                                "result": "Rasio 26:1, sesuai",
                                "status": true
                            }
                        },
                        "hoistwayAndPit": {
                            "construction": {
                                "result": "Struktur kokoh dan tertutup",
                                "status": true
                            },
                            "walls": {
                                "result": "Halus dan bebas tonjolan",
                                "status": true
                            },
                            "inclinedElevatorTrackBed": {
                                "result": "bagus",
                                "status": true
                            },
                            "cleanliness": {
                                "result": "Bersih dari debu dan oli",
                                "status": true
                            },
                            "lighting": {
                                "result": "Penerangan 120 lux",
                                "status": true
                            },
                            "emergencyDoorNonStop": {
                                "result": "Jarak antar pintu sesuai",
                                "status": true
                            },
                            "emergencyDoorSize": {
                                "result": "Ukuran sesuai standar",
                                "status": true
                            },
                            "emergencyDoorSafetySwitch": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "emergencyDoorBridge": {
                                "result": "bagus",
                                "status": true
                            },
                            "carTopClearance": {
                                "result": "Ruang bebas 600mm",
                                "status": true
                            },
                            "pitClearance": {
                                "result": "Ruang bebas 600mm",
                                "status": true
                            },
                            "pitLadder": {
                                "result": "Tersedia dan kokoh",
                                "status": true
                            },
                            "pitBelowWorkingArea": {
                                "result": "Lantai kuat, tidak ada ruang kerja di bawah",
                                "status": true
                            },
                            "pitAccessSwitch": {
                                "result": "Saklar berfungsi",
                                "status": true
                            },
                            "pitScreen": {
                                "result": "bagus",
                                "status": true
                            },
                            "hoistwayDoorLeaf": {
                                "result": "Tahan api 2 jam",
                                "status": true
                            },
                            "hoistwayDoorInterlock": {
                                "result": "Bekerja dengan baik",
                                "status": true
                            },
                            "floorLeveling": {
                                "result": "Akurasi perataan lantai < 5mm",
                                "status": true
                            },
                            "hoistwaySeparatorBeam": {
                                "result": "bagus",
                                "status": true
                            },
                            "inclinedElevatorStairs": {
                                "result": "bagus",
                                "status": true
                            }
                        },
                        "car": {
                            "frame": {
                                "result": "Struktur rangka kokoh",
                                "status": true
                            },
                            "body": {
                                "result": "Tertutup penuh, interior baik",
                                "status": true
                            },
                            "wallHeight": {
                                "result": "2200mm",
                                "status": true
                            },
                            "floorArea": {
                                "result": "Sesuai kapasitas",
                                "status": true
                            },
                            "carAreaExpansion": {
                                "result": "Tidak ada perluasan",
                                "status": true
                            },
                            "carDoor": {
                                "result": "Otomatis, berfungsi mulus",
                                "status": true
                            },
                            "carDoorSpecs": {
                                "size": {
                                    "result": "800mm x 2100mm",
                                    "status": true
                                },
                                "lockAndSwitch": {
                                    "result": "Berfungsi dengan baik",
                                    "status": true
                                },
                                "sillClearance": {
                                    "result": "Celah 30mm, sesuai",
                                    "status": true
                                }
                            },
                            "carToBeamClearance": {
                                "result": "bagus",
                                "status": true
                            },
                            "alarmBell": {
                                "result": "Berbunyi nyaring",
                                "status": true
                            },
                            "backupPowerARD": {
                                "result": "Berfungsi saat tes, membawa ke lantai terdekat",
                                "status": true
                            },
                            "intercom": {
                                "result": "Komunikasi 2 arah jelas",
                                "status": true
                            },
                            "ventilation": {
                                "result": "Fan berfungsi baik",
                                "status": true
                            },
                            "emergencyLighting": {
                                "result": "Menyala otomatis saat listrik padam",
                                "status": true
                            },
                            "operatingPanel": {
                                "result": "Semua tombol berfungsi",
                                "status": true
                            },
                            "carPositionIndicator": {
                                "result": "Akurat",
                                "status": true
                            },
                            "carSignage": {
                                "manufacturerName": {
                                    "result": "Terpasang",
                                    "status": true
                                },
                                "loadCapacity": {
                                    "result": "Terpasang jelas",
                                    "status": true
                                },
                                "noSmokingSign": {
                                    "result": "Terpasang",
                                    "status": true
                                },
                                "overloadIndicator": {
                                    "result": "Buzzer dan indikator berfungsi",
                                    "status": true
                                },
                                "doorOpenCloseButtons": {
                                    "result": "Berfungsi",
                                    "status": true
                                },
                                "floorButtons": {
                                    "result": "Semua berfungsi",
                                    "status": true
                                },
                                "alarmButton": {
                                    "result": "Berfungsi",
                                    "status": true
                                },
                                "twoWayIntercom": {
                                    "result": "Berfungsi",
                                    "status": true
                                }
                            },
                            "carRoofStrength": {
                                "result": "Kuat, tidak ada deformasi",
                                "status": true
                            },
                            "carTopEmergencyExit": {
                                "result": "Saklar berfungsi, mudah dibuka dari luar",
                                "status": true
                            },
                            "carSideEmergencyExit": {
                                "result": "bagus",
                                "status": true
                            },
                            "carTopGuardRail": {
                                "result": "Ketinggian 1100mm, kokoh",
                                "status": true
                            },
                            "guardRailHeight300to850": {
                                "result": "bagus",
                                "status": true
                            },
                            "guardRailHeightOver850": {
                                "result": "Ketinggian 1100mm, sesuai",
                                "status": true
                            },
                            "carTopLighting": {
                                "result": "Penerangan 150 lux",
                                "status": true
                            },
                            "manualOperationButtons": {
                                "result": "Tombol inspeksi berfungsi",
                                "status": true
                            },
                            "carInterior": {
                                "result": "Bahan tidak mudah terbakar dan aman",
                                "status": true
                            }
                        },
                        "governorAndSafetyBrake": {
                            "governorRopeClamp": {
                                "result": "Berfungsi saat tes overspeed",
                                "status": true
                            },
                            "governorSwitch": {
                                "result": "Berfungsi",
                                "status": true
                            },
                            "safetyBrakeSpeed": {
                                "result": "Aktif pada 120% kecepatan normal",
                                "status": true
                            },
                            "safetyBrakeType": {
                                "result": "Tipe Progressive (Berangsur)",
                                "status": true
                            },
                            "safetyBrakeMechanism": {
                                "result": "Mekanikal, tidak menggunakan listrik/hidrolik",
                                "status": true
                            },
                            "progressiveSafetyBrake": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "instantaneousSafetyBrake": {
                                "result": "bagus",
                                "status": true
                            },
                            "safetyBrakeOperation": {
                                "result": "Bekerja serempak pada kedua rel",
                                "status": true
                            },
                            "electricalCutoutSwitch": {
                                "result": "Berfungsi",
                                "status": true
                            },
                            "limitSwitch": {
                                "result": "Normal dan final limit berfungsi",
                                "status": true
                            },
                            "overloadDevice": {
                                "result": "Berfungsi pada beban 110%",
                                "status": true
                            }
                        },
                        "counterweightGuideRailsAndBuffers": {
                            "counterweightMaterial": {
                                "result": "Steel block",
                                "status": true
                            },
                            "counterweightGuardScreen": {
                                "result": "Terpasang dengan ketinggian 2.5m",
                                "status": true
                            },
                            "guideRailConstruction": {
                                "result": "Rel pemandu kokoh dan lurus",
                                "status": true
                            },
                            "bufferType": {
                                "result": "Tipe hidrolik",
                                "status": true
                            },
                            "bufferFunction": {
                                "result": "Bekerja dengan baik, meredam secara bertahap",
                                "status": true
                            },
                            "bufferSafetySwitch": {
                                "result": "Berfungsi saat buffer tertekan",
                                "status": true
                            }
                        },
                        "electricalInstallation": {
                            "installationStandard": {
                                "result": "Sesuai SNI dan PUIL",
                                "status": true
                            },
                            "electricalPanel": {
                                "result": "Panel khusus dan aman",
                                "status": true
                            },
                            "backupPowerARD": {
                                "result": "Tersedia dan berfungsi",
                                "status": true
                            },
                            "groundingCable": {
                                "result": "Penampang 12mm, resistansi 1.5 Ohm",
                                "status": true
                            },
                            "fireAlarmConnection": {
                                "result": "Terhubung ke sistem alarm gedung",
                                "status": true
                            },
                            "fireServiceElevator": {
                                "backupPower": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "specialOperation": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "fireSwitch": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "label": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "electricalFireResistance": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "hoistwayWallFireResistance": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "carSize": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "doorSize": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "travelTime": {
                                    "result": "bagus",
                                    "status": true
                                },
                                "evacuationFloor": {
                                    "result": "bagus",
                                    "status": true
                                }
                            },
                            "accessibilityElevator": {
                                "operatingPanel": {
                                    "result": "Terdapat huruf braile",
                                    "status": true
                                },
                                "panelHeight": {
                                    "result": "1000mm dari lantai",
                                    "status": true
                                },
                                "doorOpenTime": {
                                    "result": "Setting > 5 detik",
                                    "status": true
                                },
                                "doorWidth": {
                                    "result": "Bukaan 800mm",
                                    "status": true
                                },
                                "audioInformation": {
                                    "result": "Tersedia informasi suara untuk setiap lantai",
                                    "status": true
                                },
                                "label": {
                                    "result": "Tersedia label disabilitas",
                                    "status": true
                                }
                            },
                            "seismicSensor": {
                                "availability": {
                                    "result": "Tersedia",
                                    "status": true
                                },
                                "function": {
                                    "result": "Berfungsi saat disimulasikan",
                                    "status": true
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
    ```

  - **Success (200 Ok)**

  ```json
  {
      "status": "success",
      "data": {
          "Laporan": []
      }
  }
  ```

##### PUT Laporan by Id
**URL:**
`/elevatorEskalator/elevator/laporan/{id}`
**Method:**
`PUT`

- **Body Request**

  ```json
  {
    "inspectionType": "Elevator dan Eskalator",
    "subInspectionType": "Elevator",
    "examinationType": "Pemeriksaan dan Pengujian Berkala",
    "equipmentType": "Elevator Penumpang",
    "generalData": {
      "ownerName": "PT ANJAY",
      "ownerAddress": "",
      "nameUsageLocation": "",
      "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
      "manufacturerOrInstaller": "PT Elevator Maju Jaya",
      "elevatorType": "Traction",
      "brandOrType": "MajuLift Pro-X",
      "countryAndYear": "Jepang / 2022",
      "serialNumber": "MLPX-2022-12345",
      "capacity": "1000 kg / 15 orang",
      "speed": "150 m/min",
      "floorsServed": "20 lantai (1-20)",
      "permitNumber": "SKP-ELEV-001/2022",
      "inspectionDate": "2024-07-15"
    },
    "technicalDocumentInspection": {
      "designDrawing": true,
      "technicalCalculation": true,
      "materialCertificate": true,
      "controlPanelDiagram": true,
      "asBuiltDrawing": true,
      "componentCertificates": true,
      "safeWorkProcedure": true
    },
    "inspectionAndTesting": {
      "machineRoomAndMachinery": {
        "machineMounting": { "result": "Tidak ada getaran berlebih", "status": true },
        "mechanicalBrake": { "result": "Berfungsi dengan baik", "status": true },
        "electricalBrake": { "result": "Switch berfungsi normal", "status": true },
        "machineRoomConstruction": { "result": "Kuat, bersih, dan tahan api", "status": true },
        "machineRoomClearance": { "result": "Sesuai standar", "status": true },
        "machineRoomImplementation": { "result": "Penerangan 150 lux di area kerja", "status": true },
        "ventilation": { "result": "Sirkulasi udara baik", "status": true },
        "machineRoomDoor": { "result": "Membuka keluar, tahan api", "status": true },
        "mainPowerPanelPosition": { "result": "Terpasang di dalam kamar mesin", "status": true },
        "rotatingPartsGuard": { "result": "Terpasang dengan baik", "status": true },
        "ropeHoleGuard": { "result": "Ketinggian 60mm, aman", "status": true },
        "machineRoomAccessLadder": { "result": "Permanen dan kokoh", "status": true },
        "floorLevelDifference": { "result": "Tidak ada perbedaan ketinggian", "status": true },
        "fireExtinguisher": { "result": "Tersedia APAR jenis CO2 5kg", "status": true },
        "machineRoomless": {
          "panelPlacement": { "result": "N/A", "status": true },
          "lightingWorkArea": { "result": "N/A", "status": true },
          "lightingBetweenWorkArea": { "result": "N/A", "status": true },
          "manualBrakeRelease": { "result": "N/A", "status": true },
          "fireExtinguisherPlacement": { "result": "N/A", "status": true }
        },
        "emergencyStopSwitch": { "result": "Berfungsi dengan baik", "status": true }
      },
      "suspensionRopesAndBelts": {
          "condition": { "result": "Tidak ada cacat atau karat", "status": true },
          "chainUsage": { "result": "Tidak menggunakan rantai", "status": true },
          "safetyFactor": { "result": "Sesuai standar (11.5x)", "status": true },
          "ropeWithCounterweight": { "result": "4 jalur, diameter 8mm", "status": true },
          "ropeWithoutCounterweight": { "result": "N/A", "status": true },
          "belt": { "result": "N/A", "status": true },
          "slackRopeDevice": { "result": "N/A", "status": true }
      },
      "drumsAndSheaves": {
          "drumGrooves": { "result": "Alur dalam kondisi baik", "status": true },
          "passengerDrumDiameter": { "result": "Rasio 42:1, sesuai", "status": true },
          "governorDrumDiameter": { "result": "Rasio 26:1, sesuai", "status": true }
      },
      "hoistwayAndPit": {
          "construction": { "result": "Struktur kokoh dan tertutup", "status": true },
          "walls": { "result": "Halus dan bebas tonjolan", "status": true },
          "inclinedElevatorTrackBed": { "result": "N/A", "status": true },
          "cleanliness": { "result": "Bersih dari debu dan oli", "status": true },
          "lighting": { "result": "Penerangan 120 lux", "status": true },
          "emergencyDoorNonStop": { "result": "Jarak antar pintu sesuai", "status": true },
          "emergencyDoorSize": { "result": "Ukuran sesuai standar", "status": true },
          "emergencyDoorSafetySwitch": { "result": "Berfungsi dengan baik", "status": true },
          "emergencyDoorBridge": { "result": "N/A", "status": true },
          "carTopClearance": { "result": "Ruang bebas 600mm", "status": true },
          "pitClearance": { "result": "Ruang bebas 600mm", "status": true },
          "pitLadder": { "result": "Tersedia dan kokoh", "status": true },
          "pitBelowWorkingArea": { "result": "Lantai kuat, tidak ada ruang kerja di bawah", "status": true },
          "pitAccessSwitch": { "result": "Saklar berfungsi", "status": true },
          "pitScreen": { "result": "N/A", "status": true },
          "hoistwayDoorLeaf": { "result": "Tahan api 2 jam", "status": true },
          "hoistwayDoorInterlock": { "result": "Bekerja dengan baik", "status": true },
          "floorLeveling": { "result": "Akurasi perataan lantai < 5mm", "status": true },
          "hoistwaySeparatorBeam": { "result": "N/A", "status": true },
          "inclinedElevatorStairs": { "result": "N/A", "status": true }
      },
      "car": {
          "frame": { "result": "Struktur rangka kokoh", "status": true },
          "body": { "result": "Tertutup penuh, interior baik", "status": true },
          "wallHeight": { "result": "2200mm", "status": true },
          "floorArea": { "result": "Sesuai kapasitas", "status": true },
          "carAreaExpansion": { "result": "Tidak ada perluasan", "status": true },
          "carDoor": { "result": "Otomatis, berfungsi mulus", "status": true },
          "carDoorSpecs": {
              "size": { "result": "800mm x 2100mm", "status": true },
              "lockAndSwitch": { "result": "Berfungsi dengan baik", "status": true },
              "sillClearance": { "result": "Celah 30mm, sesuai", "status": true }
          },
          "carToBeamClearance": { "result": "N/A", "status": true },
          "alarmBell": { "result": "Berbunyi nyaring", "status": true },
          "backupPowerARD": { "result": "Berfungsi saat tes, membawa ke lantai terdekat", "status": true },
          "intercom": { "result": "Komunikasi 2 arah jelas", "status": true },
          "ventilation": { "result": "Fan berfungsi baik", "status": true },
          "emergencyLighting": { "result": "Menyala otomatis saat listrik padam", "status": true },
          "operatingPanel": { "result": "Semua tombol berfungsi", "status": true },
          "carPositionIndicator": { "result": "Akurat", "status": true },
          "carSignage": {
              "manufacturerName": { "result": "Terpasang", "status": true },
              "loadCapacity": { "result": "Terpasang jelas", "status": true },
              "noSmokingSign": { "result": "Terpasang", "status": true },
              "overloadIndicator": { "result": "Buzzer dan indikator berfungsi", "status": true },
              "doorOpenCloseButtons": { "result": "Berfungsi", "status": true },
              "floorButtons": { "result": "Semua berfungsi", "status": true },
              "alarmButton": { "result": "Berfungsi", "status": true },
              "twoWayIntercom": { "result": "Berfungsi", "status": true }
          },
          "carRoofStrength": { "result": "Kuat, tidak ada deformasi", "status": true },
          "carTopEmergencyExit": { "result": "Saklar berfungsi, mudah dibuka dari luar", "status": true },
          "carSideEmergencyExit": { "result": "N/A", "status": true },
          "carTopGuardRail": { "result": "Ketinggian 1100mm, kokoh", "status": true },
          "guardRailHeight300to850": { "result": "N/A", "status": true },
          "guardRailHeightOver850": { "result": "Ketinggian 1100mm, sesuai", "status": true },
          "carTopLighting": { "result": "Penerangan 150 lux", "status": true },
          "manualOperationButtons": { "result": "Tombol inspeksi berfungsi", "status": true },
          "carInterior": { "result": "Bahan tidak mudah terbakar dan aman", "status": true }
      },
      "governorAndSafetyBrake": {
          "governorRopeClamp": { "result": "Berfungsi saat tes overspeed", "status": true },
          "governorSwitch": { "result": "Berfungsi", "status": true },
          "safetyBrakeSpeed": { "result": "Aktif pada 120% kecepatan normal", "status": true },
          "safetyBrakeType": { "result": "Tipe Progressive (Berangsur)", "status": true },
          "safetyBrakeMechanism": { "result": "Mekanikal, tidak menggunakan listrik/hidrolik", "status": true },
          "progressiveSafetyBrake": { "result": "Berfungsi dengan baik", "status": true },
          "instantaneousSafetyBrake": { "result": "N/A", "status": true },
          "safetyBrakeOperation": { "result": "Bekerja serempak pada kedua rel", "status": true },
          "electricalCutoutSwitch": { "result": "Berfungsi", "status": true },
          "limitSwitch": { "result": "Normal dan final limit berfungsi", "status": true },
          "overloadDevice": { "result": "Berfungsi pada beban 110%", "status": true }
      },
      "counterweightGuideRailsAndBuffers": {
          "counterweightMaterial": { "result": "Steel block", "status": true },
          "counterweightGuardScreen": { "result": "Terpasang dengan ketinggian 2.5m", "status": true },
          "guideRailConstruction": { "result": "Rel pemandu kokoh dan lurus", "status": true },
          "bufferType": { "result": "Tipe hidrolik", "status": true },
          "bufferFunction": { "result": "Bekerja dengan baik, meredam secara bertahap", "status": true },
          "bufferSafetySwitch": { "result": "Berfungsi saat buffer tertekan", "status": true }
      },
      "electricalInstallation": {
          "installationStandard": { "result": "Sesuai SNI dan PUIL", "status": true },
          "electricalPanel": { "result": "Panel khusus dan aman", "status": true },
          "backupPowerARD": { "result": "Tersedia dan berfungsi", "status": true },
          "groundingCable": { "result": "Penampang 12mm, resistansi 1.5 Ohm", "status": true },
          "fireAlarmConnection": { "result": "Terhubung ke sistem alarm gedung", "status": true },
          "fireServiceElevator": {
              "backupPower": { "result": "N/A", "status": true },
              "specialOperation": { "result": "N/A", "status": true },
              "fireSwitch": { "result": "N/A", "status": true },
              "label": { "result": "N/A", "status": true },
              "electricalFireResistance": { "result": "N/A", "status": true },
              "hoistwayWallFireResistance": { "result": "N/A", "status": true },
              "carSize": { "result": "N/A", "status": true },
              "doorSize": { "result": "N/A", "status": true },
              "travelTime": { "result": "N/A", "status": true },
              "evacuationFloor": { "result": "N/A", "status": true }
          },
          "accessibilityElevator": {
              "operatingPanel": { "result": "Terdapat huruf braile", "status": true },
              "panelHeight": { "result": "1000mm dari lantai", "status": true },
              "doorOpenTime": { "result": "Setting > 5 detik", "status": true },
              "doorWidth": { "result": "Bukaan 800mm", "status": true },
              "audioInformation": { "result": "Tersedia informasi suara untuk setiap lantai", "status": true },
              "label": { "result": "Tersedia label disabilitas", "status": true }
          },
          "seismicSensor": {
              "availability": { "result": "Tersedia", "status": true },
              "function": { "result": "Berfungsi saat disimulasikan", "status": true }
          }
      }
    },
    "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal."
  }
  ```


**Response:**

  - **Success (200 Ok)**

    ```json
    {
        "status": "success",
        "message": "Laporan elevator berhasil diperbarui",
        "data": {
            "Laporan": {
                "id": "3IDZ8sZTDW8PIQcXEOfO",
                "inspectionType": "Elevator dan Eskalator",
                "subInspectionType": "Elevator",
                "examinationType": "Pemeriksaan dan Pengujian Berkala",
                "equipmentType": "Elevator Penumpang",
                "conclusion": "Berdasarkan hasil pemeriksaan dan pengujian, elevator penumpang dinyatakan LAIK dan aman untuk dioperasikan. Beberapa rekomendasi perbaikan kecil telah dicatat untuk pemeliharaan selanjutnya. Pemeliharaan rutin harus tetap dijalankan sesuai jadwal.",
                "documentType": "Laporan",
                "createdAt": "2025-07-07T04:26:41.545Z",
                "subNameOfInspectionType": "Elevator",
                "typeInspection": "Pemeriksaan dan Pengujian Berkala",
                "technicalDocumentInspection": {
                    "designDrawing": "Tersedia dan sesuai",
                    "technicalCalculation": "Lengkap",
                    "materialCertificate": "Lengkap",
                    "controlPanelDiagram": "Tersedia dan sesuai",
                    "asBuiltDrawing": "Tersedia",
                    "componentCertificates": "Lengkap",
                    "safeWorkProcedure": "Tersedia dan dipahami"
                },
                "EskOrElevType": "Elevator Penumpang",
                "generalData": {
                    "ownerName": "PT JOSSSSSSSSSSSS IPAN",
                    "ownerAddress": "Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan",
                    "nameUsageLocation": "Menara Perkantoran Sentral",
                    "addressUsageLocation": "Jl. MH Thamrin No. 1, Jakarta Pusat",
                    "manufacturerOrInstaller": "PT Elevator Maju Jaya",
                    "elevatorType": "Traction",
                    "brandOrType": "MajuLift Pro-X",
                    "countryAndYear": "Jepang / 2022",
                    "serialNumber": "MLPX-2022-12345",
                    "capacity": "1000 kg / 15 orang",
                    "speed": "150 m/min",
                    "floorsServed": "20 lantai (1-20)",
                    "permitNumber": "SKP-ELEV-001/2022",
                    "inspectionDate": "2024-07-15"
                },
                "nameOfInspectionType": "Elevator dan Eskalator",
                "inspectionAndTesting": {
                    "machineRoomAndMachinery": {
                        "machineMounting": {
                            "result": "Tidak ada getaran berlebih",
                            "status": true
                        },
                        "mechanicalBrake": {
                            "result": "Berfungsi dengan baik",
                            "status": true
                        },
                        "electricalBrake": {
                            "result": "Switch berfungsi normal",
                            "status": true
                        },
                        "machineRoomConstruction": {
                            "result": "Kuat, bersih, dan tahan api",
                            "status": true
                        },
                        "machineRoomClearance": {
                            "result": "Sesuai standar",
                            "status": true
                        },
                        "machineRoomImplementation": {
                            "result": "Penerangan 150 lux di area kerja",
                            "status": true
                        },
                        "ventilation": {
                            "result": "Sirkulasi udara baik",
                            "status": true
                        },
                        "machineRoomDoor": {
                            "result": "Membuka keluar, tahan api",
                            "status": true
                        },
                        "mainPowerPanelPosition": {
                            "result": "Terpasang di dalam kamar mesin",
                            "status": true
                        },
                        "rotatingPartsGuard": {
                            "result": "Terpasang dengan baik",
                            "status": true
                        },
                        "ropeHoleGuard": {
                            "result": "Ketinggian 60mm, aman",
                            "status": true
                        },
                        "machineRoomAccessLadder": {
                            "result": "Permanen dan kokoh",
                            "status": true
                        },
                        "floorLevelDifference": {
                            "result": "Tidak ada perbedaan ketinggian",
                            "status": true
                        },
                        "fireExtinguisher": {
                            "result": "Tersedia APAR jenis CO2 5kg",
                            "status": true
                        },
                        "machineRoomless": {
                            "panelPlacement": {
                                "result": "bagus",
                                "status": true
                            },
                            "lightingWorkArea": {
                                "result": "bagus",
                                "status": true
                            },
                            "lightingBetweenWorkArea": {
                                "result": "bagus",
                                "status": true
                            },
                            "manualBrakeRelease": {
                                "result": "bagus",
                                "status": true
                            },
                            "fireExtinguisherPlacement": {
                                "result": "bagus",
                                "status": true
                            }
                        },
                        "emergencyStopSwitch": {
                            "result": "Berfungsi dengan baik",
                            "status": true
                        }
                    },
                    "suspensionRopesAndBelts": {
                        "condition": {
                            "result": "Tidak ada cacat atau karat",
                            "status": true
                        },
                        "chainUsage": {
                            "result": "Tidak menggunakan rantai",
                            "status": true
                        },
                        "safetyFactor": {
                            "result": "Sesuai standar (11.5x)",
                            "status": true
                        },
                        "ropeWithCounterweight": {
                            "result": "4 jalur, diameter 8mm",
                            "status": true
                        },
                        "ropeWithoutCounterweight": {
                            "result": "bagus",
                            "status": true
                        },
                        "belt": {
                            "result": "bagus",
                            "status": true
                        },
                        "slackRopeDevice": {
                            "result": "bagus",
                            "status": true
                        }
                    },
                    "drumsAndSheaves": {
                        "drumGrooves": {
                            "result": "Alur dalam kondisi baik",
                            "status": true
                        },
                        "passengerDrumDiameter": {
                            "result": "Rasio 42:1, sesuai",
                            "status": true
                        },
                        "governorDrumDiameter": {
                            "result": "Rasio 26:1, sesuai",
                            "status": true
                        }
                    },
                    "hoistwayAndPit": {
                        "construction": {
                            "result": "Struktur kokoh dan tertutup",
                            "status": true
                        },
                        "walls": {
                            "result": "Halus dan bebas tonjolan",
                            "status": true
                        },
                        "inclinedElevatorTrackBed": {
                            "result": "bagus",
                            "status": true
                        },
                        "cleanliness": {
                            "result": "Bersih dari debu dan oli",
                            "status": true
                        },
                        "lighting": {
                            "result": "Penerangan 120 lux",
                            "status": true
                        },
                        "emergencyDoorNonStop": {
                            "result": "Jarak antar pintu sesuai",
                            "status": true
                        },
                        "emergencyDoorSize": {
                            "result": "Ukuran sesuai standar",
                            "status": true
                        },
                        "emergencyDoorSafetySwitch": {
                            "result": "Berfungsi dengan baik",
                            "status": true
                        },
                        "emergencyDoorBridge": {
                            "result": "bagus",
                            "status": true
                        },
                        "carTopClearance": {
                            "result": "Ruang bebas 600mm",
                            "status": true
                        },
                        "pitClearance": {
                            "result": "Ruang bebas 600mm",
                            "status": true
                        },
                        "pitLadder": {
                            "result": "Tersedia dan kokoh",
                            "status": true
                        },
                        "pitBelowWorkingArea": {
                            "result": "Lantai kuat, tidak ada ruang kerja di bawah",
                            "status": true
                        },
                        "pitAccessSwitch": {
                            "result": "Saklar berfungsi",
                            "status": true
                        },
                        "pitScreen": {
                            "result": "bagus",
                            "status": true
                        },
                        "hoistwayDoorLeaf": {
                            "result": "Tahan api 2 jam",
                            "status": true
                        },
                        "hoistwayDoorInterlock": {
                            "result": "Bekerja dengan baik",
                            "status": true
                        },
                        "floorLeveling": {
                            "result": "Akurasi perataan lantai < 5mm",
                            "status": true
                        },
                        "hoistwaySeparatorBeam": {
                            "result": "bagus",
                            "status": true
                        },
                        "inclinedElevatorStairs": {
                            "result": "bagus",
                            "status": true
                        }
                    },
                    "car": {
                        "frame": {
                            "result": "Struktur rangka kokoh",
                            "status": true
                        },
                        "body": {
                            "result": "Tertutup penuh, interior baik",
                            "status": true
                        },
                        "wallHeight": {
                            "result": "2200mm",
                            "status": true
                        },
                        "floorArea": {
                            "result": "Sesuai kapasitas",
                            "status": true
                        },
                        "carAreaExpansion": {
                            "result": "Tidak ada perluasan",
                            "status": true
                        },
                        "carDoor": {
                            "result": "Otomatis, berfungsi mulus",
                            "status": true
                        },
                        "carDoorSpecs": {
                            "size": {
                                "result": "800mm x 2100mm",
                                "status": true
                            },
                            "lockAndSwitch": {
                                "result": "Berfungsi dengan baik",
                                "status": true
                            },
                            "sillClearance": {
                                "result": "Celah 30mm, sesuai",
                                "status": true
                            }
                        },
                        "carToBeamClearance": {
                            "result": "bagus",
                            "status": true
                        },
                        "alarmBell": {
                            "result": "Berbunyi nyaring",
                            "status": true
                        },
                        "backupPowerARD": {
                            "result": "Berfungsi saat tes, membawa ke lantai terdekat",
                            "status": true
                        },
                        "intercom": {
                            "result": "Komunikasi 2 arah jelas",
                            "status": true
                        },
                        "ventilation": {
                            "result": "Fan berfungsi baik",
                            "status": true
                        },
                        "emergencyLighting": {
                            "result": "Menyala otomatis saat listrik padam",
                            "status": true
                        },
                        "operatingPanel": {
                            "result": "Semua tombol berfungsi",
                            "status": true
                        },
                        "carPositionIndicator": {
                            "result": "Akurat",
                            "status": true
                        },
                        "carSignage": {
                            "manufacturerName": {
                                "result": "Terpasang",
                                "status": true
                            },
                            "loadCapacity": {
                                "result": "Terpasang jelas",
                                "status": true
                            },
                            "noSmokingSign": {
                                "result": "Terpasang",
                                "status": true
                            },
                            "overloadIndicator": {
                                "result": "Buzzer dan indikator berfungsi",
                                "status": true
                            },
                            "doorOpenCloseButtons": {
                                "result": "Berfungsi",
                                "status": true
                            },
                            "floorButtons": {
                                "result": "Semua berfungsi",
                                "status": true
                            },
                            "alarmButton": {
                                "result": "Berfungsi",
                                "status": true
                            },
                            "twoWayIntercom": {
                                "result": "Berfungsi",
                                "status": true
                            }
                        },
                        "carRoofStrength": {
                            "result": "Kuat, tidak ada deformasi",
                            "status": true
                        },
                        "carTopEmergencyExit": {
                            "result": "Saklar berfungsi, mudah dibuka dari luar",
                            "status": true
                        },
                        "carSideEmergencyExit": {
                            "result": "bagus",
                            "status": true
                        },
                        "carTopGuardRail": {
                            "result": "Ketinggian 1100mm, kokoh",
                            "status": true
                        },
                        "guardRailHeight300to850": {
                            "result": "bagus",
                            "status": true
                        },
                        "guardRailHeightOver850": {
                            "result": "Ketinggian 1100mm, sesuai",
                            "status": true
                        },
                        "carTopLighting": {
                            "result": "Penerangan 150 lux",
                            "status": true
                        },
                        "manualOperationButtons": {
                            "result": "Tombol inspeksi berfungsi",
                            "status": true
                        },
                        "carInterior": {
                            "result": "Bahan tidak mudah terbakar dan aman",
                            "status": true
                        }
                    },
                    "governorAndSafetyBrake": {
                        "governorRopeClamp": {
                            "result": "Berfungsi saat tes overspeed",
                            "status": true
                        },
                        "governorSwitch": {
                            "result": "Berfungsi",
                            "status": true
                        },
                        "safetyBrakeSpeed": {
                            "result": "Aktif pada 120% kecepatan normal",
                            "status": true
                        },
                        "safetyBrakeType": {
                            "result": "Tipe Progressive (Berangsur)",
                            "status": true
                        },
                        "safetyBrakeMechanism": {
                            "result": "Mekanikal, tidak menggunakan listrik/hidrolik",
                            "status": true
                        },
                        "progressiveSafetyBrake": {
                            "result": "Berfungsi dengan baik",
                            "status": true
                        },
                        "instantaneousSafetyBrake": {
                            "result": "bagus",
                            "status": true
                        },
                        "safetyBrakeOperation": {
                            "result": "Bekerja serempak pada kedua rel",
                            "status": true
                        },
                        "electricalCutoutSwitch": {
                            "result": "Berfungsi",
                            "status": true
                        },
                        "limitSwitch": {
                            "result": "Normal dan final limit berfungsi",
                            "status": true
                        },
                        "overloadDevice": {
                            "result": "Berfungsi pada beban 110%",
                            "status": true
                        }
                    },
                    "counterweightGuideRailsAndBuffers": {
                        "counterweightMaterial": {
                            "result": "Steel block",
                            "status": true
                        },
                        "counterweightGuardScreen": {
                            "result": "Terpasang dengan ketinggian 2.5m",
                            "status": true
                        },
                        "guideRailConstruction": {
                            "result": "Rel pemandu kokoh dan lurus",
                            "status": true
                        },
                        "bufferType": {
                            "result": "Tipe hidrolik",
                            "status": true
                        },
                        "bufferFunction": {
                            "result": "Bekerja dengan baik, meredam secara bertahap",
                            "status": true
                        },
                        "bufferSafetySwitch": {
                            "result": "Berfungsi saat buffer tertekan",
                            "status": true
                        }
                    },
                    "electricalInstallation": {
                        "installationStandard": {
                            "result": "Sesuai SNI dan PUIL",
                            "status": true
                        },
                        "electricalPanel": {
                            "result": "Panel khusus dan aman",
                            "status": true
                        },
                        "backupPowerARD": {
                            "result": "Tersedia dan berfungsi",
                            "status": true
                        },
                        "groundingCable": {
                            "result": "Penampang 12mm, resistansi 1.5 Ohm",
                            "status": true
                        },
                        "fireAlarmConnection": {
                            "result": "Terhubung ke sistem alarm gedung",
                            "status": true
                        },
                        "fireServiceElevator": {
                            "backupPower": {
                                "result": "bagus",
                                "status": true
                            },
                            "specialOperation": {
                                "result": "bagus",
                                "status": true
                            },
                            "fireSwitch": {
                                "result": "bagus",
                                "status": true
                            },
                            "label": {
                                "result": "bagus",
                                "status": true
                            },
                            "electricalFireResistance": {
                                "result": "bagus",
                                "status": true
                            },
                            "hoistwayWallFireResistance": {
                                "result": "bagus",
                                "status": true
                            },
                            "carSize": {
                                "result": "bagus",
                                "status": true
                            },
                            "doorSize": {
                                "result": "bagus",
                                "status": true
                            },
                            "travelTime": {
                                "result": "bagus",
                                "status": true
                            },
                            "evacuationFloor": {
                                "result": "bagus",
                                "status": true
                            }
                        },
                        "accessibilityElevator": {
                            "operatingPanel": {
                                "result": "Terdapat huruf braile",
                                "status": true
                            },
                            "panelHeight": {
                                "result": "1000mm dari lantai",
                                "status": true
                            },
                            "doorOpenTime": {
                                "result": "Setting > 5 detik",
                                "status": true
                            },
                            "doorWidth": {
                                "result": "Bukaan 800mm",
                                "status": true
                            },
                            "audioInformation": {
                                "result": "Tersedia informasi suara untuk setiap lantai",
                                "status": true
                            },
                            "label": {
                                "result": "Tersedia label disabilitas",
                                "status": true
                            }
                        },
                        "seismicSensor": {
                            "availability": {
                                "result": "Tersedia",
                                "status": true
                            },
                            "function": {
                                "result": "Berfungsi saat disimulasikan",
                                "status": true
                            }
                        }
                    }
                }
            }
        }
    }
    ```

  - **Failur Response (404 Not Found)**

  ```json
  {
      "status": "error",
      "message": "Gagal memperbarui. Laporan elevator dengan ID tersebut tidak ditemukan."
  }
  ```

##### DELETE Laporan
**URL:**
`/elevatorEskalator/elevator/laporan/{id}`
**Method:**
`DELETE`

**response**

 - **Succes (200 Ok)**
    ```json
    {
        "status": "succes",
        "message": "Laporan elevator berhasil dihapus"
    }
    ```

  - **Failur Response (404 Not Found)**

    ```json
    {
        "status": "error",
        "message": "Gagal menghapus. Laporan elevator dengan ID tersebut tidak ditemukan."
    }
    ```

##### Download Laporan
**URL:**
`/elevatorEskalator/elevator/laporan/download/{id}`
**Method:**
`GET`

  - **Failur Response (404 Not Found)**

    ```json
    {
        "status": "error",
        "message": "Gagal membuat dokumen. Laporan dengan ID tersebut tidak ditemukan."
    }
    ```

