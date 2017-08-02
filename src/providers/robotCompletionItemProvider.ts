import {
    CompletionItemProvider, CompletionItem, TextDocument, Position, CancellationToken,
    CompletionItemKind
} from 'vscode';
import {
    buildFileToSuite
} from '../parsers/testCaseFileParser'
import {
    TestSuite
} from '../robotModels/TestSuite'
export class RobotCompletionItemProvider implements CompletionItemProvider {
    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken):Thenable<CompletionItem[]> {
        // provide completion for: user keyword input, user library function input, and variable input
        let suite : TestSuite = buildFileToSuite(document.uri.fsPath);
        
        // provide completion for user keyword

        // provide completion for user library function

        // provide completion for variable

        
        let b : CompletionItem[] = new Array<CompletionItem>();
        // usable completion item kind are:
        /// Variable, Function, Keywords, Text(for robot keyword)
        b.push(new CompletionItem('bccc', CompletionItemKind.Variable));
        b.push(new CompletionItem('baaa', CompletionItemKind.Constructor));
        b.push(new CompletionItem('cada', CompletionItemKind.Text));
        return new Promise<CompletionItem[]>((resolve, reject) => {
            resolve(b);
        });
    }
}