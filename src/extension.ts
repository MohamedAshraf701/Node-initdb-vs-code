import * as vscode from 'vscode';
import main from './main';
import moduleMain from './add-module';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('node-initdb.setupDatabase', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        const currentDirectoryName = workspaceFolders?.[0]?.name || '';
        // Define questions and default values
        const questions = [
            { prompt: 'Package name', defaultValue: currentDirectoryName, placeHolder: 'Enter package name' },
            { prompt: 'Version', defaultValue: '1.0.0', placeHolder: 'Enter version' },
            { prompt: 'Description', defaultValue: '', placeHolder: 'Enter description' },
            { prompt: 'Entry point', defaultValue: 'index.js', placeHolder: 'Enter entry point' },
            { prompt: 'Test command', defaultValue: 'echo "Error: no test specified" && exit 1', placeHolder: 'Enter test command' },
            { prompt: 'Git repository', defaultValue: '', placeHolder: 'Enter git repository' },
            { prompt: 'Keywords', defaultValue: '', placeHolder: 'Enter keywords' },
            { prompt: 'Author', defaultValue: '', placeHolder: 'Enter author' },
            { prompt: 'License', defaultValue: 'ISC', placeHolder: 'Enter license' }
        ];

        // Collect answers
        const answers: Record<string, string> = {};

        // Get workspace folder name for default package name


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

        // Step 2: Ask the user for the database type (Mongoose or Sequelize)
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
        main(answers, databaseChoice == "Sequelize" ? true : false)


        vscode.window.showInformationMessage(
            `Project Name: ${answers["Package name"]}\nDatabase Type: ${databaseChoice}`
        );

        // Additional logic for file generation can be added here
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
        } else {
            const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
            // Check for invalid characters
            if (invalidChars.test(moduleName)) {
                vscode.window.showErrorMessage("String contains invalid characters for a filename");
                return;
            }
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
        let data = moduleMain(capitalizedStr, databaseChoice == "Sequelize" ? true : false);
        vscode.env.clipboard.writeText(`
// Importing route
const Routes${capitalizedStr} = require("./Routes/${capitalizedStr}.Route");\n
// Registering route with API v1 router
apiV1Router.use("/${capitalizedStr}", Routes${capitalizedStr});`);
        vscode.window.showInformationMessage(`We’ve created routes for the ‘${capitalizedStr}’ and copied them to your clipboard. Just paste them into your index.js or app.js file.`);
    });
    context.subscriptions.push(disposable, addModuleCommand);

}

export function deactivate() { }
