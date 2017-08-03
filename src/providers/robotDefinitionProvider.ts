import {DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, commands} from 'vscode';
import {buildFileToSuiteSync} from '../parsers/testCaseFileParser';
import {TestSuite} from '../robotModels/TestSuite';
import {searchInKeywordTable, searchInLibraryTable, searchInResourceTable, initializeVisitedSet,
    initializeVarVisitedSet, searchVarInVariableTable, searchVarInResourceTable, searchVarInLocalTestCase} from '../parsers/searchFunctions';
import {globalKeywordCacheSet, globalVariableCacheSet} from '../caches/CacheItem';


export class RobotDefinitionProvider implements DefinitionProvider {
    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Thenable<Location>
    {
        console.log('path in provide definition:' + document.uri.path);
        // initialize the visitedSet
        initializeVisitedSet();
        initializeVarVisitedSet();

        // the filePath need to be compatible with different systems :(
        let filePath = document.uri.fsPath;
         
        // 1. find the whole keyword that we want to search
        // debug
        console.log(`position is ${position.line}, ${position.character}`)
        // end debug
        let targetKeyword : string = foundKeywordInDocument(document, position).trim();
        console.log("target keyword:" + targetKeyword.length);

        if (isVariableSyntax(targetKeyword)) {
            return new Promise<Location>((resolve, reject) => {
                gotoVariableDefinition(resolve, reject, targetKeyword, filePath, position.line);
            });
        }
        else {
            return new Promise<Location>((resolve, reject) => {
                gotoKeywordDefinition(resolve, reject, targetKeyword, filePath);
            });
        }
        // when we want to return a thenable object, we can use Promise object
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

/**
 * return true if the checkedStr argument is something like ${..}
 * or return null.
 */
function isVariableSyntax(checkedStr : string) : boolean {
    // match for something like ${..}, &{..} or @{..}
    if (checkedStr.match(/((\$|@|\&)\{.+\})/)) {
        return true;
    } else {
        return false;
    }
}

/**
 * goto variable's definition location
 * arguments:
 *     resolve -- a function, when the search is success, this function should be invoked, the function argument is a location.
 *     reject  -- a function, when the search is failed, this function should be invoked, the function argument is a string named reason.
 *     targetVariable -- the variable that we want to search
 *     filePath -- where is the targetVariable appears.
 *     cursorLine -- the line which cursor located, it's mainly used for local variable definition
 */
export function gotoVariableDefinition(resolve, reject, targetVariable : string, filePath : string, cursorLine : number, usingCache = false) {
    if (usingCache) {
        if (globalVariableCacheSet.IsTargetInCache(targetVariable)) {
            return resolve(globalVariableCacheSet.GetTargetLocation(targetVariable));
        }
    }
    
    // build document to a suite
    let suite : TestSuite = buildFileToSuiteSync(filePath);
    if (null == suite) {
        reject(`the file ${filePath} is not existed`);
    }

    // search in suite testcase table
    let location : Location = null;
    location = searchVarInLocalTestCase(targetVariable, suite, cursorLine);
    if (location) {
        return resolve(location);
    }
    else {
        // search in suite variable table and resource table
        let searchFunctions : Function[] = [searchVarInVariableTable, searchVarInResourceTable];

        for (let searchFunction of searchFunctions) {
            location = searchFunction(targetVariable, suite);
            if (location) {
                if (usingCache) {
                    globalVariableCacheSet.AddItemToTargetSet(targetVariable, location);
                }
                return resolve(location);
            }
        }
    }
    console.log(`the variable ${targetVariable} doesn't match anywhere`)
    return reject(`can't find the definition of "${targetVariable}`);
}

/**
 * goto keyword's definition location
 * arguments:
 *     resolve -- a function, when the search is success, this function should be invoked, the function argument is a location.
 *     reject  -- a function, when the search is failed, this function should be invoked, the function argument is a string named reason.
 *     targetKeyword -- the keyword that we want to search
 *     filePath -- where is the targetKeyword appears.
 */
export function gotoKeywordDefinition(resolve, reject, targetKeyword : string, filePath : string, usingCache=false) {
    if (usingCache) {
        if (globalKeywordCacheSet.IsTargetInCache(targetKeyword)) {
            return resolve(globalKeywordCacheSet.GetTargetLocation(targetKeyword));
        }
    }
    
    //  build document to a suite (complete)
    let suite: TestSuite = buildFileToSuiteSync(filePath);
    if (null == suite) {
        reject(`the file ${filePath} is not existed`);
    }

    //  search in suite keywords table
    let location : Location = searchInKeywordTable(targetKeyword, suite);
    let searchFunctions : Function[] = [searchInKeywordTable, searchInLibraryTable, searchInResourceTable];
    for (let searchFunction of searchFunctions) {
        location = searchFunction(targetKeyword, suite);
        if (location) {
            if (usingCache) {
                globalKeywordCacheSet.AddItemToTargetSet(targetKeyword, location);
            }
            return resolve(location);
        }
    }

    console.log(`the keyword ${targetKeyword} doesn't match anywhere`)
    reject(`can't find the definition of "${targetKeyword}"`);    
}
