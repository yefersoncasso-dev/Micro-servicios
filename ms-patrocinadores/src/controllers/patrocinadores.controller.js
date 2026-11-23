// CAPA DE PRESENTACIÓN: HTTP ↔ servicio de patrocinadores
const service = require('../services/patrocinadores.service');
const HttpError = require('../utils/http-error');

// GET /patrocinadores  ·  GET /patrocinadores?ids=1,3
async function listar(req, res) {
  let ids;
  if (req.query.ids) {
    ids = String(req.query.ids).split(',').map(Number);
    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new HttpError(400, 'ids debe ser una lista de enteros separados por comas');
    }
  }
  res.status(200).json(await service.listar(ids));
}

// GET /patrocinadores/:id
async function obtener(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  res.status(200).json(await service.obtener(id));
}

module.exports = { listar, obtener };
