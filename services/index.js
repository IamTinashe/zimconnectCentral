'use strict';
const Resumes = require('./resumes');
const Compute = require('./compute');

module.exports = class Services {
  
  constructor() { }

  compute(){
    let resumes = new Resumes();
    let compute = new Compute(resumes.getResumes());
    return compute.filterByGoodName();
  }
}