const express = require('express');
const config = require('./config/recurso');
const { verificarToken } = require('./middlewares/auth');
const crearRepositorio = require('./repositories/eventos.repository');
const crearServicio = require('./services/eventos.service');
const crearControlador = require('./controllers/eventos.controller');
const crearRutas = require('./routes/eventos.routes');

function crearApp({ repository, patrocinadoresClient, logger = console.log } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.on('finish', () => logger(`${req.method} ${req.originalUrl} ${res.statusCode}`));
    next();
  });
  app.use(express.json({ limit: '100kb' }));
  app.use(verificarToken);
  app.get('/health', (req, res) => res.status(200).json({ servicio: config.servicio, estado: 'ok' }));
  const repo = repository || crearRepositorio(require('./db'));
  const cliente = config.recurso === 'eventos' ? (patrocinadoresClient || require('./clients/patrocinadores.client')) : undefined;
  app.use(config.ruta, crearRutas(crearControlador(crearServicio(repo, cliente))));
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'El cuerpo no es JSON válido' });
    const status = error.status || 500;
    if (status >= 500 && status !== 502 && status !== 503) {
      console.error('Error interno:', error.code || error.name);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(status).json({ error: error.message, ...(error.detalles ? { detalles: error.detalles } : {}) });
  });
  return app;
}
module.exports = crearApp;
