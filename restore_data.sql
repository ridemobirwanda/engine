-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: enginedb
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `website_settings`
--

DROP TABLE IF EXISTS `website_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `website_settings` (
  `COL 1` varchar(36) DEFAULT NULL,
  `COL 2` varchar(26) DEFAULT NULL,
  `COL 3` varchar(1167) DEFAULT NULL,
  `COL 4` varchar(53) DEFAULT NULL,
  `COL 5` varchar(29) DEFAULT NULL,
  `COL 6` varchar(29) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `website_settings`
--

LOCK TABLES `website_settings` WRITE;
/*!40000 ALTER TABLE `website_settings` DISABLE KEYS */;
INSERT INTO `website_settings` VALUES ('id','key','value','description','created_at','updated_at'),('09e17622-7e1d-4c63-95ee-68f29fd94b41','tawk_property_id','68d3e2e9a5528e1923b79293','Tawk.to property ID','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('20308ef5-9295-4017-9cf6-2e1cca6ff4f1','social_instagram','','Instagram profile URL','2025-10-05 09:07:31.268575+00','2025-10-05 09:07:31.268575+00'),('29cd4291-fb93-4c8a-8e16-695dbe50a089','seo_meta_title','Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier','Default meta title for SEO','2025-10-05 09:07:42.165715+00','2025-10-05 09:07:42.165715+00'),('2ebb7784-586a-4f29-aa0b-b8af16746589','google_ads_enabled','true','Enable Google Ads tracking and conversion measurement','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('4553101f-015d-4494-9c5e-6ad8ee3d103b','join_text','JOIN THE FUN !!','Subtitle text under logo','2025-10-05 09:07:32.59756+00','2025-10-05 09:07:32.59756+00'),('4654e803-cbae-48d0-80fe-90dfd70cd8fc','seo_og_title','Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier','Open Graph title for social sharing','2025-10-05 09:07:43.617078+00','2025-10-05 09:07:43.617078+00'),('4d08e598-1de1-4a3d-9559-9c424fb14cb1','google_analytics_id','','Google Analytics 4 measurement ID','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('4dd8965b-9608-4a08-9871-676560dffb56','seo_og_image','','Open Graph image URL for social sharing','2025-10-05 09:07:44.49401+00','2025-10-05 09:07:44.49401+00'),('54434432-68d2-4d15-b350-f4c6313f07ed','contact_phone','+357-96115404','Contact phone number shown in header','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('57cbb27e-13aa-4516-bd92-a198134250d9','whatsapp_message','Hi! I\'m interested in your products. Can you help me?','Default WhatsApp message','2025-10-05 09:07:38.03288+00','2025-10-05 09:07:38.03288+00'),('60598d94-7d39-446a-a4eb-7acfe4274331','maintenance_mode','false','Enable to show maintenance page','2025-10-05 09:07:34.321321+00','2025-10-05 09:07:34.321321+00'),('6614b51b-9334-4386-8683-8c919754e7fd','site_description','Premium Automotive Engines & Parts','Site description for SEO and meta tags','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('661e7900-362f-47dc-987a-62e44d5d4ca2','seo_meta_description','Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.','Default meta description for SEO','2025-10-05 09:07:42.699384+00','2025-10-05 09:07:42.699384+00'),('686b683c-a6c1-4a6d-b656-370134c69fed','seo_twitter_description','Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.','Twitter card description','2025-10-05 09:07:45.474843+00','2025-10-05 09:07:45.474843+00'),('6ed12e26-8c7a-47d3-9b84-625447354be9','footer_text','© 2024 Verified Engine. All rights reserved.','Copyright text in footer','2025-10-05 09:07:33.927105+00','2025-10-05 09:07:33.927105+00'),('7a8bd96f-87f9-490b-b662-c718dea8bd50','google_ads_code','','Google Ads script code for tracking and conversions','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('7cd4add2-6595-42fd-afdd-c8b99ad08552','seo_meta_keywords','automotive engines, rebuilt engines, used engines, BMW engines, Mercedes engines, Audi engines, engine parts, engine heads, engine blocks, timing components, engine pistons, engine crankshafts, engine valves, engine camshafts, engine gaskets, engine bearings, engine oil pumps, engine water pumps, engine alternators, engine starters, engine sensors, engine wiring harnesses, engine mounts, engine exhaust systems, engine intake systems, engine cooling systems, engine fuel systems, engine ignition systems, engine turbo systems, engine superchargers, engine cylinder heads, engine connecting rods, engine pushrods, engine lifters, engine rocker arms, engine timing chains, engine timing belts, engine timing tensioners, engine oil filters, engine air filters, engine fuel filters, engine spark plugs, engine ignition coils, engine distributors, engine carburetors, engine fuel injectors, engine throttle bodies, engine manifolds, engine headers, engine catalytic converters, premium engines, high-performance engines, engine specialists, engine warranty, engine shipping, engine installation, engine repair, engine maintenance, engine diagnostics, engine performance','Default meta keywords for SEO','2025-10-05 09:07:43.178095+00','2025-10-05 09:07:43.178095+00'),('7fe86328-f4ed-4738-b759-811c44708c39','tawk_3d_enabled','true','Enable 3D Tawk.to widget','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('801d22f1-3879-4ea5-a0a8-0d24f7369d4c','contact_email','support@enginemarkets.com','Primary contact email address','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('84d1264f-8dd3-459a-90a9-c92b27b9b39f','social_facebook','','Facebook page URL','2025-10-05 09:07:30.870072+00','2025-10-05 09:07:30.870072+00'),('867b28f4-b9aa-41ae-89d5-adacfdab418d','site_title','EngineCore','Main website title shown in header','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('8d309b3d-826a-4853-95a8-32a904d96363','social_twitter','','Twitter profile URL','2025-10-05 09:07:31.717403+00','2025-10-05 09:07:31.717403+00'),('96cd7d4d-3727-4fe9-b747-dcd19d8227ea','free_shipping_text','FREE SHIPPING ON SELECT ITEMS!','Text shown in top banner','2025-10-05 09:07:32.115754+00','2025-10-05 09:07:32.115754+00'),('978e0b73-1a39-4fb8-b0aa-fe6fa422fec0','whatsapp_number','','WhatsApp phone number','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('a47e4b43-e919-4014-a5c6-85eeb6bbf2ce','tawk_widget_id','1j5tqsot9','Tawk.to widget ID','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('a4ca6399-aa54-4728-8f04-688d42eb6802','hero_title','Premium Automotive Engines','Main title on homepage hero section','2025-10-05 09:07:33.006999+00','2025-10-05 09:07:33.006999+00'),('a89efbd4-9823-4d0c-924a-b2fc727f4426','tawk_enabled','true','Enable Tawk.to live chat widget','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('ab4bac5d-7c85-4b8a-8b4e-dc2a4aea8dbb','seo_twitter_title','Premium Automotive Engines & Parts | EngineCore - #1 Engine Supplier','Twitter card title','2025-10-05 09:07:44.897453+00','2025-10-05 09:07:44.897453+00'),('b6128b5f-cd76-4dc0-b84a-e8aa8a12c95f','tawk_avatar_url','','Custom avatar URL for Tawk.to','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('b94fa041-f58c-4b3a-9240-4a6b12ae6e15','seo_twitter_image','','Twitter card image URL','2025-10-05 09:07:45.861377+00','2025-10-05 09:07:45.861377+00'),('c08b4e45-4199-4b1c-9f6b-5c90935104d4','seo_og_description','Discover premium automotive engines, rebuilt engines, used engines, and high-performance parts. Expert-engineered solutions for BMW, Mercedes, Audi, and more. Fast shipping worldwide.','Open Graph description for social sharing','2025-10-05 09:07:44.051721+00','2025-10-05 09:07:44.051721+00'),('c91308d0-d81e-444a-8102-e7ac74893198','hero_subtitle','Quality engines you can trust','Subtitle on homepage hero section','2025-10-05 09:07:33.518232+00','2025-10-05 09:07:33.518232+00'),('e02bf7ec-6f48-4b34-9d6e-56fa1c81b171','google_tag_manager_id','','Google Tag Manager container ID','2025-10-05 09:07:41.224191+00','2025-10-05 09:07:41.224191+00'),('e8d7d55d-e144-4713-a044-19fb89bf46bd','google_analytics_enabled','true','Enable Google Analytics tracking','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('ecf89218-429a-4e93-b228-7965620ba5d7','tawk_use_default_launcher','true','Use default Tawk.to launcher','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00'),('f7a27c68-22aa-4965-b771-6e434cd5b3cf','google_tag_manager_enabled','true','Enable Google Tag Manager','2025-10-05 09:07:40.843774+00','2025-10-05 09:07:40.843774+00'),('fd393a2d-10ab-4f34-9eba-e10d08d7c663','whatsapp_enabled','true','Enable WhatsApp chat widget','2025-10-04 18:35:40.586135+00','2025-10-04 18:35:40.586135+00');
/*!40000 ALTER TABLE `website_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `COL 1` varchar(36) DEFAULT NULL,
  `COL 2` varchar(12) DEFAULT NULL,
  `COL 3` varchar(24) DEFAULT NULL,
  `COL 4` varchar(12) DEFAULT NULL,
  `COL 5` varchar(25) DEFAULT NULL,
  `COL 6` varchar(116) DEFAULT NULL,
  `COL 7` varchar(7) DEFAULT NULL,
  `COL 8` varchar(29) DEFAULT NULL,
  `COL 9` varchar(29) DEFAULT NULL,
  `COL 10` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES ('id','name','email','phone','subject','message','status','created_at','updated_at','admin_notes'),('0be9826c-b7a9-4607-a701-df3d8b59e86a','Jane Smith','jane@example.com','','Support Request','I need help with my recent order. Order number: #12345','read','2025-09-30 12:27:01.389573+00','2025-09-30 12:27:01.389573+00',''),('2231d707-b473-4060-9e04-42f6e6299b4c','engine51','mugisharisa@gmail.com','733617010','rgtrt','dfdff','new','2025-10-01 23:50:10.741022+00','2025-10-01 23:50:10.741022+00',''),('2de7afd3-069d-416f-b88e-3c3cb455f207','Mike Johnson','mike@example.com','','General Question','What is your return policy for used engines? I want to make sure I can return it if there are any issues.','replied','2025-09-28 16:47:27.008912+00','2025-09-28 16:47:27.008912+00',''),('31b76c58-a12e-4777-9729-a85374aca4b1','engine51','mugisharisa@gmail.com','1234567890','rgtrt','weuioou','new','2025-09-29 02:45:46.253842+00','2025-09-29 02:45:46.253842+00',''),('72b2063f-f11f-449a-abc1-481fcc9d0aa9','John Doe','john@example.com','','Product Inquiry','I am interested in your engine parts. Can you provide more information?','read','2025-09-30 12:27:01.389573+00','2025-10-01 19:44:33.633983+00',''),('8fad6f81-82e4-4da9-96ea-59b542312b45','Sarah Wilson','sarah@example.com','+1122334455','Honda CBR Engine','I am looking for a Honda CBR1000RR engine for my project. Do you have any available?','read','2025-09-28 16:47:27.008912+00','2025-09-28 17:22:17.180476+00',''),('917f894f-274c-4b63-93f1-fe899ea08873','engine51','mugisharisa@gmail.com','1234567890','rgtrt','yurujrj','new','2025-09-29 02:23:13.131816+00','2025-09-29 02:23:13.131816+00',''),('9b393d68-24c6-4ea1-8443-b0f3030cae60','engine51','mugisharisa@gmail.com','1234567890','rgtrt','sdsfffb','new','2025-10-02 11:55:28.141552+00','2025-10-02 11:55:28.141552+00',''),('a0783e3d-8968-4c28-8871-be7084825d1f','erik','erikawesome453@gmail.com','123456789000','need','i want to buy engine i need support','new','2025-10-02 00:01:59.977755+00','2025-10-02 00:01:59.977755+00',''),('ab2adfcf-4d8e-4384-a911-56f9818346dc','Mike Johnson','mike@example.com','','Part Availability','Do you have the XYZ engine component in stock?','new','2025-09-30 12:27:01.389573+00','2025-09-30 12:27:01.389573+00',''),('bd8f5734-23f3-414e-8b3e-9c24d3eea903','engine51','mugisharisa@gmail.com','1234567890','rgtrt','ertyui','new','2025-10-01 23:58:53.658443+00','2025-10-01 23:58:53.658443+00',''),('e34d8b4f-4aa1-4e84-930e-925a007cd3c9','John Doe','john@example.com','+1234567890','Question about BMW Engine','Hi, I am interested in the BMW B58 engine. Can you provide more details about its condition and warranty?','replied','2025-09-28 16:47:27.008912+00','2025-09-28 17:22:05.886204+00',''),('e8a2d01b-837b-4bf4-9a62-0ac8e5d7d79f','engine51','mugisharisa@gmail.com','1234567890','rgtrt','ewrrgtt','new','2025-09-29 02:50:38.427484+00','2025-09-29 02:50:38.427484+00',''),('ef4dfc04-7e0e-4aa0-b6a3-8cac4f6fd1ba','Sarah Wilson','sarah@example.com','','Bulk Order','We are interested in placing a bulk order for 100 units.','replied','2025-09-30 12:27:01.389573+00','2025-09-30 12:27:01.389573+00',''),('efd2bf4e-537a-47bf-9b5a-61806aeccefe','Jane Smith','jane@example.com','+0987654321','Mercedes AMG Inquiry','Hello, I would like to know if you have any Mercedes AMG engines in stock. Please let me know the available options.','read','2025-09-28 16:47:27.008912+00','2025-09-28 16:47:27.008912+00','');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles` (
  `COL 1` varchar(36) DEFAULT NULL,
  `COL 2` varchar(36) DEFAULT NULL,
  `COL 3` varchar(10) DEFAULT NULL,
  `COL 4` varchar(9) DEFAULT NULL,
  `COL 5` varchar(5) DEFAULT NULL,
  `COL 6` varchar(10) DEFAULT NULL,
  `COL 7` varchar(29) DEFAULT NULL,
  `COL 8` varchar(29) DEFAULT NULL,
  `COL 9` varchar(11) DEFAULT NULL,
  `COL 10` varchar(14) DEFAULT NULL,
  `COL 11` varchar(8) DEFAULT NULL,
  `COL 12` varchar(29) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES ('id','user_id','first_name','last_name','phone','avatar_url','created_at','updated_at','device_name','device_address','location','device_join_date'),('40e59cb9-4e87-4b64-b151-8000522deed7','d439060d-3ca4-4f35-bb54-372915484371','','','','','2025-09-23 15:23:59.841705+00','2025-09-23 15:23:59.841705+00','','','','2025-09-23 15:23:59.841705+00'),('bf976e7a-23a3-4dee-a8a1-d4b7275bfc47','af6fac89-96f5-473f-9b1c-f25a93b3f29d','','','','','2025-08-31 13:38:24.274605+00','2025-08-31 13:38:24.274605+00','','','','2025-09-21 09:08:54.580692+00');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart_items` (
  `COL 1` varchar(36) DEFAULT NULL,
  `COL 2` varchar(36) DEFAULT NULL,
  `COL 3` varchar(10) DEFAULT NULL,
  `COL 4` varchar(36) DEFAULT NULL,
  `COL 5` varchar(8) DEFAULT NULL,
  `COL 6` varchar(29) DEFAULT NULL,
  `COL 7` varchar(29) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES ('id','user_id','session_id','product_id','quantity','created_at','updated_at'),('4430aec9-b1b3-4974-85c0-b1c6a1110057','d439060d-3ca4-4f35-bb54-372915484371','','1a4b1c23-212e-4d9f-becf-8fd90a6a6270','1','2025-09-28 07:49:52.820036+00','2025-09-28 07:49:52.820036+00'),('db1a4017-af8b-4670-80a7-487232833e06','d439060d-3ca4-4f35-bb54-372915484371','','a754cca8-8cb6-4ee4-a7da-faccf75103dc','1','2025-09-27 16:26:33.411788+00','2025-09-27 16:26:33.411788+00');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-11 13:38:42
