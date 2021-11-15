'use strict';
const express = require('express');
const router = express.Router()

/**
 * @swagger
 * /health:
 *    get:
 *      description: Get health
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/health', async (req, res) => {
  return res.status(200).json({ 'healthy': true });
});

module.exports = router;
