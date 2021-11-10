'use strict';
const express = require('express');
const Resumes = require('../services/resumes');
const Services = require('../services');
const app = express();

exports.all = app.get('/all', async (req, res) => {
  let resumes = new Resumes();
  try {
    let data = await resumes.getResumes();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});


exports.computed = app.get('/computed', async (req, res) => {
  let services = new Services();
  try {
    return res.status(200).json(await services.compute());
  } catch (error) {
    res.status(500);
    return res.status(500).json(error);
  }
});