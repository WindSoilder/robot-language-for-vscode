// test for test case file parser
// and search functions are in the src/parser/testCaseParser
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

import {buildFileToSuiteSync} from '../../src/parsers/testCaseFileParser';
import {TestSuite} from '../../src/robotModels/TestSuite';
import {Keyword} from '../../src/robotModels/Keyword';
import {TestCase} from '../../src/robotModels/TestCase';
import {LibraryMetaData, ResourceMetaData} from '../../src/robotModels/MetaData';
import {getSuiteFromFileName} from './parserUtil';

// note that this extension don't care about test case table and variable table in suite.
// all these files used for testing shouldn't be modified or moved
// or these tests will run failed
suite("File Builder Test", () => {
    let resourceSettingValue : string = "../test_resource";
    let expectedResourceMetaData : ResourceMetaData[] = [new ResourceMetaData("Resource", "../test_resource")];
    let expectedKeywordNames : string[] = ["keyword one", "keyword two"];
    let expectedVarNames : string[] = ["${testAttrName}", "${test another attr}"];

    function assertVarTableExisted(suite : TestSuite) {
        let suiteVarNames : string[] = [];
        for (let v of suite.variables) {
            suiteVarNames.push(v.name);
        }
        assert.equal(suiteVarNames.sort().toString(), expectedVarNames.sort().toString());
    }

    function assertKeywordTableExisted(suite : TestSuite) {
        let suiteKeywordNames : string[] = [];
        for (let keyword of suite.keywords) {
            suiteKeywordNames.push(keyword.name);
        }
        assert.equal(suiteKeywordNames.sort().toString(), expectedKeywordNames.sort().toString());
    }

    function assertResourceSettingExisted(suite : TestSuite) {
        assert.equal(suite.resourceMetaDatas[0].dataType.toLowerCase(), "Resource".toLowerCase());
        assert.equal(suite.resourceMetaDatas[0].dataValue, resourceSettingValue);
    }

    function assertKeywordTableNotExisted(suite : TestSuite) {
        assert.equal(suite.keywords.length, 0);
    }

    function assertResourceSettingNotExisted(suite : TestSuite) {
        assert.equal(suite.resourceMetaDatas.length, 0);
    }

    test("test build file with all tables", () => {
        let fileName : string = "testWithAllTables.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertKeywordTableExisted(suite);
        assertResourceSettingExisted(suite);
        assertVarTableExisted(suite);
    });

    test("test build file with only setting table", () => {
        let fileName : string = "testWithOnlySettingTable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);
        
        assertKeywordTableNotExisted(suite);
        assertResourceSettingExisted(suite);
    });

    test("test build file with only keyword table", () => {
        let fileName : string = "testWithOnlyKeywordTable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertKeywordTableExisted(suite);
        assertResourceSettingNotExisted(suite);
    });

    test("test build file with setting and testcase table", () => {
        let fileName : string = "testWithSettingAndTestCaseTable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertKeywordTableNotExisted(suite);
        assertResourceSettingExisted(suite);
    });

    test("test build file with setting and keyword table", () => {
        let fileName : string = "testWithSettingAndKeywordTable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertKeywordTableExisted(suite);
        assertResourceSettingExisted(suite);
    });

    test("test build file with testcase and keyword table", () => {
        let fileName : string = "testWithTestCaseAndKeywordTable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertKeywordTableExisted(suite);
        assertResourceSettingNotExisted(suite);
    });

    test("test build file with empty file", () => {
        let fileName : string = "testWithEmptyFile.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertKeywordTableNotExisted(suite);
        assertResourceSettingNotExisted(suite);
    });

    test("test build file with illegal syntax", () => {
        let fileName : string = "testWithIllegalSyntax.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assert.equal(suite, null, "build suite with illegal syntax should return null");
    });

    test("test build file with variable table", () => {
        let fileName : string = "testWithOnlyVariableTable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        assertVarTableExisted(suite);
    });

    test("test TestCase local variable assignment", () => {
        let fileName : string = "testLocalVariable.txt";
        let suite : TestSuite = getSuiteFromFileName(fileName);

        let caseNumber : number = 4;
        assert.equal(suite.testCases.length, caseNumber);
        assert.equal(suite.testCases[0].startLine, 1);
        assert.equal(suite.testCases[0].endLine, 5);
        assert.equal(suite.testCases[0].variables.size, 1);

        assert.equal(suite.testCases[1].startLine, 5);
        assert.equal(suite.testCases[1].endLine, 10);
        assert.equal(suite.testCases[1].variables.size, 2);

        assert.equal(suite.testCases[2].startLine, 11);
        assert.equal(suite.testCases[2].endLine, 14);
        assert.equal(suite.testCases[2].variables.size, 1);

        assert.equal(suite.testCases[3].startLine, 14);
        assert.equal(suite.testCases[3].endLine, 16);
        assert.equal(suite.testCases[3].variables.size, 0);
    });

});