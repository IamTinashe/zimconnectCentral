'use strict';
const nodemailer = require('nodemailer');
const systemEmail = 'noreply@zimconnect.org';
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
    let message = {
      from: `Zimconnect <${systemEmail}>`,
      to: user.email,
      subject: 'Your Account Has Successfully Been Created',
      html: `Hello World`
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }
}