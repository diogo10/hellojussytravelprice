function calculateValueFor(obj) {
    var value = Number(obj);
    var result = 0;
    if(value > 0 && value <= 5000) {
      result = 0; 
    } else if(value > 5000 && value <= 8000) {
      result = 2;
    }else if(value > 8000 && value <= 10000) {
      result = 3;
    }else if(value > 10000 && value <= 19000) {
      result = 4;
    }else if(value > 15000 && value <= 30000) {
      result = 6;
    }else if(value > 30000 && value <= 42000) {
      result = 8;
    }else {
      result = 12;
    }
  
    return result; 
}


module.exports = calculateValueFor;