import {Uri} from 'vscode';
import {Keyword} from './Keyword';
import {Variable} from './Variable';
import {TestCase} from './TestCase';
import {LibraryMetaData, ResourceMetaData} from './MetaData'; 

/**
 * Simplify test suite model in robot framework
 */
export class TestSuite {
    public static setting_table_names = ['Setting', 'Settings', 'Metadata']
    public static variable_table_names = ['Variable', 'Variables']
    public static testcase_table_names = ['Test Case', 'Test Cases']
    public static keyword_table_names = ['Keyword', 'Keywords', 'User Keyword', 'User Keywords']

    // represent library table in suite
    private _libraryMetaDatas : LibraryMetaData[];
    // represent resource table in suite
    private _resourceMetaDatas: ResourceMetaData[]; 
    // represent keyword table in suite
    private _keywords : Keyword[];
    // represent variable table in suite
    private _variables : Variable[];
    // represent test case table in suite
    // due to it's build process, we can assume that
    // these test cases are sorted by their startLine(or endLine)
    private _testCases : TestCase[];
    // represent source filename
    private _source : Uri;    

    public constructor(sou : Uri = null) {
        this.libraryMetaDatas = [];
        this.resourceMetaDatas = [];
        this.keywords = [];
        this.variables = [];
        this.testCases = [];
        this.source = sou;
    }

    get libraryMetaDatas() : LibraryMetaData[] { return this._libraryMetaDatas; }
    set libraryMetaDatas(value : LibraryMetaData[]) { this._libraryMetaDatas = value; }

    get resourceMetaDatas(): ResourceMetaData[] { return this._resourceMetaDatas; }
    set resourceMetaDatas(value : ResourceMetaData[]) { this._resourceMetaDatas = value; }

    get keywords() : Keyword[] { return this._keywords; }
    set keywords(value : Keyword[]) { this._keywords = value; }
    
    get variables() : Variable[] { return this._variables; }
    set variables(value : Variable[]) { this._variables = value; }
    
    get testCases() : TestCase[] { return this._testCases; }
    set testCases(value : TestCase[]) { this._testCases = value; }

    get source() : Uri { return this._source; }
    set source(value : Uri) { this._source = value; }

    /**
     * give specific line in the document, locate the actual test case in the suite object
     * @param cursorLine the line of document we used for locate test case index
     */
    public locateToTestCase(cursorLine : number) : TestCase {
        let currentTestIndex : number = this.locateToTestCaseIndex(cursorLine);

        return this.testCases[currentTestIndex];
    }

    /**
     * give specific line in the document, locate the index of test case in the suite object
     * @param cursorLine the line of document we used for locate test case index
     * @return -1 if search failed, or return the index of test case we can located for
     */
    public locateToTestCaseIndex(cursorLine : number) : number {
        function binarySearch(sortedNumber : number[]) : number {
            let max : number = sortedNumber.length;
            let min : number = 0;
            while (min < max) {
                let mid : number = (max - min) / 2;

            }
        }

        let sortedStartLine : number[] = this.testCases.map(function(tc : TestCase) {
            return tc.startLine;
        });
        let startLineEndLinePair : number[][] = this.testCases.map(function(tc : TestCase) {
            return [tc.startLine, tc.endLine];
        });

        let resultIndex : number = binarySearch(sortedStartLine);
        if (resultIndex != -1) {
            let startLine : number = startLineEndLinePair[resultIndex][0];
            let endLine : number = startLineEndLinePair[resultIndex][1];
            if (cursorLine >= startLine && cursorLine < endLine) {
                return resultIndex;
            } else {
                return -1;
            }
        }

    }
}
