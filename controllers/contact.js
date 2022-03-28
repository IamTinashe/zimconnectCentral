'use strict';
const express = require('express');
const router = express.Router();
const Mails = require('../mails');

/**
 * @swagger
 * components:
 *  schemas:
 *   Contact:
 *    type: object 
 *    properties:
 *     name:
 *      type: string
 *      description: Name of contact
 *     email:
 *      type: string
 *      description: Email of contact
 *     message:
 *      type: string
 *      description: Message of contact
 */

/**
* @swagger
*  definitions:
*   Contact:
*    type: object
*    required:
*     - email
*    properties:
*     email:
*      type: string
*      format: email
*      description: Email of the contact
*     name:
*      type: string
*      description: Name of the contact
*     message:
*      type: string
*      description: Message of the contact
*/


/**
 * @swagger
 * /contact:
 *   post:
 *     tags:
 *       - Contact
 *     description: Send contact message
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Contact object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/Contact'
 *     responses:
 *       200:
 *         description: Successfully sent message
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Contact'
 */
router.post('/', async (req, res) => {
  let mails = new Mails();
  await mails.sendContactEmail(req.body).then(response => {
    return res.status(200).json({message: 'Message sent successfully'});
  }).catch(error => {
    return res.status(500).json(error);
  })
});

module.exports = router;