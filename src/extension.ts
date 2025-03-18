import * as vscode from 'vscode';
import main from './main';
import moduleMain from './add-module';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('node-initdb.setupDatabase', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const currentDirectoryName = workspaceFolders?.[0]?.name || '';

        // Ask user for language choice
        const languageChoice = await vscode.window.showQuickPick(
            ['JavaScript', 'TypeScript'],
            { placeHolder: 'Select the programming language' }
        );
        if (!languageChoice) {
            vscode.window.showErrorMessage('You must select a programming language!');
            return;
        }

        // Ask user for database choice
        const databaseChoice = await vscode.window.showQuickPick(
            ['Mongoose', 'Sequelize'],
            { placeHolder: 'Select the database you want to use' }
        );
        if (!databaseChoice) {
            vscode.window.showErrorMessage('You must select a database type!');
            return;
        }

        // Ask user for web framework choice
        const frameworkChoice = await vscode.window.showQuickPick(
            ['Express', 'Fastify', 'Elysia'],
            { placeHolder: 'Select the web framework' }
        );
        if (!frameworkChoice) {
            vscode.window.showErrorMessage('You must select a web framework!');
            return;
        }

        // Ask user for Package Manager choice
        const PackageManager = await vscode.window.showQuickPick(
            ['npm', 'bun', 'yarn', 'pnpm'],
            { placeHolder: 'Select the Package Manager' }
        );
        if (!PackageManager) {
            vscode.window.showErrorMessage('You must select a Package Manager!');
            return;
        }

        let rootFilename = languageChoice === "JavaScript" ? "index.js" : "index.ts";

        // Define questions and default values
        const questions = [
            { prompt: 'Package name', defaultValue: currentDirectoryName, placeHolder: 'Enter package name' },
            { prompt: 'Version', defaultValue: '1.0.0', placeHolder: 'Enter version' },
            { prompt: 'Description', defaultValue: '', placeHolder: 'Enter description' },
            { prompt: 'Entry point', defaultValue: rootFilename, placeHolder: 'Enter entry point' },
            { prompt: 'Test command', defaultValue: 'echo "Error: no test specified" && exit 1', placeHolder: 'Enter test command' },
            { prompt: 'Git repository', defaultValue: '', placeHolder: 'Enter git repository' },
            { prompt: 'Keywords', defaultValue: '', placeHolder: 'Enter keywords' },
            { prompt: 'Author', defaultValue: '', placeHolder: 'Enter author' },
            { prompt: 'License', defaultValue: 'ISC', placeHolder: 'Enter license' }
        ];

        // Collect answers
        const answers: Record<string, string> = {};

        // Ask each question
        for (const question of questions) {
            // Special case for package name to use workspace folder name as default

            const defaultValue = question.prompt === 'Package name' ? currentDirectoryName : question.defaultValue;

            const answer = await vscode.window.showInputBox({
                prompt: question.prompt,
                placeHolder: question.placeHolder,
                value: defaultValue
            });

            // If user skips (presses Enter), use default value
            answers[question.prompt] = answer || defaultValue;
        }

        // main(answers, databaseChoice == "Sequelize" ? true : false)
        main(answers, databaseChoice === "Sequelize", languageChoice === "TypeScript", frameworkChoice, PackageManager);

        vscode.window.showInformationMessage(
            // `Project Name: ${answers["Package name"]}\nDatabase Type: ${databaseChoice}`
            `Project Name: ${answers["Package name"]}\nLanguage: ${languageChoice}\nFramework: ${frameworkChoice}\nDatabase: ${databaseChoice}`
        );
    });

    // Register "addModule" command
    let addModuleCommand = vscode.commands.registerCommand('node-initdb.addModule', async () => {
        const moduleName = await vscode.window.showInputBox({
            prompt: 'Enter the module name',
            placeHolder: 'Enter the name of the module you want to add'
        });

        if (!moduleName) {
            vscode.window.showErrorMessage('Module name cannot be empty!');
            return;
        }
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
        if (invalidChars.test(moduleName)) {
            vscode.window.showErrorMessage("Module name contains invalid characters!");
            return;
        }
        // else {
        //     const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
        //     // Check for invalid characters
        //     if (invalidChars.test(moduleName)) {
        //         vscode.window.showErrorMessage("String contains invalid characters for a filename");
        //         return;
        //     }
        // }

        // Ask user for language choice
        const languageChoice = await vscode.window.showQuickPick(
            ['JavaScript', 'TypeScript'],
            { placeHolder: 'Select the programming language' }
        );
        if (!languageChoice) {
            vscode.window.showErrorMessage('You must select a programming language!');
            return;
        }

        // Ask user for web framework choice
        const frameworkChoice = await vscode.window.showQuickPick(
            ['Express', 'Fastify', 'Elysia'],
            { placeHolder: 'Select the web framework' }
        );
        if (!frameworkChoice) {
            vscode.window.showErrorMessage('You must select a web framework!');
            return;
        }

        const databaseChoice = await vscode.window.showQuickPick(
            ['Mongoose', 'Sequelize'],
            {
                placeHolder: 'Select the database you want to use',
            }
        );
        if (!databaseChoice) {
            vscode.window.showErrorMessage('You must select a database type!');
            return;
        }

        const capitalizedStr = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
        // let data = moduleMain(capitalizedStr, databaseChoice == "Sequelize" ? true : false);
        let data = moduleMain(capitalizedStr, databaseChoice === "Sequelize", languageChoice === "TypeScript", frameworkChoice);

        if (frameworkChoice === "Fastify") {
            if (languageChoice === "JavaScript") {
                vscode.env.clipboard.writeText(`
                    // Importing route
                    const Routes${capitalizedStr} = require("./Routes/${capitalizedStr}.Route");\n
                    // Registering route with API v1 router
                    fastify.register(Routes${capitalizedStr},{prefix : "/api/v1/${capitalizedStr}"}
            `);
            } else{
                vscode.env.clipboard.writeText(`
                    // Importing route
                    import Routes${capitalizedStr} from './Routes/${capitalizedStr}.Route";\n
                    // Registering route with API v1 router
                    server.register(Routes${capitalizedStr} ,{prefix : "/api/v1/${capitalizedStr}"});
            `);
            }
        }
        else if (frameworkChoice === "Elysia") {
            if (languageChoice === "JavaScript") {
                vscode.env.clipboard.writeText(`
                    // Importing route
                    import { ${capitalizedStr}Routes } from "./Routes/${capitalizedStr}.Route.js");\n
                    // Registering route with API v1 router
                    .group("/api/v1/${capitalizedStr}", (app) => ${capitalizedStr}Routes(app))
            `);
            } else{
                vscode.env.clipboard.writeText(`
                    // Importing route
                    import { ${capitalizedStr}Routes } from './Routes/${capitalizedStr}.Route";\n
                    // Registering route with API v1 router
                    .group("/api/v1/${capitalizedStr}", (app: any) => ${capitalizedStr}Routes(app))
            `);
            }
        }
        else {
            if (languageChoice === "JavaScript") {
                vscode.env.clipboard.writeText(`
                    // Importing route
                    const Routes${capitalizedStr} = require("./Routes/${capitalizedStr}.Route");\n
                    // Registering route with API v1 router
                    apiV1Router.use("/${capitalizedStr}", Routes${capitalizedStr});
            `);
            } else{
                vscode.env.clipboard.writeText(`
                    // Importing route
                    import Router${capitalizedStr} from './Routes/${capitalizedStr}.Route";\n
                    // Registering route with API v1 router
                    apiV1Router.use("/${capitalizedStr}", Router${capitalizedStr});
            `);
            }
        }

        vscode.window.showInformationMessage(`We’ve created routes for the ‘${capitalizedStr}’ and copied them to your clipboard. Just paste them into your index or app file.`);
    });

    context.subscriptions.push(disposable, addModuleCommand);
}

export function deactivate() { }
