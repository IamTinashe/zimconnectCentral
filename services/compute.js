'use strict';
const Utils = require('../utils');
const utils = new Utils();

module.exports = class Compute {

  constructor(resumes) {
    this.resumes = resumes;
  }

  async filterByGoodName() {
    let index = 0;
    for (index in this.resumes) {
      if (!this.resumes[index].fullname.includes(' ') || this.resumes[index].fullname.includes('@')) {
        this.resumes.splice(index, 1);
        index--;
      }
    }
    return this.resumes;
  }

  async getEducation() {
    let index = 0;
    for (index in this.resumes) {
      let education = []
      if (this.resumes[index].education_academy.length > 0) {
        if (this.resumes[index].education.length > 0) {
          let i = 0;
          for (i in this.resumes[index].education_academy) {
            education.push({
              title: this.resumes[index].education_title[i],
              academy: this.resumes[index].education_academy[i],
              description: this.resumes[index].education[i]
            })
          }
        } else {
          let i = 0;
          for (i in this.resumes[index].education_academy) {
            education.push({
              title: this.resumes[index].education_title[i],
              academy: this.resumes[index].education_academy[i],
              description: ''
            })
          }
        }
      } else if (this.resumes[index].education_academy.length == 0) {
        if (this.resumes[index].education.length > 0) {
          let i = 0;
          for (i in this.resumes[index].education) {
            education.push({
              academy: '',
              description: this.resumes[index].education[i],
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

  async getProfession() {
    let index = 0;
    for (index in this.resumes) {
      let profession = '';
      if (this.resumes[index].sector.length == 0 && this.resumes[index].job_title.length > 0) {
        profession = this.resumes[index].job_title;
      } else if (this.resumes[index].sector.length > 0 && this.resumes[index].job_title.length == 0) {
        profession = this.resumes[index].sector;
      } else if (this.resumes[index].sector.length > 0 && this.resumes[index].job_title.length > 0) {
        profession = this.resumes[index].job_title;
      } else {
        profession = ''
      }

      delete this.resumes[index].job_title;
      delete this.resumes[index].sector;
      this.resumes[index].profession = profession
    }
    return this.resumes;
  }

  async getYearsOfExperience() {
    let index = 0;
    for (index in this.resumes) {
      this.resumes[index].yearsOfExp = 0;
      try {
        if(Array.isArray(this.resumes[index].experience_start) && this.resumes[index].experience_start.length > 0){
          if(Array.isArray(this.resumes[index].experience_end) && this.resumes[index].experience_end.length > 0){
            let months = 0;
            while(this.resumes[index].experience_start.length > 0){
              let start = utils.smallestDate(this.resumes[index].experience_start);
              let end = utils.smallestDate(this.resumes[index].experience_end);
              if(end == null || end == undefined || end == ''){
                end = new Date();
                end = end.toISOString().slice(0, 10);
              }
              this.resumes[index].experience_start.splice(this.resumes[index].experience_start.indexOf(start), 1);
              this.resumes[index].experience_end.splice(this.resumes[index].experience_end.indexOf(end), 1)
              months = utils.dateDifference(start, end) + months;
            }
            this.resumes[index].yearsOfExp = Math.round(months / 12);
          }
        }
        delete this.resumes[index].experience_start;
        delete this.resumes[index].experience_end;
      } catch (error) {
        console.log(error)
      }
    }
    return this.resumes;
  }

  async getCVURL() {
    let index = 0;
    for (index in this.resumes) {
      try {
        if (typeof this.resumes[index].cv_url === 'object') {
          if(this.resumes[index].cv_url.length > 0){
            if(this.resumes[index].cv_url[0].hasOwnProperty('file_url')){
              this.resumes[index].cv_url = this.resumes[index].cv_url[0].file_url;
            }else{
              this.resumes[index].cv_url = '';
            }
          }else if(Array.isArray(this.resumes[index].cv_url)){
            this.resumes[index].cv_url = '';
          }else{
            this.resumes[index].cv_url = (this.resumes[index].cv_url)[1].file_url;
          }
        }else{
          this.resumes[index].cv_url = '';
        }
      } catch (error) {
        console.error(error);
      }
    }
    return this.resumes;
  }

  async getImageURL() {
    let index = 0;
    for (index in this.resumes) {
      this.resumes[index].image_url = '';
      try {
        if (typeof this.resumes[index].userimage === 'object') {
          if(this.resumes[index].userimage.hasOwnProperty('file_url')){
            this.resumes[index].image_url = this.resumes[index].userimage.file_url;
          }
        }
      } catch (error) {
        console.error(error);
      }
      delete this.resumes[index].userimage;
    }
    return this.resumes;
  }

  async getAudioURL() {
    let index = 0;
    for (index in this.resumes) {
      try {
        if (Array.isArray(this.resumes[index].audioclip) && this.resumes[index].audioclip.length > 0) {
          this.resumes[index].audioclip = this.resumes[index].audioclip[0];
        }else{
          this.resumes[index].audioclip = '';
        }
      } catch (error) {
        console.error(error);
      }
    }
    return this.resumes;
  }

  async filterEducation() {
    this.resumes = this.resumes.filter(object => object.education.length != 0);
    return this.resumes;
  }

  async filterSkills() {
    this.resumes = this.resumes.filter(object => object.skills.length != 0);
    return this.resumes;
  }

  async formatText() {
    try{
      let index = 0;
      for (index in this.resumes) {
        if(this.resumes[index].skills.length > 0){
          let j = 0;
          for(j in this.resumes[index].skills){
            this.resumes[index].skills[j] = this.resumes[index].skills[j].replace(/\r?\n?\t/g, '');
          }
        }

        if(this.resumes[index].education.length > 0){
          let k = 0;
          for(k in this.resumes[index].education){
            this.resumes[index].education[k].description = this.resumes[index].education[k].description.replace(/\r\n?\t/g, ' ');
          }
        }

        if(this.resumes[index].education.length > 0){
          let m = 0;
          for(m in this.resumes[index].education){
            this.resumes[index].education[m].title = this.resumes[index].education[m].title.replace(/\\/g, '');
          }
        }
      }
      return this.resumes;
    } catch(error){
      console.error(error);
    }
  }
}