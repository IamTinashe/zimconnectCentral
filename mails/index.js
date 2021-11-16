'use strict';
const nodemailer = require('nodemailer');
const systemEmail = 'noreply@zimconnect.org';

const AccountCreated = require('./accountcreated');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  requireTLC: true,
  port: 587,
  auth: {
    user: systemEmail,
    pass: 'global2019!'
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = class Mail {
  constructor() {}

  async accountCreated(user){
    let accountCreated = new AccountCreated();
    let message = {
      from: `Zimconnect <${systemEmail}>`,
      to: user.email,
      subject: 'Your Zimconnect Account Has Successfully Been Created',
      html: accountCreated.mail(user)
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }
}