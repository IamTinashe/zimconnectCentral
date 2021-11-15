'use strict';
const express = require('express');
const router = express.Router();
const Models = require('../models');
const Mails = require('../mails');




router.get('/all', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.getUsers();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post('/create', async (req, res) => {
  let models = new Models();
  let mails = new Mails();
  try {
    let data = await models.createAuth(req.body);
    if (data.hasOwnProperty('user') && data.user == false) {
      return res.status(401).json(data.message);
    } else {
      let user = {
        username: req.body.username,
        userAuthID: data._id.toString(),
        fullname: req.body.fullname,
        company: req.body.company,
        email: req.body.email,
        role: req.body.role
      }
      data = await models.createUser(user);
      if (data.hasOwnProperty('user') && data.user == false) {
        return res.status(202).json(data.message);
      } else {
        await mails.accountCreated(data);
        return res.status(200).json(data);
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete('/delete', async (req, res) => {
  let models = new Models();
  try {
    let data = await models.deleteUser(req.body);
    return await res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;