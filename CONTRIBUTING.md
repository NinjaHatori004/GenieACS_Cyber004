# Panduan Berkontribusi

Terima kasih telah tertarik untuk berkontribusi pada proyek Gobes.net! Berikut adalah panduan untuk berkontribusi.

## Cara Berkontribusi

1. **Fork** repositori ini
2. Buat **branch** baru untuk fitur/perbaikan Anda
3. **Commit** perubahan Anda
4. **Push** ke branch yang Anda buat
5. Ajukan **Pull Request**

## Standar Kode

- Gunakan **TypeScript** untuk kode baru
- Ikuti konvensi kode yang ada
- Tulis komentar yang jelas dan bermakna
- Pastikan semua test berhasil
- Update dokumentasi yang relevan

## Melaporkan Masalah

Gunakan template berikut saat membuat issue:

```markdown
## Deskripsi Masalah

[Deskripsi singkat tentang masalah]

## Langkah Reproduksi
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

## Perilaku yang Diharapkan
[Apa yang seharusnya terjadi]

## Screenshot (jika ada)
[Sertakan screenshot jika memungkinkan]

## Informasi Tambahan
- Versi Aplikasi: [contoh: v1.0.0]
- Sistem Operasi: [contoh: CasaOS, Ubuntu]
- Browser (jika relevan): [contoh: Chrome, Firefox]
```

## Pengembangan

### Persiapan Lingkungan

1. Clone repositori
2. Install dependensi:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

### Menjalankan Aplikasi

```bash
# Backend
cd backend
npm run dev

# Frontend (di terminal terpisah)
cd frontend
npm run dev
```

## Testing

Jalankan test dengan perintah:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

## Pull Request

1. Pastikan branch Anda up-to-date dengan `main`
2. Update dokumentasi jika diperlukan
3. Pastikan semua test berhasil
4. Deskripsikan perubahan yang Anda buat

## Kode Etik

Harap baca [Kode Etik](CODE_OF_CONDUCT.md) kami sebelum berkontribusi.

## Pertanyaan?

Jika Anda memiliki pertanyaan, silakan buat issue baru atau hubungi maintainer.
