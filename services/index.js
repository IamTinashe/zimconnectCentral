'use strict';
const Resumes = require('./resumes');
const Compute = require('./compute');

module.exports = class Services {
  
  constructor() { }

  async compute(){
    let resumes = new Resumes();
    let data = await resumes.getResumes()

    let compute = new Compute(data);
    data = await compute.filterByGoodName();
    data = await compute.getEducation();
    data = await compute.getProfession();
    data = await compute.filterEducation();
    data = await compute.filterSkills();
    data = await compute.getCVURL();
    data = await compute.getImageURL();
    data = await compute.getAudioURL();
    data = await compute.getYearsOfExperience();
    data = await compute.formatText();

    return data;
  }


}