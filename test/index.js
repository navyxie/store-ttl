var should = require('should');
var store = require('../lib/index');
describe('#store#',function(){
  this.timeout(5000);
  describe('data in memory',function(){
    var instance;
    before(function(){
      instance = new store();
    });
    it('set()',function(done){
      instance.set('withdraw-1',1,function(err,data){
        done(err);
      })
    });
    it('get()',function(done){
      instance.get('withdraw-1',function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('remove()',function(done){
      instance.remove('withdraw-1',function(err,data){
        done(err);
      })
    });
    it('get()',function(done){
      instance.get('withdraw-1',function(err,data){
        should.not.exists(data);
        done(err);
      })
    });
    it('set()',function(done){
      instance.set('withdraw-2',1,1,function(err,data){
        done(err);
      })
    });
    it('get()',function(done){
      instance.get('withdraw-2',function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('get()',function(done){
      setTimeout(function(){
        instance.get('withdraw-2',function(err,data){
            should.not.exists(data);
            done(err);
        })
      },1001);
    });
  });
  describe('data in memory sync',function(){
    var instance;
    before(function(){
      instance = new store()
    })
    it('get()',function(done){
      done(instance.get('withdraw-3'));
    });
    it('set()',function(done){
      instance.set('withdraw-3',1);
      console.log(instance.get('withdraw-3'));
      instance.get('withdraw-3').should.be.ok();
      done();
    });
    it('remove()',function(done){
      instance.remove('withdraw-3');
      done(instance.get('withdraw-3'))
    });
  });
  describe('data in memory database',function(){
    var instance;
    var _store = {};
    before(function(){
      instance = new store({
        set:function(key,data,ttl,callback){
          _store[key] = data;
          callback(null,data);
        },
        get:function(key,callback){
          callback(null,_store[key]);
        },
        remove:function(key,callback){
          var data = _store[key]
          delete _store[key];
          callback(null,data);
        }
      })
    })
    it('get()',function(done){
      instance.get('withdraw-3',function(err,data){
        should.not.exists(data);
        done(err);
      })
    });
    it('set()',function(done){
      instance.set('withdraw-3',1,function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('get()',function(done){
      instance.get('withdraw-3',function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('remove()',function(done){
      instance.remove('withdraw-3',function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('set()',function(done){
      instance.set('withdraw-4',1,1,function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('get()',function(done){
      instance.get('withdraw-4',function(err,data){
        should.exists(data);
        done(err);
      })
    });
    it('get()',function(done){
      setTimeout(function(){
        instance.get('withdraw-4',function(err,data){
          should.not.exists(data);
          done(err);
        })
      },1003);
    });
    it('remove()',function(done){
      instance.remove('withdraw-4',function(err,data){
        should.not.exists(data);
        done(err);
      })
    });
  })
})