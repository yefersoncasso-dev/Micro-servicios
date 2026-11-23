// Cliente entregado en para-el-consumidor/, completado para la ficha 06.
const HttpError = require('../utils/http-error');
const PATROCINADORES_URL = (process.env.PATROCINADORES_URL || 'http://127.0.0.1:3012').replace(/\/+$/, '');

// Reenvía el token original y limita la espera a tres segundos.
async function pedir(ruta, token) {
  try {
    return await fetch(`${PATROCINADORES_URL}${ruta}`, {
      headers: { Authorization: token },
      signal: AbortSignal.timeout(3000)
    });
  } catch (error) {
    return null;
  }
}

async function leer(respuesta) {
  if (!respuesta || respuesta.status >= 500) throw new HttpError(503, 'El servicio de patrocinadores no está disponible');
  if ([401, 403].includes(respuesta.status)) throw new HttpError(respuesta.status, 'El proveedor rechazó el token o los permisos del usuario');
  if (!respuesta.ok) throw new HttpError(502, 'Respuesta inesperada del servicio de patrocinadores');
  try { return await respuesta.json(); }
  catch { throw new HttpError(502, 'El servicio de patrocinadores no devolvió JSON válido'); }
}

function comprobarFormato(datos) {
  if (!datos || !Number.isInteger(datos.id) || datos.id < 1 || typeof datos.empresa !== 'string' || typeof datos.sector !== 'string' || typeof datos.estado_contrato !== 'string') {
    throw new HttpError(502, 'El servicio de patrocinadores devolvió un objeto inválido');
  }
  return datos;
}

async function obtener(id, token) {
  const respuesta = await pedir(`/patrocinadores/${id}`, token);
  if (respuesta?.status === 404) return null;
  const datos = comprobarFormato(await leer(respuesta));
  if (datos.id !== id) throw new HttpError(502, 'El patrocinador devuelto no coincide con el solicitado');
  return datos;
}

async function validar(id, token) {
  const datos = await obtener(id, token);
  if (!datos) throw new HttpError(400, `No existe el patrocinador con id ${id}`);
  if (datos.estado_contrato === 'vencido') throw new HttpError(409, 'Un evento no puede tener un patrocinador con contrato vencido');
  return datos;
}

async function listar(ids, token) {
  const unicos = [...new Set(ids)];
  if (!unicos.length) return [];
  const datos = await leer(await pedir(`/patrocinadores?ids=${unicos.join(',')}`, token));
  if (!Array.isArray(datos)) throw new HttpError(502, 'La consulta por lotes no devolvió un arreglo');
  return datos.map(comprobarFormato);
}

module.exports = { pedir, obtener, validar, listar };
