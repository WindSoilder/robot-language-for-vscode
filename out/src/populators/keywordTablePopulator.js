"use strict";
const Keyword_1 = require("../robotModels/Keyword");
class KeywordTablePopulator {
    // feed document's keyword table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    // this static method need unit test
    static populate(lineContentList, startLine, suite) {
        let currentLineNumber = startLine;
        let lineCount = lineContentList.length;
        while (currentLineNumber < lineCount) {
            let currentLine = lineContentList[currentLineNumber];
            let endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            // match for keyword definition in keyword table
            // match for: keyword name
            let keywordPattern = new RegExp("^(\\S+ )*(\\S+)$");
            if (currentLine.match(endPattern)) {
                return currentLineNumber;
            }
            else {
                let keywordMatch = currentLine.match(keywordPattern);
                if (keywordMatch) {
                    let keyword = new Keyword_1.Keyword(currentLineNumber, keywordMatch[0]);
                    suite.keywords.push(keyword);
                }
                ++currentLineNumber;
            }
        } // end while(currentLineNumber < lineCount)
        return currentLineNumber;
    }
}
exports.KeywordTablePopulator = KeywordTablePopulator;
;
//# sourceMappingURL=keywordTablePopulator.js.map