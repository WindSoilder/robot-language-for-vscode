"use strict";
// test for robot model
// including robot keyword, robot test suite, robot metadata
const assert = require("assert");
const Keyword_1 = require("../../src/robotModels/Keyword");
const TestSuite_1 = require("../../src/robotModels/TestSuite");
const MetaData_1 = require("../../src/robotModels/MetaData");
// Defines a Mocha test suite to group tests of similar kind together
// mainly assert that models in robotframework have some property
suite("Robot Model Tests", () => {
    // Defines a Mocha unit test
    test("Keyword Test", () => {
        let testKeywordName = "a keyword";
        let testLineNumber = 3;
        let kw = new Keyword_1.Keyword(testLineNumber, testKeywordName);
        assert(kw.name == testKeywordName, "the keyword name does not match what it given!");
        assert(kw.position == testLineNumber, "the position of keyword does not match what it had given!");
    });
    test("TestSuite Table Name Test", () => {
        let setting_table_names_in_robot = ['Setting', 'Settings', 'Metadata'];
        let variable_table_names_in_robot = ['Variable', 'Variables'];
        let testcase_table_names_in_robot = ['Test Case', 'Test Cases'];
        let keyword_table_names_in_robot = ['Keyword', 'Keywords', 'User Keyword', 'User Keywords'];
        assert(TestSuite_1.TestSuite.setting_table_names == setting_table_names_in_robot);
        assert(TestSuite_1.TestSuite.variable_table_names == variable_table_names_in_robot);
        assert(TestSuite_1.TestSuite.testcase_table_names == testcase_table_names_in_robot);
        assert(TestSuite_1.TestSuite.keyword_table_names == keyword_table_names_in_robot);
    });
    test("TestSuite Test", () => {
        // omit model TestSuite test;        
    });
    test("MetaData Test", () => {
        // LibraryMetaData and ResourceMetaData test
        let test_data_type = "library";
        let test_data_value = "test.library";
        let libraryMetaData = new MetaData_1.LibraryMetaData(test_data_type, test_data_value);
        assert(libraryMetaData.dataType == test_data_type);
        assert(libraryMetaData.dataValue == test_data_value);
        test_data_type = "resource";
        let resourceMetaData = new MetaData_1.ResourceMetaData(test_data_type, test_data_value);
        assert(resourceMetaData.dataType == test_data_type);
        assert(resourceMetaData.dataValue == test_data_value);
    });
});
//# sourceMappingURL=robotModelTest.js.map