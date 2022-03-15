'use strict';
const fs = require('fs');
const express = require('express');
const Resumes = require('../services/resumes');
const ResumesModel = require('../models/resumes');
const UserModel = require('../models/users');
const Services = require('../services');
const Mails = require('../mails');
const PDF = require('../services/invoice-generator');



const web = require('../pools/web.json');
const accounting = require('../pools/accounting.json');
const hr = require('../pools/hr.json');
const sales = require('../pools/sales.json');
const marketing = require('../pools/marketing.json');
const generic = require('../pools/generic.json');
const genericeducation = require('../pools/genericeducation.json');
const educationpool = require('../pools/education.json');


const router = express.Router();



/**
 * @swagger
 * components:
 *  schemas:
 *   Resume:
 *    type: object 
 *    properties:
 *     _id:
 *      type: string
 *      description: Autogenerated unique identifier for the resume
 *     candidateID:
 *      type: string
 *      description: The candidate's unique ID
 *     fullname:
 *      type: string
 *      description: The candidate's full name
 *     gender:
 *      type: string
 *      description: The candidate's gender
 *     dob:
 *      type: string
 *      format: date
 *      description: The candidate's date of birth
 *     email:
 *      type: string
 *      format: email
 *      description: Email of the user
 *     skills:
 *      type: object
 *      format: array
 *      description: The candidate's skills
 *     yearsOfExp:
 *      type: number
 *      description: The candidate's years of experience
 *     education:
 *      type: object
 *      description: The candidate's education
 *     profession:
 *      type: string
 *      description: The candidate's profession
 *     audioclip_url:
 *      type: string
 *      description: The url of the audio clip
 *     cv_url:
 *      type: string
 *      description: The url of the cv
 *     image_url:
 *      type: string
 *      description: The url of the image
 *     salary:
 *      type: string
 *      description: The salary of the candidate
 *     views:
 *      type: number
 *      description: The number of views
 *     selectionStatus:
 *      type: object
 *      description: The selection status of the candidate
 *     availability:
 *      type: boolean
 *      description: The availability of the candidate
 *     weight:
 *      type: number
 *      description: The weight of the candidate
 *     minSalary:
 *      type: number
 *      description: minimum salary
 *     maxSalary:
 *      type: number
 *      description: maximum salary
 *   ResumeError:
 *    type: object 
 *    properties:
 *     message:
 *      type: string
 *      description: Error message
 *     status:
 *      type: number
 *      description: Status code
 *   Response:
 *    type: object 
 *    properties:
 *     message:
 *      type: string
 */



