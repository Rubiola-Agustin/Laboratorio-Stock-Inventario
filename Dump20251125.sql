-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: laboratorio_inventario
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `movimientos`
--

DROP TABLE IF EXISTS `movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `insumoId` int DEFAULT NULL,
  `tipo` enum('entrada','salida') DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `insumoId` (`insumoId`),
  CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`insumoId`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos`
--

LOCK TABLES `movimientos` WRITE;
/*!40000 ALTER TABLE `movimientos` DISABLE KEYS */;
INSERT INTO `movimientos` VALUES (1,1,'entrada',30,'Compra','2025-11-12 15:13:00'),(2,1,'salida',45,'uso','2025-11-13 15:46:54'),(3,10,'entrada',2,'compra','2025-11-18 22:28:58'),(4,4,'entrada',1,'compra','2025-11-18 22:42:24'),(5,10,'entrada',120,'compra','2025-11-18 22:43:18'),(6,4,'entrada',10,'compra','2025-11-18 22:44:41');
/*!40000 ALTER TABLE `movimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  `ubicacion` varchar(50) DEFAULT NULL,
  `proveedorId` int DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Potasio','Reactivo químico',8,'gramos','estante 3',1,0.00,NULL),(4,'Lampara de Sal','Instrumentos y equipos',12,'Unidad','Estante 4',NULL,0.00,'Limpiarla'),(6,'bomabaa','Reactivos orgánicos sólidos',54,'kilos','mesada',1,0.00,'media seca'),(7,'gergerg','Instrumentos y equipos',34,'rt','rt',1,0.00,'agtreg'),(8,'qhtqh','Soluciones y más',4,'234','324234',1,0.00,'234234234'),(9,'bomba','Reactivos inorgánicos sólidos',23,'ml','bgs',1,0.00,'grwgrwe'),(10,'bromuro de potasio','Reactivos inorgánicos sólidos',123,'unidad','armario',1,0.00,'no abrir'),(11,'una nueva lampara llsdoa','Instrumentos y equipos',1,'unidad','sfd',1,0.00,'fwsdf'),(12,'lamapra','Instrumentos y equipos',78,'dsa','dqwe',1,0.00,'dqwd');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Drogas sa','pedro sanchez','349885234785','gwwterhgwh@gmail.com');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `contraseña` varchar(100) DEFAULT NULL,
  `rol` varchar(30) DEFAULT 'estudiante',
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Agustin Rubiola','agustin','12345','profesor'),(2,'lula','lula','lula','profesor'),(3,'Christian Rubiola','christian','christian','estudiante'),(4,'Noelia Gioino','noe','12345','profesor');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 16:30:02
