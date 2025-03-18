import fs from 'fs'; // File system module for file operations
import path from 'path'; // Module for handling file paths
import { mkdirp } from 'mkdirp';
import * as vscode from 'vscode';
import * as addModuleTF from './structures/TS/fastify/module-fastify';
import * as addModuleJF from './structures/JS/fastify/module-fastify';
import * as addModuleTE from './structures/TS/express/module-express';
import * as addModuleJE from './structures/JS/express/module-express';
import * as addModuleTEL from './structures/TS/elysia/module-elysia';
import * as addModuleJEL from './structures/JS/elysia/module-elysia';

export default async function moduleMain(name: string, Database: boolean, Language: boolean, Framework: any) {
  const projectPath = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');

  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
  }

  let folder;
  let sfile;
  let mfile;

  console.log(addModuleTF);

  if (Framework === "Fastify") {
    if (Language) {
      folder = addModuleTF.default.folders;
      sfile = addModuleTF.default.sfiles;
      mfile = addModuleTF.default.mfiles;
    } else {
      folder = addModuleJF.default.folders;
      sfile = addModuleJF.default.sfiles;
      mfile = addModuleJF.default.mfiles;
    }
  }
  else if (Framework === "Elysia") {
    if (Language) {
      folder = addModuleTEL.default.folders;
      sfile = addModuleTEL.default.sfiles;
      mfile = addModuleTEL.default.mfiles;
    } else {
      folder = addModuleJEL.default.folders;
      sfile = addModuleJEL.default.sfiles;
      mfile = addModuleJEL.default.mfiles;
    }
  }
  else {
    if (Language) {
      folder = addModuleTE.default.folders;
      sfile = addModuleTE.default.sfiles;
      mfile = addModuleTE.default.mfiles;
    } else {
      folder = addModuleJE.default.folders;
      sfile = addModuleJE.default.sfiles;
      mfile = addModuleJE.default.mfiles;
    }
  }

  // Check if folder is defined and an array
  if (!folder || !Array.isArray(folder)) {
    vscode.window.showErrorMessage(`Module configuration error: 'folders' is not defined properly.`);
    return;
  }

  folder.forEach((folderItem: any) => {
    mkdirp.sync(path.join(projectPath, folderItem)); // Create directory synchronously
    console.log(`Folder "${folderItem}" created successfully.`);
  });

  let files;
  if (Database) {
    files = sfile(name);
  } else {
    files = mfile(name);
  }

  // Check if files is defined and is an array
  if (!files || !Array.isArray(files)) {
    vscode.window.showErrorMessage("Module configuration error: 'files' is not defined properly.");
    return;
  }

  files.forEach((file: any) => {
    const filePath = file.folder ? path.join(projectPath, file.folder, file.name) : path.join(projectPath, file.name);
    fs.writeFileSync(filePath, file.content); // Write file synchronously
    console.log(`File "${file.name}" created successfully.`);
  });

  return `\nModule ${name} has been created successfully.\n`;

}

// try {
//     // Dynamically import the module (must be inside an async function)
//     const addModule = await import(modulePath);
// console.log(addModule);

//     const folders = addModule.folders || [];
//     let sfile = addModule.sfiles(name);
//     let mfile = addModule.mfiles(name);

//     if (!Array.isArray(folders)) {
//       vscode.window.showErrorMessage("Module configuration error: 'folders' is not defined properly.");
//       return;
//     }

//     // Create directories specified in the folders array
//     folders.forEach((folderItem: string) => {
//       mkdirp.sync(path.join(projectPath, folderItem));
//       console.log(`Folder "${folderItem}" created successfully.`);
//     });

//     // Get the file configuration based on the Database flag.
//     let files;
//     if (Database) {
//       files = sfile;
//     } else {
//       files = mfile;
//     }

//     if (!Array.isArray(files)) {
//       vscode.window.showErrorMessage("Module configuration error: 'files' is not defined properly.");
//       return;
//     }

//     // Write each file from the configuration.
//     files.forEach((file: any) => {
//       const filePath = file.folder
//         ? path.join(projectPath, file.folder, file.name)
//         : path.join(projectPath, file.name);
//       fs.writeFileSync(filePath, file.content);
//       console.log(`File "${file.name}" created successfully.`);
//     });

//     return `\nModule ${name} has been created successfully.\n`;

//   } catch (error: any) {
//     vscode.window.showErrorMessage(`Error importing module: ${error.message}`);
//     console.error(`Error importing module: ${error.message}`);
//     return;
//   }
// }