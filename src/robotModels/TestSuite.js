"use strict";
/**
 * Simplify test suite model in robot framework
 */
var TestSuite = (function () {
    function TestSuite(sou) {
        if (sou === void 0) { sou = null; }
        this.libraryMetaDatas = [];
        this.resourceMetaDatas = [];
        this.keywords = [];
        this.variables = [];
        this.source = sou;
    }
    Object.defineProperty(TestSuite.prototype, "libraryMetaDatas", {
        get: function () { return this._libraryMetaDatas; },
        set: function (value) { this._libraryMetaDatas = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestSuite.prototype, "resourceMetaDatas", {
        get: function () { return this._resourceMetaDatas; },
        set: function (value) { this._resourceMetaDatas = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestSuite.prototype, "keywords", {
        get: function () { return this._keywords; },
        set: function (value) { this._keywords = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestSuite.prototype, "variables", {
        get: function () { return this._variables; },
        set: function (value) { this._variables = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TestSuite.prototype, "source", {
        get: function () { return this._source; },
        set: function (value) { this._source = value; },
        enumerable: true,
        configurable: true
    });
    return TestSuite;
}());
TestSuite.setting_table_names = ['Setting', 'Settings', 'Metadata'];
TestSuite.variable_table_names = ['Variable', 'Variables'];
TestSuite.testcase_table_names = ['Test Case', 'Test Cases'];
TestSuite.keyword_table_names = ['Keyword', 'Keywords', 'User Keyword', 'User Keywords'];
exports.TestSuite = TestSuite;
