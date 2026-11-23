const perfiles = require('./perfiles');
const recurso = process.env.RECURSO || 'eventos';
if (!Object.hasOwn(perfiles, recurso)) {
  throw new Error(`RECURSO debe ser uno de: ${Object.keys(perfiles).join(', ')}`);
}
// Los identificadores SQL solo provienen de este catálogo; nunca del cuerpo de una petición.
const config = {
  recurso,
  perfil: perfiles[recurso],
  servicio: `ms-${recurso}`,
  ruta: `/${recurso}`,
  tabla: recurso,
  base: `${recurso}_db`,
  usuarioDB: process.env.DB_USER || `${recurso}_user`,
  host: process.env.HOST || '127.0.0.1',
  puerto: Number(process.env.PORT || 3011),
  usuariosURL: process.env.USUARIOS_URL || 'http://127.0.0.1:3001'
};
if (!Number.isInteger(config.puerto) || config.puerto < 1 || config.puerto > 65535) throw new Error('PORT no es válido');
module.exports = config;
