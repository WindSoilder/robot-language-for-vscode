import { CompletionItem, CompletionItemKind } from 'vscode';

import { TestSuite } from '../robotModels/TestSuite';
import { Variable } from '../robotModels/Variable';

export class LocalVariableFeeder
{
    /**
     * feed variable table in suite into items
     */
    feedItems(suite: TestSuite, line: number, items: CompletionItem[]): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
}
