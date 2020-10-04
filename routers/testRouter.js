const router = require('express').Router();
const baseController = require('../controllers/baseController');
const Test = require('../models/Test');

router
  .route('/')
  .get(baseController.getAll(Test))
  .post(baseController.createOne(Test));

router
  .route('/:id')
  .get(baseController.getOne(Test))
  .patch(baseController.updateOne(Test))
  .delete(baseController.deleteOne(Test));

module.exports = router;
