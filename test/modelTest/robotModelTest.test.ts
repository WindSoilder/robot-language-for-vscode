// test for robot model
// including tests for robot keywords, robot test suite, robot metadata
import * as assert from 'assert';
import * as vscode from 'vscode';

import {Keyword} from '../../src/robotModels/Keyword';
import {TestSuite} from '../../src/robotModels/TestSuite';
import {MetaData, LibraryMetaData, ResourceMetaData} from '../../src/robotModels/MetaData';

// mainly assert that models in robotframework have some property
suite("Robot Model Tests", () => {

    test("Keyword Test", () => {
        let testKeywordName : string = "a keyword";
        let testLineNumber : number = 3;
        let kw : Keyword = new Keyword(testLineNumber, testKeywordName);
        assert(kw.name == testKeywordName, "the keyword name does not match what it given!");
        assert(kw.position == testLineNumber, "the position of keyword does not match what it had given!");
    });

    test("TestSuite Table Name Test", () => {
        // test if the table names in class TestSuite match robot test table name.
        let setting_table_names_in_robot : string[] = ['Setting', 'Settings', 'Metadata'];
        let variable_table_names_in_robot : string[] = ['Variable', 'Variables'];
        let testcase_table_names_in_robot : string[] = ['Test Case', 'Test Cases'];
        let keyword_table_names_in_robot : string[] = ['Keyword', 'Keywords', 'User Keyword', 'User Keywords'];

        assert(TestSuite.setting_table_names.sort().toString() == setting_table_names_in_robot.sort().toString());
        assert(TestSuite.variable_table_names.sort().toString() == variable_table_names_in_robot.sort().toString());
        assert(TestSuite.testcase_table_names.sort().toString() == testcase_table_names_in_robot.sort().toString());
        assert(TestSuite.keyword_table_names.sort().toString() == keyword_table_names_in_robot.sort().toString());
    });
    
    test("TestSuite Test", () => {
        // omit model TestSuite test;        
    });

    test("MetaData Test", () => {
        // LibraryMetaData and ResourceMetaData test
        let test_data_type : string = "library";
        let test_data_value : string = "test.library";

        let libraryMetaData : LibraryMetaData = new LibraryMetaData(test_data_type, test_data_value);
        assert(libraryMetaData.dataType == test_data_type);
        assert(libraryMetaData.dataValue == test_data_value);

        test_data_type = "resource";
        let resourceMetaData : ResourceMetaData = new ResourceMetaData(test_data_type, test_data_value);
        assert(resourceMetaData.dataType == test_data_type);
        assert(resourceMetaData.dataValue == test_data_value);
    });
}); 