var _ = require("underscore"),
    pos = require("pos"),
    utils = require("../util/utils"),
    doc_word = require("./document_word");
    
function getTaggedWords(doc) {
    var words = doc.lexer.lex(doc.text);
    var taggedWords = doc.tagger.tag(words);

    var output = [];
    _.each(taggedWords, function(item) {
        output.push(new doc_word(taggedWords, item[0], item[1]));
    });
    return output;
}    

var Document = function(text) {
    this.lexer = new pos.Lexer();
    this.tagger = new pos.Tagger();

    this.text = text;
};

Document.prototype.sentences = function(success, fail) {
    utils.fire(success, this.text.split("."));
    
    return this;
};

Document.prototype.words = function(success, fail) {
    var doc = this;
    var taggedWords = getTaggedWords(doc);
    
    var docWords = [];
    _.each(taggedWords, function(taggedWord) {
        docWords.push(new doc_word(taggedWords, taggedWord.text, taggedWord.tag));            
    });
    
    utils.fire(success, docWords);
    
    return doc;
};

module.exports = Document;
