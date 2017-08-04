import { CompletionItem } from 'vscode';

import { TableFeeder } from './tableFeeders/tableFeeder';
import { TestSuite } from '../robotModels/TestSuite';
import { KeywordTableFeeder } from './tableFeeders/keywordTableFeeder';
import { ResourceKeywordFeeder } from './tableFeeders/resourceKeywordFeeder';
import { LibraryMetaTableFeeder } from './tableFeeders/libraryMetaTableFeeder';

export class NonVariableFeeder
{
    private static subFeeders: TableFeeder[] = [
        new KeywordTableFeeder(),
        new ResourceKeywordFeeder(),
        new LibraryMetaTableFeeder()
    ];

    /**
     * feed all reachable non-variable to items
     */
    public static feedItems(suite: TestSuite, items: CompletionItem[]): void {
        for (let feeder of this.subFeeders) {
            feeder.feedItems(suite, items);
        }
    }
}