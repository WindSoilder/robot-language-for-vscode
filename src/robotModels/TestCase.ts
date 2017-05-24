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
    private _startLine : Number;
    private _endLine : Number;
    private _variables : Set<Variable>;
    private _testname : string;

    public get startLine() : Number { return this._startLine; }
    public set startLine(value : Number) { this._startLine = value; }

    public get endLine() : Number { return this._endLine; }
    public set endLine(value : Number) { this._endLine = value; }

    public get variables() : Set<Variable> { return this._variables; }
    public set variables(value : Set<Variable>) { this._variables = value; }

    public get testname() : string { return this._testname; }
    public set testname(value : string) { this._testname = value; }
    
    public constructor() {
        this.variables = new Set<Variable>();
    }
}