const config = require('../config/recurso');

function fechaValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [y, m, d] = valor.split('-').map(Number);
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return y >= 1000 && Number.isFinite(fecha.getTime()) && fecha.getUTCFullYear() === y && fecha.getUTCMonth() + 1 === m && fecha.getUTCDate() === d;
}

function validar(datos, perfil = config.perfil) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return ['Se esperaba un objeto JSON'];
  const errores = [];
  const permitidos = new Set(perfil.campos.map(c => c.nombre));
  for (const campo of Object.keys(datos)) if (!permitidos.has(campo)) errores.push(`Campo no permitido: ${campo}`);
  for (const c of perfil.campos) {
    const valor = datos[c.nombre];
    if (c.tipo === 'texto') {
      if (typeof valor !== 'string' || !valor.trim()) errores.push(`${c.nombre} es obligatorio y debe ser texto`);
      else if (valor.trim().length > c.max) errores.push(`${c.nombre} permite hasta ${c.max} caracteres`);
      else if (c.patron && !c.patron.test(valor.trim())) errores.push(`${c.nombre} debe tener formato ${c.formato}`);
    } else if (c.tipo === 'entero') {
      if (!Number.isSafeInteger(valor) || valor < c.min || valor > c.max) errores.push(`${c.nombre} debe ser un entero entre ${c.min} y ${c.max}`);
    } else if (c.tipo === 'fecha') {
      if (!fechaValida(valor)) errores.push(`${c.nombre} debe ser una fecha real con formato AAAA-MM-DD`);
    } else if (c.tipo === 'opcion' && !c.valores.includes(valor)) {
      errores.push(`${c.nombre} debe ser uno de: ${c.valores.join(', ')}`);
    }
  }
  if (!errores.length && perfil.validarRelacion) errores.push(...perfil.validarRelacion(datos));
  return errores;
}

function construir(datos, perfil = config.perfil) {
  return Object.fromEntries(perfil.campos.map(c => [c.nombre, typeof datos[c.nombre] === 'string' ? datos[c.nombre].trim() : datos[c.nombre]]));
}
module.exports = { validar, construir, fechaValida };
