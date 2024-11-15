import fs from 'fs'; // File system module for file operations
import path from 'path'; // Module for handling file paths
import { exec } from 'child_process';
import { mkdirp } from 'mkdirp'
import mongo from './structures/mongo';
import sequelize from './structures/sequelize';
import * as vscode from 'vscode';



export default function main(answers : Record<string, string>  ,options : boolean) {
    const projectPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');
    
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    const packageJson = { // Object to store the package.json data
        name: answers[ 'Package name'],
        version: answers['Version'],
        description: answers['Description'],
        main: answers['Entry point'],
        scripts: {
            start: `node ${answers['Entry point']}`,
            dev: `nodemon ${answers['Entry point']}`,
            test: answers['Test command']
        },
        repository: answers['Git repository'] ? { type: "git", url: answers['Git repository'] } : undefined,
        keywords: answers['Keywords'] ? answers['Keywords'].split(',').map(keyword => keyword.trim()) : [],
        author: answers['Author'],
        license: answers['License']
    };

    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2)); // Write the package.json file
    console.log("package.json file has been generated");
    let folders: string[];
    let files: any[];
    let cmd: string;
    // Determine which database setup to initialize based on user input
    if (options) {
        folders = sequelize.folders; // Folders from Sequelize configuration
        files = sequelize.files(answers['Entry point']); // Files from Sequelize configuration
        cmd = sequelize.cmd; // Command to execute from Sequelize configuration
    } else  {
        folders = mongo.folders; // Folders from MongoDB configuration
        files = mongo.files(answers['Entry point']); // Files from MongoDB configuration
        cmd = mongo.cmd; // Command to execute from MongoDB configuration
    }
    // Create directories as specified in folders array
    folders.forEach(folder => {
        mkdirp.sync(path.join(projectPath, folder)); // Create directory synchronously
        console.log(`Folder "${folder}" created successfully.`);
    });

    // Create files as specified in files array
    files.forEach(file => {
        const filePath = file.folder ? path.join(projectPath, file.folder, file.name) : path.join(projectPath, file.name);
        fs.writeFileSync(filePath, file.content); // Write file synchronously
        console.log(`File "${file.name}" created successfully.`);
    });

    // Execute command to install required packages
    console.log('Installing required packages...');
    exec(cmd, { cwd: projectPath }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error installing packages: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Packages installed successfully: ${stdout}`);
    }); // Close the readline interface
    return;
}