/**
* @swagger
*  definitions:
*   ZimbojobsResume:
*    type: object
*    required:
*     - email
*    properties:
*     email:
*      type: string
*      format: email
*      description: Email of the user
*     fullname:
*      type: string
*      description: The candidate's full name
*     gender:
*      type: string
*      description: The candidate's gender
*     dob:
*      type: string
*      description: The candidate's date of birth
*     skills:
*      type: object
*      description: The candidate's skills
*     userimage:
*      type: object
*      description: The candidate's image
*     sector:
*      type: string
*      description: The candidate's sector
*     job_title:
*      type: string
*      description: The candidate's job title
*     salary:
*      type: string
*      description: The candidate's salary
*     experience_start:
*      type: object
*      description: The candidate's experience start
*     experience_end:
*      type: object
*      description: The candidate's experience end
*     education:
*      type: object
*      description: The candidate's education
*     education_title:
*      type: object
*      description: The candidate's education title
*     education_academy:
*      type: object
*      description: The candidate's education academy
*     audioclip:
*      type: object
*      description: The candidate's audio clip
*     cv_url:
*      type: object
*      description: The candidate's cv url
*   SearchResume:
*    type: object
*    required:
*     - skill
*    properties:
*     skill:
*      type: string
*      description: The skill to search for
*   SearchBySkillset:
*    type: object
*    required:
*     - skills
*     - field
*    properties:
*     field:
*      type: string
*      description: The field to search for
*     skills:
*      type: object
*      description: The skills to search for
*   SelectCandidate:
*    type: object
*    required:
*     - candidateEmail
*     - userEmail
*    properties:
*     candidateEmail:
*      type: string
*      description: The candidate's email
*     userEmail:
*      type: string
*      format: email
*      description: The user's email
*   AdvancedSearch:
*    type: object
*    required:
*     - skills
*     - field
*     - maxBudget
*     - minBudget
*     - minYears
*     - maxYears
*     - search
*    properties:
*     skills:
*      type: object
*      description: The skills to search for
*     field:
*      type: object
*      description: The field to search for
*     maxBudget:
*      type: number
*      description: max Budget
*     minBudget:
*      type: number
*      description: min Budget
*     minYears:
*      type: number
*      description: min Years of Experience
*     maxYears:
*      type: number
*      description: max Years of Experience
*     search:
*      type: string
*      description: The search string
*   ResumeViewCount:
*    type: object
*    required:
*     - candidateEmail
*    properties:
*     candidateEmail:
*      type: string
*      description: The candidate's email
*      format: email
*   DeleteResume:
*    type: object
*    required:
*     - email
*    properties:
*     email:
*      type: string
*      description: The candidate's email
*      format: email
*   SelectCandidates:
*    type: object
*    required:
*     - user
*     - candidates
*    properties:
*     user:
*      type: string
*      description: The user's email
*      format: email
*     candidates:
*      type: object
*      description: Arraylist of candidate Emails
*      format: array
*/


