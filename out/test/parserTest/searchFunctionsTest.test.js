"use strict";
// test for search functions
// and search functions are in the src/parser/searchFunctions.ts
const assert = require("assert");
const vscode_1 = require("vscode");
const searchFunctions_1 = require("../../src/parsers/searchFunctions");
const parserUtil_1 = require("./parserUtil");
// note that this extension don't care about test case table and variable table in suite.
suite("search functions tests", () => {
    let testFileName = "testFileForSearchFunctions.txt";
    let suite = parserUtil_1.getSuiteFromFileName(testFileName);
    function assertLocationEqual(actual, expect, funcName) {
        if (expect != null) {
            assert.ok(actual != null, `The search functions ${funcName} should not return null`);
        }
        assert.ok(actual.uri.scheme == expect.uri.scheme && actual.uri.path == expect.uri.path, `In funcName: ${funcName} actual uri: ${actual.uri}, expect uri: ${expect.uri}`);
        assert.ok(actual.range.isEqual(expect.range), `In funcName: ${funcName} actual line num: ${actual.range.start.line}, expect line num: ${expect.range.start.line}`);
    }
    test("searchInKeywordTable function test", () => {
        // define the test keywords and when user search these keyword
        // the expect locations it should returns, because js have no map data structure yet
        let testKeywords = ["keyword one", "keyword two", "keyword three"];
        let expectLocations = [
            new vscode_1.Location(suite.source, new vscode_1.Position(8, 0)),
            new vscode_1.Location(suite.source, new vscode_1.Position(11, 0)),
            new vscode_1.Location(suite.source, new vscode_1.Position(14, 0))
        ];
        for (let index in testKeywords) {
            // for each search, we should initialize visisted set first
            searchFunctions_1.initializeVisitedSet();
            let loc = searchFunctions_1.searchInKeywordTable(testKeywords[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchInKeywordTable");
        }
    });
    test("searchInLibraryTable function test", () => {
        // only test for user defined library, will not testing library 
        // which are installed python site package path
        let testFunctionNames = [
            "library function one", "library function two",
            "library function three",
            "library function four"
        ];
        let testLibUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("test.py"));
        let anotherTestLibUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("anotherTest.py"));
        let testWithClassLibUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("testWithClass.py"));
        // Note that library function one .. two are defined in test.py
        // library function three is defined in anotherTest.py
        // and library function four is defined in testWithClass.py
        let expectLocations = [
            new vscode_1.Location(testLibUri, new vscode_1.Position(0, 0)),
            new vscode_1.Location(testLibUri, new vscode_1.Position(3, 0)),
            new vscode_1.Location(anotherTestLibUri, new vscode_1.Position(0, 0)),
            new vscode_1.Location(testWithClassLibUri, new vscode_1.Position(1, 0))
        ];
        for (let index in testFunctionNames) {
            // for each search, we should initialize the search functions visited set
            searchFunctions_1.initializeVisitedSet();
            let loc = searchFunctions_1.searchInLibraryTable(testFunctionNames[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchInLibraryTable");
        }
    });
    test("searchInResourceTable function test", () => {
        let testKeywordName = "keyword five";
        let expectResourceUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("testFileForSearchFunctionsResource.txt"));
        let expectLocation = new vscode_1.Location(expectResourceUri, new vscode_1.Position(1, 0));
        // for search start, we should initialize the functions visisted set
        searchFunctions_1.initializeVisitedSet();
        let loc = searchFunctions_1.searchInResourceTable(testKeywordName, suite);
        assertLocationEqual(loc, expectLocation, "searchInResourceTable");
    });
    test("varSearchInVariableTable function test", () => {
        let testVarNames = [
            "${testVar1}", "${test Var 2}"
        ];
        let expectResourceUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("testFileForVarSearchFunctions.txt"));
        let expectLocations = [
            new vscode_1.Location(expectResourceUri, new vscode_1.Position(8, 0)),
            new vscode_1.Location(expectResourceUri, new vscode_1.Position(9, 0))
        ];
        let suite = parserUtil_1.getSuiteFromFileName("testFileForVarSearchFunctions.txt");
        for (let index in testVarNames) {
            let loc = searchFunctions_1.searchVarInVariableTable(testVarNames[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchVarInVariableTable");
        }
    });
    test("varSearchInResourceTable function test", () => {
        let testVarNames = [
            "${testVar3}", "${test Var 4}"
        ];
        let expectResourceUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("testFileForVarSearchFunctionsResource.txt"));
        let expectLocations = [
            new vscode_1.Location(expectResourceUri, new vscode_1.Position(1, 0)),
            new vscode_1.Location(expectResourceUri, new vscode_1.Position(2, 0))
        ];
        let suite = parserUtil_1.getSuiteFromFileName("testFileForVarSearchFunctions.txt");
        for (let index in testVarNames) {
            searchFunctions_1.initializeVarVisitedSet();
            let loc = searchFunctions_1.searchVarInResourceTable(testVarNames[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchVarInResourceTable");
        }
    });
});
//# sourceMappingURL=searchFunctionsTest.test.js.map