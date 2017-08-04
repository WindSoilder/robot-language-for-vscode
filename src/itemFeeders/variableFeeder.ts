import { CompletionItem } from 'vscode';

import { TestSuite } from '../robotModels/TestSuite';
import { TableFeeder } from './tableFeeders/tableFeeder';
import { VariableTableFeeder } from './tableFeeders/variableTableFeeder';
import { ResourceVarFeeder } from './tableFeeders/resourceVarFeeder';
import { LocalVariableFeeder } from './localVariableFeeder';

export class VariableFeeder
{
    private static tableFeeders: TableFeeder[] = [
        new VariableTableFeeder(),
        new ResourceVarFeeder()
    ];
    private static localVarFeeder = new LocalVariableFeeder();

    /**
     * feed all reachable variable to items
     */
    public static feedItems(suite: TestSuite, line: number, items: CompletionItem[]): void {
        for (let feeder of this.tableFeeders) {
            feeder.feedItems(suite, items);
        }
        this.localVarFeeder.feedItems(suite, line, items);
    }
}
