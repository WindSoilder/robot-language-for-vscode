import {TestSuite} from '../robotModels/TestSuite';
import {TestCase} from '../robotModels/TestCase';
import {Variable} from '../robotModels/Variable';

export class TestCaseTablePopulator {
     // feed document's test case table to suite, the content of document is begin with startLine
     // return the next line to search in the document
     // this static method need unit test
     static populate(lineContentList: string[], startLine: number, suite: TestSuite): number
     {
         let currentLineNumber: number = startLine;
         let lineCount: number = lineContentList.length;
         let endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
         // match for the test case name
         let testCaseNamePattern: RegExp = /^(\S+).*/i;

         while (currentLineNumber < lineCount) {
             let currentLine: string = lineContentList[currentLineNumber];

             if (currentLine.match(endPattern)) {
                 return currentLineNumber;
             } else if (currentLine.match(testCaseNamePattern)) {
                 let tc: TestCase = new TestCase();
                 currentLineNumber = TestCaseTablePopulator.populateLocalVarToTestCase(lineContentList, currentLineNumber, tc);
                 suite.testCases.push(tc);                 
             } else {
                 // may meet empty line between test case
                 ++currentLineNumber;
             }
         }
         return currentLineNumber;
     }

     // feed documents local variables, startline and endline to TestCase
     // return the next line to search in the document
     // and it should only be used by TestCaseTablePopulator.populate
     // the startLine is the first line of TestCase body(with test case name)
     static populateLocalVarToTestCase(lineContentList: string[], startLine: number, testCase: TestCase): number 
     {
          let currentLineNumber: number = startLine;  
          let lineCount: number = lineContentList.length;

          testCase.startLine = currentLineNumber;
          testCase.testname = lineContentList[currentLineNumber];
          ++currentLineNumber;

          // match for function return value in test case table like
          //     ${variable} =     this is a func    ${arg1}
          let retVarPattern = /^(\t{1,}|\s{2,})(\$\{.+\})\s{0,1}=(\t{1,}|\s{2,})(\S+ )*(\S+ )/i;
          // match for body in test case
          // it's started with 2 or spaces or 1 or more tabs
          //     this is a keyword    ${arg}
          let testCaseBodyPattern = /^(\t{1,}|\s{2,}).*/i;

          while (currentLineNumber < lineCount &&
                 lineContentList[currentLineNumber].match(testCaseBodyPattern)) {
              let varAssignMatch = lineContentList[currentLineNumber].match(retVarPattern);
              if (varAssignMatch) {
                  let variableName: string = varAssignMatch[2];
                  let v: Variable = new Variable(currentLineNumber, variableName);
                  testCase.variables.set(variableName, v);
              }
              ++currentLineNumber;
          }
          testCase.endLine = currentLineNumber;
          return currentLineNumber;
     }
}
