const config = require('./config/recurso');
if (!process.env.JWT_SECRET || !process.env.DB_PASSWORD) {
  console.error('Configure JWT_SECRET y DB_PASSWORD en .env antes de iniciar');
  process.exit(1);
}
const pool = require('./db');
const crearApp = require('./app');
async function iniciar() {
  await pool.query('SELECT 1');
  const server = crearApp().listen(config.puerto, config.host, () => {
    console.log(`${config.servicio} disponible en http://${config.host}:${config.puerto}${config.ruta}`);
  });
  server.on('error', error => { console.error('No se pudo iniciar:', error.code); pool.end(); process.exitCode = 1; });
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(async () => { await pool.end(); process.exit(0); }));
}
iniciar().catch(error => { console.error('No se pudo conectar a MySQL:', error.code || error.message); pool.end(); process.exitCode = 1; });
