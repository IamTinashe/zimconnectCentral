'use strict';
const express = require('express');
const router = express.Router();
const Models = require('../models');
const Mails = require('../mails');



/**
 * @swagger
 * /users/all:
 *   get:
 *     tags:
 *       - Users
 *     description: Gets all users
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
    let data = await models.getUsers();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /users/id/:id:
 *   get:
 *     tags:
 *       - Users
 *     description: Gets user by ID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
 router.get('/id/:id', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUser('id', req.params.id);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /users/email/:id:
 *   get:
 *     tags:
 *       - Users
 *     description: Gets user by email
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
 router.get('/email/:id', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUser('email', req.params.id);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /users/username/:id:
 *   get:
 *     tags:
 *       - Users
 *     description: Gets user by username
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
 router.get('/username/:id', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUser('username', req.params.id);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     tags:
 *       - Users
 *     description: Update a user
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: User successfully updated
 *       500:
 *         description: Internal Server Error
 */
 router.put('/update/', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.updateUser(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else{
      return res.status(201).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



/**
 * @swagger
 * /users/create:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: User successfully created and email sent
 *       202:
 *         description: User created but email not sent
 *       401:
 *         description: Unauthorized to create user
 *       500:
 *         description: Internal Server Error
 */
router.post('/create', async (req, res) => {
  let models = new Models();
  let mails = new Mails();
  try {
    let data = await models.createAuth(req.body);
    let code = data.confirmationCode;
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(401).json(data.message);
    } else {
      let user = {
        username: req.body.username,
        userAuthID: data._id.toString(),
        fullname: req.body.fullname,
        company: req.body.company,
        email: req.body.email,
        role: req.body.role
      }
      data = await models.createUser(user);
      if (data.hasOwnProperty('user') && data.user == false) {
        return res.status(202).json(data.message);
      } else {
        data.confirmationCode = code;
        await mails.accountCreated(data);
        return res.status(201).json(data);
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



/**
 * @swagger
 * /users/delete:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a User
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: User successfully deleted
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.deleteUser(req.body);
    return await res.status(201).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;