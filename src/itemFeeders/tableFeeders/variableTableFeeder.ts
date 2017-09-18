import { CompletionItem, CompletionItemKind } from 'vscode';

import { TableFeeder } from './tableFeeder';
import { TestSuite } from '../../robotModels/TestSuite';
import { Variable } from '../../robotModels/Variable';

export class VariableTableFeeder implements TableFeeder
{
    /**
     * feed variable table in suite into items
     */
    feedItems(suite: TestSuite, items: CompletionItem[]): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => {
            for (let variable of suite.variables) {
                // beacuase the provider is only ask when
                // user typing a word, and special characters will be removed
                // so remove the special character in variable name
                let variableName = variable.name.replace(/\$\{|\&\{|\@\{/, "").replace("}", "");

                items.push(new CompletionItem(variableName, CompletionItemKind.Variable));
            }
            resolve();
        });
    }
}
