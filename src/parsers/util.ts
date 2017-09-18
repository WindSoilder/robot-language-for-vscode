/**
 * provide util functions for some operations
 */
import * as path from 'path';
import * as fs from 'fs';
import {TestSuite} from '../robotModels/TestSuite';

/**
 * get the actual resource path through one resource metadata value
 * @param resourceVal the value of resource metadata from suite
 * @param suitePath the file path of suite
 */
export function getResourcePath(resourceVal: string,
                                suitePath: string): string
{
    if (path.isAbsolute(resourceVal)) {
        return resourceVal;        
    } else {
        return path.join(suitePath, resourceVal);
    }
}

/**
 * get the library full path according to library meta data
 * if the library is not existed, return null
 */
export function getLibraryFullPathSync(modulePath: string, suite: TestSuite): string {
    // this function will get file from base dir, site package path and check if they are existed
    let getPathFunctions: Function[] = [
        getLibraryFullPathInCurrentDir,
        getLibraryFullPathInCurrentDirWithClassName,
        getLibraryFullPathInSiteDir,
        getLibraryFullPathInSiteDirWithClassName 
    ];

    for (let getPathFunction of getPathFunctions) {
        let libraryPath: string = getPathFunction(modulePath, suite);
        console.log(`search in ${libraryPath}`);
        if (fs.existsSync(libraryPath)) {
            return libraryPath;
        }
    }
    return null;
}

export function getLibraryFullPath(modulePath: string, suite: TestSuite): Thenable<string> {
    let getPathFunctions: Function[] = [
        getLibraryFullPathInCurrentDir,
        getLibraryFullPathInCurrentDirWithClassName,
        getLibraryFullPathInSiteDir,
        getLibraryFullPathInSiteDirWithClassName
    ];

    return new Promise<string>((resolve, reject) => {
        for (let getPathFunction of getPathFunctions) {
            let libraryPath: string = getPathFunction(modulePath, suite);
            console.log(`search in ${libraryPath}`);
            fs.exists(libraryPath, (exists) => {
                if (exists) {
                    resolve(libraryPath);
                }
            });
        }
        reject(`check for module ${modulePath} runs failed`);
    });
}

/*
 * return full path base on the suite's current directory
 * it doesn't check if the file existed
 */
function getLibraryFullPathInCurrentDir(modulePath: string, suite: TestSuite): string {
   let libraryRootPath: string = path.dirname(suite.source.fsPath);

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

function getLibraryFullPathInCurrentDirWithClassName(modulePath: string, suite: TestSuite): string {
   // this function is work for this scenario
   // library    dell.automation.modulename.classname
   // for this scenario, we should return dell/automation/modulename.py
   // rather than return dell/automation/modulename/classname.py
   let actualModulePathList: string[] = modulePath.split('.').slice(0, -1);
   let actualModulePath: string = actualModulePathList.join('.');

   return getLibraryFullPathInCurrentDir(actualModulePath, suite);
}

function getLibraryFullPathInSiteDirWithClassName(modulePath: string, suite: TestSuite): string {
   let actualModulePathList: string[] = modulePath.split('.').slice(0, -1);
   let actualModulePath: string = actualModulePathList.join('.');

   return getLibraryFullPathInSiteDir(actualModulePath, suite);
}
/*
 * return full path base on python site package directory
 * it doesn't check if the file existed
 */
function getLibraryFullPathInSiteDir(modulePath: string, suite: TestSuite): string {
   let libraryRootPath: string = process.env.PY_SITE_PATH;
   return getLibraryFullPathForGivenRoot(libraryRootPath, modulePath);
}

function getLibraryFullPathForGivenRoot(rootPath: string, modulePath: string): string {
    const PYTHON_EXT_NAME = ".py";

    // use for this issue
    // library    dell.automation.ca_common.test.py
    let libraryPath: string = modulePath.replace(/\.py/, '');
    libraryPath = libraryPath.replace(/\./g, path.sep);
    let sitePackageFullPath: string = path.join(rootPath, libraryPath) + PYTHON_EXT_NAME;

    return sitePackageFullPath;
}
