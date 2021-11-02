'use strict';

module.exports = class Compute {

  constructor(resumes) {
    this.resumes = resumes;
  }

  filterByGoodName() {
    let index = 0;
    for (index in this.resumes){
      if (!this.resumes[index].fullname.includes(' ') || this.resumes[index].fullname.includes('@')) {
        this.resumes.splice(index, 1);
        index--;
      }
    }
    return this.resumes;
  }
  
}