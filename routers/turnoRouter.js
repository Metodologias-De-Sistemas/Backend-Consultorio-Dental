const router = require('express').Router();
const turnoController = require('../controllers/turnoController');

router.route('/').get(turnoController.getAll);

router.route('/turno').post(turnoController.createOne);

router
  .route('/:id')
  .get(turnoController.getAllById)
  .patch(turnoController.updateOne)
  .delete(turnoController.deleteOne);

module.exports = router;
