import {DefinitionProvider, TextDocument, Position, CancellationToken, Location, Uri, commands} from 'vscode';
import {buildFileToSuite} from '../parsers/testCaseFileParser';
import {TestSuite} from '../robotModels/TestSuite';
import {searchInKeywordTable, searchInLibraryTable, searchInResourceTable, initializeVisitedSet,
    initializeVarVisitedSet, searchVarInVariableTable, searchVarInResourceTable} from '../parsers/searchFunctions';
import {globalKeywordCacheSet, globalVariableCacheSet} from '../caches/CacheItem';


export class RobotDefinitionProvider implements DefinitionProvider {
    public provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Thenable<Location>
    {
        console.log('path in provide definition:' + document.uri.path);
        // initialize the visitedSet
        initializeVisitedSet();
        initializeVarVisitedSet();

        // the filePath need to be compatible with different systems :(
        let filePath = document.uri.path.replace('/', '');
         
        // 1. find the whole keyword that we want to search
        let targetKeyword : string = foundKeywordInDocument(document, position).trim();
        console.log("target keyword:" + targetKeyword.length);

        if (isVariableSyntax(targetKeyword)) {
            return new Promise<Location>((resolve, reject) => {
                gotoVariableDefinition(resolve, reject, targetKeyword, filePath);
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
    if (checkedStr.match(/(\$\{.+\})/)) {
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
 */
export function gotoVariableDefinition(resolve, reject, targetVariable : string, filePath : string) {
    if (globalVariableCacheSet.IsTargetInCache(targetVariable)) {
        return resolve(globalVariableCacheSet.GetTargetLocation(targetVariable));
    }
    
    // build document to a suite
    let suite : TestSuite = buildFileToSuite(filePath);
    if (null == suite) {
        reject(`the file ${filePath} is not existed`);
    }

    // search in suite variable table
    let location : Location = searchVarInVariableTable(targetVariable, suite);
    if (location) {
        globalVariableCacheSet.AddItemToTargetSet(targetVariable, location);
        console.log(targetVariable + " is matched in variable table");
        return resolve(location);
    } else {
        // search in suite resource table
        location = searchVarInResourceTable(targetVariable, suite);
        if (location) {
            globalVariableCacheSet.AddItemToTargetSet(targetVariable, location);
            console.log(targetVariable + " is matched in resource table")
            return resolve(location);
        }
    }
    console.log(`the keyword ${targetVariable} doesn't match anywhere`)
    return reject(`can't find the definition of "${targetVariable}"`);    
}

/**
 * goto keyword's definition location
 * arguments:
 *     resolve -- a function, when the search is success, this function should be invoked, the function argument is a location.
 *     reject  -- a function, when the search is failed, this function should be invoked, the function argument is a string named reason.
 *     targetKeyword -- the keyword that we want to search
 *     filePath -- where is the targetKeyword appears.
 */
export function gotoKeywordDefinition(resolve, reject, targetKeyword : string, filePath : string) {  
    if (globalKeywordCacheSet.IsTargetInCache(targetKeyword)) {
        return resolve(globalKeywordCacheSet.GetTargetLocation(targetKeyword));
    }
    
    //  build document to a suite (complete)
    let suite: TestSuite = buildFileToSuite(filePath);
    if (null == suite) {
        reject(`the file ${filePath} is not existed`);
    }

    //  search in suite keywords table
    let location : Location = searchInKeywordTable(targetKeyword, suite);
    if (location) {
        globalKeywordCacheSet.AddItemToTargetSet(targetKeyword, location);
        console.log(targetKeyword + " is matched in keyword table")
        return resolve(location);
    }
    else {
        // search in suite library table
        location = searchInLibraryTable(targetKeyword, suite);
        if (location) {
            globalKeywordCacheSet.AddItemToTargetSet(targetKeyword, location);
            console.log(targetKeyword + " is matched in library table")
            return resolve(location);
        }
        else {
            // search in suite resource table
            location = searchInResourceTable(targetKeyword, suite);
            if (location) {
                globalKeywordCacheSet.AddItemToTargetSet(targetKeyword, location);
                console.log(targetKeyword + " is matched in resource table")
                return resolve(location);
            }
        }
    }
    console.log(`the keyword ${targetKeyword} doesn't match anywhere`)
    reject(`can't find the definition of "${targetKeyword}"`);    
}