-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 11, 2023 at 08:24 PM
-- Server version: 5.7.33
-- PHP Version: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_parking`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_name` varchar(100) DEFAULT NULL,
  `admin_email` varchar(100) DEFAULT NULL,
  `admin_password` varchar(200) DEFAULT NULL,
  `admin_level` varchar(50) NOT NULL,
  `admin_status` tinyint(1) NOT NULL DEFAULT '1',
  `admin_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_name`, `admin_email`, `admin_password`, `admin_level`, `admin_status`, `admin_created_at`) VALUES
(1, 'Fajri Rinaldi Chan', 'fajri@gariskode.com', '$2y$10$gf7pYElK4Mv7MAJYMc6IHOHfnHPcw2D3rX9pSvxiExznc2LsOsni2', 'admin', 1, '2023-02-18 03:59:41'),
(2, 'Rahma Yanti', 'rahma@orbituinbkt.com', '$2y$10$.C/TU3f9ctXMUOU9bIREluGVi3fixNzL7Q1Koi7doG9rxpWKAMQKO', 'admin', 1, '2023-03-15 06:42:28'),
(555, 'voucher', NULL, NULL, 'admin', 1, '2023-06-05 13:29:18');

-- --------------------------------------------------------

--
-- Table structure for table `isi_saldo`
--

