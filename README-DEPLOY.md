# BackupHarbor — perbaikan low-value content

Paket ini adalah revisi dari `BackupHarbor_2.0_GitHub_Ready(1).zip` yang kamu berikan. Fokusnya menambah kegunaan nyata dan memperbaiki tools. **Ini bukan hasil persetujuan AdSense** dan website online belum diubah oleh paket ini.

## Yang diperbaiki

- Menambahkan tiga panduan mendalam: mengecek file cloud-only sebelum pindah perangkat, membuat catatan bukti uji restore, serta merencanakan retensi versi backup. Panduan baru menggunakan rujukan resmi yang relevan dan diberi kredit **BackupHarbor Editorial**; artikel sebelumnya tetap mempertahankan kredit aslinya.
- Menambahkan template CSV contoh untuk mencatat hasil restore. Contohnya fiktif dan tidak perlu berisi data pribadi atau password.
- Memperjelas sepuluh halaman tools dengan contoh perhitungan, langkah penggunaan, cara membaca hasil, dan batasan yang berbeda sesuai fungsi tool.
- Memperbaiki agar rencana dan hasil tool yang sudah tidak sesuai input tidak bisa diekspor seolah-olah masih berlaku. Input dikunci saat pengecekan file sedang berjalan. Tool 3-2-1 dan simulasi juga menolak beberapa jawaban yang saling bertentangan; Restore Drill menunjukkan jika perubahan belum disimpan.
- Mempertahankan halaman dan URL yang sudah ada, memperbarui daftar panduan, tautan internal, metadata, dan sitemap.
- Nama kontak **Putri Dahlia**, email **mylogolemon@gmail.com**, AdSense `ca-pub-9278916846563994`, dan baris `ads.txt` yang sesuai sudah benar di ZIP asal dan tetap dipakai.

## Upload ke GitHub dan deploy ke Vercel

1. Simpan salinan atau buat branch cadangan dari repository yang sedang online. Paket ini dibuat dari ZIP yang kamu kirim; jika repository sudah berubah setelah ZIP tersebut dibuat, **bandingkan perubahan terbaru sebelum menimpa file**.
2. Ekstrak ZIP perbaikan ini. Upload seluruh **isi** ZIP ke root repository BackupHarbor yang sudah terhubung ke Vercel. Timpa file yang namanya sama dan tambahkan folder/file baru, terutama `resources/` serta tiga file baru di `guides/`. `index.html`, `ads.txt`, `robots.txt`, `sitemap.xml`, dan `vercel.json` harus berada di root, bukan di dalam folder tambahan.
3. Tunggu deployment production selesai. Ini adalah website HTML/CSS/JavaScript statis, tanpa dependensi atau build khusus. Pastikan Vercel memakai repository, branch, dan root directory yang benar.
4. Source ini **masih memakai `https://www.backupharbor.site` sebagai canonical** karena itu konfigurasi di ZIP asal. Periksa di Vercel bahwa `www.backupharbor.site` adalah domain utama dan versi `backupharbor.site` dialihkan secara benar ke sana. Jika domain utama yang aktif justru versi tanpa `www`, selaraskan canonical, Open Graph, JSON-LD, sitemap, robots.txt dan pengalihan sebelum meminta review. Jangan membuat pengalihan bolak-balik.
5. Setelah deploy, periksa di browser publik: halaman utama, `/guides/`, tiga panduan baru, halaman Contact dan halaman tools. Buka `/ads.txt` dan pastikan isinya tepat:

   ```text
   google.com, pub-9278916846563994, DIRECT, f08c47fec0942fa0
   ```

   Periksa juga `/robots.txt` dan `/sitemap.xml` pada domain utama dan pastikan halaman dapat diakses tanpa login atau deployment protection.
6. Di `/lab/`, coba file contoh yang tersedia melalui File Integrity Checker: `original.txt` + `identical.txt` seharusnya **MATCH**, sedangkan `original.txt` + `altered.txt` seharusnya **DIFFERENT**. Coba juga kalkulator kapasitas dan Backup Plan Builder. Periksa navigasi dan tampilan pada ponsel.
7. Gunakan Google Search Console untuk memeriksa URL live, canonical yang dipilih Google, dan sitemap. Pastikan crawler dapat mengakses situs. Pengiriman sitemap tidak menjamin semua halaman akan diindeks.
8. Di AdSense, pastikan situs yang diajukan dan publisher ID sesuai akunmu. Baca kembali alasan penolakan **low-value content**, tinjau halaman baru dan kebijakan privasi agar sesuai praktikmu, lalu ajukan review setelah hasil deploy dan akses publik sudah terverifikasi. Jika menayangkan iklan yang memerlukan persetujuan di EEA, Inggris, atau Swiss, konfigurasikan CMP tersertifikasi Google; teks privacy saja tidak membuat CMP aktif.

## Pemeriksaan lokal

Dari root repository, jika Python 3 dan Node.js tersedia:

```bash
python3 checks/site_audit.py
node --test checks/tools.test.cjs
```

Pemeriksaan statis mencakup 51 halaman HTML, 24 panduan, tautan internal dan fragmen, metadata, JSON-LD, sitemap, kontak, kode AdSense, dan `ads.txt`. Pengujian fungsi mencakup contoh kapasitas dan waktu, input yang bertentangan, hasil kedaluwarsa, penyimpanan drill, dan hash file contoh melalui JavaScript yang sama dalam lingkungan uji.

Pratinjau desktop, hasil Backup Plan Builder, perubahan input, dan kalkulator kapasitas telah diperiksa di browser. Pemilihan file contoh melalui browser pratinjau tidak selesai karena keterbatasan lingkungan; fungsi hash diuji secara otomatis memakai file contoh, tetapi **alur pemilihan file pada browser dan tampilan ponsel masih perlu diuji setelah deploy**. Akses website publik, redirect domain, crawler Google, status `ads.txt` di dashboard AdSense, dan penerimaan review juga belum bisa diverifikasi dari paket lokal ini.

## Rujukan resmi

- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/12171612
- https://support.google.com/adsense/answer/13554116
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
