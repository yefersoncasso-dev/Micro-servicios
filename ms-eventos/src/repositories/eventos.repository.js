const config = require('../config/recurso');

function crearRepositorio(pool) {
  const columnas = config.perfil.campos.map(c => c.nombre);
  const tabla = `\`${config.tabla}\``;
  return {
    async findAll(filtros = {}) {
      const condiciones = [];
      const valores = [];
      if (filtros.valor !== undefined) {
        condiciones.push(`\`${config.perfil.filtro}\` = ?`);
        valores.push(filtros.valor);
      }
      if (filtros.ids) {
        condiciones.push(`id IN (${filtros.ids.map(() => '?').join(',')})`);
        valores.push(...filtros.ids);
      }
      const [filas] = await pool.execute(`SELECT * FROM ${tabla}${condiciones.length ? ' WHERE ' + condiciones.join(' AND ') : ''} ORDER BY id`, valores);
      return filas;
    },
    async findById(id) {
      const [filas] = await pool.execute(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
      return filas[0] || null;
    },
    async findByUnique(valor) {
      const [filas] = await pool.execute(`SELECT * FROM ${tabla} WHERE \`${config.perfil.unico}\` = ?`, [valor]);
      return filas[0] || null;
    },
    async create(datos) {
      const [resultado] = await pool.execute(`INSERT INTO ${tabla} (${columnas.map(c => `\`${c}\``).join(',')}) VALUES (${columnas.map(() => '?').join(',')})`, columnas.map(c => datos[c]));
      return this.findById(resultado.insertId);
    },
    async update(id, datos) {
      const [resultado] = await pool.execute(`UPDATE ${tabla} SET ${columnas.map(c => `\`${c}\` = ?`).join(',')} WHERE id = ?`, [...columnas.map(c => datos[c]), id]);
      return resultado.affectedRows ? this.findById(id) : null;
    },
    async remove(id) {
      const [resultado] = await pool.execute(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
      return resultado.affectedRows > 0;
    }
  };
}
module.exports = crearRepositorio;
