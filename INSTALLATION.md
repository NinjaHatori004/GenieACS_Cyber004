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

## Instalasi di CasaOS

### Opsi 1: Melalui Terminal CasaOS

1. **Akses Terminal CasaOS**
   - Buka CasaOS Dashboard
   - Klik ikon Terminal di sidebar kiri
   - Atau akses via SSH ke perangkat CasaOS

2. **Persiapan Direktori**
   ```bash
   # Buat direktori untuk aplikasi
   mkdir -p /mnt/data/apps/gobesnet
   cd /mnt/data/apps/gobesnet
   ```

3. **Unduh File yang Diperlukan**
   ```bash
   # Unduh file docker-compose.yml
   curl -O https://raw.githubusercontent.com/NinjaHatori004/GenieACS_Cyber004/main/docker-compose.yml
   
   # Buat direktori untuk konfigurasi
   mkdir -p backend frontend
   
   # Unduh file .env contoh
   curl -o backend/.env https://raw.githubusercontent.com/NinjaHatori004/GenieACS_Cyber004/main/backend/.env.example
   curl -o frontend/.env https://raw.githubusercontent.com/NinjaHatori004/GenieACS_Cyber004/main/frontend/.env.example
   
   # Salin ke file .env aktual
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Konfigurasi Aplikasi**
   ```bash
   # Edit konfigurasi (sesuaikan dengan kebutuhan)
   nano backend/.env
   nano frontend/.env
   ```
   Pastikan konfigurasi database dan port tidak bentrok dengan layanan lain.

5. **Jalankan Aplikasi**
   ```bash
   # Berikan izin yang diperlukan
   chmod -R 777 /mnt/data/apps/gobesnet
   
   # Jalankan dengan Docker Compose
   docker-compose up -d --build
   ```

### Opsi 2: Melalui File Compose Langsung di CasaOS UI

1. **Siapkan File docker-compose.yml**
   - Salin isi file `docker-compose.yml` dari repositori
   - Pastikan path volume disesuaikan dengan struktur direktori CasaOS

2. **Tambahkan Aplikasi di CasaOS**
   - Buka CasaOS Dashboard
   - Klik "+" di pojok kanan atas
   - Pilih "Custom App"
   - Tempelkan isi file `docker-compose.yml`
   - Klik "Deploy"

3. **Konfigurasi Volume**
   Pastikan path volume mengarah ke direktori yang benar:
   ```yaml
   volumes:
     - /mnt/data/apps/gobesnet/backend_data:/app/backend/data
     - /mnt/data/apps/gobesnet/postgres_data:/var/lib/postgresql/data
   ```

### Opsi 3: Menggunakan CasaOS App Store (Jika Tersedia)

1. **Tambahkan Repositori Kustom** (jika diperlukan)
   - Buka Settings > App Store
   - Tambahkan URL repositori aplikasi
   - Klik "Save"

2. **Instal Aplikasi**
   - Buka App Store
   - Cari "Gobes.net" atau "GuiniEACS+"
   - Klik "Install"
   - Ikuti panduan instalasi di layar

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
- Edit file `docker-compose.yml` dan ubah port yang bermasalah
- Atau hentikan layanan yang menggunakan port tersebut:
  ```bash
  # Cari proses yang menggunakan port
  sudo lsof -i :3000  # Ganti dengan port yang bermasalah
  
  # Hentikan proses (ganti PID dengan nomor proses)
  kill -9 PID
  ```

### 2. Masalah Izin
```bash
# Berikan izin ke direktori aplikasi
sudo chmod -R 777 /mnt/data/apps/gobesnet

# Jika masih ada masalah, ubah kepemilikan
sudo chown -R $(whoami):$(whoami) /mnt/data/apps/gobesnet
```

### 3. Melihat Log Aplikasi
```bash
# Log untuk semua service
docker-compose logs -f

# Log untuk service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend

