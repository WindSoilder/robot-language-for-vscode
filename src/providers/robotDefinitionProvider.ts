import {DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, commands} from 'vscode';
import {buildFileToSuite} from '../parsers/testCaseFileParser';
import {TestSuite} from '../robotModels/TestSuite';
import {searchInKeywordTable, searchInLibraryTable, searchInResourceTable, initializeVisitedSet} from '../parsers/searchFunctions';


export class RobotDefinitionProvider implements DefinitionProvider {
    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Thenable<Location>
    {
        console.log('path in provide definition:' + document.uri.path);
        // initialize the visitedSet
        initializeVisitedSet();

        // the filePath need to be compatible with different systems :(
        let filePath = document.uri.path.replace('/', '');
         
        // 1. find the whole keyword that we want to search
        let targetKeyword : string = foundKeywordInDocument(document, position).trim();
        console.log("target keyword:" + targetKeyword.length);

        return new Promise<Location>((resolve, reject) => {
            // 2. build document to a suite (complete)
            let suite: TestSuite = buildFileToSuite(filePath);
            if (null == suite) {
                reject(`the file ${filePath} is not existed`);
            }

            // 3. search in suite keywords table
            let location : Location = searchInKeywordTable(targetKeyword, suite);
            if (location) {
                console.log(targetKeyword + " is matched in keyword table")
                return resolve(location);
            }
            else {
                location = searchInLibraryTable(targetKeyword, suite);
                if (location) {
                    console.log(targetKeyword + " is matched in library table")
                    return resolve(location);
                }
                else {
                    location = searchInResourceTable(targetKeyword, suite);
                    if (location) {
                        console.log(targetKeyword + " is matched in resource table")
                        return resolve(location);
                    }
                }
            }
            return reject(`can't find the fefinition of "${targetKeyword}"`);    
        })
        // when we wan't to return a thenable object, we can use Promise object
        // return new Promise<Location>(robotGotoDefinition)
    }
}

/**
 * when user input F12, this function will return a keyword value
 * which he want to search
 * Need Unit Test
 */
export function foundKeywordInDocument(document: TextDocument, position: Position) : string {

    let line: number = position.line, column: number = position.character;
    let doc : string = document.lineAt(position.line).text;
    let c : string = doc[column];
    
    let pattern : RegExp = new RegExp(`(\\S+ )*\\S*${c}\\S*( \\S+)*`);
    let match; 
    let totalMatchedPatternLength : number = 0;

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

