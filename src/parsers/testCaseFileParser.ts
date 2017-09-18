import * as fs from 'fs';
import * as path from 'path';
import {TextDocument, Uri} from 'vscode';
import {TestSuite} from '../robotModels/TestSuite';
import {PyModule} from '../robotModels/PyModule';
import {PyFunction} from '../robotModels/PyFunction';
import {getLibraryFullPath} from './util';
import {FunctionPopulator} from '../populators/pyLibPopulators/functionPopulator';
import {KeywordTablePopulator} from '../populators/keywordTablePopulator';
import {SettingTablePopulator} from '../populators/settingTablePopulator';
import {TestCaseTablePopulator} from '../populators/testcaseTablePopulator';
import {VariableTablePopulator} from '../populators/variableTablePopulator';


/**
 * build file to TestSuite object sync
 * @param filePath the path to build
 * @return TestSuite object, which contains useful information
 */
export function buildFileToSuiteSync(filePath: string): TestSuite {
    // if the file is not existed, we should not open it.  And let user know that
    if (!fs.existsSync(filePath)) {
        return null;
    }

    let fileContent: string = fs.readFileSync(filePath).toString();
    let targetSuite: TestSuite = new TestSuite(Uri.file(filePath));
    if (feedContentIntoSuite(fileContent, targetSuite)) {
        return targetSuite;
    }
    else {
        return null;
    }
}


function getPopulatorThroughHeader(header: string)
{
    if (-1 != TestSuite.keyword_table_names.indexOf(header)) {
        return KeywordTablePopulator;
    } else if (-1 != TestSuite.setting_table_names.indexOf(header)) {
        return SettingTablePopulator;
    } else if (-1 != TestSuite.variable_table_names.indexOf(header)) {
        return VariableTablePopulator;
    } else if(-1 != TestSuite.testcase_table_names.indexOf(header)) {
        return TestCaseTablePopulator;
    } else {
        // the header name is illegal, so parse should failed.
        return null;
    }
}


/**
 * this function need Unit Test
 */
export function buildFileToSuite(filePath: string): Thenable<TestSuite> {
    return new Promise<TestSuite>((resolve, reject) => {
        // if the file is not existed, we should not open it.  And let user know that
        fs.exists(filePath, (exists) => {
            if (exists) {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        reject("error in read file");
                    } else {
                        let fileContent: string = data.toString();
                        let targetSuite: TestSuite = new TestSuite(Uri.file(filePath));
                        feedContentIntoSuite(fileContent, targetSuite);
                        resolve(targetSuite);
                    }
                });
            }
        });
    });
}


/**
 * feed content of file into suite
 * @param fileContent content of file in string
 * @param suite the target suite to feed
 * @return true for feed success, false for feed failure, it may caused by the illegal header input
 */
function feedContentIntoSuite(fileContent: string, suite: TestSuite): boolean
{
    // in windows, lines is split by \r\n, but in linux, it's split by \n
    // so use a regex to match both \r, \n, \r\n
    let lineContentList: string[] = fileContent.split(/\r?\n/);
    let lineCount: number = lineContentList.length;
    let currentLineNumber: number = 0;

    while (currentLineNumber < lineCount) {
        let currentLine: string = lineContentList[currentLineNumber];
        let match = currentLine.match("\\*\\*\\*(.*)\\*\\*\\*");

        if (match) {
            let header: string = match[1].trim();

            // if the header is leagal table
            // then feed the header to target suite
            let populatorClass = getPopulatorThroughHeader(header);
            if (populatorClass) {
                ++currentLineNumber;
                currentLineNumber = populatorClass.populate(lineContentList, currentLineNumber, suite);
            } else {
                return null;
            }
        } // end if (match)
        else {
            ++currentLineNumber;
        }
    }
    return true;
}


/**
 * parse the meta data to python module object
 * @param metaValue the value which existed in robot file
 * @return python module object
 */
export function parseMetaDataToLib(metaValue: string,
    suite: TestSuite): Thenable<PyModule>
{
    let pyModule: PyModule = new PyModule();
    return new Promise<PyModule>((resolve, reject) => {
        getLibraryFullPath(metaValue, suite)
        .then((libPath: string) => {
            fs.readFile(libPath, (err, data) => {
                if (err) {
                    reject(`file for ${metaValue} is not existed`);
                } else {
                    let fileContentList: string[] = data.toString().split(/\r?\n/);
                    if (shouldProvideTopLevelFunction(libPath, metaValue)) {
                        FunctionPopulator.populate(fileContentList, pyModule);
                    } else {
                        let className: string = splitOutClassName(metaValue);
                        FunctionPopulator.populatePartial(fileContentList, pyModule, className);
                    }
                }
            });
        });
    });
}


/**
 * check if the metaValue indicate a python module(for it can also indicate a class in module too)
 * @param libPath the absolute path of a module (it's something like A/b/c/d.py)
 * @param metaValue the value which is defined in test suite, (it's something like A.b.c.d)
 * @return True if the metaValue indicate a python module, else return false
 */
function shouldProvideTopLevelFunction(libPath: string, metaValue: string): boolean
{
    // 1. check if the metaValue ends with .py
    if (metaValue.endsWith('.py')) {
        return true;
    } else {
        // 2. check if the metaValue's final part(split by .)
        //    is equal to the libPath's final part(split by file separator)
        let finalPartOfMeta: string = metaValue.split('.')[-1] + '.py';
        let fileName: string = path.basename(libPath);
        return finalPartOfMeta == fileName;
    }
}

/**
 * return class name from metaValue
 * The invoker have to ensure that the metaValue is valid
 * and it indicate to a class
 * e.g:
 *     splitOutClassName(package.module.ClassA) => ClassA
 * @param metaValue the value which indicate the library path
 */
function splitOutClassName(metaValue: string): string
{
    return metaValue.split('.')[-1];
}
