import { CompletionItem } from 'vscode';

import {VariableTableFeeder} from './variableTableFeeder';
import {ResourceFeeder} from './resourceFeeder';

/**
 * feed variable which defined in suite's resource table
 */
export class ResourceVarFeeder extends ResourceFeeder
{
    constructor() {
        super(new VariableTableFeeder());
    }
}
