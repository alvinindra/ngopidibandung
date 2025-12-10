# Ngopi Bandung (Bandung Cafe Map)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/alvinindras-projects/v0-bandung-cafe-map)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/mJbDoOIGX9m)

Peta interaktif cafe di Bandung. Ngopi Bandung / Cafe Bandung membantu cari tempat ngopi, coworking, atau nongkrong dengan cepat. We mix Bahasa + English to keep it friendly for local and global contributors.

## What is Ngopi Bandung?

- Ngopi Bandung = curated map of Bandung coffee shops, cafes, and cowork spaces.
- Fokus pada lokasi, fasilitas, harga rata-rata, dan vibes supaya gampang pilih tempat.
- Data utama berada di `src/data/cafes.json` dan bisa dikembangkan bareng-bareng.

## Tech & Development

- Next.js (App Router) + TailwindCSS.
- Map features live in `src/features/map`.
- Default dev server runs with **Bun**: `bun dev` (pnpm/ npm work too, but Bun is fastest).

### Run locally

```bash
# install deps (recommended)
bun install

# start dev
bun dev

# open http://localhost:3000 (Turbopack may auto-pick another port)
```

## Contributing (Open Source / Kolaborasi)

We welcome PRs and issues. Kita butuh bantuan untuk nambah data cafe dan perbaikan UI/UX.

### Tambah / update data cafe

1. Edit `src/data/cafes.json`.
2. Pastikan setiap entri memiliki:
   - `name`, `address`, `latitude`, `longitude`
   - `price_range` (string), `wifi` (boolean), `power` (boolean)
   - optional: `notes`, `instagram`, `website`
3. Jaga format JSON rapi dan valid (double quotes, trailing comma free).
4. Test lokal: `bun dev` lalu cek peta apakah marker muncul sesuai.

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
  - Lint/format: `bun run lint` (atau tooling lain jika tersedia).
  - Pastikan JSON valid dan tidak memecah build.
  - Tambah test ringan bila menambah logic (jika applicable).
- PR kecil lebih cepat direview.

## Roadmap singkat

- Tambah filter (wifi, colokan, price).
- Mode offline / caching ringan.
- Kontribusi bulk data cafe (CSV → JSON pipeline).

## License

MIT — silakan gunakan, fork, dan kontribusi. Cheers, mari ngopi bareng! 😊
