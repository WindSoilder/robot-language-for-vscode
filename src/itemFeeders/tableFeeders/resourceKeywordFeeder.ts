import * as path from 'path';
import {CompletionItem} from 'vscode';

import {TestSuite} from '../../robotModels/TestSuite';
import {TableFeeder} from './tableFeeder';
import {buildFileToSuiteSync} from '../../parsers/testCaseFileParser';
import {KeywordTableFeeder} from './keywordTableFeeder';

/**
 * feed keyword which defined in suite's resource table
 * Note that if feed suite data to result items,
 * please invoke clearVisitedSet around feedItems method
 * e.g:
 *     let feeder: ResourceKeywordFeeder = new ResourceKeywordFeeder()
 *     feeder.feedItems(suite, items)
 */
export class ResourceKeywordFeeder implements TableFeeder
{
    private visitedSet: Set<string> = new Set<string>();

    feedItems(suite: TestSuite, items: CompletionItem[]): void {
        this.clearVisitedSet();
        this.feedDataToItems(suite, items);
        this.clearVisitedSet();
    }

    feedDataToItems(suite: TestSuite, items: CompletionItem[]): void {
        let currentPath: string = suite.source.fsPath;
        currentPath = path.dirname(currentPath);

        for (let resource of suite.resourceMetaDatas) {
            let targetPath: string = null;
            if (path.isAbsolute(resource.dataValue)) {
                targetPath = resource.dataValue;
            } else {
                targetPath = path.join(currentPath, resource.dataValue);
            }

            if (this.visitedSet.has(targetPath)) {
                continue;
            }

            let resourceSuite: TestSuite = buildFileToSuiteSync(targetPath);

            if (null == suite) {
                continue;
            }

            this.visitedSet.add(targetPath);

            let keywordTableFeeder: KeywordTableFeeder = new KeywordTableFeeder();
            keywordTableFeeder.feedItems(resourceSuite, items);
            this.feedDataToItems(resourceSuite, items);
        }
    }

    private clearVisitedSet(): void {
        this.visitedSet.clear();
    }
}
