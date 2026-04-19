-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Apr 2026 pada 12.28
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_finance`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `consultant_id` int(11) NOT NULL,
  `health_check_id` int(11) DEFAULT NULL,
  `booking_date` date NOT NULL,
  `booking_time` time NOT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `consultation_method` enum('chat','video_meeting') DEFAULT 'chat',
  `topic` text DEFAULT NULL,
  `status` enum('pending','booked','completed','cancelled') DEFAULT 'pending',
  `total_fee` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `consultant_id`, `health_check_id`, `booking_date`, `booking_time`, `duration_minutes`, `consultation_method`, `topic`, `status`, `total_fee`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, '2026-06-12', '10:00:00', 60, 'video_meeting', 'Konsultasi tentang manajemen utang', 'booked', 0, NULL, '2026-04-04 03:47:56', '2026-04-04 03:47:56'),
(2, 5, 1, NULL, '2026-04-09', '19:00:00', 60, 'chat', NULL, 'booked', 0, NULL, '2026-04-09 09:40:25', '2026-04-09 09:40:25'),
(3, 5, 1, NULL, '2026-04-09', '15:00:00', 60, 'chat', NULL, 'booked', 0, NULL, '2026-04-09 09:41:29', '2026-04-09 09:41:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `consultants`
--

CREATE TABLE `consultants` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `rate` int(11) NOT NULL,
  `experience_years` int(11) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 0.0,
  `total_reviews` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `consultants`
--

INSERT INTO `consultants` (`id`, `name`, `specialization`, `bio`, `photo_url`, `rate`, `experience_years`, `rating`, `total_reviews`, `is_available`, `created_at`) VALUES
(1, 'Budi Finansial', 'Manajemen Utang', 'Ahli strategi keuangan digital.', NULL, 0, 5, 0.0, 0, 1, '2026-04-04 03:45:41'),
(2, 'Siska Amelia, CFA', 'Investasi & Tabungan', 'Membantu Anda membangun dana darurat dan mulai berinvestasi sejak dini dengan risiko terukur.', NULL, 100000, 3, 5.0, 0, 1, '2026-04-05 07:28:42');

-- --------------------------------------------------------

--
-- Struktur dari tabel `financial_health_checks`
--

CREATE TABLE `financial_health_checks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `monthly_income` bigint(20) NOT NULL,
  `monthly_expenses` bigint(20) NOT NULL,
  `monthly_debt_payment` bigint(20) NOT NULL,
  `total_debt` bigint(20) DEFAULT 0,
  `emergency_fund` bigint(20) DEFAULT 0,
  `debt_to_income_ratio` decimal(5,2) DEFAULT NULL,
  `expense_to_income_ratio` decimal(5,2) DEFAULT NULL,
  `emergency_fund_months` decimal(4,1) DEFAULT NULL,
  `status` enum('Sehat','Rawan','Kritis') NOT NULL,
  `score` int(11) NOT NULL,
  `recommendation` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `financial_health_checks`
--

