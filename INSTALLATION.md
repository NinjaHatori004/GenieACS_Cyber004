# Panduan Instalasi Gobes.net di CasaOS (STB HG80P)

## Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Persiapan Awal](#persiapan-awal)
3. [Instalasi Aplikasi](#instalasi-aplikasi)
   - [Opsi 1: Menggunakan CasaOS App Store](#opsi-1-menggunakan-casaos-app-store)
   - [Opsi 2: Instalasi Manual dengan Docker Compose](#opsi-2-instalasi-manual-dengan-docker-compose)
4. [Inisialisasi Database](#inisialisasi-database)
5. [Verifikasi Instalasi](#verifikasi-instalasi)
6. [Konfigurasi Tambahan](#konfigurasi-tambahan)
7. [Troubleshooting](#troubleshooting)
8. [Update Aplikasi](#update-aplikasi)

## Prasyarat
- Perangkat STB HG80P dengan CasaOS terinstal
- Koneksi internet yang stabil
- Minimal 2GB RAM (4GB disarankan)
- Minimal 10GB ruang penyimpanan kosong
- Docker dan Docker Compose terinstal

## Persiapan Awal

1. **Persiapan Penyimpanan**
   - Pastikan Anda memiliki partisi penyimpanan yang cukup
   - Disarankan menggunakan penyimpanan eksternal untuk data

2. **Persiapan Jaringan**
   - Pastikan perangkat terhubung ke jaringan lokal
   - Catat alamat IP perangkat CasaOS Anda

## Instalasi Aplikasi

### Opsi 1: Menggunakan CasaOS App Store

1. Buka CasaOS Dashboard
2. Buka App Store
3. Cari "Gobes.net" atau "GuiniEACS+"
4. Klik "Install"
5. Ikuti panduan instalasi di layar
6. Lewati ke bagian [Verifikasi Instalasi](#verifikasi-instalasi)

### Opsi 2: Instalasi Manual dengan Docker Compose

1. **Clone Repository**
   ```bash
   # Masuk ke direktori penyimpanan
   cd /mnt/data
   
   # Clone repository
   git clone https://github.com/NinjaHatori004/GenieACS_Cyber004.git gobesnet
   cd gobesnet
   ```

2. **Persiapan Konfigurasi**
   ```bash
   # Salin file contoh konfigurasi
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit konfigurasi (sesuaikan dengan kebutuhan)
   nano backend/.env
   nano frontend/.env
   ```

3. **Buat Direktori untuk Data**
   ```bash
   mkdir -p /mnt/data/gobesnet/{postgres_data,pgadmin_data,backend_data}
   chmod -R 777 /mnt/data/gobesnet
   ```

4. **Jalankan Aplikasi**
   ```bash
   # Build dan jalankan container
   docker-compose up -d --build
   ```

## Inisialisasi Database

1. **Jalankan Migrasi Database**
   ```bash
   docker-compose exec backend npx prisma migrate dev --name init
   ```

2. **Buat Admin Pertama**
   ```bash
   docker-compose exec backend node scripts/create-admin.js
   ```
   Ikuti petunjuk di layar untuk membuat akun admin pertama.

## Verifikasi Instalasi

1. **Periksa Status Container**
   ```bash
   docker-compose ps
   ```
   Pastikan semua container berstatus "Up"

2. **Akses Aplikasi**
   - **Frontend**: http://alamat-ip-anda:3000
   - **Backend API**: http://alamat-ip-anda:5000
   - **pgAdmin**: http://alamat-ip-anda:5050
     - Email: admin@admin.com
     - Password: admin

## Konfigurasi Tambahan

### Backup Otomatis
Buat skrip backup harian:
```bash
# /etc/cron.daily/gobesnet-backup
#!/bin/bash
BACKUP_DIR="/mnt/backup/gobesnet"
mkdir -p $BACKUP_DIR
docker-compose -f /mnt/data/gobesnet/docker-compose.yml exec -T postgres pg_dump -U postgres gobesnet > $BACKUP_DIR/gobesnet_$(date +%Y%m%d).sql
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Reverse Proxy (Opsional)
Konfigurasi reverse proxy jika ingin menggunakan domain kustom atau SSL.

## Troubleshooting

### 1. Port Sudah Digunakan
Edit file `docker-compose.yml` dan ubah port yang bermasalah.

### 2. Masalah Izin
```bash
chmod -R 777 /mnt/data/gobesnet
```

### 3. Melihat Log Aplikasi
```bash
# Log untuk semua service
docker-compose logs -f

# Log untuk service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Masalah Koneksi Database
Pastikan konfigurasi database di `backend/.env` sesuai dengan konfigurasi di `docker-compose.yml`.

## Update Aplikasi

```bash
# Masuk ke direktori aplikasi
cd /mnt/data/gobesnet

# Update kode
git pull

# Build ulang dan restart container
docker-compose down
docker-compose up -d --build

# Jalankan migrasi database jika ada
docker-compose exec backend npx prisma migrate deploy
```

## Dukungan

Jika Anda menemui masalah, silakan buat issue di [GitHub Repository](https://github.com/NinjaHatori004/GenieACS_Cyber004/issues) atau hubungi tim dukungan.
