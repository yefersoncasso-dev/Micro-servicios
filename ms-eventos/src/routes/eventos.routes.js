const { Router } = require('express');
const { requiereRol } = require('../middlewares/auth');
module.exports = controller => {
  const router = Router();
  router.get('/', controller.listar);
  router.get('/:id', controller.obtener);
  router.post('/', requiereRol('administrador'), controller.crear);
  router.put('/:id', requiereRol('administrador'), controller.actualizar);
  router.delete('/:id', requiereRol('administrador'), controller.eliminar);
  return router;
};
