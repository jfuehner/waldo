var _ = require("underscore"),
    sugar = require("sugar");

function isPos(pos, word) {
    return _.contains(pos, word.tag);    
}

function isDate(word) {
    return Date.create(word.text).isValid();
}

module.exports = {
    // fires a callback (when appropriate) with parameters passed
    fire: function(callback, params) {
        if(!_.isFunction(callback)) return;

        if(_.isUndefined(params)) {
            params = [];
        }
        else if(!_.isArray(params)) {
            params = [params];
        }
        
        callback(params);
        
        return this;
    },
    isAdjective: function(word) {
        return isPos(["JJ", "JJR", "JJS"], word);        
    },
    isNoun: function(word) {
        return (isPos(["NN", "NNS"], word) || this.isProperNoun(word));
    },
    isProperNoun: function(word) {
        return (!this.isDayOfWeek(word) && !this.isMonth(word) && isPos(["NNP", "NNPS"], word));
    },    
    isPreposition: function(word) {
        return isPos(["IN"], word);        
    },
    isDayOfWeek: function(word) {
        return isDate(word);
    },
    isMonth: function(word) {
        return isDate(word);
    }
};