import {TextDocument} from 'vscode';
import {TestSuite} from '../robotModels/TestSuite';
import {MetaData} from '../robotModels/MetaData';

export class SettingTablePopulator {
     // feed document's setting table to suite, the content of document is begin with startLine
     // return the next line to search in the document
     // this static method need unit test
     static populate(lineContentList: string[], startLine: number, suite: TestSuite): number
     {
         let currentLineNumber: number = startLine;
         let lineCount: number = lineContentList.length;
         
         while (currentLineNumber < lineCount) {
             let currentLine: string = lineContentList[currentLineNumber];
             let endPattern = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
            
             // match for meta data definition in setting table
             // library    librayrname
             let metaDataPattern = /^(library|resource)(\t{1,}|\s{2,})(.*)/i;

             if (currentLine.match(endPattern)) {
                 return currentLineNumber;
             } else {
                 let metaDataMatch = currentLine.match(metaDataPattern);
                 if (metaDataMatch) {
                     let metaDataType: string = metaDataMatch[1];
                     let metaDataValue: string = metaDataMatch[3];
                     let metaData: MetaData = new MetaData(metaDataType, metaDataValue);
                     
                     if (metaDataType.toLowerCase() == "library") {
                        suite.libraryMetaDatas.push(metaData); 
                     } else if (metaDataType.toLowerCase() == "resource") {
                        suite.resourceMetaDatas.push(metaData);                         
                     }
                 } // end if (metaDataMatch)
             } // end else
             ++currentLineNumber;
         } // end while(currentLineNumber < lineCount)
         return currentLineNumber;
     }
}