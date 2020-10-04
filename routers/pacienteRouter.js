const pacienteController = require('../controllers/baseController');
const router = require('express').Router();
const Paciente = require('../models/Paciente');

router
  .route('/')
  .get(pacienteController.getAll(Paciente))
  .post(pacienteController.createOne(Paciente));

router
  .route('/:id') // http://localhost:3001/api/pacientes/123;
  .get(pacienteController.getOne(Paciente))
  .patch(pacienteController.updateOne(Paciente))
  .delete(pacienteController.deleteOne(Paciente));

module.exports = router;
