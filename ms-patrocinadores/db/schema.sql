-- db/schema.sql — base de datos de ms-patrocinadores
SET NAMES utf8mb4;

CREATE TABLE patrocinadores (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  empresa              VARCHAR(100) NOT NULL,
  sector               VARCHAR(60) NOT NULL,
  estado_contrato      VARCHAR(20) NOT NULL
);

INSERT INTO patrocinadores (empresa, sector, estado_contrato) VALUES
  ('Tecnoandina', 'tecnología', 'vigente'),
  ('Lácteos del Valle', 'alimentos', 'vigente'),
  ('Construye Ya', 'construcción', 'vencido'),
  ('Banco Futuro', 'finanzas', 'vigente');
