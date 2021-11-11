'use strict';
const Users = require('./users');
const Resumes = require('./resumes');
const Auth = require('./auth');
const Utils = require('../utils');
const mongoose = require('mongoose');
const username = 'admin';
const password = 'zimconnect';
const host = '159.69.120.82';
const port = '27017';
const db = 'zimconnect';

const utils = new Utils();

mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${db}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

module.exports = class Models {
  constructor() { }

  async getUsers(){
    return await Users.find({}); 
  }

  async createAuth(body){
    try {
      let authUser = await Auth.findOne({email: body.email});
      if(authUser == null){
        authUser = await Auth.findOne({username: body.username});
        if(authUser == null){
          let code = utils.generateCode(1000, 10000);
          let auth = new Auth({
            username: body.username,
            email: body.email,
            password: body.password,
            active: false,
            confirmed: false,
            confirmationCode: code
          }); 
          return await auth.save();
        }else{
          return { user : false, message: 'Username already exists in the username table' }
        }
      } else {
        return { user : false, message: 'Email already exists in the authentication table' }
      }
    } catch (error) {
      return error;
    }
  }


  async createUser(body){
    try {
      let user = await Users.findOne({email: body.email});
      if(user == null){
        user = await Users.findOne({username: body.username});
        if(user == null){
          let users = new Users(body); 
          return await users.save();
        }else{
          return { user : false, message: 'Username already exists in the users table' }
        }
      } else {
        return { user : false, message: 'Email already exists in the users table' }
      }
    } catch (error) {
      return error;
    }
  }

  async deleteUser(body){
    try {
      let user = await Auth.findOne({ email: body.email });
      if(user == null){
        return { user: false, message: 'User does not exist in the authentication table'}
      } else {
        await Auth.deleteOne({ email: body.email });
        user = await Users.findOne({ email: body.email });
        if(user == null){
          return { user: false, message: 'User does not exist in the users table'}
        }else{
          return await Users.deleteOne({ email: body.email });
        }
      }
    } catch (error) {
      return error;
    }
  }

  async getResumes(){
    return await Resumes.find({}); 
  }
}