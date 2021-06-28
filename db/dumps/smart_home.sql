-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 26, 2019 at 02:50 PM
-- Server version: 5.7.26-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.4

CREATE DATABASE IF NOT EXISTS smart_home;

USE smart_home;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_home`
--

-- --------------------------------------------------------

--
-- Table structure for table `Devices`
--

CREATE TABLE `Devices` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(128) NOT NULL,
  `state` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `dev` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Devices`
--

INSERT INTO `Devices` (`id`, `name`, `description`, `state`, `type`, `dev`) VALUES
(1, 'Lampara 1', 'Luz living', 1, 1, 'lamp'),
(2, 'Lampara 2', 'Luz cocina', 0, 1, 'lamp'),
(3, 'AC 1', 'AC Comedor', 1, 2, 'cooler'),
(4, 'Televisión 1', 'Televisión living', 1, 2, 'tv'),
(5, 'Calefacción 1', 'Calefacción de la cocina', 1, 2, 'heater'),
(6, 'Audio 1', 'Equipo de Música', 0, 1, 'audio');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Devices`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Devices`
--
ALTER TABLE `Devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
