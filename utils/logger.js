/* eslint-disable no-console */
const { NODE_ENV } = require('./config');

const info = (...params) => {
  if (NODE_ENV !== 'testing') {
    console.log(...params);
  }
};

const error = (...errors) => {
  console.error(...errors);
};

module.exports = { info, error };
