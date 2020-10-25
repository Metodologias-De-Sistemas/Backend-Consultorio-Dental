const router = require('express').Router();
const pacienteController = require('../controllers/pacienteController');

router.route('/').get(pacienteController.getAll);

router.route('/registro').post(pacienteController.createOne);

router
  .route('/:id')
  .get(pacienteController.getOne)
  .patch(pacienteController.updateOne)
  .delete(pacienteController.deleteOne);

module.exports = router;
