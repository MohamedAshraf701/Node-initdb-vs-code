# node-initdb

node-initdb is a CLI tool for initializing database configurations and structures in Node.js projects.

![Node InitDB Plugin Demo](https://github.com/MohamedAshraf701/node-cli/blob/main/example.gif)

## Installation

You can install node-initdb globally using npm:

```bash
npm install -g node-initdb
```

## Usage

To use node-initdb, navigate to your project directory and run one of the following commands based on your database choice:

-	`-m`/`--mongo`: Add MongoDB configuration and files for the module.
-	`-s`/`--seque`: Add Sequelize configuration and files for the module.
-	`-y`/`--yes`: Skip interactive prompts and use default values for module creation.

### Initialize Sequelize Structure

To set up Sequelize with default folders, files, and install necessary packages:

```bash
node-initdb --seque
```

```bash
node-initdb -s
```

### Initialize MongoDB Structure

To set up MongoDB with default folders, files, and install necessary packages:

```bash
node-initdb --mongo 
```

```bash
node-initdb -m
```

### Add Module Task

To add a new module using `node-add`, run the following command:

```bash
node-add <moduleName> [-m / --mongo] [-s / --seque]
```

Replace `<moduleName>` with the name of your module. Use the following optional flags:

### Example

```bash
node-add "user" -m
```

## Folder Structure

After running the command, node-initdb will create the following folder structure:

```
- config/
- Controllers/
- Routes/
- Models/
- uploads/
- Utils/
```

## Files Created

node-initdb creates essential files such as controller, route, model files, and configuration files necessary for setting up your chosen database.

## Dependencies

node-initdb installs the following dependencies based on your database setup:

- For Sequelize: `sequelize`, `mysql2`
- For MongoDB: `mongoose`
- Middleware and Utilities: `express`, `body-parser`, `cors`, `dotenv`, `fs`, `http-errors`, `https`, `jsonwebtoken`, `multer`

## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request. Please follow the existing coding style and guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Get in touch

If you have any questions, feel free to reach out:

- Email: ashrafchauhan567@gmail.com
- GitHub: [@MohamedAshraf701](https://github.com/MohamedAshraf701)

# Support
<p><a href="https://www.buymeacoffee.com/ashraf704"> <img align="left" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="ashraf704" /></a></p><br><br>
