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
function toArray(args){
  return [].slice.call(args);
}
function getTime(){
  return Date.now();
}
function noop(){}
module.exports = {
  isType:isType,
  isObject:isObject,
  isFunction:isFunction,
  isArray:isArray,
  isString:isString,
  toArray:toArray,
  getTime:getTime,
  noop:noop
}