// CAPA DE ACCESO A DATOS: patrocinadores en MySQL
const pool = require('../db');

// MySQL guarda BOOLEAN como 0/1: aquí se traduce al formato del contrato
const aObjeto = (fila) => ({ ...fila });

async function findAll(ids) {
  const [filas] = ids
    ? await pool.query('SELECT * FROM patrocinadores WHERE id IN (?) ORDER BY id', [ids])
    : await pool.query('SELECT * FROM patrocinadores ORDER BY id');
  return filas.map(aObjeto);
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM patrocinadores WHERE id = ?', [id]);
  return filas.length ? aObjeto(filas[0]) : null;
}

module.exports = { findAll, findById };
