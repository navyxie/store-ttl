var should = require('should');
var util = require('../lib/util');
describe('util',function(){
  it('isArray()',function(){
    (util.isArray([])).should.be.ok();
  });
  it('toArray()',function(){
    function a(){
      return util.toArray(arguments);
    }
    (util.isArray(a())).should.be.ok();
  });
  it('toArray() not ok',function(){
    function a(){
      return arguments;
    }
    (util.isArray(a())).should.not.be.ok();
  });
  it('isObject()',function(){
    (util.isObject({})).should.be.ok();
  });
  it('isObject() not ok',function(){
    (util.isObject('{}')).should.not.be.ok();
  })
})