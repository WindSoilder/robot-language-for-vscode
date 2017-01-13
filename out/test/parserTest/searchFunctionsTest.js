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
    test("searchInKeywordTable function test", () => {
        // define the test keywords and when user search these keyword
        // the expect locations it should returns, because js have no map data structure yet
        let testKeywords = ["keyword one", "keyword two", "keyword three"];
        let expectLocations = [
            new vscode_1.Location(suite.source, new vscode_1.Position(7, 0)),
            new vscode_1.Location(suite.source, new vscode_1.Position(10, 0)),
            new vscode_1.Location(suite.source, new vscode_1.Position(13, 0))
        ];
        for (let index in testKeywords) {
            let loc = searchFunctions_1.searchInKeywordTable(testKeywords[index], suite);
            assert.ok(loc != null, "The search in keyword table function should not return null");
            assert.ok(loc.uri == expectLocations[index].uri && loc.range == expectLocations[index].range);
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
            let loc = searchFunctions_1.searchInLibraryTable(testFunctionNames[index], suite);
            assert.ok(loc != null, "The search in keyword table function should not return null");
            assert.ok(loc.uri == expectLocations[index].uri && loc.range == expectLocations[index].range);
        }
    });
    test("searchInResourceTable function test", () => {
        let testKeywordName = "keyword five";
        let expectResourceUri = vscode_1.Uri.file(parserUtil_1.testFileAbsPath("testFileForSearchFunctionsResource.txt"));
        let expectLocation = new vscode_1.Location(expectResourceUri, new vscode_1.Position(1, 0));
        let loc = searchFunctions_1.searchInKeywordTable(testKeywordName, suite);
        assert.ok(loc != null, "The search in keyword table function should not return null");
        assert.ok(loc.uri == expectLocation.uri && loc.range == expectLocation.range);
    });
});
//# sourceMappingURL=searchFunctionsTest.js.map