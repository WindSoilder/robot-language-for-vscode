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
    public static feedItems(suite: TestSuite, items: CompletionItem[]): Thenable<void> {
        //return new ResourceKeywordFeeder().feedItems(suite, items);
        let promiseList: Thenable<void>[] = [];
        this.generatePromiseList(promiseList, suite, items);

        return new Promise<void>((resolve, reject) => {
            Promise.all(promiseList)
            .then(() => {
                resolve();
            });
        });

    }

    private static generatePromiseList(promiseList: Thenable<void>[],
                                       suite: TestSuite,
                                       items: CompletionItem[]): void
    {
        for (let feeder of this.subFeeders) {
            promiseList.push(feeder.feedItems(suite, items));
        }
    }
}
