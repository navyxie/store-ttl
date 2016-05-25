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
    client.SETEX(key,ttl,data,function(err,reply){
      callback(err,reply);
    });
  },
  get:function(key,callback){
    client.GET(key,function(err,reply){
      callback(err,reply);
    });
  },
  remove:function(key,callback){
    client.DEL(key,function(err,data){
      callback(err,data);
    }); 
  },
  ttl:60, //the unit is second,defualt one day.
  ttlUnit:true, //if true ttl is milliseconds but second
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

- [`update`](#update)

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

<a name="update" />

update

```js
storeInstance.update('test-redis','update-ok',function(err,data){
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


## test

```js
//test
npm test

//coverage

npm run cov

```

## code coverage

```
=============================== Coverage summary ===============================
Statements   : 98.2% ( 109/111 )
Branches     : 84% ( 42/50 )
Functions    : 96.15% ( 25/26 )
Lines        : 98.2% ( 109/111 )
================================================================================
```


version:

- 3.x.x
  1. support redis client set object 
- 2.x.x 
  1. api return json : {data:orignData,ttl:ttl,expire:expire}.
  2. add update api.
- 1.x.x api return origin data
