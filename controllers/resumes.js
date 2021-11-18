'use strict';
const express = require('express');
const Resumes = require('../services/resumes');
const ResumesModel = require('../models/resumes');
const Services = require('../services');
const web = require('../pools/web.json');
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
 *   put:
 *     tags:
 *       - Resumes
 *     description: Manually update all resumes from Zimbojobs to Zimconnect
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Successfully updated all resumes from Zimbojobs to Zimconnect
 *       500:
 *         description: Internal Server Error
 */
router.put('/update', async (req, res) => {
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

/**
 * @swagger
 * /resumes/filtered:
 *  get:
 *   tags:
 *    - Resumes
 *   description: Gets All Filtered Resumes from Zimconnect
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: Returns all filtered resumes from Zimconnect
 *    500:
 *     description: Internal Server Error
 */
router.get('/filtered', async (req, res) => {
  try {
    return res.status(200).json(await ResumesModel.find({}));
  } catch (error) {
    return res.status(500).json(error);
  }
});


/**
 * @swagger
 * /resumes/search:
 *  post:
 *   tags:
 *    - Resumes
 *   description: Searches for Resumes from Zimconnect with specific parameter
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: Returns array of searched resumes from Zimconnect
 *    500:
 *     description: Internal Server Error
 */
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

/**
 * @swagger
 * /resumes/skillset:
 *  post:
 *   tags:
 *    - Resumes
 *   description: Searches for Resumes from Zimconnect by skillset
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: Returns array of searched resumes from Zimconnect
 *    500:
 *     description: Internal Server Error
 */
router.post('/skillset', async (req, res) => {
  try {
    let resumes = await ResumesModel.find({});
    if (req.body.skill == 'web') {
      let selectedResumes = resumes.filter(object => object.skills.map(name => name.toLowerCase()).some(ai => web.values.includes(ai.toLowerCase())));
      selectedResumes.sort((a, b) => a.yearsOfExp.localeCompare(b.yearsOfExp)).reverse();
      return res.status(200).json(selectedResumes);
    } else {
      return res.status(200).json({ message: 'No results found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// router.delete('/delete', async (req, res) => {
//   try {
//     await ResumesModel.deleteMany();
//     return res.status(200).json({ message: 'Successfully deleted all resumes' });
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });


module.exports = router;