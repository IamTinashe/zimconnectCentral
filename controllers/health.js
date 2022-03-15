'use strict';
const express = require('express');
const router = express.Router();
const PDF = require('../services/invoice-generator');

/**
 * @swagger
 * components:
 *  schemas:
 *   Health:
 *    type: object 
 *    properties:
 *     healthy:
 *      type: string
 *      description: Server is healthy
 */


/**
 * @swagger
 * /health:
 *  get:
 *   tags:
 *    - Health
 *   description: Returns the health of the server
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: Server is healthy
 *     schema:
 *      type: object
 *      $ref: '#/components/schemas/Health'
 */
router.get('/health', async (req, res) => {
  return res.status(200).json({ 'healthy': true });
});

router.get('/pdf', async (req, res) => {
  let pdf = new PDF();
  pdf.generatePdf();
  return res.status(200).json({ 'healthy': true });
});

module.exports = router;