INSERT INTO `financial_health_checks` (`id`, `user_id`, `monthly_income`, `monthly_expenses`, `monthly_debt_payment`, `total_debt`, `emergency_fund`, `debt_to_income_ratio`, `expense_to_income_ratio`, `emergency_fund_months`, `status`, `score`, `recommendation`, `created_at`) VALUES
(1, 1, 5000000, 3000000, 1500000, 20000000, 2000000, 30.00, 60.00, 0.7, 'Rawan', 41, 'Rasio cicilan utang Anda cukup tinggi (30-50%). Hindari menambah utang baru dan fokus melunasi cicilan yang ada.\n\nPengeluaran Anda terkendali dengan baik. Manfaatkan sisa pemasukan untuk investasi atau menabung.\n\nAnda belum memiliki dana darurat. Mulai sisihkan minimal 10% pemasukan setiap bulan.\n\nKondisi keuangan Anda dalam status RAWAN. Konsultasi dengan ahli keuangan dapat membantu mencegah kondisi yang memburuk.', '2026-04-04 03:31:33'),
(2, 1, 5000000, 3000000, 1500000, 20000000, 2000000, 30.00, 60.00, 0.7, 'Rawan', 41, 'Rasio cicilan utang Anda cukup tinggi (30-50%). Hindari menambah utang baru dan fokus melunasi cicilan yang ada.\n\nPengeluaran Anda terkendali dengan baik. Manfaatkan sisa pemasukan untuk investasi atau menabung.\n\nAnda belum memiliki dana darurat. Mulai sisihkan minimal 10% pemasukan setiap bulan.\n\nKondisi keuangan Anda dalam status RAWAN. Konsultasi dengan ahli keuangan dapat membantu mencegah kondisi yang memburuk.', '2026-04-04 03:40:02'),
(3, 5, 100, 10, 3, 0, 0, 3.00, 10.00, 0.0, 'Sehat', 75, 'Rasio cicilan utang Anda masih dalam batas aman. Pertahankan kebiasaan ini.\n\nPengeluaran Anda terkendali dengan baik. Manfaatkan sisa pemasukan untuk investasi atau menabung.\n\nAnda belum memiliki dana darurat. Mulai sisihkan minimal 10% pemasukan setiap bulan.', '2026-04-09 10:00:07'),
(4, 5, 200, 20, 10, 3, 0, 5.00, 10.00, 0.0, 'Sehat', 75, 'Rasio cicilan utang Anda masih dalam batas aman. Pertahankan kebiasaan ini.\n\nPengeluaran Anda terkendali dengan baik. Manfaatkan sisa pemasukan untuk investasi atau menabung.\n\nAnda belum memiliki dana darurat. Mulai sisihkan minimal 10% pemasukan setiap bulan.', '2026-04-09 12:56:08'),
(5, 5, 50, 10, 10, 0, 0, 20.00, 20.00, 0.0, 'Sehat', 67, 'Rasio cicilan utang Anda masih dalam batas aman. Pertahankan kebiasaan ini.\n\nPengeluaran Anda terkendali dengan baik. Manfaatkan sisa pemasukan untuk investasi atau menabung.\n\nAnda belum memiliki dana darurat. Mulai sisihkan minimal 10% pemasukan setiap bulan.', '2026-04-09 12:56:51'),
(10, 5, 5000000, 10000000, 20000000, 0, 0, 400.00, 200.00, 0.0, 'Kritis', 0, 'Cicilan utang Anda melebihi 50% pemasukan. Segera konsultasikan dengan ahli keuangan untuk restrukturisasi utang.\n\nPengeluaran Anda hampir menyamai pemasukan. Segera kurangi pengeluaran tidak esensial.\n\nAnda belum memiliki dana darurat. Mulai sisihkan minimal 10% pemasukan setiap bulan.\n\nKondisi keuangan Anda dalam status KRITIS. Segera berkonsultasi dengan konsultan keuangan profesional kami.', '2026-04-10 07:29:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `photo_url`, `created_at`, `updated_at`) VALUES
(1, 'nama kamu', 'email@example.com', '$2b$12$PAnwEoS.CG7s2uO.LpkCquvQ95qfrcFaSrqTmkcLKqYnDZ/s1/Jeu', '081234567890', NULL, '2026-04-04 03:07:27', '2026-04-04 03:07:27'),
(4, 'jamaltest', 'user.test@smartfinance.id', '$2b$12$qD2J.TOab7ym4DbuyfaaXec/N6XNOrGJJJmjVsuvl6EfnCGER0AvK', NULL, NULL, '2026-04-05 10:21:35', '2026-04-05 10:21:35'),
(5, 'buditest123', 'budi@gmail.com', '$2b$12$DftVw.BNZAby05Mb0eqeiOKL7jWqOVHA1/OfI1qcRpw0uHHSnGW9i', NULL, NULL, '2026-04-06 13:30:16', '2026-04-06 13:30:16');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `consultant_id` (`consultant_id`),
  ADD KEY `health_check_id` (`health_check_id`);

--
-- Indeks untuk tabel `consultants`
--
ALTER TABLE `consultants`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `financial_health_checks`
--
ALTER TABLE `financial_health_checks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `consultants`
--
ALTER TABLE `consultants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `financial_health_checks`
--
ALTER TABLE `financial_health_checks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`consultant_id`) REFERENCES `consultants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`health_check_id`) REFERENCES `financial_health_checks` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `financial_health_checks`
--
ALTER TABLE `financial_health_checks`
  ADD CONSTRAINT `financial_health_checks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
