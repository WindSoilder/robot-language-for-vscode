import {TextDocument} from 'vscode';
import {TestSuite} from '../robotModels/TestSuite';
import {MetaData} from '../robotModels/MetaData';
import {Keyword} from '../robotModels/Keyword';

export class KeywordTablePopulator {
    // feed document's keyword table to suite, the content of document is begin with startLine
    // return the next line to search in the document
    // this static method need unit test
    static populate(lineContentList : string[], startLine : number, suite : TestSuite) : number 
    {
         let currentLineNumber : number = startLine;
         let lineCount : number = lineContentList.length;
         
         while (currentLineNumber < lineCount) {
             let currentLine : string = lineContentList[currentLineNumber];
             let endPattern : RegExp = new RegExp("\\*\\*\\*(.*)\\*\\*\\*");
             
             // match for keyword definition in keyword table
             // match for: keyword name
             let keywordPattern : RegExp = new RegExp("^(\\S+ )*(\\S+)$");

             if (currentLine.match(endPattern)) {
                 return currentLineNumber;
             } else {
                 let keywordMatch : RegExpMatchArray = currentLine.match(keywordPattern);
                 if (keywordMatch) {
                     let keyword : Keyword = new Keyword(currentLineNumber, keywordMatch[0]);
                     suite.keywords.push(keyword);
                 }
                 ++currentLineNumber;
             }
         } // end while(currentLineNumber < lineCount)
         return currentLineNumber;
    } 
};

