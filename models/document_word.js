var _ = require("underscore"),
    utils = require("../util/utils"),
    word = require("./word"),
    related_word = require("./related_word");

var DocumentWord = function(wordSet, text, tag) {
    this.wordSet = wordSet;
    this.text = text;
    this.tag = tag;
};

DocumentWord.prototype = new word();
DocumentWord.prototype.constructor = DocumentWord;

DocumentWord.prototype.related = function() {
    var word = this;
    var rv = [];
    
    if(_.isEmpty(word.text)) return rv;
    
    _.each(word.wordSet, function(item, index) {
        if(word.text.length <= 1) return;
        
        var related = [];
        
        if(item.text === word.text) {
            if(index > 0) {
                for(var pwi = index; pwi > 0; pwi--) {
                    var prevWord = word.wordSet[(pwi - 1)];
                    
                    if(_.isUndefined(prevWord)) break;
                    if(!utils.isNoun(prevWord)) break;
                    
                    related.unshift(new related_word(word.wordSet, prevWord.text, prevWord.weight()));
                }
            }
            
            related.push(new related_word(word.wordSet, word.text, word.weight()));
    
            if(index < word.wordSet.length) {
                for(var nwi = index; nwi < word.wordSet.length; nwi++) {
                    var nextWord = word.wordSet[(nwi + 1)];
    
                    if(_.isUndefined(nextWord)) break;
                    if(!utils.isNoun(nextWord)) break;
                    
                    related.push(new related_word(word.wordSet, nextWord.text, nextWord.weight()));
                }                        
            }            

            if(!_.isEmpty(related)) {
                var relatedText = _.chain(related).pluck("text").value().join(" ");
                
                if(relatedText !== word.text) {
                    var relatedWeight = _.chain(related).pluck("weight").reduce(function(memo, num) {
                       return (memo + num);
                    }).value();                    
                    
                    rv.push(new related_word(word.wordSet, relatedText, relatedWeight));
                }
            }
        }
    });
    
    return _.uniq(rv, function(item) {
        return item.text;
    });
};

DocumentWord.prototype.weight = function() {
    var word = this;
    var weight = 0;

    if(_.isEmpty(word.text) || !utils.isNoun(word)) return weight;
    
    weight++;
    
    _.each(word.wordSet, function(item, index) {
        if(item.text === word.text) {
            if(index > 0) {
                for(var pwi = index; pwi > 0; pwi--) {
                    var prevWord = word.wordSet[(pwi - 1)];

                    if(_.isUndefined(prevWord)) break;
                    if(!utils.isNoun(prevWord)) break;
                    if(utils.isPreposition(prevWord)) continue;

                    if(utils.isProperNoun(prevWord)) {
                        weight++;
                    }
                    weight++;
                }
            }

            if(index < word.wordSet.length) {
                for(var nwi = index; nwi < word.wordSet.length; nwi++) {
                    var nextWord = word.wordSet[(nwi + 1)];
                    
                    if(_.isUndefined(nextWord)) break;
                    if(!utils.isNoun(nextWord)) break;
                    if(utils.isPreposition(nextWord)) continue;

                    if(utils.isProperNoun(nextWord)) {
                        weight++;
                    }
                    weight++;
                }                        
            }
        }
    });
    
    // words with caps receive extra weight
    var caps = word.text.replace(/[^A-Z]/g, "").length;
    if(caps > 0) {
        weight = ((weight + caps) * 2);
    }
    
    if(utils.isProperNoun(word)) {
        weight = (weight * 2);
    }
    return weight;    
};

DocumentWord.prototype.occurrence = function() {
    var word = this;

    return _.filter(word.wordSet, function(item) {
        return (item.text.toLowerCase() === word.text.toLowerCase());
    }).length; 
};

DocumentWord.prototype.confidence = function() {
    var word = this;
    
    var relatedSum = 0;
    var relatedWords = word.related();

    if(relatedWords.length > 0) {
        relatedSum = _.chain(relatedWords).pluck("weight").reduce(function(memo, num) {
           return (memo + num); 
        }).value();
    }
    return parseFloat((word.occurrence() / word.wordSet.length) + word.weight() + relatedSum);  
};

module.exports = DocumentWord;