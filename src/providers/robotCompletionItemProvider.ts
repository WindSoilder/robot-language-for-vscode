import {
    CompletionItemProvider, CompletionItem, TextDocument, Position, CancellationToken,
 } from 'vscode';

export class RobotCompletionItemProvider implements CompletionItemProvider {
    public provideCompletionItems(
        // provide completion for: user keyword input, user library function input
        // and variable input

        document: TextDocument, position: Position, token: CancellationToken):
        Thenable<CompletionItem[]> {
        let b : CompletionItem[] = new Array<CompletionItem>();
        let a : CompletionItem = new CompletionItem('abcdefg');
        b.push(a);
        return new Promise<CompletionItem[]>((resolve, reject) => {
            resolve(b);
        });
    }
}