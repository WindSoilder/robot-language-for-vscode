import { CompletionItem } from 'vscode';

import { TestSuite } from '../../robotModels/TestSuite';
import { TableFeeder } from './tableFeeder';

/**
 * feed keyword which defined in suite's resource table
 */
export class ResourceKeywordFeeder implements TableFeeder
{
    feedItems(suite: TestSuite, items: CompletionItem[]): void {

    }
}
