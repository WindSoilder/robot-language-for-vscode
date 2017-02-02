/**
 * This file is used to test the core functions in the system
 */
import {gotoKeywordDefinition, gotoVariableDefinition} from '../src/providers/robotDefinitionProvider';
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import {getSuiteFromFileName, testFileAbsPath} from './parserTest/parserUtil';
// Defines a Mocha test suite to group tests of similar kind together
suite("Performance Tests", () => {

    // Defines a Mocha unit test
    test("goto keyword performance test", () => {
        GotoDefinitionPerformanceTest.TestGotoKeywordDefinition();
    });

    test("goto variable performance test", () => {
        GotoDefinitionPerformanceTest.TestGotoVariableDefinition();
    })
});

function searchSuccess() {

}

function searchFailed(message : string) {
    throw Error(message);
}

class GotoDefinitionPerformanceTest {
    static TestGotoKeywordDefinition() {
        // get time start
        let startTime : Date = new Date();
        // invoke the function 10000 times
        let i : number = 0;
        while (i < 50000) {
            gotoKeywordDefinition(searchSuccess, searchFailed, "keyword one", testFileAbsPath("testFileForSearchFunctions.txt"));
            ++i;
        }
        // get end time
        let endTime : Date = new Date();
        console.log(endTime);
        console.log(startTime);
    }

    static TestGotoVariableDefinition() {
        // get time start
        let startTime : Date = new Date();
        // invoke the function 10000 times
        let i : number = 0;
        while (i < 50000) {
            gotoVariableDefinition(searchSuccess, searchFailed, "${testAttrName}", testFileAbsPath("testWithOnlyVariableTable.txt"));
            ++i;
        }
        // get end time
        let endTime : Date = new Date();
        console.log(endTime);
        console.log(startTime);        
    }
}