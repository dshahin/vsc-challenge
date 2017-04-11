'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Markov from "./markov-maker";

let markov = new Markov();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "goodbye-world" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        var selection = editor.selection;
        var input = editor.document.getText(selection);

        // Display a message box to the user
        if(input.length){
            var output =  markov.make_sentence(input);

            console.log(output);
            output = "\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + output + "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n";
            applyEdit (editor, selection, output);
        }
        
    });

    context.subscriptions.push(disposable);

}

function positionFactory(line, char) {
    return new vscode.Position(line, char);
}

function rangeFactory(start, end) {
    return new vscode.Range(start, end);
}
function textEditFactory(range, content) {
    return new vscode.TextEdit(range, content);
}
function getDocument (vsEditor) {
    return typeof vsEditor._documentData !== 'undefined' ? vsEditor._documentData : vsEditor._document
}

function editFactory (coords, content){
    var start = positionFactory(coords.start.line, coords.start.char);
    var end = positionFactory(coords.end.line +1, 0);
    var range = rangeFactory(end, end);
    
    return textEditFactory(range, content);
}

function workspaceEditFactory() {
    return new vscode.WorkspaceEdit();
}

function setEditFactory(uri, coords, content) {
    var workspaceEdit = workspaceEditFactory();
    var edit = editFactory(coords, content);

    workspaceEdit.set(uri, [edit]);
    return workspaceEdit;
}

function applyEdit (vsEditor, coords, content){
    var vsDocument = getDocument(vsEditor);
    var edit = setEditFactory(vsDocument._uri, coords, content);
    vscode.workspace.applyEdit(edit);
}

// this method is called when your extension is deactivated
export function deactivate() {
}