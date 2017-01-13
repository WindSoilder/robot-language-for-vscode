"use strict";
const path = require("path");
const testCaseFileParser_1 = require("../../src/parsers/testCaseFileParser");
const MetaData_1 = require("../../src/robotModels/MetaData");
// Defines a Mocha test suite to group tests of similar kind together
// mainly assert that models in robotframework have some property
// note that this extension don't care about test case table and variable table in suite.
suite("File Builder Test", () => {
    let testCaseFileBaseDir = path.join(__dirname, "robotTestFiles");
    let resourceSettingValue = "../test_resource";
    let expectedResourceMetaData = [new MetaData_1.ResourceMetaData("Resource", "../test_resource")];
    let expectedKeywordNames = ["keyword one", "keyword two"];
    test("test build file with all tables", () => {
        let fileName = "testWithAllTables.txt";
        let filePath = path.join(testCaseFileBaseDir, fileName);
        let suite = testCaseFileParser_1.buildFileToSuite(filePath);
    });
    test("test build file with only setting table", () => {
        let fileName = "testWithOnlySettingTable.txt";
    });
    test("test build file with only testcase table", () => {
        let fileName = "testWithOnlyTestCaseTable.txt";
    });
    test("test build file with only keyword table", () => {
        let fileName = "testWithOnlyKeywordTable.txt";
    });
    test("test build file with only variable table", () => {
        let fileName = "testWithOnlyVariableTable.txt";
    });
    test("test build file with setting and testcase table", () => {
        let fileName = "testWithSettingAndTestCaseTable.txt";
    });
    test("test build file with setting and keyword table", () => {
        let fileName = "testWithSettingAndKeywordTable.txt";
    });
    test("test build file with testcase and keyword table", () => {
        let fileName = "testWithTestCaseAndKeywordTable.txt";
    });
    test("test build file with empty file", () => {
        let fileName = "testWithEmptyFile.txt";
    });
    test("test build file with illegal syntax", () => {
        let fileName = "testWithIllegalSyntax.txt";
    });
});
//# sourceMappingURL=testCaseParserTest.js.map