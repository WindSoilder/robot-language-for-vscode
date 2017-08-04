import { CompletionItem, CompletionItemKind } from 'vscode';

import { TableFeeder } from './tableFeeder';
import { TestSuite } from '../../robotModels/TestSuite';
import { Variable } from '../../robotModels/Variable';

export class LibraryMetaTableFeeder implements TableFeeder
{
    /**
     * feed library metadata in suite into items
     */
    feedItems(suite: TestSuite, items: CompletionItem[]): void
    {

    }
}