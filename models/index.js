'use strict';
const Users = require('./users');
const Resumes = require('./resumes');
const Auth = require('./auth');
const Utils = require('../utils');
const mongoose = require('mongoose');
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

const utils = new Utils();

mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${db}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

module.exports = class Models {
  constructor() { }

  async getUsers() {
    try {
      return await Users.find({});
    } catch (error) {
      return error
    }
  }

  async updateUser(body){
    try {
      let user = await Users.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist', status: 404 }
      } else {
        if (user.username == body.username) {
          Users.findOneAndUpdate({ email: body.email }, { $set: body }, (error, response) =>{
            if (error) {
              console.error(error);
            }
          });
          return this.getUser('email', body.email);
        } else {
          user = await Users.findOne({ username: body.username });
          if (user == null) {
            Users.findOneAndUpdate({ email: body.email }, { $set: body }, (error, response) =>{
              if (error) {
                console.error(error);
              }
            });
            return this.getUser('email', body.email);
          } else {
            return { user: false, message: 'Username already exists', status: 401 }
          }
        }
      }
    } catch (error) {
      return error;
    }
  }

  async createAuth(body) {
    try {
      let authUser = await Auth.findOne({ email: body.email });
      if (authUser == null) {
        authUser = await Auth.findOne({ username: body.username });
        if (authUser == null) {
          let code = utils.generateCode(1000, 10000);
          let auth = new Auth({
            username: body.username,
            email: body.email,
            password: body.password,
            active: false,
            confirmed: false,
            confirmationCode: code,
            createdAt: Date.now(),
            loggedIn: false,
          });
          return await auth.save();
        } else {
          return { user: false, message: 'Username already exists in the username table' }
        }
      } else {
        return { user: false, message: 'Email already exists in the authentication table' }
      }
    } catch (error) {
      return error;
    }
  }


  async createUser(body) {
    try {
      let user = await Users.findOne({ email: body.email });
      if (user == null) {
        user = await Users.findOne({ username: body.username });
        if (user == null) {
          let users = new Users(body);
          return await users.save();
        } else {
          return { user: false, message: 'Username already exists in the users table' }
        }
      } else {
        return { user: false, message: 'Email already exists in the users table' }
      }
    } catch (error) {
      return error;
    }
  }

  async deleteUser(body) {
    try {
      let user = await Auth.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist in the authentication table' }
      } else {
        await Auth.deleteOne({ email: body.email });
        user = await Users.findOne({ email: body.email });
        if (user == null) {
          return { user: false, message: 'User does not exist in the users table' }
        } else {
          user.myCandidates.forEach(async element => {
            let candidate = await Resumes.findOne({ email: element.email });
            if (candidate != null) {
              candidate.selectionStatus = candidate.selectionStatus.filter(function(el) { return el.user == body.email; });
              Resumes.findOneAndUpdate({ 'email': candidate.email }, { $set: candidate }, async (error, response) => {
                if (error) {
                  return { user: user, message: 'Could not update candidate' }
                }
              });
            }
          });
          return await Users.deleteOne({ email: body.email });
        }
      }
    } catch (error) {
      return error;
    }
  }

  async authenticate(body) {
    try {
      let user = await Auth.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist in the authentication table', status: 404 }
      } else if (user.password != body.password) {
        return { user: false, message: 'Unauthorized. Password incorrect', status: 401 }
      } else if (user.confirmed == false) {
        return { user: false, message: 'Unauthorized. User has not confirmed their email address', status: 401 }
      } else if (user.active == false) {
        return { user: false, message: 'Unauthorized. User has not been activated', status: 401 }
      } else {
        let query = { loggedIn: true };
        Auth.findOneAndUpdate({ email: body.email }, { $set: query }, (error, response) =>{
          if (error) {
            console.error(error);
          }
        });
        user = await Users.findOne({ email: body.email });
        if (user == null) {
          return { user: false, message: 'User does not exist in the users table', status: 404 }
        } else {
          return user;
        }
      }
    } catch (error) {
      return error;
    }
  }

  async logout(body){
    try {
      let user = await Auth.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist in the authentication table', status: 404 }
      } else {
        let query = { loggedIn: false };
        Auth.findOneAndUpdate({ email: body.email }, { $set: query }, (error, response) =>{
          if (error) {
            console.error(error);
          }
        });
        User.findOneAndUpdate({ email: body.email }, { $set: query }, (error, response) =>{
          if (error) {
            console.error(error);
          }
        });
        return { user: true, message: 'User has been logged out' };
      }
    } catch (error) {
      return error;
    }
  }

  async confirm(body) {
    try {
      let user = await Auth.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist in the authentication table', status: 404 }
      } else {
        if (user.confirmationCode != body.confirmationCode) {
          return { user: false, message: 'Incorrect confirmation code', status: 401 }
        } else {
          user.active = true;
          user.confirmed = true;
          Auth.findOneAndUpdate({ email: body.email }, { $set: user }, (error, response) =>{
            if (error) {
              console.error(error);
            }
          });
          return await Users.findOne({ email: body.email });
        }
      }
    } catch (error) {
      return error;
    }
  }

  async forgotPassword(body) {
    try {
      let user = await Auth.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist in the authentication table', status: 404 }
      } else {
        let code = utils.generateCode(1000, 10000);
        let query = {
          confirmed: false,
          confirmationCode: code
        }
        Auth.findOneAndUpdate({ 'email': body.email }, { $set: query }, (error, response) => {
          if (error) {
            console.error(error);
          }
        });
        user = await Users.findOne({ email: body.email });
        user.confirmationCode =  code;
        return user;
      }
    } catch (error) {
      return error;
    }
  }

  async resetPassword(body) {
    try {
      let user = await Auth.findOne({ email: body.email });
      if (user == null) {
        return { user: false, message: 'User does not exist in the authentication table', status: 404 }
      } else {
        if (user.confirmationCode != body.confirmationCode) {
          return { user: false, message: 'Incorrect confirmation code', status: 401 }
        }else if(body.password == user.password) {
          return { user: false, message: 'Password cannot be the same as the old password', status: 401 }
        }else if(body.password.length < 6) {
          return { user: false, message: 'Password should be greater than 6 characters', status: 401 }
        } else {
          let query = {
            confirmed: true,
            active: true,
            password: body.password
          }
          Auth.findOneAndUpdate({ 'email': body.email }, { $set: query }, (error, response) =>{
            if (error) {
              console.error(error);
            }
          });
          return await Users.findOne({ email: body.email });
        }
      }
    } catch (error) {
      return error;
    }
  }

  async getUser(type, param) {
    try {
      if (type == 'id') {
        return await Users.findOne({ _id: param });
      } else if (type == 'email') {
        return await Users.findOne({ email: param });
      } else if (type == 'username') {
        return await Users.findOne({ username: param });
      } else {
        return { user: false, message: 'User does not exist in the users table', status: 404 }
      }
    } catch (error) {
      return error;
    }
  }

  async getAuth() {
    try {
      return await Auth.find({});
    } catch (error) {
      return error
    }
  }

  async getResumes() {
    return await Resumes.find({});
  }
}