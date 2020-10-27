const router = require('express').Router();
const consultaController = require('../controllers/consultaController');

router
  .route('/')
  .get(consultaController.getAll)
  .post(consultaController.createOne);

router.route('/:id').get(consultaController.getOne);

module.exports = router;
