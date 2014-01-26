var word = require("./word");

var RelatedWord = function(wordSet, text, weight) {
    this.wordSet = wordSet;
    this.text = text;
    this.weight = weight;
};

RelatedWord.prototype = new word();
RelatedWord.prototype.constructor = RelatedWord;

module.exports = RelatedWord;