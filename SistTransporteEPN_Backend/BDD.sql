-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_transporte
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (1,'Admin','User','admin@example.com','123456'),(2,'Manager','User','manager@example.com','managerhashed');
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conductores`
--

DROP TABLE IF EXISTS `conductores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conductores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `ruta` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`correo`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `conductores_ibfk_1` (`ruta`),
  CONSTRAINT `conductores_ibfk_1` FOREIGN KEY (`ruta`) REFERENCES `rutas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conductores`
--

LOCK TABLES `conductores` WRITE;
/*!40000 ALTER TABLE `conductores` DISABLE KEYS */;
INSERT INTO `conductores` VALUES (1,'Carlos','Rivera','carlos.rivera@example.com','123456','0987654321',1),(2,'Ana','Martinez','ana.martinez@example.com','ijklhashed','0965432108',3),(5,'Carlos','Rivera','carlos.riivera@example.com','efghhashed','0987654322',2),(7,'Carlos','Gustavo','dasdsa@dah.com','casdasdad','1758966666',1);
/*!40000 ALTER TABLE `conductores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `codigoUnico` varchar(20) NOT NULL,
  `ruta` int DEFAULT NULL,
  `parada` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`correo`),
  UNIQUE KEY `codigo_unico` (`codigoUnico`),
  KEY `estudiantes_ibfk_1` (`ruta`),
  KEY `estudiantes_ibfk_2` (`parada`),
  CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`ruta`) REFERENCES `rutas` (`id`),
  CONSTRAINT `estudiantes_ibfk_2` FOREIGN KEY (`parada`) REFERENCES `paradas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (1,'Juaaaaan','Perez','juan.perez@epn.edu.ec','1234hashed','123456789',1,NULL),(2,'Maria','Gomez','maria.gomez@epn.edu.ec','5678hashed','987654321',NULL,NULL),(3,'Carlos','Lopez','carlos.lopez@epn.edu.ec','abcdhashed','112233445',3,NULL),(6,'Juan','Perez','juan.peez@epn.edu.ec','1234hashed','123456889',2,NULL),(8,'Carlos','Benavides','car@epn.edu.ec','2112121212','565445665',3,NULL),(9,'Carlos','bena','dsasda@epn.edu.ec','Cardasjd@.a5','515661561',2,NULL),(10,'Estudiante','Nuevo','correo1@epn.edu.ec','123456','123444455',2,NULL);
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paradas`
--

DROP TABLE IF EXISTS `paradas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paradas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ruta` int DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paradas_ibfk_1` (`ruta`),
  CONSTRAINT `paradas_ibfk_1` FOREIGN KEY (`ruta`) REFERENCES `rutas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paradas`
--

LOCK TABLES `paradas` WRITE;
/*!40000 ALTER TABLE `paradas` DISABLE KEYS */;
INSERT INTO `paradas` VALUES (10,1,'EPN',-0.21022000,-78.48828000),(11,1,'Ladrón de Guevara',-0.21261500,-78.48997400),(12,1,'Av. Velasco Ibarra',-0.22073800,-78.49528400),(13,1,'Av. Napo',-0.24004900,-78.51143200),(14,1,'Calle Corazón',-0.24519800,-78.51711600),(15,1,'Redondel de la Villaflora',-0.24491300,-78.51929200),(16,1,'Av. Pedro Vicente Maldonado',-0.25517400,-78.52244900),(17,1,'Parada El Capulí del eco-vía',-0.29953600,-78.54227200),(18,2,'EPN',-0.21255800,-78.49038300),(19,2,'Ladrón de Guevara',-0.21259300,-78.49109000),(20,2,'Oriental',-0.23008400,-78.50146900),(21,2,'Trébol',-0.23325300,-78.50446800),(22,2,'Av. Rumiñahui',-0.23387400,-78.48449200),(23,2,'Av. Simón Bolívar',-0.27374800,-78.51020000),(24,2,'Av. Morán Valverde',-0.29032000,-78.53694900),(25,2,'Av. Maldonado',-0.29473400,-78.54040300),(26,2,'Antiguo peaje',-0.34509700,-78.54881600),(27,3,'EPN',-0.21022000,-78.48828000),(28,3,'Ladrón de Guevara',-0.21455000,-78.49010000),(29,3,'Av. Patria',-0.21780000,-78.49350000),(30,3,'Pérez Guerrero',-0.22040000,-78.49620000),(31,3,'Bolivia',-0.22300000,-78.49880000),(32,3,'Av. Universitaria',-0.23020000,-78.50310000),(33,3,'Av. Mariscal Sucre',-0.23580000,-78.50780000),(34,3,'Av. Morán Valverde',-0.24500000,-78.51220000),(35,3,'Av. Otayañan',-0.25060000,-78.52000000),(36,3,'Av. Pedro Vicente Maldonado',-0.25940000,-78.52830000),(37,3,'Carr. Panamericana',-0.27820000,-78.54070000),(38,3,'Parque de Machachi',-0.31133000,-78.55642000),(39,4,'EPN',-0.21022000,-78.48828000),(40,4,'Ladrón de Guevara',-0.21455000,-78.49010000),(41,4,'Av. Patria',-0.21780000,-78.49350000),(42,4,'Pérez Guerrero',-0.22040000,-78.49620000),(43,4,'Bolivia',-0.22300000,-78.49880000),(44,4,'Av. Universitaria',-0.23020000,-78.50310000),(45,4,'Av. Mariscal Sucre',-0.23580000,-78.50780000),(46,4,'Michelena',-0.24020000,-78.51220000),(47,4,'Av. Teniente Hugo Ortiz',-0.24500000,-78.52040000),(48,4,'Av. Cardenal de la Torre',-0.25060000,-78.52830000),(49,4,'Guanando',-0.25500000,-78.53210000),(50,4,'Cusubamba',-0.26030000,-78.53570000),(51,4,'Av. Mariscal Sucre',-0.26540000,-78.54010000),(52,4,'Cóndor Ñan',-0.27000000,-78.54500000),(53,4,'Terminal Quitumbe',-0.31000000,-78.55600000),(54,5,'EPN',-0.21022000,-78.48828000),(55,5,'Ladrón de Guevara',-0.21455000,-78.49010000),(56,5,'Av. Patria',-0.21780000,-78.49350000),(57,5,'Pérez Guerrero',-0.22040000,-78.49620000),(58,5,'Bolivia',-0.22300000,-78.49880000),(59,5,'Av. Universitaria',-0.23020000,-78.50310000),(60,5,'Av. Mariscal Sucre',-0.23580000,-78.50780000),(61,5,'Iglesia de la Ecuatoriana',-0.27050000,-78.54620000),(62,6,'EPN',-0.21022000,-78.48828000),(63,6,'Ladrón de Guevara',-0.21455000,-78.49010000),(64,6,'Av. Patria',-0.21780000,-78.49350000),(65,6,'Pérez Guerrero',-0.22040000,-78.49620000),(66,6,'Bolivia',-0.22300000,-78.49880000),(67,6,'Av. Universitaria',-0.23020000,-78.50310000),(68,6,'Av. Mariscal Sucre',-0.23580000,-78.50780000),(69,6,'Cbo. Luis Iturralde',-0.24000000,-78.51010000),(70,6,'Av. Teniente Hugo Ortiz',-0.24500000,-78.52040000),(71,6,'Cardenal de la Torre',-0.25060000,-78.52830000),(72,6,'Av. Marquesa de Solanda',-0.25500000,-78.53210000),(73,6,'Av. Rumichaca',-0.26030000,-78.53570000),(74,6,'Estadio del Aucas',-0.27050000,-78.54620000),(75,7,'EPN',-0.21022000,-78.48828000),(76,7,'Oriental',-0.21880000,-78.49500000),(77,7,'Av. Napo',-0.23050000,-78.50350000),(78,7,'Villaflora',-0.25940000,-78.51800000),(79,7,'Alonso de Angulo',-0.26350000,-78.52500000),(80,7,'Av. Teniente Hugo Ortiz',-0.26850000,-78.53050000),(81,7,'Quicentro Sur',-0.27320000,-78.53500000),(82,8,'EPN',-0.21022000,-78.48828000),(83,8,'Ladrón de Guevara',-0.21455000,-78.49010000),(84,8,'Av. Patria',-0.21780000,-78.49350000),(85,8,'Pérez Guerrero',-0.22040000,-78.49620000),(86,8,'Bolivia',-0.22300000,-78.49880000),(87,8,'Av. Universitaria',-0.23020000,-78.50310000),(88,8,'Av. Mariscal Sucre',-0.23580000,-78.50780000),(89,8,'Redondel del Condado',-0.24560000,-78.51550000),(90,8,'Manuel Córdoba Galarza',-0.25350000,-78.52050000),(91,8,'Plaza Equinoccial',-0.26650000,-78.52850000),(92,9,'EPN',-0.21022000,-78.48828000),(93,9,'Av. 10 de Agosto',-0.21450000,-78.49020000),(94,9,'Juan León Mera',-0.21800000,-78.49250000),(95,9,'El Labrador',-0.23050000,-78.50350000),(96,9,'Av. Galo Plaza',-0.23580000,-78.50780000),(97,9,'Panamericana Norte',-0.24500000,-78.51220000),(98,9,'Intercambiador Av. Simón Bolívar',-0.25060000,-78.52000000),(99,9,'Calle Isidro Ayora',-0.25550000,-78.52580000),(100,9,'Colegio Americano de Quito',-0.26030000,-78.53570000),(101,10,'EPN',-0.21022000,-78.48828000),(102,10,'Ladrón de Guevara',-0.21455000,-78.49010000),(103,10,'Av. Patria',-0.21780000,-78.49350000),(104,10,'Av. América',-0.22050000,-78.49550000),(105,10,'Av. 10 de Agosto',-0.22550000,-78.50050000),(106,10,'Av. La Prensa',-0.23020000,-78.50550000),(107,10,'Condado Shopping',-0.23580000,-78.50780000),(108,11,'EPN',-0.21022000,-78.48828000),(109,11,'Ladrón de Guevara',-0.21455000,-78.49010000),(110,11,'Av. Patria',-0.21780000,-78.49350000),(111,11,'Av. 10 de Agosto',-0.22550000,-78.50050000),(112,11,'Av. La Prensa',-0.23020000,-78.50550000),(113,11,'Av. Diego Vásquez Cepeda',-0.23500000,-78.51020000),(114,11,'Av. Jaime Roldós Aguilera',-0.24050000,-78.51550000),(115,11,'Av. Isidro Ayora',-0.24550000,-78.52050000),(116,12,'EPN',-0.21022000,-78.48828000),(117,12,'Ladrón de Guevara',-0.21455000,-78.49010000),(118,12,'Av. Patria',-0.21780000,-78.49350000),(119,12,'Av. 6 de Diciembre',-0.22280000,-78.49550000),(120,12,'Av. Eloy Alfaro',-0.23050000,-78.50350000),(121,12,'Terminal Carcelén',-0.23580000,-78.50780000),(122,12,'Panamericana Norte',-0.24500000,-78.51220000),(123,12,'Capitán Giovanni Calles',-0.25060000,-78.52000000),(124,12,'Luis Vacarí',-0.25550000,-78.52580000),(125,12,'Galo Plaza',-0.26030000,-78.53570000),(126,12,'Estadio de Carapungo',-0.26650000,-78.54050000),(127,13,'EPN',-0.21022000,-78.48828000),(128,13,'Av. 12 de Octubre',-0.21450000,-78.49020000),(129,13,'Av. González Suárez',-0.21800000,-78.49250000),(130,13,'Fernando Ayarza',-0.22200000,-78.49550000),(131,13,'Av. Eloy Alfaro',-0.23050000,-78.50350000),(132,13,'De Las Palmeras',-0.23580000,-78.50780000),(133,13,'Av. Simón Bolívar',-0.24500000,-78.51220000),(134,13,'Panamericana Norte',-0.25060000,-78.52000000),(135,14,'EPN',-0.21022000,-78.48828000),(136,14,'Av. Oriental',-0.21880000,-78.49500000),(137,14,'Av. General Rumiñahui',-0.22550000,-78.50050000),(138,14,'El Triángulo',-0.23020000,-78.50550000),(139,14,'El Colibrí',-0.23500000,-78.51020000),(140,14,'El Choclo',-0.24050000,-78.51550000),(141,14,'Av. Calderón',-0.24550000,-78.52050000),(142,14,'Monumento Rumiñahui',-0.25030000,-78.52570000),(143,14,'Santa Maria',-0.25500000,-78.53050000),(144,14,'Parque El Turismo',-0.26050000,-78.53580000),(145,15,'EPN',-0.21022000,-78.48828000),(146,15,'Queseras del Medio',-0.21450000,-78.49020000),(147,15,'Av. De los Conquistadores',-0.21800000,-78.49250000),(148,15,'Av. Simón Bolívar',-0.22200000,-78.49550000),(149,15,'Ruta Viva',-0.23050000,-78.50350000),(150,15,'Pifo',-0.23580000,-78.50780000),(151,15,'Tababela',-0.24500000,-78.51220000),(152,15,'Yaruquí',-0.25060000,-78.52000000),(153,15,'Parque de Checa',-0.25550000,-78.52580000),(154,15,'El Quinche',-0.26030000,-78.53570000),(155,16,'EPN',-0.21022000,-78.48828000),(156,16,'Vicentina',-0.21450000,-78.49020000),(157,16,'Guápulo',-0.21800000,-78.49250000),(158,16,'Cumbayá',-0.22200000,-78.49550000),(159,16,'El Nacional',-0.23050000,-78.50350000),(160,16,'Tumbaco',-0.23580000,-78.50780000),(161,16,'Puembo',-0.24500000,-78.51220000),(162,17,'EPN',-0.21022000,-78.48828000),(163,17,'Av. 12 de Octubre',-0.21450000,-78.49020000),(164,17,'Av. Coruña',-0.21800000,-78.49250000),(165,17,'Estación Trole Norte',-0.22500000,-78.50000000),(166,18,'EPN',-0.21022000,-78.48828000),(167,18,'Av. Velasco Ibarra',-0.22090000,-78.49560000),(168,18,'Estación El Recreo',-0.23000000,-78.50250000);
/*!40000 ALTER TABLE `paradas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutas`
--

DROP TABLE IF EXISTS `rutas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `asientos_disponibles` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutas`
--

LOCK TABLES `rutas` WRITE;
/*!40000 ALTER TABLE `rutas` DISABLE KEYS */;
INSERT INTO `rutas` VALUES (1,'CAPULÍ',20),(2,'GUAMANÍ',25),(3,'MACHACHI',30),(4,'QUITUMBE',25),(5,'ECUATORIANA',20),(6,'ESTADIO DEL AUCAS',20),(7,'QUICENTRO SUR',20),(8,'SAN ANTONIO DE PICHINCHA',25),(9,'CARCELEN 1',30),(10,'CONDADO SHOPPING',25),(11,'CARCELEN 2',30),(12,'CARAPUNGO',25),(13,'PANAMERICANA',20),(14,'SANGOLQUI',25),(15,'QUINCHE',30),(16,'PUEMBO',25),(17,'TROLE NORTE ESTACION',20),(18,'ESTACION EL RECREO',20);
/*!40000 ALTER TABLE `rutas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-29 20:35:04
