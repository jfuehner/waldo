var fs = require("fs"),
    geode = require("geode"),
    q = require("q"),
    _ = require("underscore"),
    document = require("./models/document"),
    utils = require("./util/utils");
    
//var prepositions = fs.readFileSync("grammar-prepositions.txt").toString().split("\n");
var docs = [];

module.exports = {
    addDocument: function(doc, success) {
        var self = this;
        
        docs.push(new document(doc));              
        utils.fire(success, docs);           
        
        return this;
    },
    clearDocuments: function(success) {
      docs = [];
      utils.fire(success, docs);
      
      return this;
    },
    getDocuments: function(callback) {
        utils.fire(callback, docs);
        
        return this;
    },
    extractLocations: function(username, success) {
        var self = this;
        var defs = [];
        
        var all_tokens = [];
        defs.push(q.fcall(function() {
            self.getTokens(false, function(tokens) {
                console.log(tokens);
                all_tokens = tokens;
            });
        }));
        
        var cap_nouns = [];        
        /*
        defs.push(q.fcall(self.getNouns(function(nouns) {
            self.getCapitalizedTokens(nouns, function(cappedNouns) {
                cap_nouns = cappedNouns;
            });
        })));*/
        
        q.all(defs).then(function() {
            //console.log(all_tokens);
            //console.log(cap_nouns);
            utils.fire(success, null);
        });
        
        //console.log(prepositions);
        
        /*
        var upperCaseTokens = _.filter(tokens, function(token) {
           return (token[0] === token[0].toUpperCase());
        });
        console.log(upperCaseTokens);
        */
        
/*
        var geo = new geode(username);

        geo.search({ q: "london", maxRows: 10 }, function(err, results) {
            utils.fire(success, results);
        });
        */
        //return this;
        var items = [];
        
        _.each(docs, function(doc) {
            doc.words(function(words) {
                items.push(_.chain(words).uniq(function(item) {
                    return item.text;
                }).filter(function(item) {
                    return (
                        (utils.isProperNoun(item) || (utils.isNoun(item) && item.related().length > 0))
                        && item.occurrence() <= 2 && item.confidence() >= 8);
                }).value());
            });        
        });
        
        _.chain(items).flatten().each(function(word) {
            console.log(word.text + " - " + word.tag);
            _.each(word.related(), function(related) {
                console.log("--> " + related.text + " - " + related.weight);
            });
            console.log("--> weight= " + word.weight() + ", occ= " + word.occurrence() + ", conf= " + word.confidence());        
        });        
    }
};