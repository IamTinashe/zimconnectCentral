
module.exports = class Utils {

  constructor() { }

  async arrayToLowerCase(a) {
    if (Array.isArray(a)) {
      return a.map(name => name.toLowerCase());
    } else {
      return a;
    }
  }

  dateDifference(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    try{
      if(date1 > date2){
        let x = date1;
        date1 = date2;
        date2 = x;
      }
      let months;
      months = (date2.getFullYear() - date1.getFullYear()) * 12;
      months -= date1.getMonth();
      months += date2.getMonth();
      return months <= 0 ? 0 : months;
    }catch(error){
      return 0;
    }
  }

  smallestDate(array) {
    let index = 0;
    let smallest = array[0];
    for(index in array){
      if(new Date(array[index]) < new Date(smallest)){
        smallest = array[index];
      }
    }
    return smallest;
  }

  generateCode(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}