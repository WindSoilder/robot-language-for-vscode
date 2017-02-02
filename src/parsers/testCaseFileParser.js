"use strict";
var fs = require("fs");
var vscode_1 = require("vscode");
var TestSuite_1 = require("../robotModels/TestSuite");
var keywordTablePopulator_1 = require("../populators/keywordTablePopulator");
var settingTablePopulator_1 = require("../populators/settingTablePopulator");
var variableTablePopulator_1 = require("../populators/variableTablePopulator");
/**
 * this function need Unit Test
 */
function buildFileToSuite(filePath) {
    // if the file is not existed, we should not open it.  And let user know that
    if (!fs.existsSync(filePath)) {
        return null;
    }
    var fileContent = fs.readFileSync(filePath).toString();
    var lineContentList = fileContent.split('\r\n');
    var lineCount = lineContentList.length;
    var currentLineNumber = 0;
    var targetSuite = new TestSuite_1.TestSuite(vscode_1.Uri.file(filePath));
    while (currentLineNumber < lineCount) {
        var currentLine = lineContentList[currentLineNumber];
        var match = currentLine.match("\\*\\*\\*(.*)\\*\\*\\*");
        if (match) {
            var header = match[1].trim();
            // if the header is keyword or setting
            // then feed the header to target suite 
            if (-1 != TestSuite_1.TestSuite.keyword_table_names.indexOf(header)) {
                ++currentLineNumber;
                currentLineNumber = keywordTablePopulator_1.KeywordTablePopulator.populate(lineContentList, currentLineNumber, targetSuite);
            }
            else if (-1 != TestSuite_1.TestSuite.setting_table_names.indexOf(header)) {
                ++currentLineNumber;
                currentLineNumber = settingTablePopulator_1.SettingTablePopulator.populate(lineContentList, currentLineNumber, targetSuite);
            }
            else if (-1 != TestSuite_1.TestSuite.variable_table_names.indexOf(header)) {
                ++currentLineNumber;
                currentLineNumber = variableTablePopulator_1.VariableTablePopulator.populate(lineContentList, currentLineNumber, targetSuite);
            }
            else if (-1 != TestSuite_1.TestSuite.testcase_table_names.indexOf(header)) {
                // the header is legal but we are not concern for it
                // we are not concern about Variable table and TestCase table
                currentLineNumber++;
            }
            else {
                // the header name is illegal, so parse should failed.
                return null;
            }
        } // end if (match)
        else {
            ++currentLineNumber;
        }
    }
    return targetSuite;
}
exports.buildFileToSuite = buildFileToSuite;