CREATE TABLE `isi_saldo` (
  `isi_saldo_id` int(11) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `isi_saldo_tanggal` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isi_saldo_jumlah` int(100) NOT NULL,
  `admin_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `isi_saldo`
--

INSERT INTO `isi_saldo` (`isi_saldo_id`, `uid`, `isi_saldo_tanggal`, `isi_saldo_jumlah`, `admin_id`) VALUES
(2, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(3, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(4, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(5, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(6, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(7, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(8, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(9, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(10, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(11, 'e1pqf', '2023-06-06 00:00:00', 1000, 555),
(12, 'e1pqf', '2023-06-09 00:00:00', 1000, 555),
(13, 'e1pqf', '2023-06-09 00:00:00', 1000, 555);

-- --------------------------------------------------------

--
-- Table structure for table `lokasi_parkir`
--

CREATE TABLE `lokasi_parkir` (
  `lokasi_id` int(11) NOT NULL,
  `lokasi_nama` varchar(100) NOT NULL,
  `lokasi_jenis` varchar(20) NOT NULL,
  `lokasi_longtitude` varchar(100) NOT NULL,
  `lokasi_latitude` varchar(100) NOT NULL,
  `lokasi_jarak` int(11) NOT NULL,
  `lokasi_jumlah_slot` int(11) NOT NULL,
  `lokasi_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lokasi_parkir`
--

INSERT INTO `lokasi_parkir` (`lokasi_id`, `lokasi_nama`, `lokasi_jenis`, `lokasi_longtitude`, `lokasi_latitude`, `lokasi_jarak`, `lokasi_jumlah_slot`, `lokasi_status`) VALUES
(1, 'A1', 'roda 2', '-0.32103109019691595', '100.39893671771071', 250, 100, 1),
(2, 'A2', 'roda 4', '-0.3214585702343409', '100.39844842465614', 250, 40, 1),
(3, 'B2', 'roda 4', '-0.32103109019691595', '100.39893671771071', 400, 40, 1),
(4, 'B1', 'roda 2', '-0.32103109019691595', '100.39893671771071', 400, 100, 1),
(5, 'C1', 'roda 2', '-0.32103109019691595', '100.39893671771071', 500, 100, 1),
(6, 'C2', 'roda 4', '-0.32103109019691595', '100.39893671771071', 500, 40, 1);

-- --------------------------------------------------------

--
-- Table structure for table `parkir`
--

CREATE TABLE `parkir` (
  `parkir_id` int(11) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `parkir_jenis_kendaraan` varchar(100) NOT NULL,
  `parkir_masuk` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `parkir_keluar` varchar(100) NOT NULL,
  `parkir_foto_kendaraan` varchar(100) NOT NULL,
  `parkir_tarif` int(20) NOT NULL,
  `parkir_status` tinyint(1) NOT NULL,
  `lokasi_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `parkir`
--

INSERT INTO `parkir` (`parkir_id`, `uid`, `parkir_jenis_kendaraan`, `parkir_masuk`, `parkir_keluar`, `parkir_foto_kendaraan`, `parkir_tarif`, `parkir_status`, `lokasi_id`) VALUES
(45, 'e1pqf', 'roda 4', '2023-06-11 06:23:45', '', '8C587B79-90A9-4213-8CE8-BAACE0B9C126.JPG', 4000, 1, 2),
(46, 'e1pqf', 'roda 2\n', '2023-06-11 00:54:47', '', 'e1pqf_kendaraan.jpg', 2000, 1, 2),
(47, 'e1pqf', 'roda 4\n', '2023-06-11 12:44:13', '', 'e1pqf_kendaraan.jpg', 4000, 1, 1),
(48, 'e1pqf', 'roda 2\n', '2023-06-11 12:47:40', '', 'e1pqf_kendaraan.jpg', 2000, 1, 1),
(49, 'e1pqf', 'roda 4', '2020-11-11 13:23:45', '', '8C587B79-90A9-4213-8CE8-BAACE0B9C126.JPG', 4000, 1, 1),
(50, 'e1pqf', 'roda 4', '2020-11-11 13:23:45', '', '8C587B79-90A9-4213-8CE8-BAACE0B9C126.JPG', 4000, 1, 1),
(51, 'e1pqf', 'roda 4', '2020-11-11 13:23:45', '', '8C587B79-90A9-4213-8CE8-BAACE0B9C126.JPG', 4000, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `saldo`
--

CREATE TABLE `saldo` (
  `saldo_id` int(11) NOT NULL,
  `uid` varchar(50) NOT NULL,
  `saldo_sisa` int(100) NOT NULL,
  `saldo_terpakai` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `saldo`
--

INSERT INTO `saldo` (`saldo_id`, `uid`, `saldo_sisa`, `saldo_terpakai`) VALUES
(4, 'e1pqf', 964000, 176000),
(5, '2j3jd393', 50000, 0),
(6, 'j28cb38s', 50000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `token_id` int(11) NOT NULL,
  `token_bot` text NOT NULL,
  `ket` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`token_id`, `token_bot`, `ket`) VALUES
(3, '5773821772:AAHk74nwa0GAA8Wvs1Ov0FsvU9C2SgcSK-s', 'Minangkabau Robotik, usernname = minangkabau_robotik_bot');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` varchar(50) NOT NULL,
  `user_nama` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(200) NOT NULL,
  `user_phone` varchar(50) NOT NULL,
  `user_fcm` text NOT NULL,
  `user_telegram` varchar(50) DEFAULT NULL,
  `user_status` tinyint(1) NOT NULL DEFAULT '1',
  `user_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uid`, `user_nama`, `user_email`, `user_password`, `user_phone`, `user_fcm`, `user_telegram`, `user_status`, `user_created_at`) VALUES
('2j3jd393', 'Khoirullah', 'irul@gmail.com', '$2a$10$XDqppEK4ldiPzclYfQTCNOXlvCodHNeq/gB0xP5ZeBxhKl0e7aHiW', '', 'dYBs0vtwQy2Y7T9_THQ4tX:APA91bG5mHM1QxQFz-coIQkqjiI_ui0nQe-QXIcAMIid19ZSlxjDKhR6Kbydp9qNvbaGEnyTx5vNjhNGQNqBB-Ky01VpMo3lJ7SuPWFpd5IjNrhoaGS8k-V-NqO2vwaZgeWkmb3UTtip', NULL, 1, '2023-06-11 14:01:46'),
('e1pqf', 'Fajri Chan', 'fajri@gariskode.com', '$2a$10$XDqppEK4ldiPzclYfQTCNOXlvCodHNeq/gB0xP5ZeBxhKl0e7aHiW', '089613390766', 'eySPS-nFSHijjyWtSxxcId:APA91bENjkzJ2nWtcOoV3iCJHZ7y9O77ty7l7iYhffMBRhamlmHMaOZ8vLa7yq0mFRW1-LI720MuBxbjKSWLpsCcwjte5_oq247Zf52UcORwlJxvlbcsRgQnxkMkCbW-U1lkznY6wjqR', '', 1, '2023-06-05 17:51:11'),
('j28cb38s', 'Aldi', 'aldi@gmail.com', '$2a$10$XDqppEK4ldiPzclYfQTCNOXlvCodHNeq/gB0xP5ZeBxhKl0e7aHiW', '089512341234', '', NULL, 1, '2023-06-11 14:00:46');

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `voucher_id` int(11) NOT NULL,
  `voucher_nomor` text NOT NULL,
  `voucher_nominal` int(11) NOT NULL,
  `voucher_expired` date NOT NULL,
  `voucher_digunakan` date DEFAULT NULL,
  `uid` varchar(20) DEFAULT NULL,
  `voucher_status` int(11) NOT NULL COMMENT '0=Belum DIgunakan, 1= Sudah Digunakan, 2=Rusak dan 3=Expired'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`voucher_id`, `voucher_nomor`, `voucher_nominal`, `voucher_expired`, `voucher_digunakan`, `uid`, `voucher_status`) VALUES
(5, 'ksdvbisbvisbvc343', 1000, '2023-06-15', '2023-06-05', 'e1pqf', 1),
(4, 'ksdvbisbvisbvcsc', 1000, '2023-06-15', '2023-06-09', 'e1pqf', 1),
(6, 'ksdvbisbvisdsvc343', 1000, '2023-06-15', '2023-06-06', 'e1pqf', 1),
(7, 'ksdsdvbisbvisdsvc343', 1000, '2023-06-15', NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `isi_saldo`
--
ALTER TABLE `isi_saldo`
  ADD PRIMARY KEY (`isi_saldo_id`),
  ADD KEY `rfid` (`uid`);

--
-- Indexes for table `lokasi_parkir`
--
ALTER TABLE `lokasi_parkir`
  ADD PRIMARY KEY (`lokasi_id`);

--
-- Indexes for table `parkir`
--
ALTER TABLE `parkir`
  ADD PRIMARY KEY (`parkir_id`);

--
-- Indexes for table `saldo`
--
ALTER TABLE `saldo`
  ADD PRIMARY KEY (`saldo_id`),
  ADD KEY `rfid` (`uid`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`token_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`voucher_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=556;

--
-- AUTO_INCREMENT for table `isi_saldo`
--
ALTER TABLE `isi_saldo`
  MODIFY `isi_saldo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `lokasi_parkir`
--
ALTER TABLE `lokasi_parkir`
  MODIFY `lokasi_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `parkir`
--
ALTER TABLE `parkir`
  MODIFY `parkir_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `saldo`
--
ALTER TABLE `saldo`
  MODIFY `saldo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `voucher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `isi_saldo`
--
ALTER TABLE `isi_saldo`
  ADD CONSTRAINT `isi_saldo_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `saldo`
--
ALTER TABLE `saldo`
  ADD CONSTRAINT `saldo_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
