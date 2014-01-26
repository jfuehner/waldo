var _ = require("underscore");

var Word = function(wordSet, text) {
    this.wordSet = wordSet;
    this.text = text;
};

module.exports = Word;