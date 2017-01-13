"use strict";
// test for robot model
// including tests for robot keywords, robot test suite, robot metadata
const assert = require("assert");
const Keyword_1 = require("../../src/robotModels/Keyword");
const TestSuite_1 = require("../../src/robotModels/TestSuite");
const MetaData_1 = require("../../src/robotModels/MetaData");
// mainly assert that models in robotframework have some property
suite("Robot Model Tests", () => {
    test("Keyword Test", () => {
        let testKeywordName = "a keyword";
        let testLineNumber = 3;
        let kw = new Keyword_1.Keyword(testLineNumber, testKeywordName);
        assert(kw.name == testKeywordName, "the keyword name does not match what it given!");
        assert(kw.position == testLineNumber, "the position of keyword does not match what it had given!");
    });
    test("TestSuite Table Name Test", () => {
        // test if the table names in class TestSuite match robot test table name.
        let setting_table_names_in_robot = ['Setting', 'Settings', 'Metadata'];
        let variable_table_names_in_robot = ['Variable', 'Variables'];
        let testcase_table_names_in_robot = ['Test Case', 'Test Cases'];
        let keyword_table_names_in_robot = ['Keyword', 'Keywords', 'User Keyword', 'User Keywords'];
        assert(TestSuite_1.TestSuite.setting_table_names.sort().toString() == setting_table_names_in_robot.sort().toString());
        assert(TestSuite_1.TestSuite.variable_table_names.sort().toString() == variable_table_names_in_robot.sort().toString());
        assert(TestSuite_1.TestSuite.testcase_table_names.sort().toString() == testcase_table_names_in_robot.sort().toString());
        assert(TestSuite_1.TestSuite.keyword_table_names.sort().toString() == keyword_table_names_in_robot.sort().toString());
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
//# sourceMappingURL=robotModelTest.test.js.map