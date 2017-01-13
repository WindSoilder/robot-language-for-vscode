'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {RobotDefinitionProvider} from './providers/robotDefinitionProvider';

const ROBOT_MODE: vscode.DocumentFilter = { language: 'robot', scheme: 'file'};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "keithstudy" is now active!');

    let definitionDispose = vscode.languages.registerDefinitionProvider(
        ROBOT_MODE, new RobotDefinitionProvider());
            
    context.subscriptions.push(definitionDispose);
}

// this method is called when your extension is deactivated
export function deactivate() {
}