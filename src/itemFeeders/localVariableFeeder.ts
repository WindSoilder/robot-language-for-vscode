import { CompletionItem, CompletionItemKind } from 'vscode';

import { TestSuite } from '../robotModels/TestSuite';
import { TestCase } from '../robotModels/TestCase';
import { Variable } from '../robotModels/Variable';

export class LocalVariableFeeder
{
    /**
     * feed variable table in suite into items
     */
    feedItems(suite: TestSuite, line: number, items: CompletionItem[]): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => {
            let currentTestCase: TestCase = suite.locateToTestCase(line);

            if (currentTestCase) {
                for (let variableName of currentTestCase.variables.keys()) {
                    variableName = variableName.replace(/\$\{|\&\{|\@\{/, "")
                                   .replace("}", "");
                    items.push(new CompletionItem(variableName,
                                                  CompletionItemKind.Variable));
                }
            }
            resolve();
        });
    }
}
