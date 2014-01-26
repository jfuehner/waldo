var assert = require("assert"),
    natural_geo = require("../waldo"),
    should = require("should"),
    _ = require("underscore");

//var doc = "A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu, killing at least 15 people while dozens wounded, witnesses said.  The car bomb went off near the hotel in Hamar-weyne district, which is the base of tens of Somali Parliamentarians and government officials. All casualties were confirmed to be civilians and MPs. A suicide car bomb exploded near Hotel Muna in Mogadishu. At least 15 people died while more than 25 others, including two members of parliament, were injured in the blast. Al Shabaab claimed responsibility for the explosion, saying it used a car to carry out the explosion. A number of government officials arrived at the scene of the explosion and confirmed that a car laden with explosive devices had exploded.";
//var doc = "Mogadishu";
//natural_geo.extractLocations(doc);

describe("natural-geo", function() {
    beforeEach(function(done){
        natural_geo.clearDocuments(function(docs) {
           done(); 
        });  
    });
        
    describe("#getDocuments", function() {
        it("should have 0 documents", function(done) {
            natural_geo.getDocuments(function(docs) {
                docs.should.have.length(0);
                done();
            });
        });
    
        it("should have 1 document", function(done) {
            natural_geo.addDocument("My test test document", function(docs) {
                docs.should.have.length(1);
    
                var firstDoc = _.first(docs);
                firstDoc.should.have.property("doc");
                firstDoc.doc.should.equal("My test test document");
                firstDoc.should.have.property("words");                        
                firstDoc.words.should.have.length(4);
                
                var firstDocWord = _.first(firstDoc.words);
                firstDocWord.should.have.property("word");
                firstDocWord.should.have.property("tag");            
                firstDocWord.tag.should.equal("PRP$");
                done();
            });
        });    
    });
    
    describe("#addDocuments", function() {
        it("should have 1 document", function(done) {
            natural_geo.addDocument("My test document", function(docs) {
                docs.should.have.length(1);
                done();
            });
        });
        
        it("should have 2 document", function(done) {
            natural_geo.addDocument("Yellow").addDocument("My test document", function(docs) {
                docs.should.have.length(2);
                done();
            });
        });    
    });
    
    describe("#clearDocuments", function() {
        it("should have 0 document", function(done) {
            natural_geo.clearDocuments(function(docs) {
                docs.should.have.length(0);
                done();
            });    
        });    
    });
    
    describe("#getTokens", function() {
        it("should have 0 tokens", function(done) {
            natural_geo.getTokens(function(tokens) {
                tokens.should.have.length(0);   
                done();
            });
        });
        
        it("should have 3 tokens", function(done) {
            natural_geo.addDocument("My test test document").getTokens(function(tokens) {
                tokens.should.have.length(3);
                done();
            });
        });
        
        it("should have 4 tokens", function(done) {
            natural_geo.addDocument("Yellow").addDocument("My test document").getTokens(function(tokens) {
                tokens.should.have.length(4);
                done();
            });
        });    
    });
    
    describe("#getNouns", function() {
        it("should have 1 document", function(done) {
            natural_geo.addDocument("A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu", function(docs) {
               docs.should.have.length(1); 
               done();
            });
        });
        
        it("should return 10 nouns", function(done) {
            natural_geo.getNouns(function(nouns) {
                nouns.should.have.length(10); 
                done();
            });
        });
        
        it("should return Mogadishu", function(done) {
            natural_geo.addDocument("Mogadishu").getNouns(function(nouns) {
                _.first(nouns).should.equal("Mogadishu");
                done();
            });
        });    
    });
    
    describe("#getVerbs", function() {
        it("should have 1 document", function(done) {
            natural_geo.addDocument("A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu", function(docs) {
               docs.should.have.length(1); 
               done();
            });
        });
        
        it("should return 2 verbs", function(done) {
            natural_geo.addDocument("A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu").getVerbs(function(verbs) {
                //verbs.should.have.length(2); 
                done();
            });
        });
    });
    
    describe("#extractLocations", function() {
        it("should have 1 document", function(done) {
            natural_geo.addDocument("A huge suicide car bomb explosion on Wednesday targeted at Muna hotel in Mogadishu, killing at least 15 people while dozens wounded, witnesses said.  The car bomb went off near the hotel in Hamar-weyne district, which is the base of tens of Somali Parliamentarians and government officials. All casualties were confirmed to be civilians and MPs. A suicide car bomb exploded near Hotel Muna in Mogadishu. At least 15 people died while more than 25 others, including two members of parliament, were injured in the blast. Al Shabaab claimed responsibility for the explosion, saying it used a car to carry out the explosion. A number of government officials arrived at the scene of the explosion and confirmed that a car laden with explosive devices had exploded.").extractLocations("jfuehner", function(data) {
                should.exist(data);
                data.should.have.length(1);
                _.first(data).should.have.property("totalResultsCount");
                _.first(data).should.have.property("geonames").with.length(10);
                done();
            });
        });
    });
});

