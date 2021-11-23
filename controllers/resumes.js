'use strict';
const fs = require('fs');
const express = require('express');
const Resumes = require('../services/resumes');
const ResumesModel = require('../models/resumes');
const UserModel = require('../models/users');
const Services = require('../services');
const Mails = require('../mails');



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
 *   ResumeError:
 *    type: object 
 *    properties:
 *     message:
 *      type: string
 *      description: Error message
 *     status:
 *      type: number
 *      description: Status code
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
 *         description: Successfully updated all resumes from Zimbojobs to Zimconnect
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
 *     description: Manually update all resumes from Zimbojobs to Zimconnect
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
 *         description: Successfully updated all resumes from Zimbojobs to Zimconnect
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
      resumes[index].weight = 0;
      resumes[index].value = 1800;
      resumes[index].education = resumes[index].education.filter(item => !genericeducation.values.includes(item.title.toLowerCase()));
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
 *     description: Gets a resume from zimconnect by email
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
 *         description: Successfully fetched all resumes from zimconnect that match the search criteria
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
 *         description: Successfully fetched all resumes from zimconnect that match the search criteria
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
      let count = resume.weight;//resume.skills.map(v => v.toLowerCase()).filter(skills => skillset.map(v => v.toLowerCase()).includes(skills)).length * 10;
      count = count + (resume.skills.map(v => v.toLowerCase()).filter(skills => req.body.skills.map(v => v.toLowerCase()).includes(skills)).length * 30);
      count = count + (resume.yearsOfExp * 5);
      count = count + (resume.education.length * 10);
      resume.weight = resume.weight + count;
    });
    //selectedResumes = resumes.filter(object => object.skills.map(name => name.toLowerCase()).some(ai => pool.includes(ai.toLowerCase())));
    //selectedResumes.sort((a, b) => a.yearsOfExp.localeCompare(b.yearsOfExp)).reverse();
    if (selectedResumes.length > 0) {
      // let result = selectedResumes.map(a => a.skills);
      // let merged = [].concat.apply([], result);
      // let newmerged = merged.concat(web.values);
      // let words = newmerged.map(v => v.toLowerCase());
      // let uniq = [...new Set(words)];
      // uniq = uniq.map(v => v.toLowerCase());
      // let gen = generic.values.map(v => v.toLowerCase());
      // let resu = uniq.filter(item => !gen.includes(item));
      // let values = {
      //   "values": resu
      // }
      // fs.writeFile('./pools/marketing.json', JSON.stringify(values), 'utf8', error => {
      //   if (error) {
      //     console.error(error)
      //     return
      //   }
      // });


      // let educationtitles = selectedResumes.map(a => a.education.map(b => b.title));
      // let merged = [].concat.apply([], educationtitles);
      // let newmerged = merged.concat(educationpool.marketing);
      // let words = newmerged.map(v => v.toLowerCase());
      // let uniq = [...new Set(words)];
      // uniq = uniq.map(v => v.toLowerCase());
      // let gen = genericeducation.values.map(v => v.toLowerCase());
      // let resu = uniq.filter(item => !gen.includes(item));
      // let hrRemoved = resu.filter(item => !educationpool.hr.includes(item));
      // let accountingRemoved = hrRemoved.filter(item => !educationpool.accounting.includes(item));
      // let webRemoved = accountingRemoved.filter(item => !educationpool.web.includes(item));
      // let marketingRemoved = webRemoved.filter(item => !educationpool.marketing.includes(item));
      // let salesRemoved = marketingRemoved.filter(item => !educationpool.sales.includes(item));
      // educationpool.dental = salesRemoved;
      // fs.writeFile('./pools/education.json', JSON.stringify(educationpool), 'utf8', error => {
      //   if (error) {
      //     console.error(error)
      //     return
      //   }
      // });
      try{
        selectedResumes.sort((a,b) => a.weight - b.weight).reverse();
      } catch(error){
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
 * /resumes/select:
 *   post:
 *     tags:
 *       - Resumes
 *     description: Select candidate
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
 router.post('/select', async (req, res) => {
  let mails = new Mails();
  try {
    let candidate = await ResumesModel.findOne({ email: req.body.candidateEmail });
    let user = await UserModel.findOne({ email: req.body.userEmail });
    if (candidate && user) {
      if(candidate.availability == true){
        candidate.selectionStatus.push({
          status: true,
          date: new Date(),
          user: req.body.userEmail
        });
        candidate.views = candidate.views + 1;
        candidate.availability = false;
        ResumesModel.findOneAndUpdate({ 'email': candidate.email }, { $set: candidate }, async (error, response) => {
          if (error) {
            console.error(error);
            return res.status(202).json({ message: 'Error occured while updating the candidate profile' });
          }else{
            if(user.myCandidates.length == 0){
              user.myCandidates.push(candidate);
            }else{
              let found = false;
              user.myCandidates.forEach(element => {
                if(element.email != candidate.email){
                  user.myCandidates.push(candidate);
                  found = true;
                }
              });
              if(!found){
                return res.status(401).json({ message: 'Candidate is already listed' });
              }
            }
            UserModel.findOneAndUpdate({ 'email': user.email }, { $set: user }, async (error, response) => {
              if (error) {
                console.error(error);
                return res.status(202).json({ message: 'Error occured while updating the user profile' });
              }else{
                await mails.sendQuote(user, candidate);
                return res.status(201).json(user);
              }
            });
          }
        });
      }else{
        return res.status(401).json({ message: 'Candidate is already being considered elsewhere' });
      }
    }else if(candidate && !user){
      return res.status(404).json({ message: 'User not found' });
    }else{
      return res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});



/**
 * @swagger
 * /resumes/removeselected:
 *   delete:
 *     tags:
 *       - Resumes
 *     description: Remove candidate
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
 router.delete('/removeselected', async (req, res) => {
  try {
    let candidate = await ResumesModel.findOne({ email: req.body.candidateEmail });
    let user = await UserModel.findOne({ email: req.body.userEmail });
    if (candidate && user) {
      candidate.selectionStatus = candidate.selectionStatus.filter(function(el) { return el.user != req.body.userEmail; });
      candidate.availability = true;
      ResumesModel.findOneAndUpdate({ 'email': candidate.email }, { $set: candidate }, async (error, response) => {
        if (error) {
          console.error(error);
          return res.status(202).json({ message: 'Error occured while removing status on the candidate profile' });
        }else{
          user.myCandidates = user.myCandidates.filter(function(el) { return el.email != req.body.candidateEmail; });
          UserModel.findOneAndUpdate({ 'email': user.email }, { $set: user }, async (error, response) => {
            if (error) {
              console.error(error);
              return res.status(202).json({ message: 'Error occured while removing candidate from the user profile' });
            }else{
              return res.status(201).json(user);
            }
          });
        }
      });
    }else if(candidate && !user){
      return res.status(404).json({ message: 'User not found' });
    }else{
      return res.status(404).json({ message: 'Candidate not found' });
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