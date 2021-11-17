'use strict';
const express = require('express');
const Resumes = require('../services/resumes');
const ResumesModel = require('../models/resumes');
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
 * /resumes/update:
 *   post:
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
router.post('/update', async (req, res) => {
  let services = new Services();
  try {
    let data = await services.compute();
    let index = 0;
    for (index in data) {
      ResumesModel.findOneAndUpdate({ 'email': data[index].email }, { $set: data[index] }, { upsert: true }, (error, response) => {
        if (error) {
          console.error(error);
        }
      });
    }
    return res.status(201).json({ message: 'Successfully updated all resumes' });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get('/filtered', async (req, res) => {
  try {
    return res.status(200).json(await ResumesModel.find({}));
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post('/search', async (req, res) => {
  try {
    let resumes = await ResumesModel.find({});
    let selectedResumes = resumes.filter(object => object.skills.map(name => name.toLowerCase()).includes(req.body.skills.toLowerCase()));
    selectedResumes.sort((a, b) => a.yearsOfExp.localeCompare(b.yearsOfExp)).reverse();
    return res.status(200).json(selectedResumes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete('/delete', async (req, res) => {
  try {
    await ResumesModel.deleteMany();
    return res.status(200).json({ message: 'Successfully deleted all resumes' });
  } catch (error) {
    return res.status(500).json(error);
  }
});


module.exports = router;