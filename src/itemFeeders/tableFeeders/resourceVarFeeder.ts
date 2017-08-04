import { CompletionItem } from 'vscode';

import { TestSuite } from '../../robotModels/TestSuite';
import { TableFeeder } from './tableFeeder';

/**
 * feed variable which defined in suite's resource table
 */
export class ResourceVarFeeder implements TableFeeder
{
    feedItems(suite: TestSuite, items: CompletionItem[]): void {

    }
}