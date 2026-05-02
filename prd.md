Product Requirements Document (PRD): Greeting.co (Coffee & Creamy) Web Platform
1. Executive Summary
Problem Statement: Pelanggan kedai kopi sering mengalami antrean panjang di depan kasir, sementara staf kasir kewalahan merekap pesanan secara manual yang dapat menghambat efisiensi pelayanan.
Proposed Solution: Membangun sebuah aplikasi web pemesanan dine-in/take-away dan reservasi tempat berbasis self-service. Pesanan yang dibuat pelanggan melalui web akan langsung tersinkronisasi ke dashboard kasir secara real-time, lalu pelanggan bisa segera melakukan pembayaran di kasir tanpa harus menyebutkan pesanan dari awal.
Success Criteria:
Menurunkan waktu rata-rata proses pemesanan dan antrean pelanggan di kasir secara signifikan.
Mencapai adoption rate pemesanan online tinggi (menjadi jalur transaksi utama toko via web).
Kasir dapat menyelesaikan status order di dashboard dalam hitungan detik.
2. User Experience & Functionality
User Personas:
Pelanggan Kopi (Customer): Pengunjung (seperti pelajar/pekerja muda) yang mencari tempat hangout dan menginginkan cara cepat untuk memesan dan me-reservasi meja tanpa antre.
Kasir (Admin): Staf toko yang membutuhkan antarmuka dashboard yang bersih untuk membaca pesanan masuk secara real-time, tanpa notifikasi aplikasi pihak ketiga yang membingungkan.
User Stories:
As a customer, saya ingin melihat menu (Kopi Susu, Rock Coffee, dll) dan melakukan pemesanan via HP so that saya hanya perlu datang ke kasir untuk membayar.
As a customer, saya ingin melakukan reservasi meja pada jam tertentu so that tempat hangout saya sudah terjamin.
As a cashier, saya ingin pesanan langsung tampil di sistem sesaat setelah pelanggan submit pesanan web so that saya bisa segera menyiapkan minuman.
Acceptance Criteria:
Pelanggan dapat memilih produk, mengatur quantity, dan menekan tombol "Kirim Pesanan".
Aplikasi memberikan "Nomor Pesanan" / struk digital yang cukup diperlihatkan ke kasir.
Tersedia menu Reservasi Tempat dengan detail (Tanggal, Jam, Jumlah Orang).
Halaman Khusus Kasir menampilkan notifikasi/list jika ada pesanan baru. Detail tagihan invoice dikalkulasi otomatis.
Non-Goals:
TIDAK ada integrasi pengiriman/delivery pihak ketiga (Grab/Gojek).
TIDAK ada gateway pembayaran online otomatis (QRIS, Kartu Kredit). Sistem sepenuhnya pay-at-counter.
3. AI System Requirements
(Tidak diperlukan untuk kebutuhan operasional kedai kopi pada fase ini)

4. Technical Specifications
Architecture Overview: Proyek Fullstack monorepo menggunakan arsitektur bawaan Next.js App Router (app/ directory). Interaksi UI dijalankan pada Client Components, sedangkan pengambilan data dan manipulasi pesanan dilakukan pada Route Handlers (API) yang dijembatani perlindungan otentikasi, terintegrasi ke Database secara langsung.
Integrations & Tech Stack:
Frontend: Next.js (App Router), React, TailwindCSS untuk styling, dan komponen dari shadcn/ui.
Backend: Next.js API Route Handlers.
Database & ORM: Drizzle ORM (terhubung dengan relational DB seperti PostgreSQL/MySQL yang sesuai).
Auth: Better Auth untuk menangani sistem manajemen izin Role-Based Access Control (RBAC), memisahkan izin antara Customer regular dan Cashier (Admin).
Security & Privacy:
Perlindungan rute Admin (Dashboard Kasir). Route kasir /cashier diotorisasi sisi server untuk memutus akses tanpa token atau Role admin.
Password Hash dan pengelolaan sesi pengguna ditangani standar dari Better Auth.
5. Risks & Roadmap
Phased Rollout:
Tahap 1 (MVP): Katalog Menu Digital, Sistem Add-to-cart dan Submit Pesanan, Dashboard Kasir sederhana (List Pesanan Pending/Selesai).
Tahap 2: Sistem Table Booking/Reservation.
Tahap 3: Auth penuh untuk Customer (sehingga mereka bebas melihat order history mereka) dan pelaporan statistik menu favorit.
Technical Risks:
Issue: Koneksi internet perangkat kasir putus lambat saat me-refresh.
Mitigasi: Penggunaan Client-side soft refresh secara polling di background menggunakan React Query atau sejenisnya untuk memastikan tidak ada pesanan hilang.
Issue: Potensi pemesanan iseng (Spam orders).
Mitigasi: Memerlukan reservasi akun dengan e-mail (berkat Better Auth), sehingga admin bisa melakukan black-list e-mail tersebut jika ia hanya meninggalkan spam orders di antrean.
