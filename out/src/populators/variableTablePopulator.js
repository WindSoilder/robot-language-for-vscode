"use strict";
const Variable_1 = require("../robotModels/Variable");
class VariableTablePopulator {
    // feed document's variable table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    static populate(lineContentList, startLine, suite) {
        let currentLineNumber = startLine;
        let lineCount = lineContentList.length;
        while (currentLineNumber < lineCount) {
            let currentLine = lineContentList[currentLineNumber];
            let endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            // match for keyword definition in variable table
            // ${variable}    value
            let variablePattern = /^(\$\{.+\})(\t{1,}|\s{2,})(.*)/i;
            if (currentLine.match(endPattern)) {
                return currentLineNumber;
            }
            else {
                let variableMatch = currentLine.match(variablePattern);
                if (variableMatch) {
                    let v = new Variable_1.Variable(currentLineNumber, variableMatch[1]);
                    suite.variables.push(v);
                } // end if (metaDataMatch)
            } // end else
            ++currentLineNumber;
        } // end while(currentLineNumber < lineCount)
        return currentLineNumber;
    }
}
exports.VariableTablePopulator = VariableTablePopulator;
//# sourceMappingURL=variableTablePopulator.js.map