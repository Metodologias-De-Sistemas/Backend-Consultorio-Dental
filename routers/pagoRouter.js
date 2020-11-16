const router = require('express').Router();
const pagoController = require('../controllers/pagoController');

router.route('/').post(pagoController.pagarTurno);

module.exports = router;
