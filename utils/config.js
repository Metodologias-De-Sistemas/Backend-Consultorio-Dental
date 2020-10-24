require('dotenv').config();

const { MONGODB_URI, PORT, JWT_SECRET } = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
};
