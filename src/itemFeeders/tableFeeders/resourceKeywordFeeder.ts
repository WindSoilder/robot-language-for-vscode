import * as path from 'path';
import {CompletionItem} from 'vscode';

import {TestSuite} from '../../robotModels/TestSuite';
import {TableFeeder} from './tableFeeder';
import {buildFileToSuiteSync, buildFileToSuite} from '../../parsers/testCaseFileParser';
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

    feedItems(suite: TestSuite, items: CompletionItem[]): Thenable<void> {
        return new Promise<void>((resolve, reject) => {
            this.clearVisitedSet();
            return this.feedDataToItems(suite, items).then(() => {
                this.clearVisitedSet();
                resolve();
            });
        });
    }

    feedDataToItems(suite: TestSuite, items: CompletionItem[]): Thenable<void> {
        let currentPath: string = suite.source.fsPath;
        currentPath = path.dirname(currentPath);

        return new Promise<void>((resolve, reject) => {
            if (suite.resourceMetaDatas.length > 0) {
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

                    buildFileToSuite(targetPath).
                    then((resourceSuite) => {
                        if (null == resourceSuite) {
                           return;
                        }

                        this.visitedSet.add(targetPath);
                        let keywordTableFeeder: KeywordTableFeeder = new KeywordTableFeeder();
                        keywordTableFeeder.feedItems(resourceSuite, items).
                        then(() => {
                            return this.feedDataToItems(resourceSuite, items)
                                   .then(() => {
                                     resolve();
                            });
                        });
                    });
                }
            }
            else {
                resolve();
            }
        });
    }

    private clearVisitedSet(): void {
        this.visitedSet.clear();
    }
}
