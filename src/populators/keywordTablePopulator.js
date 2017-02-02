"use strict";
var Keyword_1 = require("../robotModels/Keyword");
var KeywordTablePopulator = (function () {
    function KeywordTablePopulator() {
    }
    // feed document's keyword table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    // this static method need unit test
    KeywordTablePopulator.populate = function (lineContentList, startLine, suite) {
        var currentLineNumber = startLine;
        var lineCount = lineContentList.length;
        while (currentLineNumber < lineCount) {
            var currentLine = lineContentList[currentLineNumber];
            var endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            // match for keyword definition in keyword table
            // match for: keyword name
            var keywordPattern = new RegExp("^(\\S+ )*(\\S+)$");
            if (currentLine.match(endPattern)) {
                return currentLineNumber;
            }
            else {
                var keywordMatch = currentLine.match(keywordPattern);
                if (keywordMatch) {
                    var keyword = new Keyword_1.Keyword(currentLineNumber, keywordMatch[0]);
                    suite.keywords.push(keyword);
                }
                ++currentLineNumber;
            }
        } // end while(currentLineNumber < lineCount)
        return currentLineNumber;
    };
    return KeywordTablePopulator;
}());
exports.KeywordTablePopulator = KeywordTablePopulator;
;
