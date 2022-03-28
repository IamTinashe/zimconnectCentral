'use strict';
const nodemailer = require('nodemailer');

const AccountCreated = require('./accountcreated');
const AccountConfirmed = require('./accountconfirmed');
const ForgotPassword = require('./forgotpassword');
const ResetPassword = require('./resetpassword');
const SendQuote = require('./sendquote');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  secure: false,
  requireTLC: true,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
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
      from: `WorXconnect <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Your WorXconnect Account Has Successfully Been Created',
      html: accountCreated.mail(user)
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }

  async accountConfirmed(user){
    let accountConfirmed = new AccountConfirmed();
    let message = {
      from: `WorXconnect <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'You Have Successfully Confirmed Your Email Address',
      html: accountConfirmed.mail(user)
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }

  async forgotPassword(user){
    let forgotPassword = new ForgotPassword();
    let message = {
      from: `WorXconnect <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Forgot Password',
      html: forgotPassword.mail(user)
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }

  async resetPassword(user){
    let resetPassword = new ResetPassword();
    let message = {
      from: `WorXconnect <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Your Password Has Successfully Been Reset',
      html: resetPassword.mail(user)
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }

  async sendQuote(user, candidate, file){
    let sendQuote = new SendQuote();
    let message = {
      from: `WorXconnect <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Quote for your selected candidates',
      html: sendQuote.mail(user, candidate),
      attachments: [{
        filename: file,
        path: './invoices/quote.pdf',
        contentType: 'application/pdf'
      }]
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }

  async sendContactEmail(emailObj){
    let message = {
      from: `WorXconnect <${process.env.EMAIL_USERNAME}>`,
      to: "tinashe.zvihwati@zimworx.com",
      subject: `Contact Message from ${emailObj.name}`,
      html: `Name: ${emailObj.name}<br>Email: ${emailObj.email}<br>Message: ${emailObj.message}`
    }

    await transporter.sendMail(message).then(response => {
      return response;
    }).catch(error => {
      return error;
    })
  }
}