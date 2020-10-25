require('dotenv').config();

const {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  GMAIL_USER,
  GMAIL_PASS,
} = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  GMAIL_USER,
  GMAIL_PASS,
};
