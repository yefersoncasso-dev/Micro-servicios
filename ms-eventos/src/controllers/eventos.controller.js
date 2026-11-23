const config = require('../config/recurso');
const HttpError = require('../utils/http-error');
function leerId(valor) {
  if (!/^[1-9]\d*$/.test(String(valor)) || !Number.isSafeInteger(Number(valor)) || Number(valor) > 2147483647) throw new HttpError(400, 'El id debe ser un entero positivo válido');
  return Number(valor);
}
function crearControlador(service) {
  return {
    async listar(req, res) {
      const filtros = {};
      const valor = req.query[config.perfil.filtro];
      if (valor !== undefined) {
        if (typeof valor !== 'string' || !valor.trim()) throw new HttpError(400, 'El filtro debe contener un texto');
        filtros.valor = valor.trim();
      }
      if (req.query.ids !== undefined) {
        if (typeof req.query.ids !== 'string' || !req.query.ids) throw new HttpError(400, 'ids debe contener enteros separados por comas');
        filtros.ids = [...new Set(req.query.ids.split(',').map(leerId))];
      }
      res.status(200).json(await service.listar(filtros, req.headers.authorization));
    },
    async obtener(req, res) { res.status(200).json(await service.obtener(leerId(req.params.id), req.headers.authorization)); },
    async crear(req, res) {
      const fila = await service.crear(req.body, req.headers.authorization);
      res.status(201).location(`${req.baseUrl}/${fila.id}`).json(fila);
    },
    async actualizar(req, res) { res.status(200).json(await service.actualizar(leerId(req.params.id), req.body, req.headers.authorization)); },
    async eliminar(req, res) { await service.eliminar(leerId(req.params.id)); res.status(204).end(); }
  };
}
module.exports = crearControlador;
