import addModule from "./structures/module-add";
import fs from 'fs'; // File system module for file operations
import path from 'path'; // Module for handling file paths
import { mkdirp } from 'mkdirp';
import * as vscode from 'vscode';


export default function moduleMain(name: string, options: boolean) {
    const projectPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');

    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    addModule.folders.forEach(folder => {
        mkdirp.sync(path.join(projectPath, folder)); // Create directory synchronously
        console.log(`Folder "${folder}" created successfully.`);
    });
    let files;
    if (options) {
        files = addModule.sfiles(name);
    } else {
        files = addModule.mfiles(name);
    }
    files.forEach(file => {
        const filePath = file.folder ? path.join(projectPath, file.folder, file.name) : path.join(projectPath, file.name);
        fs.writeFileSync(filePath, file.content); // Write file synchronously
        console.log(`File "${file.name}" created successfully.`);
    });
    return `





`;

}
