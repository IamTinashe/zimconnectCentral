'use strict';
const express = require('express');
const router = express.Router()

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     description: Checks if server is up
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Healthy
 */
router.get('/health', async (req, res) => {
  return res.status(200).json({ 'healthy': true });
});

module.exports = router;
