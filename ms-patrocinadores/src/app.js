// =====================================================================
// ms-patrocinadores · microservicio PROVEEDOR del examen (solo lectura).
// Lo consulta el microservicio de eventos para validar y componer.
// =====================================================================
const express = require('express');
const cors = require('cors');
const rutas = require('./routes/patrocinadores.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Registro: muestra en la terminal cada petición que llega
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ servicio: 'ms-patrocinadores', estado: 'ok' });
});

app.use('/patrocinadores', rutas);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message });
});

module.exports = app;
