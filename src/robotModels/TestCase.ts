import {Variable} from './Variable'

/**
 * Represent one TestCase in robotframework
 * and it's not the same as TestCase model in robotframework
 * it just leave the same name, and this TestCase doesn't include 
 * statements, it just used for goto variable definition
 */
export class TestCase {
    /**
     * Note for the startLine and endLine
     * it represent the TestCase body line range in TestSuite
     * and the range is include startLine, not include endLine, in math, it's [startLine, endLine)
     */
    private _startLine : number;
    private _endLine : number;

    // cause that ES don't support Set for define custom equal function
    // to indicate that two objects are equal, so I have to throw out
    // variable name to be the key of map, and map it to actual Variable Object
    private _variables : Map<string, Variable>;
    private _testname : string;

    public get startLine() : number { return this._startLine; }
    public set startLine(value : number) { this._startLine = value; }

    public get endLine() : number { return this._endLine; }
    public set endLine(value : number) { this._endLine = value; }

    public get variables() : Map<string, Variable> { return this._variables; }
    public set variables(value : Map<string, Variable>) { this._variables = value; }

    public get testname() : string { return this._testname; }
    public set testname(value : string) { this._testname = value; }
    
    public constructor() {
        this.variables = new Map<string, Variable>();
    }

    /**
     * judge if a specifiec variable is in the test case object
     * @param variableName the variable name that we want to search
     */
    private containsVariable(variableName : string) : boolean {
         return this.variables.has(variableName);
    }

    /**
     * get Variable object from the inner object, and we can use this object to get it's defined location
     * @param variableName the variable name that we want to get
     */
    public getVariable(variableName : string) : Variable {
         if (this.containsVariable(variableName)) {
             return this.variables.get(variableName);
         } else {
             return null;
         }
    }
}