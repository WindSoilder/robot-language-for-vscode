import { CompletionItem } from 'vscode';

import { TestSuite } from '../../robotModels/TestSuite';

/**
 * This interface class provide method for feed something in suite into items
 */
export interface TableFeeder
{
    /**
     * feed something in suite into result items
     */
    feedItems(suite: TestSuite, items: CompletionItem[]): Thenable<void>
}
