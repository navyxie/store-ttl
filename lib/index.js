var events = require('events');
var util = require('util');
var _util = require('./util');
var noop = _util.noop;

function saveDataInMemonyWarn(text){
  if(process.env.NODE_ENV === 'production') {
    console.warn("Dont %s data in memory, when cluster or multi-computer!",text);
  }
}

function STORE_TTL(config){
  if(!_util.isObject(config)){
    config = {};
  }
  this._store = {};
  this.config = config;
  this.config.namespace = config.namespace || 'store-ttl-';
  this.config.ttlUnit = config.ttlUnit ? 1 : 1000;
  this.config.ttl = (config.ttl || 86400)*this.config.ttlUnit;//default ttl : one day
  this.cleanTimeoutSecond = config.cleanTimeoutSecond || 60*5;// per 5 minutes clean timeout store data
  this._eventHandler();
  if(config.autoClean){
    this._startClean();
  }
}
util.inherits(STORE_TTL, events.EventEmitter);

STORE_TTL.prototype.set = function(key,data,ttl,callback){
  var config = this.config;
  var that = this;
  if(_util.isFunction(ttl)){
    callback = ttl;
    ttl = config.ttl;
  }else{
    ttl = ttl * config.ttlUnit;
  }
  callback = callback || noop;
  key = this.getNameSpace() + key;
  var saveData = {
    data:data,
    expire:_util.getTime() + ttl,
    ttl:ttl,
    ttlUnit:config.ttlUnit
  }
  var setHandler = this.config.set || function(key,data,ttl,callback){
    callback = callback || noop;
    saveDataInMemonyWarn('save');
    that._store[key] = data;
    callback(null,saveData);
    return saveData;
  }
  var stringData = saveData;
  if(_util.isObject(saveData)){
    stringData  = JSON.stringify(saveData);
  }
  return setHandler(key,stringData,ttl,function(err,data){
    that.emit('set',key,saveData);
    callback(err,saveData);
  })
} 
STORE_TTL.prototype.get = function(key,callback){
  callback = callback || noop;
  var config = this.config;
  var that = this;
  var oringinKey = key;
  key = this.getNameSpace() + key;
  var getHandler =  this.config.get || function(key,callback){
    callback = callback || noop;
    saveDataInMemonyWarn('get');
    callback(null,that._store[key]);
    return that._store[key];
  }
  return getHandler(key,function(err,data){
    that.emit('get',key);
    if(!err && data){
      try{
        data = JSON.parse(data);
      }catch(e){

      }
      if(parseInt(data.expire) < _util.getTime()){
        that.emit('clear',oringinKey);
        callback(null,null);
      }else{
        callback(null,data);
      }
    }else{
      callback(err,null);
    }
  });
} 
STORE_TTL.prototype.remove = function(key,callback){
  var config = this.config;
  var that = this;
  key = this.getNameSpace() + key;
  if(!_util.isFunction(callback)){
    callback = noop;
  }
  var removeHandler =  this.config.remove || function(key,callback){
    callback = callback || noop;
    saveDataInMemonyWarn('remove');
    var data = that._store[key];
    delete that._store[key];
    callback(null,data);
    return data;
  }
  return removeHandler(key,function(err,data){
    that.emit('remove',key);
    callback(err,data);
  });
},
STORE_TTL.prototype.update = function(key,value,callback){
  var config = this.config;
  var that = this;
  callback = callback || noop;
  var updateHandler = this.config.update || function(key,value,callback){
    callback = callback || noop;
    that.get(key,function(err,data){
      if(!err && data){
        that.set(key,value, (data.expire - Date.now())/config.ttlUnit,callback);
      }else{
        callback(err || 'key ' + key + ' do not exists.');
      }
    })
  }
  return updateHandler(key,value,function(err,data){
    that.emit('update',key,value);
    callback(err,data);
  })
}
STORE_TTL.prototype.getNameSpace = function(){
  return this.config.namespace;
}
STORE_TTL.prototype._eventHandler = function(){
  var that = this;
  this.on('clear',function(key){
    that.remove(key,noop);
  })
}
STORE_TTL.prototype._cleanTimeoutData = function(){
  var that = this;
  var tokenList = this._store;
  var keys = Object.keys(tokenList);
  for(var i = 0 , len = keys.length ; i < len ; i++){
    var data = tokenList[keys[i]];
    try{
      data = JSON.parse(data);
    }catch(e){

    }
    if (_util.isObject(data) && (data.expire <= Date.now())) {
      delete tokenList[keys[i]];
      that.emit('store-ttl-_cleanTimeoutToken',{key:keys[i],data:data})
    }
  }
}
STORE_TTL.prototype._startClean = function(){
  var that = this;
  setInterval(function(){
    that._cleanTimeoutData();
  },that.cleanTimeoutSecond*1000);
}
module.exports = STORE_TTL;