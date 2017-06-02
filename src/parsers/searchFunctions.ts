import * as path from 'path';
import * as fs from 'fs';
import {Location, Position, Uri, TextDocument} from 'vscode';
import {TestSuite} from '../robotModels/TestSuite';
import {Keyword} from '../robotModels/Keyword';
import {TestCase} from '../robotModels/TestCase';
import {Variable} from '../robotModels/Variable';
import {buildFileToSuite} from './testCaseFileParser';

// these two set are use for get rid of infinite library or resource search
// Save all libraries absoluted path that we have visited
var visitedLibrarySet = new Set();
// Save all resources absoluted path that we have visited
var visitedResourceSet = new Set();

// Save all resources absoluted path that we have visited 
var varVisitedResourceSet = new Set();

/**
 * Search keyword in the given TestSuite's Keyword Table
 * returns:
 *     if search successfully, return the keyword location
 *     else return null.
 */
export function searchInKeywordTable(targetKeyword : string, suite : TestSuite) : Location {
    // iterate keyword list, if found target keyword in keyword list
    // return the keyword's definition location, else return null
    for (let keyword of suite.keywords) {
        if (targetKeyword.toLowerCase() == keyword.name.toLowerCase()) {
            let loc : Location = new Location(suite.source, 
                                              new Position(keyword.position, 0));
            return loc;
        }
    }
    return null;
}

/**
 * Search keyword in the given TestSuite's Library Table
 * returns:
 *     if search successfully, return the keyword location
 *     else return null
 */
export function searchInLibraryTable(targetKeyword : string, suite : TestSuite) : Location {
    // prerequisite: user set environment variable PY_SITE_PATH
    // iterate library list, for each library list, open the file
    // and then replace targetKeyword to a '_' linked string, and then
    // search if there is a function defined there, if so, return it's location, else return a failure
    let targetFunc = targetKeyword.replace(/ /g, "_");

    // according to python search way
    // we will first search the library file in the file's current directory
    // and then search in site package directory
    for (let modulePath of suite.libraryMetaDatas) {   
        let libraryFullPath : string = getLibraryFullPath(modulePath.dataValue, suite);

        // if the library is robot builtin, we can't catch it from file
        // and we will return continue to search next
        if (libraryFullPath == null) {
            continue;
        }

        if (visitedLibrarySet.has(libraryFullPath)) {
            continue;
        }

        // open file and search if the target keyword in the buffer     
        let fileContent : string = fs.readFileSync(libraryFullPath).toString();
        let searchPattern = new RegExp(`def ${targetFunc}.*`, "i");
        let fileLines : string[] = fileContent.split("\r\n"); 
        let lineCount : number = 0;
        for (let fileLine of fileLines) {
            let match = fileLine.match(searchPattern);
            if (match) {
                return new Location(Uri.file(libraryFullPath), 
                                    new Position(lineCount, 0));
            }
            ++lineCount; 
        }

        visitedLibrarySet.add(libraryFullPath);
    } 
    return null;
}

/**
 * Search the keyword in the given TestSuite's resource table
 * returns:
 *     if search successfully, return the keyword location
 *     else return null
 */
export function searchInResourceTable(targetKeyword : string, sourceSuite : TestSuite) : Location {
    // remove uri path starts with '/'
    // the uri path is like '/C://test/test2', so we should remove the first '/'
    let currentPath : string = sourceSuite.source.path.replace('/', '');
    currentPath = path.dirname(currentPath);
    // the filePath need to be compatible with different systems :(

    for (let resource of sourceSuite.resourceMetaDatas) {
        let targetPath : string = null;
        if (path.isAbsolute(resource.dataValue)) {
            targetPath = resource.dataValue;
        } else {
            targetPath = path.join(currentPath, resource.dataValue);
        }

        console.log("in for loop in search in resource table:" + targetPath);

        if (visitedResourceSet.has(targetPath)) {
            continue;
        }

        let suite : TestSuite = buildFileToSuite(targetPath);

        if (null == suite) {
            continue;   // continue to next suite
        }

        visitedResourceSet.add(targetPath);
        let location : Location = searchInKeywordTable(targetKeyword, suite);
        if (location) {
            return location;
        }
        else {
            location = searchInLibraryTable(targetKeyword, suite);
            if (location) return location;
            else {
                location = searchInResourceTable(targetKeyword, suite);
                if (location) return location;
            }
        }
    } // end for (let resource of suite.resourceMetaDatas)
}

/**
 * search variable in the testSuite's TestCase, which may define dynamic variable
 * @param targetVariable the variable that we want to located
 * @param sourceSuite testSuite we use for location
 * @param cursorLine  the line of targetVariable in the document, it's helpful to locate where the testcase it's located in
 */
export function searchVarInLocalTestCase(targetVariable : string, sourceSuite : TestSuite, cursorLine : number) : Location
{
    let currentTestCase : TestCase = sourceSuite.locateToTestCase(cursorLine);

    let v : Variable = currentTestCase.getVariable(targetVariable);
    if (v != null) {
        return new Location(sourceSuite.source,
                            new Position(v.position, 0));
    } else {
        return null;
    }
}

