const router = require('express').Router();
const turnoController = require('../controllers/turnoController');

router.route('/').get(turnoController.getAll).post(turnoController.createOne);
router.route('/aceptados').get(turnoController.turnosAceptados);
router
  .route('/:id')
  .get(turnoController.getOne)
  .patch(turnoController.updateOne)
  .delete(turnoController.deleteOne);

module.exports = router;
