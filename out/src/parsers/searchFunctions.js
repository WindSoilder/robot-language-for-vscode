"use strict";
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const testCaseFileParser_1 = require("./testCaseFileParser");
// these two set are use for get rid of infinite library or resource search
// Save all libraries absoluted path that we have visited
var visitedLibrarySet = new Set();
// Save all resources absoluted path that we have visited
var visitedResourceSet = new Set();
/**
 * these three function here need Unit Test.
 */
function searchInKeywordTable(targetKeyword, suite) {
    // iterate keyword list, if found target keyword in keyword list
    // return the keyword's definition location, else return null
    for (let keyword of suite.keywords) {
        if (targetKeyword.toLowerCase() == keyword.name.toLowerCase()) {
            let loc = new vscode_1.Location(suite.source, new vscode_1.Position(keyword.position, 0));
            return loc;
        }
    }
    return null;
}
exports.searchInKeywordTable = searchInKeywordTable;
function searchInLibraryTable(targetKeyword, suite) {
    // prerequisite: user set environment variable PY_SITE_PATH
    // iterate library list, for each library list, open the file
    // and then replace targetKeyword to a '_' linked string, and then
    // search if there is a function defined there, if so, return it's location, else return a failure
    let targetFunc = targetKeyword.replace(/ /g, "_");
    // according to python search way
    // we will first search the library file in the file's current directory
    // and then search in site package directory
    for (let modulePath of suite.libraryMetaDatas) {
        let libraryFullPath = getLibraryFullPath(modulePath.dataValue, suite);
        // if the library is robot builtin, we can't catch it from file
        // and we will return continue to search next
        if (libraryFullPath == null) {
            continue;
        }
        if (visitedLibrarySet.has(libraryFullPath)) {
            continue;
        }
        // open file and search if the target keyword in the buffer     
        let fileContent = fs.readFileSync(libraryFullPath).toString();
        let searchPattern = new RegExp(`def ${targetFunc}.*`, "i");
        let fileLines = fileContent.split("\r\n");
        let lineCount = 0;
        for (let fileLine of fileLines) {
            let match = fileLine.match(searchPattern);
            if (match) {
                return new vscode_1.Location(vscode_1.Uri.file(libraryFullPath), new vscode_1.Position(lineCount, 0));
            }
            ++lineCount;
        }
        visitedLibrarySet.add(libraryFullPath);
    }
    return null;
}
exports.searchInLibraryTable = searchInLibraryTable;
function searchInResourceTable(targetKeyword, sourceSuite) {
    let currentPath = sourceSuite.source.path.replace('/', '');
    currentPath = path.dirname(currentPath);
    // the filePath need to be compatible with different systems :(
    for (let resource of sourceSuite.resourceMetaDatas) {
        let targetPath = path.join(currentPath, resource.dataValue);
        console.log("in for loop in search in resource table:" + targetPath);
        if (visitedResourceSet.has(targetPath)) {
            continue;
        }
        let suite = testCaseFileParser_1.buildFileToSuite(targetPath);
        if (null == suite) {
            continue; // continue to next suite
        }
        visitedResourceSet.add(targetPath);
        let location = searchInKeywordTable(targetKeyword, suite);
        if (location) {
            return location;
        }
        else {
            location = searchInLibraryTable(targetKeyword, suite);
            if (location)
                return location;
            else {
                location = searchInResourceTable(targetKeyword, suite);
                if (location)
                    return location;
            }
        }
    } // end for (let resource of suite.resourceMetaDatas)
}
exports.searchInResourceTable = searchInResourceTable;
/**
 * get the library full path according to library meta data
 * if the library is not existed, return null
 */
function getLibraryFullPath(modulePath, suite) {
    // this function will get file from base dir, site package path and check if they are existed
    let getPathFunctions = [
        getLibraryFullPathInCurrentDir,
        getLibraryFullPathInCurrentDirWithClassName,
        getLibraryFullPathInSiteDir,
        getLibraryFullPathInSiteDirWithClassName
    ];
    for (let getPathFunction of getPathFunctions) {
        let libraryPath = getPathFunction(modulePath, suite);
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
function getLibraryFullPathInCurrentDir(modulePath, suite) {
    let libraryRootPath = path.dirname(suite.source.path.replace('/', ''));
    // use for this issue:
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
function getLibraryFullPathInCurrentDirWithClassName(modulePath, suite) {
    // this function is work for this issue
    // library    dell.automation.modulename.classname
    // for this issue, we should not return dell/automation/modulename/classname.py 
    // rather than return dell/automation/modulename.py
    let actualModulePathList = modulePath.split('.').slice(0, -1);
    let actualModulePath = actualModulePathList.join('.');
    return getLibraryFullPathInCurrentDir(actualModulePath, suite);
}
function getLibraryFullPathInSiteDirWithClassName(modulePath, suite) {
    let actualModulePathList = modulePath.split('.').slice(0, -1);
    let actualModulePath = actualModulePathList.join('.');
    return getLibraryFullPathInSiteDir(actualModulePath, suite);
}
/*
 * return full path base on python site package directory
 * it doesn't check if the file existed
 */
function getLibraryFullPathInSiteDir(modulePath, suite) {
    let libraryRootPath = process.env.PY_SITE_PATH;
    return getLibraryFullPathForGivenRoot(libraryRootPath, modulePath);
}
function getLibraryFullPathForGivenRoot(rootPath, modulePath) {
    const PYTHON_EXT_NAME = ".py";
    // use for this issue
    // library    dell.automation.ca_common.test.py
    let libraryPath = modulePath.replace(/\.py/, '');
    libraryPath = libraryPath.replace(/\./g, path.sep);
    let sitePackageFullPath = path.join(rootPath, libraryPath) + PYTHON_EXT_NAME;
    return sitePackageFullPath;
}
function initializeVisitedSet() {
    visitedLibrarySet = new Set();
    visitedResourceSet = new Set();
}
exports.initializeVisitedSet = initializeVisitedSet;
//# sourceMappingURL=searchFunctions.js.map