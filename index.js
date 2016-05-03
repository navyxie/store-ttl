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
  this.config = config;
  this.config.namespace = config.namespace || 'store-ttl';
}
STORE_TTL.prototype.save = this.config.save || function(key,data,ttl,callback){

}
STORE_TTL.prototype.get = this.config.get || function(key,callback){

}
STORE_TTL.prototype.remove = this.config.remove || function(key,callback){

}
STORE_TTL.prototype._clearTimeout = function(){

}
module.exports = STORE_TTL;