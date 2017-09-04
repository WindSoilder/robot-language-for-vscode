import * as fs from 'fs';

import {
    CompletionItemProvider, CompletionItem, TextDocument, Position, CancellationToken,
    CompletionItemKind
} from 'vscode';

import { buildFileToSuite, buildFileToSuiteSync } from '../parsers/testCaseFileParser';
import { TestSuite } from '../robotModels/TestSuite';
import { Searchable } from '../robotModels/Searchable';
import { NonVariableFeeder } from '../itemFeeders/nonVariableFeeder';
import { VariableFeeder } from '../itemFeeders/variableFeeder';

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

                if (this.shouldProvideVariable(document, position)) {
                    this.feedVariableItems(testSuite, position.line, resultCompletionItem)
                    .then(() => {
                        resolve(resultCompletionItem);
                    });
                } else {
                    this.feedNonVariableItems(testSuite, resultCompletionItem)
                    .then(() => {
                        resolve(resultCompletionItem);
                    });
                }
            });
        });
    }

    /**
     * judge for if we should provide variable or others
     */
    private shouldProvideVariable(document: TextDocument, position: Position): boolean {
        let currentLine: string = document.lineAt(position.line).text;
        let column = position.character - 1;
        return column != 0 &&
               currentLine[column - 1] == '{';
    }

    /**
     * feed variables in suite into items
     * @param suite the source of TestSuite to provide
     * @param line the line number in the document, it can used to indicate whether we need local variable
     * @param items result items to feed
     */
    private feedVariableItems(suite: TestSuite, line: number, items: CompletionItem[]): Thenable<void>
    {
        return VariableFeeder.feedItems(suite, line, items);
    }

    /**
     * feed robot keyword and function into items
     * @param suite the source of TestSuite to provide
     * @param items result items to feed
     */
    private feedNonVariableItems(suite: TestSuite, items: CompletionItem[]): Thenable<void> {
        return NonVariableFeeder.feedItems(suite, items);
    }
}
