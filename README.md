# Ngopi di Bandung (Bandung Cafe Map)

Peta interaktif cafe di Bandung. Ngopi Bandung / Cafe Bandung membantu cari tempat ngopi, coworking, atau nongkrong dengan cepat. We mix Bahasa + English to keep it friendly for local and global contributors.

## What is Ngopi di Bandung?

- Ngopi di Bandung = curated map of Bandung coffee shops, cafes, and cowork spaces.
- Fokus pada lokasi, fasilitas, harga rata-rata, dan vibes supaya gampang pilih tempat.
- Data utama berada di `src/data/cafes.json` dan bisa dikembangkan bareng-bareng.

## Tech & Development

- Next.js (App Router) + TailwindCSS.
- Map features live in `src/features/map`.
- Default dev server runs with **Pnpm**: `pnpm dev`.

### Run locally

```bash
# install deps (recommended)
pnpm install

# start dev
pnpm dev

# open http://localhost:3000 (Turbopack may auto-pick another port)
```

## Contributing (Open Source / Kolaborasi)

We welcome PRs and issues. Kita butuh bantuan untuk menambah data cafe dan perbaikan UI/UX.

### Tambah / update data cafe

1. Edit `src/data/cafes.json`.
2. Pastikan setiap entri memiliki semua field yang diperlukan.
3. Jaga format JSON rapi dan valid (double quotes, trailing comma free).
4. Test lokal: `pnpm dev` lalu cek peta apakah marker + drawer muncul sesuai.

### Buka issue

- Gunakan bahasa campuran oke. Sertakan detail singkat:
  - Bug: langkah reproduksi, expected vs actual.
  - Data request: nama cafe + alamat + titik koordinat (kalau bisa).
  - Feature: jelaskan benefit untuk pengguna (misal filter, dark mode, dsb).

### Kirim pull request

- Fork atau buat branch dari `main`.
- Jelaskan perubahan dalam Bahasa/English singkat.
- Sertakan screenshot/gif jika ubah UI.
- Checklist sebelum kirim:
  - Lint/format: `pnpm run lint` (atau tooling lain jika tersedia).
  - Pastikan JSON valid dan tidak memecah build.
  - Tambah test ringan bila menambah logic (jika applicable).
- PR kecil lebih cepat direview.

## Dukung proyek ini

- GitHub Sponsors: https://github.com/sponsors/alvinindra
- Saweria: https://saweria.co/alvinindra
- Kontribusi kode/data selalu terbuka lewat PR & issue.

## License

MIT — silakan gunakan, fork, dan kontribusi. Cheers, mari ngopi bareng! 😊
