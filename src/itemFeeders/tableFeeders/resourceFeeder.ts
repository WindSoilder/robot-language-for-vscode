import * as path from 'path';
import {CompletionItem} from 'vscode';

import {TestSuite} from '../../robotModels/TestSuite';
import {getResourcePath} from '../../parsers/util';
import {TableFeeder} from './tableFeeder';
import {buildFileToSuite} from '../../parsers/testCaseFileParser';

export abstract class ResourceFeeder implements TableFeeder
{
    private visitedSet: Set<string> = new Set<string>();
    private resourceWorker: TableFeeder = undefined;

    constructor(resourceWorker: TableFeeder) {
        this.resourceWorker = resourceWorker;
    }

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
                    let targetPath: string = getResourcePath(resource.dataValue,
                                                             currentPath);

                    if (this.visitedSet.has(targetPath)) {
                        continue;
                    }

                    buildFileToSuite(targetPath)
                    .then((resourceSuite) => {
                        if (null == resourceSuite) {
                           return;
                        }

                        this.visitedSet.add(targetPath);
                        this.resourceWorker.feedItems(resourceSuite, items)
                        .then(() => {
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