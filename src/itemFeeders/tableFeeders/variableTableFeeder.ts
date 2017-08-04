import { CompletionItem, CompletionItemKind } from 'vscode';

import { TableFeeder } from './tableFeeder';
import { TestSuite } from '../../robotModels/TestSuite';
import { Variable } from '../../robotModels/Variable';

export class VariableTableFeeder implements TableFeeder
{
    /**
     * feed variable table in suite into items
     */
    feedItems(suite: TestSuite, items: CompletionItem[]): void
    {
        for (let variable of suite.variables) {
            let variableName = variable.name.replace(/\$\{|\&\{|\@\{/, "").replace("}", "");

            items.push(new CompletionItem(variableName, CompletionItemKind.Variable));
        }
    }
}