/**
 * @swagger
 * /resumes/all:
 *   get:
 *     tags:
 *       - Resumes
 *     description: Returns all resumes from Zimbojobs
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully updated all resumes from Zimbojobs to WorXconnect
 *         schema:
 *          type: object
 *          $ref: '#/definitions/ZimbojobsResume'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
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
 *     description: Manually update all resumes from Zimbojobs to WorXconnect
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/ZimbojobsResume'
 *     responses:
 *       201:
 *         description: Successfully updated all resumes from Zimbojobs to WorXconnect
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.put('/update', async (req, res) => {
  let services = new Services();
  try {
    let resumes = await services.compute();
    let index = 0;
    for (index in resumes) {
      resumes[index].candidateID = `CAN${index}`;
      let resume = await ResumesModel.findOne({ email: resumes[index].email });
      if (resume) {
        resumes[index].weight = resume.weight;
        resumes[index].value = resume.value;
        resumes[index].availability = resume.availability;
        resumes[index].views = resume.views;
      } else {
        resumes[index].weight = 0;
        resumes[index].value = 1800;
        resumes[index].availability = true;
        resumes[index].views = 0;
      }
      resumes[index].education = resumes[index].education.filter(item => !genericeducation.values.includes(item.title.toLowerCase()));
      if (resumes[index].salary != "." && resumes[index].salary != "Negotiable" && resumes[index].salary != "n/a" && resumes[index].salary != "NA" && resumes[index].salary != "N/A" && resumes[index].salary != "" && resumes[index].salary != ", " && resumes[index].salary != " ," && resumes[index].salary != "," && resumes[index].salary != "-" && resumes[index].salary != "000," && resumes[index].salary != ",00") {
        resumes[index].salary = resumes[index].salary.replace(/,/g, '');
        resumes[index].salary = parseInt(resumes[index].salary);
        if (resumes[index].salary > 10000) {
          resumes[index].salary = resumes[index].salary / 100
        } else if (resumes[index].salary > 3000 && resumes[index].salary <= 10000) {
          resumes[index].salary = resumes[index].salary / 2
        } else if (resumes[index].salary <= 3) {
          resumes[index].salary = resumes[index].salary * 1000
        } else if (resumes[index].salary > 3 && resumes[index].salary < 9) {
          resumes[index].salary = resumes[index].salary * 100
        }

        resumes[index].minSalary = parseInt((resumes[index].salary * 100) / 75);
        resumes[index].maxSalary = parseInt((resumes[index].salary * 100) / 55);
      } else {
        resumes[index].minSalary = parseInt((1000 * 100) / 75);
        resumes[index].maxSalary = parseInt((1000 * 100) / 55);
      }

      if (resumes[index].education.length > 0) {
        resumes[index].minSalary = ((resumes[index].education.length / 10) * resumes[index].minSalary) + resumes[index].minSalary
        resumes[index].maxSalary = ((resumes[index].education.length / 10) * resumes[index].maxSalary) + resumes[index].maxSalary
      }
      if (resumes[index].yearsOfExp > 0) {
        resumes[index].minSalary = ((resumes[index].yearsOfExp / 10) * resumes[index].minSalary) + resumes[index].minSalary
        resumes[index].maxSalary = ((resumes[index].yearsOfExp / 10) * resumes[index].maxSalary) + resumes[index].maxSalary
      }
      resumes[index].minSalary = Math.round(resumes[index].minSalary / 100) * 100;
      resumes[index].maxSalary = Math.round(resumes[index].maxSalary / 100) * 100;
      ResumesModel.findOneAndUpdate({ email: resumes[index].email }, { $set: resumes[index] }, { upsert: true }, (error, response) => {
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
 * /resumes/updateviewcount:
 *   put:
 *     tags:
 *       - Resumes
 *     description: Updates View Count of Resume
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/ResumeViewCount'
 *     responses:
 *       201:
 *         description: Successfully updated all resumes from Zimbojobs to WorXconnect
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.put('/updateviewcount', async (req, res) => {
  try {
    ResumesModel.findOneAndUpdate({ email: req.body.candidateEmail }, { $inc: { views: 1 } }, (error, response) => {
      if (error) {
        console.error(error);
      }
    });
    return res.status(201).json({ message: 'Increased View Count' });
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
 *     description: Gets all resumes from zimconnect
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully fetched all resumes from zimconnect
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
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
 * /resumes/{email}:
 *   get:
 *     tags:
 *       - Resumes
 *     description: Gets a resume from worxconnect by email
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully fetched a resume from zimconnect
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.get('/:email', async (req, res) => {
  try {
    let user = await ResumesModel.findOne({ email: req.params.email });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});


/**
 * @swagger
 * /resumes/search:
 *   post:
 *     tags:
 *       - Resumes
 *     description: Search for resumes
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/SearchResume'
 *     responses:
 *       200:
 *         description: Successfully fetched all resumes from worxconnect that match the search criteria
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       404:
 *         description: No resumes found
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.post('/search', async (req, res) => {
  try {
    let resumes = await ResumesModel.find({});
    let selectedResumes = resumes.filter(object => object.skills.map(name => name.toLowerCase()).includes(req.body.skill.toLowerCase()));
    selectedResumes.sort((a, b) => a.yearsOfExp.localeCompare(b.yearsOfExp)).reverse();
    if (selectedResumes.length > 0) {
      return res.status(200).json(selectedResumes);
    } else {
      return res.status(404).json({ message: 'No resumes found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});


/**
 * @swagger
 * /resumes/advancedsearch:
 *   post:
 *     tags:
 *       - Resumes
 *     description: Search for resumes
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/AdvancedSearch'
 *     responses:
 *       200:
 *         description: Successfully fetched all resumes from worxconnect that match the search criteria
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       404:
 *         description: No resumes found
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.post('/advancedsearch', async (req, res) => {
  try {
    let resumes = await ResumesModel.find({});
    let selectedResumes = [];
    let pool = [], skillset = [];
    if (req.body.field == 'web' || req.body.field == 'software') {
      pool = educationpool.web;
      skillset = web.values;
    } else if (req.body.field == 'accounting') {
      pool = educationpool.accounting;
      skillset = accounting.values;
    } else if (req.body.field == 'hr') {
      pool = educationpool.hr;
      skillset = hr.values;
    } else if (req.body.field == 'sales' || req.body.field == 'marketing') {
      pool = educationpool.marketing;
      skillset = marketing.values;
    } else {
      pool = educationpool.dental;
    }
    if (req.body.search.length > 0) {
      pool = [];
      pool = pool.concat(educationpool.web, educationpool.accounting, educationpool.hr, educationpool.marketing, educationpool.dental);
      pool = pool.filter(item => item.toLowerCase().includes(req.body.search.toLowerCase()));
      selectedResumes = resumes.filter(resume => resume.education.map(obj => obj.title.toLowerCase()).some(ai => pool.includes(ai))
        || resume.education.map(obj => obj.title.toLowerCase()).includes(req.body.search.toLowerCase())
        || resume.education.map(obj => obj.description.toLowerCase()).includes(req.body.search.toLowerCase())
        || resume.skills.map(name => name.toLowerCase()).includes(req.body.search.toLowerCase())
        || resume.profession.toLowerCase().includes(req.body.search.toLowerCase())
        || resume.skills.filter(word => word.toLowerCase().includes(req.body.search.toLowerCase())).length > 0
      );
    } else {
      selectedResumes = resumes.filter(resume => resume.education.map(obj => obj.title.toLowerCase()).some(ai => pool.includes(ai)));
    }
    selectedResumes.forEach(resume => {
      let count = resume.weight;
      count = count + (resume.skills.map(v => v.toLowerCase()).filter(skills => req.body.skills.map(v => v.toLowerCase()).includes(skills)).length * 30);
      count = count + (resume.yearsOfExp * 5);
      count = count + (resume.education.length * 10);
      resume.weight = resume.weight + count;
    });
    if (selectedResumes.length > 0) {
      if (req.body.maxBudget > 0) {
        selectedResumes = selectedResumes.filter(resume => parseInt(resume.minSalary) >= req.body.minBudget);
        selectedResumes = selectedResumes.filter(resume => parseInt(resume.maxSalary) <= req.body.maxBudget && parseInt(resume.minSalary) <= req.body.maxBudget);
      }
      if (req.body.maxYears > 0 && req.body.minYears == 0) {
        selectedResumes = selectedResumes.filter(resume => parseInt(resume.yearsOfExp) <= req.body.maxYears);
      } else if (req.body.minYears > 0 && req.body.maxYears > 0) {
        selectedResumes = selectedResumes.filter(resume => parseInt(resume.yearsOfExp) >= req.body.minYears && parseInt(resume.yearsOfExp) <= req.body.maxYears);
      }
      try {
        selectedResumes.sort((a, b) => a.weight - b.weight).reverse();
      } catch (error) {
        console.log(error);
      }
      return res.status(200).json(selectedResumes);
    } else {
      return res.status(404).json({ message: 'No resumes found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



/**
 * @swagger
 * /resumes/skillset:
 *   post:
 *     tags:
 *       - Resumes
 *     description: Search for resumes
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/SearchBySkillset'
 *     responses:
 *       200:
 *         description: Successfully fetched all resumes from worxconnect that match the search criteria
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       404:
 *         description: No resumes found
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.post('/skillset', async (req, res) => {
  try {
    let resumes = await ResumesModel.find({});
    let selectedResumes = [];
    let pool = [], skillset = [];
    if (req.body.field == 'web' || req.body.field == 'software') {
      pool = educationpool.web;
      skillset = web.values;
    } else if (req.body.field == 'accounting') {
      pool = educationpool.accounting;
      skillset = accounting.values;
    } else if (req.body.field == 'hr') {
      pool = educationpool.hr;
      skillset = hr.values;
    } else if (req.body.field == 'sales' || req.body.field == 'marketing') {
      pool = educationpool.marketing;
      skillset = marketing.values;
    } else {
      pool = educationpool.dental;
    }
    selectedResumes = resumes.filter(resume => resume.education.map(obj => obj.title.toLowerCase()).some(ai => pool.includes(ai)));
    selectedResumes.forEach(resume => {
      let count = resume.weight;
      count = count + (resume.skills.map(v => v.toLowerCase()).filter(skills => req.body.skills.map(v => v.toLowerCase()).includes(skills)).length * 30);
      count = count + (resume.yearsOfExp * 5);
      count = count + (resume.education.length * 10);
      resume.weight = resume.weight + count;
    });
    if (selectedResumes.length > 0) {
      try {
        selectedResumes.sort((a, b) => a.weight - b.weight).reverse();
      } catch (error) {
        console.log(error);
      }
      return res.status(200).json(selectedResumes);
    } else {
      return res.status(404).json({ message: 'No resumes found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



/**
 * @swagger
 * /resumes/shortlist:
 *   post:
 *     tags:
 *       - Resumes
 *     description: Shortlist candidate
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/SelectCandidate'
 *     responses:
 *       201:
 *         description: Successfully selected candidate
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       202:
 *         description: Partially completed
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       401:
 *         description: Unauthorized
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       404:
 *         description: Candidate not found
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.post('/shortlist', async (req, res) => {
  try {
    let candidate = await ResumesModel.findOne({ email: req.body.candidateEmail });
    let user = await UserModel.findOne({ email: req.body.userEmail });
    if (candidate && user) {
      if (candidate.availability == true) {
        candidate.selectionStatus.push({
          status: true,
          date: new Date(),
          user: req.body.userEmail
        });
        candidate.views = candidate.views + 1;
        ResumesModel.findOneAndUpdate({ 'email': candidate.email }, { $set: candidate }, async (error, response) => {
          if (error) {
            return res.status(202).json({ message: 'Error occured while updating the candidate profile' });
          } else {
            if (user.myCandidates.length == 0) {
              user.myCandidates.push(candidate);
            } else {
              let found = false;
              let candid = {};
              user.myCandidates.forEach(element => {
                if (element.email == candidate.email) {
                  found = true;
                } else {
                  candid = candidate;
                }
              });
              if (found) {
                return res.status(401).json({ message: 'Candidate is already listed' });
              } else {
                user.myCandidates.push(candid);
                user.myCandidates = user.myCandidates.filter(value => Object.keys(value).length !== 0);
              }
            }
            UserModel.findOneAndUpdate({ 'email': user.email }, { $set: user }, async (error, response) => {
              if (error) {
                console.error(error);
                return res.status(202).json({ message: 'Error occured while updating the user profile' });
              } else {
                return res.status(201).json(user);
              }
            });
          }
        });
      } else {
        return res.status(401).json({ message: 'Candidate is already being considered elsewhere' });
      }
    } else if (candidate && !user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



/**
 * @swagger
 * /resumes/removeshortlist:
 *   delete:
 *     tags:
 *       - Resumes
 *     description: Remove shortlisted candidate
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/SelectCandidate'
 *     responses:
 *       201:
 *         description: Successfully removed candidate
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Resume'
 *       202:
 *         description: Partially completed
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       401:
 *         description: Unauthorized
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       404:
 *         description: Candidate not found
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.delete('/removeshortlist', async (req, res) => {
  try {
    let candidate = await ResumesModel.findOne({ email: req.body.candidateEmail });
    let user = await UserModel.findOne({ email: req.body.userEmail });
    if (candidate && user) {
      candidate.selectionStatus = candidate.selectionStatus.filter(function (el) { return el.user != req.body.userEmail; });
      candidate.availability = true;
      ResumesModel.findOneAndUpdate({ 'email': candidate.email }, { $set: candidate }, async (error, response) => {
        if (error) {
          return res.status(202).json({ message: 'Error occured while removing status on the candidate profile' });
        } else {
          user.myCandidates = user.myCandidates.filter(function (el) { return el.email != req.body.candidateEmail; });
          UserModel.findOneAndUpdate({ 'email': user.email }, { $set: user }, async (error, response) => {
            if (error) {
              return res.status(202).json({ message: 'Error occured while removing candidate from the user profile' });
            } else {
              return res.status(201).json(user);
            }
          });
        }
      });
    } else if (candidate && !user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      return res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 * /resumes/select:
 *   post:
 *     tags:
 *       - Resumes
 *     description: Select candidates and send Quote
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/SelectCandidates'
 *     responses:
 *       201:
 *         description: Successfully selected candidate
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/User'
 *       202:
 *         description: Partially completed
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       401:
 *         description: Unauthorized
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       404:
 *         description: Candidate not found
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.post('/select', async (req, res) => {
  let pdf = new PDF();
  let mails = new Mails();
  let candidateList = req.body.candidates;
  let user = { email: req.body.user }
  let errorGlobal = { status: false, code: 0 };
  let errorList = []
  user = await UserModel.findOne({ email: user.email });
  candidateList.forEach(async element => {
    try {
      let candidate = await ResumesModel.findOne({ email: element });
      if (candidate && user) {
        candidate.availability = false;
        ResumesModel.findOneAndUpdate({ 'email': candidate.email }, { $set: candidate }, async (error, response) => {
          if (error) {
            errorGlobal.status = true;
            errorList.push({ message: error });
          } else {
            for (let index in user.myCandidates) {
              if (user.myCandidates[index].email == candidate.email) {
                user.myCandidates[index].availability = false;
              }
            }
            UserModel.findOneAndUpdate({ 'email': user.email }, { $set: user }, async (error, response) => {
              if (error) {
                errorGlobal.status = true;
                errorList.push({ message: error });
              }
            });
          }
        });
      } else if (candidate && !user) {
        errorGlobal.status = true;
        errorList.push({ message: user + ' Could not be found' })
      } else {
        errorGlobal.status = true;
        errorList.push({ message: candidate + ' Could not be found' })
      }
    } catch (error) {
      errorGlobal.status = true;
      errorGlobal.code = 500
    }
  });

  if (errorGlobal.status == true) {
    return res.status(errorGlobal.code).json({ message: errorList });
  } else {
    let file = await pdf.generatePdf(user, candidateList);
    console.log(file)
    await mails.sendQuote(user, candidateList, "output.pdf");
    return res.status(201).json(user);
  }
});


/**
 * @swagger
 * /resumes/delete:
 *   delete:
 *     tags:
 *       - Resumes
 *     description: Remove Resume
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resumes object
 *         required: true
 *         schema:
 *          $ref: '#/definitions/DeleteResume'
 *     responses:
 *       201:
 *         description: Successfully deleted resume
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/Response'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *          type: object
 *          $ref: '#/components/schemas/ResumeError'
 */
router.delete('/delete', async (req, res) => {
  try {
    let candidateEmail = req.body.email;
    let candidate = await ResumesModel.findOne({ email: candidateEmail });
    candidate.selectionStatus.forEach(async element => {
      let user = await UserModel.findOne({ email: element.user });
      user.myCandidates = user.myCandidates.filter(value => value.email != candidateEmail);
      UserModel.findOneAndUpdate({ 'email': user.email }, { $set: user }, async (error, response) => {
        if (error) {
          console.error(error);
        }
      }).clone().then(async () => {
        await ResumesModel.deleteOne({ email: candidateEmail }, async (error, response) => {
          if (error) {
            return res.status(401).json(error);
          } else {
            return res.status(201).json({ message: 'Successfully deleted candidate' });
          }
        }).clone();
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// router.delete('/deleteall', async (req, res) => {
//   try {
//     await ResumesModel.deleteMany();
//     return res.status(200).json({ message: 'Successfully deleted all resumes' });
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });


module.exports = router;