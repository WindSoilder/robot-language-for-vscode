import { CompletionItem, CompletionItemKind } from 'vscode';

import { TableFeeder } from './tableFeeder';
import { PyModule } from '../../robotModels/PyModule';
import {TestSuite} from '../../robotModels/TestSuite';
import {parseMetaDataToLib} from '../../parsers/testCaseFileParser';


export class LibraryMetaTableFeeder implements TableFeeder
{
    /**
     * feed library metadata in suite into items
     */
    feedItems(suite: TestSuite, items: CompletionItem[]): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => {
            for (let libMetaData of suite.libraryMetaDatas) {
                parseMetaDataToLib(libMetaData.dataValue, suite)
                .then((pyLib: PyModule) => {
                    for (let func of pyLib.functions) {
                        items.push(new CompletionItem(func.name, CompletionItemKind.Function));
                    }
                });
            }
            resolve();
        });
    }
}
