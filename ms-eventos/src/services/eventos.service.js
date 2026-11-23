const config = require('../config/recurso');
const modelo = require('../models/eventos');
const HttpError = require('../utils/http-error');

function crearServicio(repo, patrocinadores) {
  const relacionActiva = config.recurso === 'eventos';
  if (relacionActiva && !patrocinadores) throw new Error('Falta el cliente de patrocinadores');
  const proyectar = p => ({ id: p.id, empresa: p.empresa, sector: p.sector });
  const sinPatrocinador = (fila, aviso) => ({ ...fila, patrocinador: null, aviso });
  const esFalloProveedor = error => error.status === 503 || error.status === 502;

  async function componerUno(fila, token) {
    if (!relacionActiva) return fila;
    try {
      const p = await patrocinadores.obtener(fila.patrocinador_id, token);
      return p ? { ...fila, patrocinador: proyectar(p) } : sinPatrocinador(fila, 'El patrocinador referenciado ya no existe');
    } catch (error) {
      if (!esFalloProveedor(error)) throw error;
      return sinPatrocinador(fila, 'No se pudo consultar el servicio de patrocinadores');
    }
  }

  async function componerListado(filas, token) {
    if (!relacionActiva || !filas.length) return filas;
    try {
      // Una sola petición por listado; no se consulta al proveedor dentro de un ciclo.
      const datos = await patrocinadores.listar([...new Set(filas.map(f => f.patrocinador_id))], token);
      const porId = new Map(datos.map(p => [p.id, p]));
      return filas.map(fila => porId.has(fila.patrocinador_id)
        ? { ...fila, patrocinador: proyectar(porId.get(fila.patrocinador_id)) }
        : sinPatrocinador(fila, 'El patrocinador referenciado ya no existe'));
    } catch (error) {
      if (!esFalloProveedor(error)) throw error;
      return filas.map(fila => sinPatrocinador(fila, 'No se pudo consultar el servicio de patrocinadores'));
    }
  }
  function limpiar(datos) {
    const errores = modelo.validar(datos);
    if (errores.length) throw new HttpError(400, 'Datos inválidos', errores);
    return modelo.construir(datos);
  }
  async function comprobarUnico(datos, id) {
    const existente = await repo.findByUnique(datos[config.perfil.unico]);
    if (existente && existente.id !== id) throw new HttpError(409, `${config.perfil.unico} ya existe`);
  }
  async function escribir(operacion) {
    try { return await operacion(); }
    catch (error) {
      // La restricción UNIQUE también cubre peticiones concurrentes.
      if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, `${config.perfil.unico} ya existe`);
      throw error;
    }
  }
  return {
    async listar(filtros, token) { return componerListado(await repo.findAll(filtros), token); },
    async obtener(id, token) {
      const fila = await repo.findById(id);
      if (!fila) throw new HttpError(404, 'No existe el registro solicitado');
      return componerUno(fila, token);
    },
    async crear(datos, token) {
      const limpio = limpiar(datos);
      const patrocinador = relacionActiva ? await patrocinadores.validar(limpio.patrocinador_id, token) : null;
      await comprobarUnico(limpio);
      const creado = await escribir(() => repo.create(limpio));
      return relacionActiva ? { ...creado, patrocinador: proyectar(patrocinador) } : creado;
    },
    async actualizar(id, datos, token) {
      const limpio = limpiar(datos);
      if (!await repo.findById(id)) throw new HttpError(404, 'No existe el registro solicitado');
      const patrocinador = relacionActiva ? await patrocinadores.validar(limpio.patrocinador_id, token) : null;
      await comprobarUnico(limpio, id);
      const actualizado = await escribir(() => repo.update(id, limpio));
      if (!actualizado) throw new HttpError(404, 'No existe el registro solicitado');
      return relacionActiva ? { ...actualizado, patrocinador: proyectar(patrocinador) } : actualizado;
    },
    async eliminar(id) {
      if (!await repo.remove(id)) throw new HttpError(404, 'No existe el registro solicitado');
    }
  };
}
module.exports = crearServicio;
