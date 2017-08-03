import * as fs from 'fs';

import {
    CompletionItemProvider, CompletionItem, TextDocument, Position, CancellationToken,
    CompletionItemKind
} from 'vscode';

import { buildFileToSuite, buildFileToSuiteSync } from '../parsers/testCaseFileParser';
import { TestSuite } from '../robotModels/TestSuite';
import { Searchable } from '../robotModels/Searchable';
/*
import { FunctionItemFeeder } from '../itemFeeders/functionItemFeeder';
import { KeywordItemFeeder } from '../itemFeeders/keywordItemFeeder';
import { VariableItemFeeder } from '../itemFeeders/variableItemFeeder';
*/

export class RobotCompletionItemProvider implements CompletionItemProvider {
    /**
     * Provide these proposals:
     * 1. function proposal(as function kind)
     * 2. variable proposal(as variable kind)
     * 3. robot framework keyword proposal(as text kind)
     * 4. robot inner keyword proposal(as keyword kind)
     */
    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionItem[]> {
        return new Promise<CompletionItem[]>((resolve, reject) => {
            buildFileToSuite(document.uri.fsPath).then((testSuite) => {
                let resultCompletionItem: CompletionItem[] = new Array<CompletionItem>();
/*
                if (this.shouldProvideVariable()) {
                    this.feedVariableItems(testSuite, resultCompletionItem, position.line);
                } else {
                    this.feedKeywordAndFunctionItems(testSuite, resultCompletionItem);
                }
                */
                resolve(resultCompletionItem);
            });
        });
    }
}