export function searchVarInVariableTable(targetVariable : string, sourceSuite : TestSuite) : Location {
    // iterate variable list, if found target variable in variable list
    // return the variable's definition location, else return null
    for (let variable of sourceSuite.variables) {
        if (targetVariable.toLowerCase() == variable.name.toLowerCase()) {
            let loc : Location = new Location(sourceSuite.source, 
                                              new Position(variable.position, 0));
            return loc;
        }
    }
    return null;
}

export function searchVarInResourceTable(targetVariable : string, sourceSuite : TestSuite) : Location {
    let currentPath : string = sourceSuite.source.path.replace('/', '');
    currentPath = path.dirname(currentPath);

    // the filePath need to be compatible with different systems :(
    for (let resource of sourceSuite.resourceMetaDatas) {
        let targetPath = path.join(currentPath, resource.dataValue);

        if (varVisitedResourceSet.has(targetPath)) {
            continue;
        }

        let suite : TestSuite = buildFileToSuite(targetPath);

        if (null == suite) {
            continue;   // continue to next suite
        }

        visitedResourceSet.add(targetPath);
        let location : Location = searchVarInVariableTable(targetVariable, suite);
        if (location) {
            return location;
        }
        else {
            location = searchInResourceTable(targetVariable, suite);
            if (location) return location;
        }
    } // end for (let resource of suite.resourceMetaDatas)
}

/**
 * get the library full path according to library meta data
 * if the library is not existed, return null
 */
function getLibraryFullPath(modulePath : string, suite : TestSuite) : string {
    // this function will get file from base dir, site package path and check if they are existed
    let getPathFunctions : Function[] = [
        getLibraryFullPathInCurrentDir,
        getLibraryFullPathInCurrentDirWithClassName,
        getLibraryFullPathInSiteDir,
        getLibraryFullPathInSiteDirWithClassName 
    ];

    
    for (let getPathFunction of getPathFunctions) {
        let libraryPath : string = getPathFunction(modulePath, suite);
        console.log(`search in ${libraryPath}`);
        if (fs.existsSync(libraryPath)) {
            return libraryPath;
        }
    }
    return null;
}

/*
 * return full path base on the suite's current directory
 * it doesn't check if the file existed
 */
function getLibraryFullPathInCurrentDir(modulePath : string, suite : TestSuite) : string {
   let libraryRootPath : string = path.dirname(suite.source.path.replace('/', ''));

   // use for this scenario:
   // library    ../../testLibrary/testmodule.py
   // for this one, we should join from module path to root path earily, and change modulePath to emptystring
   if (modulePath.startsWith('.')) {
       console.log(`library root path: ${libraryRootPath}`);
       console.log(`base name of library root path: ${libraryRootPath}`);
       console.log(`module path: ${modulePath}`);
       libraryRootPath = path.join(libraryRootPath, modulePath);
       console.log(`after library root path: ${libraryRootPath}`);
       modulePath = '';
   }
   return getLibraryFullPathForGivenRoot(libraryRootPath, modulePath);
}

function getLibraryFullPathInCurrentDirWithClassName(modulePath : string, suite : TestSuite) : string {
   // this function is work for this scenario
   // library    dell.automation.modulename.classname
   // for this scenario, we should return dell/automation/modulename.py 
   // rather than return dell/automation/modulename/classname.py
   let actualModulePathList : string[] = modulePath.split('.').slice(0, -1);
   let actualModulePath : string = actualModulePathList.join('.'); 
   
   return getLibraryFullPathInCurrentDir(actualModulePath, suite);
}

function getLibraryFullPathInSiteDirWithClassName(modulePath : string, suite : TestSuite) : string {
   let actualModulePathList : string[] = modulePath.split('.').slice(0, -1);
   let actualModulePath : string = actualModulePathList.join('.');

   return getLibraryFullPathInSiteDir(actualModulePath, suite);
}
/*
 * return full path base on python site package directory
 * it doesn't check if the file existed
 */
function getLibraryFullPathInSiteDir(modulePath : string, suite : TestSuite) : string {
   let libraryRootPath : string = process.env.PY_SITE_PATH;
   return getLibraryFullPathForGivenRoot(libraryRootPath, modulePath);
}

function getLibraryFullPathForGivenRoot(rootPath : string, modulePath : string) : string {
    const PYTHON_EXT_NAME = ".py";

    // use for this issue
    // library    dell.automation.ca_common.test.py
    let libraryPath : string = modulePath.replace(/\.py/, '');
    libraryPath = libraryPath.replace(/\./g, path.sep);
    let sitePackageFullPath : string = path.join(rootPath, libraryPath) + PYTHON_EXT_NAME;

    return sitePackageFullPath;
}

export function initializeVisitedSet() {
    visitedLibrarySet.clear();
    visitedResourceSet.clear();
} 

export function initializeVarVisitedSet() {
    varVisitedResourceSet.clear();
}