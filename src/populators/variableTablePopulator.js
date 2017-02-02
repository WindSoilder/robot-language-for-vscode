"use strict";
var Variable_1 = require("../robotModels/Variable");
var VariableTablePopulator = (function () {
    function VariableTablePopulator() {
    }
    // feed document's variable table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    VariableTablePopulator.populate = function (lineContentList, startLine, suite) {
        var currentLineNumber = startLine;
        var lineCount = lineContentList.length;
        while (currentLineNumber < lineCount) {
            var currentLine = lineContentList[currentLineNumber];
            var endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            // match for keyword definition in variable table
            // ${variable}    value
            var variablePattern = /^(\$\{.+\})(\t{1,}|\s{2,})(.*)/i;
            if (currentLine.match(endPattern)) {
                return currentLineNumber;
            }
            else {
                var variableMatch = currentLine.match(variablePattern);
                if (variableMatch) {
                    var v = new Variable_1.Variable(currentLineNumber, variableMatch[1]);
                    suite.variables.push(v);
                } // end if (metaDataMatch)
            } // end else
            ++currentLineNumber;
        } // end while(currentLineNumber < lineCount)
        return currentLineNumber;
    };
    return VariableTablePopulator;
}());
exports.VariableTablePopulator = VariableTablePopulator;
