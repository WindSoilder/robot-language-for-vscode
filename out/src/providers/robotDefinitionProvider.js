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
 * Need Unit Test
 */
function foundKeywordInDocument(document, position) {
    let line = position.line, column = position.character;
    let doc = document.lineAt(position.line).text;
    let c = doc[column];
    let pattern = new RegExp(`(\\S+ )*\\S*${c}\\S*( \\S+)*`);
    let match;
    let totalMatchedPatternLength = 0;
    do {
        match = doc.match(pattern);
        doc = doc.replace(match[0], '');
        totalMatchedPatternLength += match[0].length;
    } while (match.index + totalMatchedPatternLength < column);
    // Should omit Given, When, Then, And builtin keyword.
    // these keywords is use for data-driven style test case
    let givenWhenThenAndPattern = /(Given |When |Then |And )/i;
    let targetKeyword = match[0].replace(givenWhenThenAndPattern, '');
    console.log(targetKeyword);
    return targetKeyword;
}
exports.foundKeywordInDocument = foundKeywordInDocument;
//# sourceMappingURL=robotDefinitionProvider.js.map