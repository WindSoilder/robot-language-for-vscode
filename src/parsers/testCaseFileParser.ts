import * as fs from 'fs';
import {TextDocument, Uri} from 'vscode';
import {TestSuite} from '../robotModels/TestSuite';
import {KeywordTablePopulator} from '../populators/keywordTablePopulator';
import {SettingTablePopulator} from '../populators/settingTablePopulator';
import {TestCaseTablePopulator} from '../populators/testcaseTablePopulator';
import {VariableTablePopulator} from '../populators/variableTablePopulator';

/**
 * this function need Unit Test
 */
export function buildFileToSuite(filePath : string) : TestSuite {
    // if the file is not existed, we should not open it.  And let user know that
    if (!fs.existsSync(filePath)) {
        return null;
    }

    let fileContent : string = fs.readFileSync(filePath).toString();
    // in windows, lines is split by \r\n, but in linux, it's split by \n
    // so use a regex to match both \r, \n, \r\n
    let lineContentList : string[] = fileContent.split(/\r?\n/);
    let lineCount : number = lineContentList.length;
    let currentLineNumber : number = 0;
    let targetSuite : TestSuite = new TestSuite(Uri.file(filePath));

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
                currentLineNumber = populatorClass.populate(lineContentList, currentLineNumber, targetSuite);
            } else {
                return null;
            }
        } // end if (match)
        else {
           ++currentLineNumber;
        }
    }
    return targetSuite;
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
