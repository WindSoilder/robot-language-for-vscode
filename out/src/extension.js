'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const robotDefinitionProvider_1 = require("./providers/robotDefinitionProvider");
const ROBOT_MODE = { language: 'robot', scheme: 'file' };
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "keithstudy" is now active!');
    let definitionDispose = vscode.languages.registerDefinitionProvider(ROBOT_MODE, new robotDefinitionProvider_1.RobotDefinitionProvider());
    context.subscriptions.push(definitionDispose);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map