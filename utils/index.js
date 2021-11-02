'use strict';


module.exports = class Utils {

  constructor() { }

  arrayToLowerCase(a){
    if(Array.isArray(a)){
      return a.map(name => name.toLowerCase());
    }else{
      return a;
    }
  }

  static dateDifference(date1, date2){
    let diff = new Date(date2.getTime() - date1.getTime());
    let years = diff.getUTCFullYear() - 1970;
    if(diff.getUTCMonth() > 7)
      years = years + 1
    return years
  }
}