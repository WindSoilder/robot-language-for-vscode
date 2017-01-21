import {foundKeywordInCurrentLine as ficl} from '../../src/providers/robotDefinitionProvider';
import * as assert from 'assert'; 

suite("provider's find keyword test", () => {
    function assertSearchSuccess(testSrc : string, expectKeyword : string, testCharacters : string[],
                                 testColumns : number[]) {
        assert.ok(testCharacters.length == testColumns.length, "the length of test characters list must be equal to the length of test columns");        
        for (let index in testCharacters) {
             assert.equal(ficl(testSrc, testCharacters[index], testColumns[index]), expectKeyword);
        }
    }
    
    test("find keyword contains one word with no args", () => {
        let testSrc : string = "noArgKeyword";
        let expectKeyword : string = "noArgKeyword";
        let testCharacters : string[] = ["n", "e", "d"];
        let testColumns : number[] = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);


    });

    test("find keyword contains one word with one arg", () => {
        let testSrc : string = "oneArgKeyword    arg1";
        let expectKeyword : string = "oneArgKeyword";
        let testCharacters : string[] = ["o", "g", "d"];
        let testColumns : number[] = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);        
    });

    test("find keyword contains one word with the character appears in argument", () => {
        let testSrc : string = "oneArgKeyword    Arg";
        let expectKeyword : string = "oneArgKeyword";
        let testCharacters : string[] = ["A", "r", "g"];
        let testColumns : number[] = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });

    test("find keyword contains more than one word with no args", () => {
        let testSrc : string = "keyword with two word";
        let expectKeyword : string = "keyword with two word";
        let testCharacters : string[] = ["k", "i", "t", "d"];
        let testColumns : number[] = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });

    test("find keyword contains more than one word with one arg", () => {
        let testSrc : string = "keyword with two word    arg";
        let expectKeyword : string = "keyword with two word";
        let testCharacters : string[] = ["k", "w", "o", "d"];
        let testColumns : number[] = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);

    });

    test("find keyword contains more than one word with the character appears in argument", () => {
        let testSrc : string = "keyword with two word    firstarg    secondarg";
        let expectKeyword : string = "keyword with two word";
        let testCharacters : string[] = ["k", "e", "r", "d"];
        let testColumns : number[] = [];
        for (let testCharacter of testCharacters) {
            testColumns.push(expectKeyword.indexOf(testCharacter));
        }
        assertSearchSuccess(testSrc, expectKeyword, testCharacters, testColumns);
    });
});