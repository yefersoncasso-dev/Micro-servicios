// CAPA DE PRESENTACIÓN: rutas de patrocinadores (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/patrocinadores.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /patrocinadores  y  GET /patrocinadores?ids=1,3
router.get('/:id', controller.obtener);   // GET /patrocinadores/:id

module.exports = router;
