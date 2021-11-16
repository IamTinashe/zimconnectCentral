'use strict';
const express = require('express');
const router = express.Router();
const Models = require('../models');
const Mails = require('../mails');



/**
 * @swagger
 * /auth/all:
 *   get:
 *     tags:
 *       - Authentication
 *     description: Gets all auth users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User successfully created and email sent
 *       500:
 *         description: Internal Server Error
 */
router.get('/all', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getAuth();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Authenticates User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authentication
 *         description: Authentication object
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: User successfully created and email sent
 *       401:
 *         description: Unauthorized to create user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.authenticate(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      let token = 1;
      return res.header('Authorization', `Bearer ${token}`).status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /auth/confirm:
 *   put:
 *     tags:
 *       - Authentication
 *     description: Confirms User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: confirmation
 *         description: confirmation object
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: User successfully confirmed email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
 router.put('/confirm', async (req, res) => {
  let models = new Models();
  let mails = new Mails();
  try {
    let data = await models.confirm(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      let token = 1;
      await mails.accountConfirmed(data);
      return res.header('Authorization', `Bearer ${token}`).status(201).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /auth/forgot:
 *   put:
 *     tags:
 *       - Authentication
 *     description: Forgot Password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: reset
 *         description: forgot object
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: User forgot password email sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
 router.put('/forgot', async (req, res) => {
  let models = new Models();
  let mails = new Mails();
  try {
    let data = await models.forgotPassword(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      await mails.forgotPassword(data);
      return res.status(201).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /auth/reset:
 *   put:
 *     tags:
 *       - Authentication
 *     description: Reset Password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: reset
 *         description: reset object
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: User reset password success
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
 router.put('/reset', async (req, res) => {
  let models = new Models();
  let mails = new Mails();
  try {
    let data = await models.resetPassword(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      await mails.resetPassword(data);
      return res.status(201).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;