# Log real-time dengan timestamp
docker-compose logs --tail=100 -f --timestamps
```

### 4. Masalah Koneksi Database
1. Periksa status container database:
   ```bash
   docker-compose ps | grep postgres
   ```
2. Periksa log database:
   ```bash
   docker-compose logs postgres
   ```
3. Pastikan konfigurasi di `backend/.env` sesuai dengan `docker-compose.yml`
4. Coba restart service database:
   ```bash
   docker-compose restart postgres
   ```

### 5. Masalah Khusus CasaOS
- **Aplikasi Tidak Muncul di Daftar**
  - Pastikan file `docker-compose.yml` valid
  - Periksa log CasaOS: `journalctl -u casaos -f`
  - Restart CasaOS: `sudo systemctl restart casaos`

- **Tidak Bisa Mengakses Aplikasi**
  - Periksa firewall:
    ```bash
    sudo ufw status
    sudo ufw allow 3000/tcp  # Sesuaikan dengan port aplikasi
    ```
  - Periksa binding address di konfigurasi aplikasi (gunakan 0.0.0.0 bukan localhost)

- **Masalah Penyimpanan**
  - Pastikan direktori tujuan memiliki cukup ruang:
    ```bash
    df -h /mnt/data
    ```
  - Periksa izin direktori:
    ```bash
    ls -la /mnt/data/apps/gobesnet
    ```

### 6. Reset Aplikasi
Jika terjadi masalah serius, Anda bisa mereset aplikasi:
```bash
# Hentikan dan hapus container
docker-compose down -v

# Hapus data (hati-hati, ini akan menghapus semua data)
sudo rm -rf /mnt/data/apps/gobesnet/postgres_data

# Mulai ulang
docker-compose up -d
```

## Update Aplikasi

### Opsi 1: Update Melalui Terminal

```bash
# Masuk ke direktori aplikasi
cd /mnt/data/apps/gobesnet

# Backup database (opsional tapi disarankan)
docker-compose exec -T postgres pg_dump -U postgres gobesnet > backup_$(date +%Y%m%d).sql

# Update kode
git pull

# Update container
# Jika ada perubahan di docker-compose.yml
docker-compose down
docker-compose up -d --build

# Atau jika hanya update kode aplikasi
docker-compose up -d --build --no-deps backend frontend

# Jalankan migrasi database jika ada
docker-compose exec backend npx prisma migrate deploy

# Bersihkan image yang tidak terpakai
docker image prune -f
```

### Opsi 2: Update Melalui CasaOS UI

1. **Hapus Aplikasi Lama**
   - Buka CasaOS Dashboard
   - Temukan aplikasi Gobes.net
   - Klik ikon titik tiga (⋮) dan pilih "Remove"
   - **Jangan centang opsi hapus data volume**

2. **Deploy Versi Baru**
   - Klik "+" untuk menambahkan aplikasi baru
   - Pilih "Custom App"
   - Tempelkan konten `docker-compose.yml` yang baru
   - Pastikan konfigurasi volume sama dengan sebelumnya
   - Klik "Deploy"

### Setelah Update

1. **Verifikasi Versi**
   ```bash
   # Cek versi backend
   curl http://localhost:5000/api/version
   
   # Cek versi frontend
   curl http://localhost:3000 | grep 'window.appVersion'
   ```

2. **Periksa Log**
   ```bash
   # Periksa log untuk error
   docker-compose logs --tail=50
   ```

3. **Test Fitur Penting**
   - Login
   - Akses dashboard
   - Fitur kritis lainnya

### Rollback Jika Gagal

Jika update menyebabkan masalah, Anda bisa rollback ke versi sebelumnya:

```bash
# Kembali ke commit sebelumnya
git checkout HEAD~1

# Bangun ulang containerdocker-compose up -d --build

# Restore database jika diperlukan
docker-compose exec -T postgres psql -U postgres gobesnet < backup_*.sql
```

## Dukungan

Jika Anda menemui masalah, silakan buat issue di [GitHub Repository](https://github.com/NinjaHatori004/GenieACS_Cyber004/issues) atau hubungi tim dukungan.
