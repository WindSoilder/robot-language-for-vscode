import {foundKeywordInCurrentLine as ficl} from '../../src/providers/robotDefinitionProvider';
import * as assert from 'assert'; 

/**
 * the keyword in provider's function include Keyword and Variable find
 */
suite("provider's find keyword test", () => {
    function assertSearchSuccess(testSrc : string, expectKeyword : string, testCharacters : string[],
                                 testColumns : number[]) {
        assert.ok(testCharacters.length == testColumns.length, "the length of test characters list must be equal to the length of test columns");        
        for (let index in testCharacters) {
             assert.equal(ficl(testSrc, testCharacters[index], testColumns[index]), expectKeyword,
             `testing search for "${testCharacters[index]}" in "${testSrc}" failed`);
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

    test("find variable value with no constant", () => {
        // test for find variable definition, the value is used purely
        // such as ${testarg}
        let testSrc : string = "keyword with one word    ${a arg}";
        let expectVariableName : string = "${a arg}";
        let testCharacters : string[] = ["g"];
        let testColumns : number[] = [];

        for (let testCharacter of testCharacters) {
            testColumns.push(testSrc.indexOf(testCharacter));
        }

        assertSearchSuccess(testSrc, expectVariableName, testCharacters, testColumns);
    });

    test("find variable value with constant prefix", () => {
        // test for find variable definition, the value is used with constant prefix
        // such as constant_${testarg}
        let testSrc : string = "keyword with two args    1_1_${ anotherArg }    2";
        let expectVariableName : string = "${ anotherArg }";
        let testCharacters : string[] = ["1", "{", "}", "A"];
        let testColumns : number[] = [];

        for (let testCharacter of testCharacters) {
            testColumns.push(testSrc.indexOf(testCharacter));
        }

        assertSearchSuccess(testSrc, expectVariableName, testCharacters, testColumns);
    });

    test("find variable value with constant suffix", () => {
        // test for find variable definition, the value is used with constant suffix
        // such as ${testarg}_constant
        let testSrc : string = "keyword with three arg    ${argOne}    ${this is one argument}_2_3    ${argThree}";
        let expectVariableName : string = "${this is one argument}";
        let testCharacters : string[] = ["s", "u", "2", "3", "_"];
        let testColumns : number[] = [];

        for (let testCharacter of testCharacters) {
            testColumns.push(testSrc.indexOf(testCharacter));
        }
        
        assertSearchSuccess(testSrc, expectVariableName, testCharacters, testColumns);
    });
});