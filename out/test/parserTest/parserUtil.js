"use strict";
const testCaseFileParser_1 = require("../../src/parsers/testCaseFileParser");
const path = require("path");
function getSuiteFromFileName(fileName) {
    // build suite from giving file name, assume the base path of filename is 
    // the file's base directory
    let filePath = testFileAbsPath(fileName);
    return testCaseFileParser_1.buildFileToSuite(filePath);
}
exports.getSuiteFromFileName = getSuiteFromFileName;
function testFileAbsPath(fileName) {
    // return test file absolute path according fileName
    // assume that all file is in the file's base directory
    // and should return out/test/parserTest/robotTestFiles/${fileName}
    let testCaseFileBaseDir = path.join(__dirname, "robotTestFiles");
    let filePath = path.join(testCaseFileBaseDir, fileName);
    return filePath;
}
exports.testFileAbsPath = testFileAbsPath;
//# sourceMappingURL=parserUtil.js.map