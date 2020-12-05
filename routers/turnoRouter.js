const router = require('express').Router();
const turnoController = require('../controllers/turnoController');

// endpoints triviales

router
  .route('/:id')
  .get(turnoController.getOne)
  .patch(turnoController.updateOne)
  .delete(turnoController.deleteOne);

router.route('/').get(turnoController.getAll).post(turnoController.createOne);

// endpoints no triviales

router.route('/aceptados').get(turnoController.getTurnosAceptados);
router.route('/ocupados').get(turnoController.getFechasOcupadas);

module.exports = router;
