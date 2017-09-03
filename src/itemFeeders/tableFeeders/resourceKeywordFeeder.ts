import * as path from 'path';
import {CompletionItem} from 'vscode';

import {KeywordTableFeeder} from './keywordTableFeeder';
import {ResourceFeeder} from './resourceFeeder';

/**
 * feed keyword which defined in suite's resource table
 * Note that if feed suite data to result items,
 * please invoke clearVisitedSet around feedItems method
 * e.g:
 *     let feeder: ResourceKeywordFeeder = new ResourceKeywordFeeder()
 *     feeder.feedItems(suite, items)
 */
export class ResourceKeywordFeeder extends ResourceFeeder
{
    constructor() {
        super(new KeywordTableFeeder());
    }
}
