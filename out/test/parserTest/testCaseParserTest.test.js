"use strict";
// test for test case file parser
// and search functions are in the src/parser/testCaseParser
const assert = require("assert");
const MetaData_1 = require("../../src/robotModels/MetaData");
const parserUtil_1 = require("./parserUtil");
// note that this extension don't care about test case table and variable table in suite.
suite("File Builder Test", () => {
    let resourceSettingValue = "../test_resource";
    let expectedResourceMetaData = [new MetaData_1.ResourceMetaData("Resource", "../test_resource")];
    let expectedKeywordNames = ["keyword one", "keyword two"];
    let expectedVarNames = ["${testAttrName}", "${test another attr}"];
    function assertVarTableExisted(suite) {
        let suiteVarNames = [];
        for (let v of suite.variables) {
            suiteVarNames.push(v.name);
        }
        assert.equal(suiteVarNames.sort().toString(), expectedVarNames.sort().toString());
    }
    function assertKeywordTableExisted(suite) {
        let suiteKeywordNames = [];
        for (let keyword of suite.keywords) {
            suiteKeywordNames.push(keyword.name);
        }
        assert.equal(suiteKeywordNames.sort().toString(), expectedKeywordNames.sort().toString());
    }
    function assertResourceSettingExisted(suite) {
        assert.equal(suite.resourceMetaDatas[0].dataType.toLowerCase(), "Resource".toLowerCase());
        assert.equal(suite.resourceMetaDatas[0].dataValue, resourceSettingValue);
    }
    function assertKeywordTableNotExisted(suite) {
        assert.equal(suite.keywords.length, 0);
    }
    function assertResourceSettingNotExisted(suite) {
        assert.equal(suite.resourceMetaDatas.length, 0);
    }
    test("test build file with all tables", () => {
        let fileName = "testWithAllTables.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableExisted(suite);
        assertResourceSettingExisted(suite);
        assertVarTableExisted(suite);
    });
    test("test build file with only setting table", () => {
        let fileName = "testWithOnlySettingTable.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableNotExisted(suite);
        assertResourceSettingExisted(suite);
    });
    test("test build file with only keyword table", () => {
        let fileName = "testWithOnlyKeywordTable.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableExisted(suite);
        assertResourceSettingNotExisted(suite);
    });
    test("test build file with setting and testcase table", () => {
        let fileName = "testWithSettingAndTestCaseTable.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableNotExisted(suite);
        assertResourceSettingExisted(suite);
    });
    test("test build file with setting and keyword table", () => {
        let fileName = "testWithSettingAndKeywordTable.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableExisted(suite);
        assertResourceSettingExisted(suite);
    });
    test("test build file with testcase and keyword table", () => {
        let fileName = "testWithTestCaseAndKeywordTable.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableExisted(suite);
        assertResourceSettingNotExisted(suite);
    });
    test("test build file with empty file", () => {
        let fileName = "testWithEmptyFile.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertKeywordTableNotExisted(suite);
        assertResourceSettingNotExisted(suite);
    });
    test("test build file with illegal syntax", () => {
        let fileName = "testWithIllegalSyntax.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assert.equal(suite, null, "build suite with illegal syntax should return null");
    });
    test("test build file with variable table", () => {
        let fileName = "testWithOnlyVariableTable.txt";
        let suite = parserUtil_1.getSuiteFromFileName(fileName);
        assertVarTableExisted(suite);
    });
});
//# sourceMappingURL=testCaseParserTest.test.js.map