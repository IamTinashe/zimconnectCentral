'use strict';
const express = require('express');
const Resumes = require('../services/resumes');
const Services = require('../services');
const router = express.Router();

/**
 * @swagger
 * /resumes/all:
 *   get:
 *     tags:
 *       - Resumes
 *     description: Gets All Resumes from Zimbojobs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: zimbojobsResumes
 *         description: zimbojobs object
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully retrieved all resumes from Zimbojobs
 *       500:
 *         description: Internal Server Error
 */
router.get('/all', async (req, res) => {
  let resumes = new Resumes();
  try {
    let data = await resumes.getResumes();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});


/**
 * @swagger
 * /resumes/filtered:
 *   get:
 *     tags:
 *       - Resumes
 *     description: Gets All Filtered Resumes from Zimbojobs
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: zimbojobsFilteredResumes
 *         description: zimbojobsfiltered object
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully retrieved all filtered resumes from Zimbojobs
 *       500:
 *         description: Internal Server Error
 */
router.get('/filtered', async (req, res) => {
  let services = new Services();
  try {
    return res.status(200).json(await services.compute());
  } catch (error) {
    res.status(500);
    return res.status(500).json(error);
  }
});

module.exports = router;