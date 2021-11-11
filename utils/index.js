
module.exports = class Utils {

  constructor() { }

  async arrayToLowerCase(a) {
    if (Array.isArray(a)) {
      return a.map(name => name.toLowerCase());
    } else {
      return a;
    }
  }

  async dateDifference(date1, date2) {
    let diff = new Date(date2.getTime() - date1.getTime());
    let years = diff.getUTCFullYear() - 1970;
    if (diff.getUTCMonth() > 7)
      years = years + 1
    return years;
  }

  async smallestDate(array) {
    let j = 0;
    let smallest = array[0];
    while (j < array.length) {
      if ((new Date(array[j]) !== "Invalid Date") && !isNaN(new Date(array[j]))) {
        if (smallest.getTime() > array[j].getTime()) {
          smallest = array[j];
        }
      }
      j++;
    }
    return smallest;
  }

  generateCode(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}