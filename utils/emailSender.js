const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_PASS } = require('./config');

const mailSender = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: `${GMAIL_USER}`,
    pass: `${GMAIL_PASS}`,
  },
});

const getMailOptions = (opts) => {
  const { to, subject, text, html } = opts;

  return {
    from: `${GMAIL_USER}`,
    to,
    subject,
    html,
    text,
  };
};

module.exports = { mailSender, getMailOptions };
