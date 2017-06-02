// test for search functions
// and search functions are in the src/parser/searchFunctions.ts
import * as assert from 'assert';
import {Location, Position, Uri} from 'vscode';
import * as path from 'path';

import {searchInKeywordTable, searchInLibraryTable, searchInResourceTable, initializeVisitedSet,
        initializeVarVisitedSet, searchVarInVariableTable, searchVarInResourceTable, searchVarInLocalTestCase} from '../../src/parsers/searchFunctions';
import {TestSuite} from '../../src/robotModels/TestSuite';
import {Keyword} from '../../src/robotModels/Keyword';
import {LibraryMetaData, ResourceMetaData} from '../../src/robotModels/MetaData';
import {getSuiteFromFileName, testFileAbsPath} from './parserUtil';

// note that this extension don't care about test case table and variable table in suite.
suite("search functions tests", () => {
    let testFileName : string = "testFileForSearchFunctions.txt";
    let suite : TestSuite = getSuiteFromFileName(testFileName);
    
    function assertLocationEqual(actual : Location, expect : Location, funcName : string) {
        if (expect != null) {
            assert.ok(actual != null, `The search functions ${funcName} should not return null`);
        }
        assert.ok(actual.uri.scheme == expect.uri.scheme && actual.uri.path == expect.uri.path,
        `In funcName: ${funcName} actual uri: ${actual.uri}, expect uri: ${expect.uri}`);
        assert.ok(actual.range.isEqual(expect.range),
        `In funcName: ${funcName} actual line num: ${actual.range.start.line}, expect line num: ${expect.range.start.line}`);
    }

    test("searchInKeywordTable function test", () => {
        // define the test keywords and when user search these keyword
        // the expect locations it should returns, because js have no map data structure yet
        let testKeywords : string[] = ["keyword one", "keyword two", "keyword three"];
        let expectLocations : Location[] = [
            new Location(suite.source, new Position(8, 0)),
            new Location(suite.source, new Position(11, 0)),
            new Location(suite.source, new Position(14, 0))
        ] 
        
        for (let index in testKeywords) {
            // for each search, we should initialize visisted set first
            initializeVisitedSet();
            let loc : Location = searchInKeywordTable(testKeywords[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchInKeywordTable");
        }
    });

    test("searchInLibraryTable function test", () => {
        // only test for user defined library, will not testing library 
        // which are installed python site package path

        let testFunctionNames : string[] = [
            "library function one", "library function two",
            "library function three", 
            "library function four"
        ]
        let testLibUri : Uri = Uri.file(testFileAbsPath("test.py"));
        let anotherTestLibUri : Uri = Uri.file(testFileAbsPath("anotherTest.py"));
        let testWithClassLibUri : Uri = Uri.file(testFileAbsPath("testWithClass.py"));

        // Note that library function one .. two are defined in test.py
        // library function three is defined in anotherTest.py
        // and library function four is defined in testWithClass.py
        let expectLocations : Location[] = [
            new Location(testLibUri, new Position(0, 0)),
            new Location(testLibUri, new Position(3, 0)),
            new Location(anotherTestLibUri, new Position(0, 0)),
            new Location(testWithClassLibUri, new Position(1, 0))  
        ]
        
        for (let index in testFunctionNames) {
            // for each search, we should initialize the search functions visited set
            initializeVisitedSet();
            let loc : Location = searchInLibraryTable(testFunctionNames[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchInLibraryTable");
        }
    });

    test("searchInResourceTable function test", () => {
        let testKeywordName : string = "keyword five";
        let expectResourceUri : Uri = Uri.file(testFileAbsPath("testFileForSearchFunctionsResource.txt"));
        let expectLocation : Location = 
            new Location(expectResourceUri, new Position(1, 0));
        
        // for search start, we should initialize the functions visisted set
        initializeVisitedSet();
        let loc : Location = searchInResourceTable(testKeywordName, suite);
        assertLocationEqual(loc, expectLocation, "searchInResourceTable");
    });

    test("varSearchInVariableTable function test", () => {
        let testVarNames : string[] = [
            "${testVar1}", "${test Var 2}"
        ];
        let expectResourceUri : Uri = Uri.file(testFileAbsPath("testFileForVarSearchFunctions.txt"));
        let expectLocations : Location[] = [
            new Location(expectResourceUri, new Position(8, 0)),
            new Location(expectResourceUri, new Position(9, 0))
        ];
        let suite : TestSuite = getSuiteFromFileName("testFileForVarSearchFunctions.txt");
        
        for (let index in testVarNames) {
            let loc : Location = searchVarInVariableTable(testVarNames[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchVarInVariableTable");
        }
    });

    test("varSearchInResourceTable function test", () => {
        let testVarNames : string[] = [
            "${testVar3}", "${test Var 4}"
        ];
        let expectResourceUri : Uri = Uri.file(testFileAbsPath("testFileForVarSearchFunctionsResource.txt"));
        let expectLocations : Location[] = [
            new Location(expectResourceUri, new Position(1, 0)),
            new Location(expectResourceUri, new Position(2, 0))
        ]
        let suite : TestSuite = getSuiteFromFileName("testFileForVarSearchFunctions.txt");

        for (let index in testVarNames) {
            initializeVarVisitedSet();
            let loc : Location = searchVarInResourceTable(testVarNames[index], suite);
            assertLocationEqual(loc, expectLocations[index], "searchVarInResourceTable");
        }
    });

    test("varSearchInLocalTestCase function test", () => {
        let testVarNames : string[] = [
            "${localVariable}",
            "${localVariable}", "${anotherVariable}",
            "${wasSetInVarTable}"
        ];

        let testCursorLine : number[] = [
            4,
            8, 9,
            13
        ];
        let expectResourceUri : Uri = Uri.file(testFileAbsPath("testLocalVariable.txt"));
        let expectLocations : Location[] = [
            new Location(expectResourceUri, new Position(3, 0)),
            new Location(expectResourceUri, new Position(6, 0)),
            new Location(expectResourceUri, new Position(7, 0)),
            new Location(expectResourceUri, new Position(12, 0))
        ];

        let suite : TestSuite = getSuiteFromFileName("testLocalVariable.txt");

        for (let index in testVarNames) {
            let loc : Location = searchVarInLocalTestCase(testVarNames[index], suite, testCursorLine[index]);
            assertLocationEqual(loc, expectLocations[index], "searchVarInLocalTestCase");
        }
    });
});
