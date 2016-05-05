a simple key value store that support ttl, and you can custom setter,getter,remove function such as redis.

## install

```js
npm install store-ttl
```

## usage

[node_redis](https://github.com/NodeRedis/node_redis) demo :

```js
var redis = require("redis"),
  client = redis.createClient(6379,'localhost');

var STORE = require('store-ttl');
var storeInstance = new STORE({
  set:function(key,data,ttl,callback){
    client.set(key,data,function(err,reply){
      callback(err,reply.toString());
    });
    client.expire(key,ttl);
  },
  get:function(key,callback){
    client.get(key,function(err,reply){
      callback(err,reply.toString());
    });
  },
  remove:function(key,callback){
    client.del(key,function(err){
      callback(err);
    })    
  },
  ttl:60, //the unit is second,defualt one day.
  namespace:'test-store-ttl' //default:store-ttl-
});
storeInstance.set('test-redis','ok',10,function(err,data){
  console.log(err,data);
})
storeInstance.get('test-redis',function(err,data){
  console.log(err,data);//data:ok
})
setTimeout(function(){
  storeInstance.get('test-redis',function(err,data){
    console.log(err,data);//data:null
  })
},10001)
```

## API

- [`set`](#set)

- [`get`](#get)

- [`remove`](#remove)

- [`getNameSpace`](#getNameSpace)

<a name="set" />

set

```js
storeInstance.set('test-redis','ok',10,function(err,data){
  console.log(err,data);
})
```

<a name="get" />

get

```js
storeInstance.get('test-redis',function(err,data){
  console.log(err,data);
})
```

<a name="remove" />

remove

```js
storeInstance.remove('test-redis',function(err,data){
  console.log(err);
})
```

<a name="getNameSpace" />

getNameSpace

```js
console.log(storeInstance.getNameSpace());//test-store-ttl
```

