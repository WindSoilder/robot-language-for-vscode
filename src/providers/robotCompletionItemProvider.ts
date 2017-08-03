import * as fs from 'fs';

import {
    CompletionItemProvider, CompletionItem, TextDocument, Position, CancellationToken,
    CompletionItemKind
} from 'vscode';

import { buildFileToSuite, buildFileToSuiteSync } from '../parsers/testCaseFileParser';
import { TestSuite } from '../robotModels/TestSuite';
/*
import { FunctionItemFeeder } from '../itemFeeders/functionItemFeeder';
import { KeywordItemFeeder } from '../itemFeeders/keywordItemFeeder';
import { VariableItemFeeder } from '../itemFeeders/variableItemFeeder';
*/
export class RobotCompletionItemProvider implements CompletionItemProvider {
    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken):Thenable<CompletionItem[]> {
        return new Promise<CompletionItem[]>((resolve, reject) => {
            let buildPromise : Thenable<TestSuite> = buildFileToSuite(document.uri.fsPath);

            buildPromise.then((testSuite) => {
                // do something to the test suite object
                let resultCompletionItem : CompletionItem[] = new Array<CompletionItem>();
                resultCompletionItem.push(new CompletionItem("abcd"));
                resultCompletionItem.push(new CompletionItem("abcgqgeqe"));
                this.feedRobotCompletionItems(testSuite, resultCompletionItem);
                resolve(resultCompletionItem);
            });
        });
        /*
        buildFileToSuite(document.uri.fsPath).then()

        // provide completion for: user keyword input, user library function input, and variable input
        let suite : TestSuite = buildFileToSuiteSync(document.uri.fsPath);
        let resultCompletionItem : CompletionItem[] = new Array<CompletionItem>();

        // provide completion for user keyword
        //feedRobotCompletionItems(suite, resultCompletionItem);
        // provide completion for user library function

        // provide completion for variable, for variable, should also provide the variable defined in the current test case
        return new Promise<CompletionItem[]>((resolve, reject) => {

        }).then();
        */
    }

    /**
     * feed all items to the given resultItems
     * @param suite The source suite to feed
     * @param resultItems Where these completion items result feed to
     */
    public feedRobotCompletionItems(suite: TestSuite, resultItems: CompletionItem[]) : void {
        //feedSuiteIntoItems(suite, resultItems);
        
        // travel through suite's setting table, get it's resource file and library file
        // and then feed these files into result items
        for (let resource of suite.resourceMetaDatas) {
            //get resource path, build it, and feed the file's into it
        }
    }

    private feedSuiteIntoItems
}