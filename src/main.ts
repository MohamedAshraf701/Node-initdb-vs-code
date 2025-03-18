import fs from 'fs'; // File system module for file operations
import path from 'path'; // Module for handling file paths
import { exec } from 'child_process';
import { mkdirp } from 'mkdirp';
import * as vscode from 'vscode';

export default function main(answers: Record<string, string>, Database: boolean, Language: boolean, Framework: any, PackageManager: any) {
    const projectPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');

    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
    }
    const packageJson = { // Object to store the package.json data
        name: answers['Package name'],
        version: answers['Version'],
        description: answers['Description'],
        main: answers['Entry point'],
        scripts: {
            start: PackageManager === "bun" ? `bun run --watch ${answers['Entry point']}` : `node ${answers['Entry point']} `,
            dev: PackageManager === "bun" ? `bun run --watch ${answers['Entry point']}` : `nodemon ${answers['Entry point']} `,
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
    let Mongo;
    let Seque;

    if (Framework === "Fastify") {
        if (Language) {
            Mongo = require("./structures/TS/fastify/mongo-fastify");
            Seque = require("./structures/TS/fastify/sequelize-fastify");
        } else {
            Mongo = require("./structures/JS/fastify/mongo-fastify");
            Seque = require("./structures/JS/fastify/sequelize-fastify");
        }
    } else if (Framework === "Elysia") {
        if (Language) {
            Mongo = require("./structures/TS/elysia/mongo-elysia");
            Seque = require("./structures/TS/elysia/sequelize-elysia");
        } else {
            Mongo = require("./structures/JS/elysia/mongo-elysia");
            Seque = require("./structures/JS/elysia/sequelize-elysia");
        }
    }
    else {
        if (Language) {
            Mongo = require("./structures/TS/express/mongo-express");
            Seque = require("./structures/TS/express/sequelize-express");
        } else {
            Mongo = require("./structures/JS/express/mongo-express");
            Seque = require("./structures/JS/express/sequelize-express");
        }
    }

    // Fix for modules that export via default (so that Mongo.files is available)
    if (Mongo && typeof Mongo.files !== "function" && Mongo.default && typeof Mongo.default.files === "function") {
        Mongo = Mongo.default;
    }
    if (Seque && typeof Seque.files !== "function" && Seque.default && typeof Seque.default.files === "function") {
        Seque = Seque.default;
    }
    // Determine which database setup to initialize based on user input
    if (Database) {
        folders = Seque.folders; // Folders from Sequelize configuration
        files = Seque.files(answers['Entry point']); // Files from Sequelize configuration
        cmd = Seque.cmd; // Command to execute from Sequelize configuration
    } else {
        folders = Mongo.folders; // Folders from MongoDB configuration
        files = Mongo.files(answers['Entry point']); // Files from MongoDB configuration
        cmd = Mongo.cmd; // Command to execute from MongoDB configuration
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
    exec(`${PackageManager === "npm" ? "npm install " + cmd : PackageManager === "yarn" ? "yarn add " + cmd : PackageManager === "pnpm" ? "pnpm add " + cmd : "bun add " + cmd}`, { cwd: projectPath }, (error, stdout, stderr) => {
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
