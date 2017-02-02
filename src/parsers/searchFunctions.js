"use strict";
var path = require("path");
var fs = require("fs");
var vscode_1 = require("vscode");
var testCaseFileParser_1 = require("./testCaseFileParser");
// these two set are use for get rid of infinite library or resource search
// Save all libraries absoluted path that we have visited
var visitedLibrarySet = new Set();
// Save all resources absoluted path that we have visited
var visitedResourceSet = new Set();
// Save all resources absoluted path that we have visited 
var varVisitedResourceSet = new Set();
/**
 * these three function here need Unit Test.
 */
function searchInKeywordTable(targetKeyword, suite) {
    // iterate keyword list, if found target keyword in keyword list
    // return the keyword's definition location, else return null
    for (var _i = 0, _a = suite.keywords; _i < _a.length; _i++) {
        var keyword = _a[_i];
        if (targetKeyword.toLowerCase() == keyword.name.toLowerCase()) {
            var loc = new vscode_1.Location(suite.source, new vscode_1.Position(keyword.position, 0));
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
    var targetFunc = targetKeyword.replace(/ /g, "_");
    // according to python search way
    // we will first search the library file in the file's current directory
    // and then search in site package directory
    for (var _i = 0, _a = suite.libraryMetaDatas; _i < _a.length; _i++) {
        var modulePath = _a[_i];
        var libraryFullPath = getLibraryFullPath(modulePath.dataValue, suite);
        // if the library is robot builtin, we can't catch it from file
        // and we will return continue to search next
        if (libraryFullPath == null) {
            continue;
        }
        if (visitedLibrarySet.has(libraryFullPath)) {
            continue;
        }
        // open file and search if the target keyword in the buffer     
        var fileContent = fs.readFileSync(libraryFullPath).toString();
        var searchPattern = new RegExp("def " + targetFunc + ".*", "i");
        var fileLines = fileContent.split("\r\n");
        var lineCount = 0;
        for (var _b = 0, fileLines_1 = fileLines; _b < fileLines_1.length; _b++) {
            var fileLine = fileLines_1[_b];
            var match = fileLine.match(searchPattern);
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
    var currentPath = sourceSuite.source.path.replace('/', '');
    currentPath = path.dirname(currentPath);
    // the filePath need to be compatible with different systems :(
    for (var _i = 0, _a = sourceSuite.resourceMetaDatas; _i < _a.length; _i++) {
        var resource = _a[_i];
        var targetPath = path.join(currentPath, resource.dataValue);
        console.log("in for loop in search in resource table:" + targetPath);
        if (visitedResourceSet.has(targetPath)) {
            continue;
        }
        var suite_1 = testCaseFileParser_1.buildFileToSuite(targetPath);
        if (null == suite_1) {
            continue; // continue to next suite
        }
        visitedResourceSet.add(targetPath);
        var location_1 = searchInKeywordTable(targetKeyword, suite_1);
        if (location_1) {
            return location_1;
        }
        else {
            location_1 = searchInLibraryTable(targetKeyword, suite_1);
            if (location_1)
                return location_1;
            else {
                location_1 = searchInResourceTable(targetKeyword, suite_1);
                if (location_1)
                    return location_1;
            }
        }
    } // end for (let resource of suite.resourceMetaDatas)
}
exports.searchInResourceTable = searchInResourceTable;
function searchVarInVariableTable(targetVariable, sourceSuite) {
    // iterate variable list, if found target variable in variable list
    // return the variable's definition location, else return null
    for (var _i = 0, _a = sourceSuite.variables; _i < _a.length; _i++) {
        var variable = _a[_i];
        if (targetVariable.toLowerCase() == variable.name.toLowerCase()) {
            var loc = new vscode_1.Location(sourceSuite.source, new vscode_1.Position(variable.position, 0));
            return loc;
        }
    }
    return null;
}
exports.searchVarInVariableTable = searchVarInVariableTable;
function searchVarInResourceTable(targetVariable, sourceSuite) {
    var currentPath = sourceSuite.source.path.replace('/', '');
    currentPath = path.dirname(currentPath);
    // the filePath need to be compatible with different systems :(
    for (var _i = 0, _a = sourceSuite.resourceMetaDatas; _i < _a.length; _i++) {
        var resource = _a[_i];
        var targetPath = path.join(currentPath, resource.dataValue);
        if (varVisitedResourceSet.has(targetPath)) {
            continue;
        }
        var suite_2 = testCaseFileParser_1.buildFileToSuite(targetPath);
        if (null == suite_2) {
            continue; // continue to next suite
        }
        visitedResourceSet.add(targetPath);
        var location_2 = searchVarInVariableTable(targetVariable, suite_2);
        if (location_2) {
            return location_2;
        }
        else {
            location_2 = searchInResourceTable(targetVariable, suite_2);
            if (location_2)
                return location_2;
        }
    } // end for (let resource of suite.resourceMetaDatas)
}
exports.searchVarInResourceTable = searchVarInResourceTable;
/**
 * get the library full path according to library meta data
 * if the library is not existed, return null
 */
function getLibraryFullPath(modulePath, suite) {
    // this function will get file from base dir, site package path and check if they are existed
    var getPathFunctions = [
        getLibraryFullPathInCurrentDir,
        getLibraryFullPathInCurrentDirWithClassName,
        getLibraryFullPathInSiteDir,
        getLibraryFullPathInSiteDirWithClassName
    ];
    for (var _i = 0, getPathFunctions_1 = getPathFunctions; _i < getPathFunctions_1.length; _i++) {
        var getPathFunction = getPathFunctions_1[_i];
        var libraryPath = getPathFunction(modulePath, suite);
        console.log("search in " + libraryPath);
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
    var libraryRootPath = path.dirname(suite.source.path.replace('/', ''));
    // use for this issue:
    // library    ../../testLibrary/testmodule.py
    // for this one, we should join from module path to root path earily, and change modulePath to emptystring
    if (modulePath.startsWith('.')) {
        console.log("library root path: " + libraryRootPath);
        console.log("base name of library root path: " + libraryRootPath);
        console.log("module path: " + modulePath);
        libraryRootPath = path.join(libraryRootPath, modulePath);
        console.log("after library root path: " + libraryRootPath);
        modulePath = '';
    }
    return getLibraryFullPathForGivenRoot(libraryRootPath, modulePath);
}
function getLibraryFullPathInCurrentDirWithClassName(modulePath, suite) {
    // this function is work for this issue
    // library    dell.automation.modulename.classname
    // for this issue, we should not return dell/automation/modulename/classname.py 
    // rather than return dell/automation/modulename.py
    var actualModulePathList = modulePath.split('.').slice(0, -1);
    var actualModulePath = actualModulePathList.join('.');
    return getLibraryFullPathInCurrentDir(actualModulePath, suite);
}
function getLibraryFullPathInSiteDirWithClassName(modulePath, suite) {
    var actualModulePathList = modulePath.split('.').slice(0, -1);
    var actualModulePath = actualModulePathList.join('.');
    return getLibraryFullPathInSiteDir(actualModulePath, suite);
}
/*
 * return full path base on python site package directory
 * it doesn't check if the file existed
 */
function getLibraryFullPathInSiteDir(modulePath, suite) {
    var libraryRootPath = process.env.PY_SITE_PATH;
    return getLibraryFullPathForGivenRoot(libraryRootPath, modulePath);
}
function getLibraryFullPathForGivenRoot(rootPath, modulePath) {
    var PYTHON_EXT_NAME = ".py";
    // use for this issue
    // library    dell.automation.ca_common.test.py
    var libraryPath = modulePath.replace(/\.py/, '');
    libraryPath = libraryPath.replace(/\./g, path.sep);
    var sitePackageFullPath = path.join(rootPath, libraryPath) + PYTHON_EXT_NAME;
    return sitePackageFullPath;
}
function initializeVisitedSet() {
    visitedLibrarySet = new Set();
    visitedResourceSet = new Set();
}
exports.initializeVisitedSet = initializeVisitedSet;
function initializeVarVisitedSet() {
    varVisitedResourceSet = new Set();
}
exports.initializeVarVisitedSet = initializeVarVisitedSet;
