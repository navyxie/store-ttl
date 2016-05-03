function isType(obj,type){
  return Object.prototype.toString.call(obj) === '[object '+type+']';
}
function isObject(obj){
  return isType(obj,'Object');
}
function isFunction(fn){
  return isType(fn,'Function');
}
function isArray(arr){
  return isType(arr,'Array');
}
function isString(str){
  return isType(str,'String');
}
function STORE_TTL(config){
  if(!isObject(config)){
    console.error('config must be object.');
    return;
  }
  this._store = {};
}
STORE_TTL.prototype.save = function(){

}
module.exports = STORE_TTL;