import {TestSuite} from '../../src/robotModels/TestSuite';
import {buildFileToSuiteSync} from '../../src/parsers/testCaseFileParser';
import * as path from 'path';

export function getSuiteFromFileName(fileName: string): TestSuite {
     // build suite from giving file name, assume the base path of filename is 
     // the file's base directory
     let filePath = testFileAbsPath(fileName);
     return buildFileToSuiteSync(filePath);
}

export function testFileAbsPath(fileName: string): string {
    // return test file absolute path according fileName
    // assume that all file is in the file's base directory
    // and should return out/test/parserTest/robotTestFiles/${fileName}
    let testCaseFileBaseDir: string = path.join(__dirname, "..", "..", "..", "test","robotTestFiles");     
    let filePath: string = path.join(testCaseFileBaseDir, fileName);
    return filePath;     
}