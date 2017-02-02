"use strict";
/**
 * This file is used to test the core functions in the system
 */
const robotDefinitionProvider_1 = require("../src/providers/robotDefinitionProvider");
const parserUtil_1 = require("./parserTest/parserUtil");
// Defines a Mocha test suite to group tests of similar kind together
suite("Performance Tests", () => {
    // Defines a Mocha unit test
    test("goto keyword performance test", () => {
        GotoDefinitionPerformanceTest.TestGotoKeywordDefinition();
    });
    test("goto variable performance test", () => {
        GotoDefinitionPerformanceTest.TestGotoVariableDefinition();
    });
});
function searchSuccess() {
}
function searchFailed(message) {
    throw Error(message);
}
class GotoDefinitionPerformanceTest {
    static TestGotoKeywordDefinition() {
        // get time start
        let startTime = new Date();
        // invoke the function 10000 times
        let i = 0;
        while (i < 50000) {
            robotDefinitionProvider_1.gotoKeywordDefinition(searchSuccess, searchFailed, "keyword one", parserUtil_1.testFileAbsPath("testFileForSearchFunctions.txt"));
            ++i;
        }
        // get end time
        let endTime = new Date();
        console.log(endTime);
        console.log(startTime);
    }
    static TestGotoVariableDefinition() {
        // get time start
        let startTime = new Date();
        // invoke the function 10000 times
        let i = 0;
        while (i < 50000) {
            robotDefinitionProvider_1.gotoVariableDefinition(searchSuccess, searchFailed, "${testAttrName}", parserUtil_1.testFileAbsPath("testWithOnlyVariableTable.txt"));
            ++i;
        }
        // get end time
        let endTime = new Date();
        console.log(endTime);
        console.log(startTime);
    }
}
//# sourceMappingURL=gotoDefinitionPerformanceTest.js.map