-- Ficha 06, tarea 1: referencia obligatoria al microservicio de patrocinadores.
-- La relación entre microservicios se valida por HTTP, sin clave foránea entre bases.
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS eventos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventos_db;
CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(64) NOT NULL UNIQUE,
  nombre VARCHAR(160) NOT NULL,
  fecha DATE NOT NULL,
  asistentes_esperados INT NOT NULL CHECK (asistentes_esperados > 0),
  tipo ENUM('conferencia', 'taller', 'feria') NOT NULL,
  patrocinador_id INT NOT NULL CHECK (patrocinador_id > 0)
);
INSERT INTO eventos (codigo, nombre, fecha, asistentes_esperados, tipo, patrocinador_id) VALUES
('EV-001', 'Conferencia de redes', '2026-12-01', 50, 'conferencia', 1),
('EV-002', 'Taller de servicios', '2026-12-02', 20, 'taller', 2),
('EV-003', 'Feria tecnológica', '2026-12-03', 100, 'feria', 4)
ON DUPLICATE KEY UPDATE id = id;
