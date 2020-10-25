require('dotenv').config();

const { MONGODB_URI, PORT, JWT_SECRET, NODE_ENV } = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  NODE_ENV,
};
