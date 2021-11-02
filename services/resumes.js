'use strict';
const axios = require('axios');
const options = {
  hostname: 'https://www.zimbojobs.com',
  path: '/wp-json/custom/v1/candidates',
};

module.exports = class Resumes {

  constructor() { }

  getResumes() {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await axios.get(options.hostname + options.path);
        resolve(response.data);
      } catch (error) {
        reject(error)
      }
    })
  }
}