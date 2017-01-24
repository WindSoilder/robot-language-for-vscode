import {Uri} from 'vscode';
import {Keyword} from './Keyword';
import {Variable} from './Variable';
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
    // represent source filename
    private _source : Uri;    

    public constructor(sou : Uri = null) {
        this.libraryMetaDatas = [];
        this.resourceMetaDatas = [];
        this.keywords = [];
        this.variables = [];
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
    
    get source() : Uri { return this._source; }
    set source(value : Uri) { this._source = value; }
}