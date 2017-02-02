"use strict";
var MetaData_1 = require("../robotModels/MetaData");
var SettingTablePopulator = (function () {
    function SettingTablePopulator() {
    }
    // feed document's setting table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    // this static method need unit test
    SettingTablePopulator.populate = function (lineContentList, startLine, suite) {
        var currentLineNumber = startLine;
        var lineCount = lineContentList.length;
        while (currentLineNumber < lineCount) {
            var currentLine = lineContentList[currentLineNumber];
            var endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            // match for meta data definition in setting table
            // library    librayrname
            var metaDataPattern = /^(library|resource)(\t{1,}|\s{2,})(.*)/i;
            if (currentLine.match(endPattern)) {
                return currentLineNumber;
            }
            else {
                var metaDataMatch = currentLine.match(metaDataPattern);
                if (metaDataMatch) {
                    var metaDataType = metaDataMatch[1];
                    var metaDataValue = metaDataMatch[3];
                    var metaData = new MetaData_1.MetaData(metaDataType, metaDataValue);
                    if (metaDataType.toLowerCase() == "library") {
                        suite.libraryMetaDatas.push(metaData);
                    }
                    else if (metaDataType.toLowerCase() == "resource") {
                        suite.resourceMetaDatas.push(metaData);
                    }
                } // end if (metaDataMatch)
            } // end else
            ++currentLineNumber;
        } // end while(currentLineNumber < lineCount)
        return currentLineNumber;
    };
    return SettingTablePopulator;
}());
exports.SettingTablePopulator = SettingTablePopulator;
