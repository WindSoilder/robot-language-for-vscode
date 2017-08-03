import {TestSuite} from '../robotModels/TestSuite';
import {Variable} from '../robotModels/Variable';

export class VariableTablePopulator {
    // feed document's variable table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    static populate(lineContentList: string[], startLine: number, suite: TestSuite): number
    {
        let currentLineNumber: number = startLine;
        let lineCount: number = lineContentList.length;

         while (currentLineNumber < lineCount) {
             let currentLine: string = lineContentList[currentLineNumber];
             let endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            
             // match for keyword definition in variable table
             // ${variable}    value
             // @{listVariable}    value1    value2
             // &{dictVariable}    name=1    age=3
             let variablePattern = /^((\$|@|\&)\{.+\})(\t{1,}|\s{2,})(.*)/i;
             if (currentLine.match(endPattern)) {
                 return currentLineNumber;
             } else {
                 let variableMatch = currentLine.match(variablePattern);
                 if (variableMatch) {
                     let v: Variable = new Variable(currentLineNumber, variableMatch[1]);
                     suite.variables.push(v);
                 } // end if (metaDataMatch)
             } // end else
             ++currentLineNumber;
         } // end while(currentLineNumber < lineCount)
         return currentLineNumber;        
    }
}