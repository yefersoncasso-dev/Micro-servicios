const app = require('./app');

const PORT = Number(process.env.PORT) || 3012;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`ms-patrocinadores escuchando en http://${HOST}:${PORT}`);
});
