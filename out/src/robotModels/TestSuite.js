"use strict";
/**
 * Simplify test suite model in robot framework
 */
class TestSuite {
    constructor(sou = null) {
        this.libraryMetaDatas = [];
        this.resourceMetaDatas = [];
        this.keywords = [];
        this.variables = [];
        this.source = sou;
    }
    get libraryMetaDatas() { return this._libraryMetaDatas; }
    set libraryMetaDatas(value) { this._libraryMetaDatas = value; }
    get resourceMetaDatas() { return this._resourceMetaDatas; }
    set resourceMetaDatas(value) { this._resourceMetaDatas = value; }
    get keywords() { return this._keywords; }
    set keywords(value) { this._keywords = value; }
    get variables() { return this._variables; }
    set variables(value) { this._variables = value; }
    get source() { return this._source; }
    set source(value) { this._source = value; }
}
TestSuite.setting_table_names = ['Setting', 'Settings', 'Metadata'];
TestSuite.variable_table_names = ['Variable', 'Variables'];
TestSuite.testcase_table_names = ['Test Case', 'Test Cases'];
TestSuite.keyword_table_names = ['Keyword', 'Keywords', 'User Keyword', 'User Keywords'];
exports.TestSuite = TestSuite;
//# sourceMappingURL=TestSuite.js.map