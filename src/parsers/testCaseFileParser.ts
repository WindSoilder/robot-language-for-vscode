import * as fs from 'fs';
import {TextDocument, Uri} from 'vscode';
import {TestSuite} from '../robotModels/TestSuite';
import {KeywordTablePopulator} from '../populators/keywordTablePopulator';
import {SettingTablePopulator} from '../populators/settingTablePopulator';
import {TestCaseTablePopulator} from '../populators/testcaseTablePopulator';
import {VariableTablePopulator} from '../populators/variableTablePopulator';

/**
 * build file to TestSuite object sync
 * @param filePath the path to build
 * @return TestSuite object, which contains useful information
 */
export function buildFileToSuiteSync(filePath : string) : TestSuite {
    // if the file is not existed, we should not open it.  And let user know that
    if (!fs.existsSync(filePath)) {
        return null;
    }

    let fileContent : string = fs.readFileSync(filePath).toString();
    let targetSuite : TestSuite = new TestSuite(Uri.file(filePath));
    if (feedContentIntoSuite(fileContent, targetSuite)) {
        return targetSuite;
    }
    else {
        return null;
    }
}

function getPopulatorThroughHeader(header : string)
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
export function buildFileToSuite(filePath : string) : Thenable<TestSuite> {
    return new Promise<TestSuite>((resolve, reject) => {
        // if the file is not existed, we should not open it.  And let user know that
        fs.exists(filePath, (exists) => {
            if (exists) {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        reject("error in read file");
                    } else {
                        let fileContent : string = data.toString();
                        let targetSuite : TestSuite = new TestSuite(Uri.file(filePath));
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
function feedContentIntoSuite(fileContent : string, suite : TestSuite) : boolean
{
    // in windows, lines is split by \r\n, but in linux, it's split by \n
    // so use a regex to match both \r, \n, \r\n
    let lineContentList : string[] = fileContent.split(/\r?\n/);
    let lineCount : number = lineContentList.length;
    let currentLineNumber : number = 0;

    while (currentLineNumber < lineCount) {
        let currentLine : string = lineContentList[currentLineNumber];
        let match = currentLine.match("\\*\\*\\*(.*)\\*\\*\\*");

        if (match) {
            let header : string = match[1].trim();

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