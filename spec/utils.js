var assert = require("assert"),
    should = require("should"),
    _ = require("underscore"),
    utils = require("../utils");
    
describe("#fire", function() {
    it("should not attempt to fire when a callback does not exist", function() {
        _.isUndefined(utils.fire()).should.be.ok;
    });
    
    it("should not attempt to fire when null is passed for the callback", function() {
        _.isUndefined(utils.fire(null, "test")).should.be.ok;
    });    

    it("should create an array of params when no parameters are passed", function() {
        utils.fire(function(params) {
            params.should.have.length(0);
            params.should.be.instanceof(Array);
        });
    });
    
    it("should create an array of params when single param is passed", function() {
        utils.fire(function(params) {
            params.should.have.length(1);
            params.should.be.instanceof(Array);            
        }, "test");
    });  
    
    it("should have 2 params", function() {
        utils.fire(function(params) {
            params.should.have.length(2);
            params.should.be.instanceof(Array);            
        }, ["test", "test1"]);
    });      
});    