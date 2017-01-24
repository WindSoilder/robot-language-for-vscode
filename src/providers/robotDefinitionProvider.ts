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
 */
export function foundKeywordInDocument(document: TextDocument, position: Position) : string {
    let line: number = position.line, column: number = position.character;
    let doc : string = document.lineAt(position.line).text;
    let c : string = doc[column];

    return foundKeywordInCurrentLine(doc, c, column);
}

/**
 * return keyword name in the line
 * Note that it's only invoked by foundKeywordInDocument
 * args:
 *     src -- the source of line to search keyword 
 *     character -- the position character value
 *     cloumnPos -- the column of character in src, starts with 0
 * Need Unit Test
 */
export function foundKeywordInCurrentLine(src : string, character : string, columnPos : number) {
    let pattern : RegExp = new RegExp(`(\\S+ )*\\S*${character}\\S*( \\S+)*`);
    let match; 
    let totalMatchedPatternLength : number = 0;

    do {
       match = src.match(pattern);
       src = src.replace(match[0], '');
       totalMatchedPatternLength += match[0].length;
    } while (match.index + totalMatchedPatternLength < columnPos); 

    // Should omit Given, When, Then, And builtin keyword.
    // these keywords is use for data-driven style test case
    let givenWhenThenAndPattern : RegExp = /(Given |When |Then |And )/i;
    let targetKeyword : string = match[0].replace(givenWhenThenAndPattern, '');
    
    // add for variable support.....
    // if the target keyword have variable syntax, this function
    // will return the variable syntax
    let matchVariableSyntaxResult : RegExpMatchArray = targetKeyword.match(/(\$\{.+\}).*/);
    if (matchVariableSyntaxResult) {
        targetKeyword = matchVariableSyntaxResult[1];
    }

    console.log(targetKeyword);
    return targetKeyword;    
}

