const loginController = require('../controllers/loginController');
const router = require('express').Router();

router.route('/').post(loginController.login);

module.exports = router;