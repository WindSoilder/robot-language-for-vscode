"use strict";
const testCaseFileParser_1 = require("../parsers/testCaseFileParser");
const searchFunctions_1 = require("../parsers/searchFunctions");
class RobotDefinitionProvider {
    provideDefinition(document, position, token) {
        console.log('path in provide definition:' + document.uri.path);
        // initialize the visitedSet
        searchFunctions_1.initializeVisitedSet();
        // the filePath need to be compatible with different systems :(
        let filePath = document.uri.path.replace('/', '');
        // 1. find the whole keyword that we want to search
        let targetKeyword = foundKeywordInDocument(document, position).trim();
        console.log("target keyword:" + targetKeyword.length);
        return new Promise((resolve, reject) => {
            // 2. build document to a suite (complete)
            let suite = testCaseFileParser_1.buildFileToSuite(filePath);
            if (null == suite) {
                reject(`the file ${filePath} is not existed`);
            }
            // 3. search in suite keywords table
            let location = searchFunctions_1.searchInKeywordTable(targetKeyword, suite);
            if (location) {
                console.log(targetKeyword + " is matched in keyword table");
                return resolve(location);
            }
            else {
                location = searchFunctions_1.searchInLibraryTable(targetKeyword, suite);
                if (location) {
                    console.log(targetKeyword + " is matched in library table");
                    return resolve(location);
                }
                else {
                    location = searchFunctions_1.searchInResourceTable(targetKeyword, suite);
                    if (location) {
                        console.log(targetKeyword + " is matched in resource table");
                        return resolve(location);
                    }
                }
            }
            return reject(`can't find the fefinition of "${targetKeyword}"`);
        });
        // when we wan't to return a thenable object, we can use Promise object
        // return new Promise<Location>(robotGotoDefinition)
    }
}
exports.RobotDefinitionProvider = RobotDefinitionProvider;
/**
 * when user input F12, this function will return a keyword value
 * which he want to search
 */
function foundKeywordInDocument(document, position) {
    let line = position.line, column = position.character;
    let doc = document.lineAt(position.line).text;
    let c = doc[column];
    return foundKeywordInCurrentLine(doc, c, column);
}
exports.foundKeywordInDocument = foundKeywordInDocument;
/**
 * return keyword name in the line
 * Note that it's only invoked by foundKeywordInDocument
 * args:
 *     src -- the source of line to search keyword
 *     character -- the position character value
 *     cloumnPos -- the column of character in src, starts with 0
 * Need Unit Test
 */
function foundKeywordInCurrentLine(src, character, columnPos) {
    let pattern = new RegExp(`(\\S+ )*\\S*${character}\\S*( \\S+)*`);
    let match;
    let totalMatchedPatternLength = 0;
    do {
        match = src.match(pattern);
        src = src.replace(match[0], '');
        totalMatchedPatternLength += match[0].length;
    } while (match.index + totalMatchedPatternLength < columnPos);
    // Should omit Given, When, Then, And builtin keyword.
    // these keywords is use for data-driven style test case
    let givenWhenThenAndPattern = /(Given |When |Then |And )/i;
    let targetKeyword = match[0].replace(givenWhenThenAndPattern, '');
    // add for variable support.....
    // if the target keyword have variable syntax, this function
    // will return the variable syntax
    let matchVariableSyntaxResult = targetKeyword.match(/(\$\{.+\}).*/);
    if (matchVariableSyntaxResult) {
        targetKeyword = matchVariableSyntaxResult[1];
    }
    console.log(targetKeyword);
    return targetKeyword;
}
exports.foundKeywordInCurrentLine = foundKeywordInCurrentLine;
//# sourceMappingURL=robotDefinitionProvider.js.map