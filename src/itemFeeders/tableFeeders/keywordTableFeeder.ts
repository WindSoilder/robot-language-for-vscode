import { CompletionItem, CompletionItemKind } from 'vscode';

import { TableFeeder } from './tableFeeder';
import { TestSuite } from '../../robotModels/TestSuite';
import { Keyword } from '../../robotModels/Keyword';

export class KeywordTableFeeder implements TableFeeder
{
    /**
     * feed keyword table in suite to items
     */
    feedItems(suite: TestSuite, items: CompletionItem[]): void
    {
        for (let keyword of suite.keywords) {
            items.push(new CompletionItem(keyword.name, CompletionItemKind.Function));
        }
    }
}