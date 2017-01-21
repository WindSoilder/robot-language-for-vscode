"use strict";
const robotDefinitionProvider_1 = require("../../src/providers/robotDefinitionProvider");
const assert = require("assert");
suite("provider's find keyword test", () => {
    function assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns) {
        assert.ok(testCharacters.length == testColumns.length, "the length of test characters list must be equal to the length of test columns");
        for (let index in testCharacters) {
            assert.equal(robotDefinitionProvider_1.foundKeywordInCurrentLine(testSrc, testCharacters[index], testColumns[index]), expectKeyword);
        }
    }
    test("find keyword contains one word with no args", () => {
        let testSrc = "noArgKeyword";
        let expectKeyword = "noArgKeyword";
        let testCharacters = ["n", "e", "d"];
        let testColumns = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
    test("find keyword contains one word with one arg", () => {
        let testSrc = "oneArgKeyword    arg1";
        let expectKeyword = "oneArgKeyword";
        let testCharacters = ["o", "g", "d"];
        let testColumns = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
    test("find keyword contains one word with the character appears in argument", () => {
        let testSrc = "oneArgKeyword    Arg";
        let expectKeyword = "oneArgKeyword";
        let testCharacters = ["A", "r", "g"];
        let testColumns = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
    test("find keyword contains more than one word with no args", () => {
        let testSrc = "keyword with two word";
        let expectKeyword = "keyword with two word";
        let testCharacters = ["k", "i", "t", "d"];
        let testColumns = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
    test("find keyword contains more than one word with one arg", () => {
        let testSrc = "keyword with two word    arg";
        let expectKeyword = "keyword with two word";
        let testCharacters = ["k", "w", "o", "d"];
        let testColumns = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
    test("find keyword contains more than one word with the character appears in argument", () => {
        let testSrc = "keyword with two word    firstarg    secondarg";
        let expectKeyword = "keyword with two word";
        let testCharacters = ["k", "e", "r", "d"];
        let testColumns = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
});
//# sourceMappingURL=foundKeywordInCurrentLineTest.test.js.map