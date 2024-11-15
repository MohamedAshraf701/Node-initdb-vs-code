import module from "./structures/module";
import fs from 'fs'; // File system module for file operations
import path from 'path'; // Module for handling file paths
import { exec } from 'child_process';
import { mkdirp } from 'mkdirp';
import * as vscode from 'vscode';


export default function moduleMain(name: string, options: boolean) {
    const projectPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');

    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    module.folders.forEach(folder => {
        mkdirp.sync(path.join(projectPath, folder)); // Create directory synchronously
        console.log(`Folder "${folder}" created successfully.`);
    });
    let files;
    if (options) {
        files = module.sfiles(name);
    } else {
        files = module.mfiles(name);
    }
    files.forEach(file => {
        const filePath = file.folder ? path.join(projectPath, file.folder, file.name) : path.join(projectPath, file.name);
        fs.writeFileSync(filePath, file.content); // Write file synchronously
        console.log(`File "${file.name}" created successfully.`);
    });
    return `
Add This Code Into Your Project Main file 

// Importing route 
const Routes${name} = require("./Routes/${name}.Route");

// Registering route with API v1 router
apiV1Router.use("/${name}", Routes${name});
`;

}
