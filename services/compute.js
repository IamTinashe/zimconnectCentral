'use strict';
const Utils = require('../utils');
const utils = new Utils();

module.exports = class Compute {

  constructor(resumes) {
    this.resumes = resumes;
  }

  async filterByGoodName() {
    let index = 0;
    for (index in this.resumes){
      if (!this.resumes[index].fullname.includes(' ') || this.resumes[index].fullname.includes('@')) {
        this.resumes.splice(index, 1);
        index--;
      }
    }
    return this.resumes;
  }

  async getEducation(){
    let index = 0;
    for(index in this.resumes){
      let education = []
      if(this.resumes[index].education_academy.length > 0){
        if(this.resumes[index].education.length > 0){
          let i = 0;
          for(i in this.resumes[index].education_academy){
            education.push({
              title: this.resumes[index].education_title[i],
              academy: this.resumes[index].education_academy[i],
              qualification: this.resumes[index].education[i]
            })
          }
        }else{
          let i = 0;
          for(i in this.resumes[index].education_academy){
            education.push({
              title: this.resumes[index].education_title[i],
              academy: this.resumes[index].education_academy[i],
              qualification: ''
            })
          }
        }
      }else if(this.resumes[index].education_academy.length == 0){
        if(this.resumes[index].education.length > 0){
          let i = 0;
          for(i in this.resumes[index].education){
            education.push({
              academy: '',
              qualification: this.resumes[index].education[i],
              title: this.resumes[index].education_title[i],
            })
          }
        }
      }
      delete this.resumes[index].education_title;
      delete this.resumes[index].education_academy;
      this.resumes[index].education = education
    }
    return this.resumes;
  }

  async getProfession(){
    let index = 0;
    for (index in this.resumes){
      let profession = '';
      if(this.resumes[index].sector.length == 0 && this.resumes[index].job_title.length > 0){
        profession = this.resumes[index].job_title;
      }else if (this.resumes[index].sector.length > 0 && this.resumes[index].job_title.length == 0){
        profession = this.resumes[index].sector;
      }else if (this.resumes[index].sector.length > 0 && this.resumes[index].job_title.length > 0){
        profession = this.resumes[index].job_title;
      }else{
        profession = ''
      }

      delete this.resumes[index].job_title;
      delete this.resumes[index].sector;
      this.resumes[index].profession = profession
    }
    return this.resumes;
  }

  async getYearsOfExperience(){
    let index = 0;
    let length = this.resumes.length;
    console.log(length)
    for (index = 0; index < 1953; index++){
      console.log(this.resumes[index].hasOwnProperty("experience_start"));
      //console.log(this.resumes[index]);
      //console.log(this.resumes[index].experience_start)
       let start = await utils.smallestDate(this.resumes[index].experience_start);
       let end = await utils.smallestDate(this.resumes[index].experience_end);
    //   let years = utils.dateDifference(start, end)
    //console.log(end)
    }
    return this.resumes;
  }

  async filterEducation(){
    this.resumes = this.resumes.filter(object => object.education.length != 0);
    return this.resumes;
  }

  async filterSkills(){
    this.resumes = this.resumes.filter(object => object.skills.length != 0);
    return this.resumes;
  }
}