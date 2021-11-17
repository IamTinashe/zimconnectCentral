'use strict';
const express = require('express');
const router = express.Router();
const Models = require('../models');
const Mails = require('../mails');


/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object 
 *    properties:
 *     username:
 *      type: string
 *      description: Username of the user
 *     userAuthID:
 *      type: string
 *      description: Autogenerated AuthID of the user
 *     fullname:
 *      type: string
 *      description: User fullname
 *     company:
 *      type: string
 *      description: Company of the user.
 *     email:
 *      type: string
 *      format: email
 *      description: Email of the user
 *     role:
 *      type: string
 *      description: Role of the user.
 *     _id:
 *      type: string
 *      description: Autogenerated id
 *     createdAt:
 *      type: string
 *      description: Autogenerated Date of creation of the user.
 *     loggedIn:
 *      type: boolean
 *      description: Is the user logged in or not.
 *     loggedInAt:
 *      type: string
 *      description: Autogenerated Date of last login of the user.
 *   Error:
 *    type: object 
 *    properties:
 *     message:
 *      type: string
 *      description: Error message
 *   DeleteUser:
 *    type: object 
 *    properties:
 *     deletedCount:
 *      type: integer
 *      description: Delete status of the user.
 */

/**
* @swagger
*  definitions:
*   User:
*    type: object
*    required:
*     - email
*     - fullname
*     - username
*     - company
*     - role
*     - password
*    properties:
*     fullname:
*      type: string
*      description: User fullname
*     email:
*      type: string
*      format: email
*      description: Email of the user
*     username:
*      type: string
*      description: Username of the user
*     company:
*      type: string
*      description: Company of the user.
*     role:
*      type: string
*      description: Role of the user.
*     password:
*      type: string
*      description: Password of the user.
*   DeleteUser:
*    type: object
*    required:
*     - email
*    properties:
*     email:
*      type: string
*      format: email
*      description: Email of the user
*   UpdateUser:
*    type: object
*    required:
*     - email
*     - fullname
*     - username
*     - company
*     - role
*    properties:
*     fullname:
*      type: string
*      description: User fullname
*     email:
*      type: string
*      format: email
*      description: Email of the user
*     username:
*      type: string
*      description: Username of the user
*     company:
*      type: string
*      description: Company of the user.
*     role:
*      type: string
*      description: Role of the user.
*/


/**
 * @swagger
 * /users/all:
 *  get:
 *   tags:
 *    - Users
 *   description: Gets all users
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: An array of users
 *     schema:
 *      type: array
 *      $ref: '#/components/schemas/User'
 *    500:
 *     description: Internal Server Error
 *     schema:
 *      type: array
 *      $ref: '#/components/schemas/Error'
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
 * /users/id/{id}:
 *  get:
 *   tags:
 *    - Users
 *   description: Gets a user by id
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: A user object
 *     schema:
 *      type: object
 *      $ref: '#/components/schemas/User'
 *    500:
 *     description: Internal Server Error
 *     schema:
 *      type: array
 *      $ref: '#/components/schemas/Error'
 */
router.get('/id/:id', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUser('id', req.params.id);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /users/email/{id}:
 *  get:
 *   tags:
 *    - Users
 *   description: Gets a user by email
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: A user object
 *     schema:
 *      type: object
 *      $ref: '#/components/schemas/User'
 *    500:
 *     description: Internal Server Error
 *     schema:
 *      type: array
 *      $ref: '#/components/schemas/Error'
 */
router.get('/email/:id', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUser('email', req.params.id);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else {
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /users/username/{id}:
 *  get:
 *   tags:
 *    - Users
 *   description: Gets a user by username
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: A user object
 *     schema:
 *      type: object
 *      $ref: '#/components/schemas/User'
 *    500:
 *     description: Internal Server Error
 *     schema:
 *      type: array
 *      $ref: '#/components/schemas/Error'
 */
router.get('/username/:id', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUser('username', req.params.id);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else {
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
 *     description: Updates a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/UpdateUser'
 *     responses:
 *       201:
 *        description: User updated
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/User'
 *       401:
 *        description: Unauthorized
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
 *       404:
 *        description: User not found
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
 *       500:
 *        description: Internal Server Error
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
 */
router.put('/update/', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.updateUser(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(data.status).json(data.message);
    } else {
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
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/User'
 *     responses:
 *       200:
 *        description: A user object
 *        schema:
 *         type: object
 *         $ref: '#/components/schemas/User'
 *       202:
 *        description: User created but email not sent
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
 *       401:
 *        description: Unauthorized to create user
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
 *       500:
 *        description: Internal Server Error
 *        schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
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
        role: req.body.role,
        createdAt: Date.now(),
        loggedIn: false,
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
 *     description: Deletes a User by email
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Delete User object
 *         required: true.
 *         schema:
 *          $ref: '#/definitions/DeleteUser'
 *     responses:
 *       201:
 *         description: User successfully deleted
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/DeleteUser'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Error'
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