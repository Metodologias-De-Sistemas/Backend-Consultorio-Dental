const { StatusCodes } = require('http-status-codes');
const Turno = require('../models/Turno');
const MyError = require('../utils/MyError');

exports.getAll = async (req, res, next) => {
  try {
    if (!req.token) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: 'No tiene autorización para realizar la acci´ón.' });
		}
		
		const turnosDocs = await Turno.find({});
		
  } catch (err) {}
};
