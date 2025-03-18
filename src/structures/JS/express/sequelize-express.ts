const sequelize = {

    folders: ['config','Controllers', 'Routes', 'Models', 'uploads', 'Middleware' , 'Utils'],
    files: (index: any, Projectname: any) =>{return [
        {
            folder: 'Controllers',
            name: 'health.Controller.js',
            content:
                `
  // Importing HTTP status codes and messages from utilities
  const { Codes, Messages } = require("../Utils/httpCodesAndMessages");
  // Importing the response handler utility for managing API responses
  const ResponseHandler = require("../Utils/responseHandler");
  
  module.exports = {
      // Health check endpoint
      Health: (req, res, next) => {
          try {
              // Attempt to send a success response indicating the health status
              ResponseHandler.sendSuccess(res, "health Status", Codes.OK, Messages.OK);
              return;
          } catch (error) {
              // Handle any errors that occur during the process by sending an error response
              ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
              next(error); // Pass the error to the next middleware for further handling
          }
      }
  }
                ` },
        {
            folder: 'Routes',
            name: 'health.Route.js',
            content:
                `
// Importing the express module to create router instances and handle the routing
const express = require("express");
// Creating a router instance from express to define route handlers
const router = express.Router();

// Importing the HealthController from the Controllers directory
const HealthController = require("../Controllers/health.Controller")

// Defining a GET route on the root path which uses the Health method from HealthController to handle requests
router.get("/" ,HealthController.Health);

// Exporting the router instance to be used in other parts of the application
module.exports = router;
                ` },
                {
                    folder: 'Middleware', name: 'fileUpload.js',
                    content:
                        `
/**
 * @fileoverview This module sets up and exports a configured Multer instance 
 * for handling file uploads in a Node.js application. It includes:
 * - Storage configuration for saving uploaded files.
 * - File filtering to allow only image uploads.
 * - File size limit enforcement.
 */

const multer = require("multer"); // Importing multer for handling file uploads

// Configure storage settings for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Set upload destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Rename file with timestamp to avoid conflicts
    }
});

// Define a filter to allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only images are allowed!"), false); // Reject non-image files
    }
};

// Configure multer with storage, file filtering, and size limits
const upload = multer({
    storage, // Use defined storage settings
    fileFilter, // Apply file type filter
    limits: { fileSize: 2 * 1024 * 1024 } // Limit file size to 2MB
});

module.exports = upload; // Export configured multer instance


                ` },
        {
            folder: 'Models',
            name: 'Example.Model.js',
            content:
                `
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // Update the path as necessary

const   ExampleModel = sequelize.define('ExampleModel', {
    // String field with required validation, minimum length, maximum length, and default value
    stringField: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'String field is required' },
            len: {
                args: [5, 50],
                msg: 'String field must be between 5 and 50 characters long'
            }
        },
        defaultValue: 'Default String'
    },
    // Number field with required validation, minimum value, maximum value, and default value
    numberField: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'Number field is required' },
            min: {
                args: [0],
                msg: 'Number field must be at least 0'
            },
            max: {
                args: [100],
                msg: 'Number field must be less than or equal to 100'
            }
        },
        defaultValue: 42
    },
    // Date field with default value set to current date and time
    dateField: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    // Buffer field for storing binary data (no specific validation or default value provided here)
    bufferField: {
        type: DataTypes.BLOB
    },
    // Boolean field with default value
    booleanField: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // Mixed field that can hold any type of value, with an empty object as default (using JSON type)
    mixedField: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    // ObjectId field for referencing another document (self-referencing for ${Projectname})
    objectIdField: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    // Array field containing strings, with default values
    arrayField: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['defaultItem1', 'defaultItem2']
    },
    // Decimal128 field for high-precision decimal values
    decimal128Field: {
        type: DataTypes.DECIMAL(38, 16),
        defaultValue: 0.0
    },
    // Map field for storing key-value pairs of strings (using JSON type)
    mapField: {
        type: DataTypes.JSON,
        defaultValue: { key1: 'value1', key2: 'value2' }
    },
    // Nested object with fields containing default values (using JSON type)
    nestedObject: {
        type: DataTypes.JSON,
        defaultValue: { nestedString: 'Nested Default String', nestedNumber: 10 }
    },
    // List of lists containing nested arrays of numbers with default values
    listOfLists: {
        type: DataTypes.JSON,
        defaultValue: [[1, 2, 3], [4, 5, 6]]
    },
    // List of objects with subfields and default values
    listOfObjects: {
        type: DataTypes.JSON,
        defaultValue: [
            { subField1: 'Default1', subField2: 100 },
            { subField1: 'Default2', subField2: 200 }
        ]
    },
    // Email field with validation for format, uniqueness, and trimming
    emailField: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('emailField', value.trim().toLowerCase());
        },
        validate: {
            notNull: { msg: 'Email is required' },
            isEmail: { msg: 'Invalid email address' }
        }
    }
}, {
    tableName: 'example_models',
    timestamps: true
});

module.exports = ExampleModel;
                
                
        ` },
        { folder: 'uploads', name: 'dummy', content: '// Dummy file' },
        {
            folder: 'Utils', name: 'httpCodesAndMessages.js', content:
                `
// HTTP Status Codes
// This object maps standard HTTP status codes to their numeric values.
const Codes = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
};
// HTTP Status Messages
// This object maps standard HTTP status codes to their default message strings.
const Messages = {
  CONTINUE: "Continue",
  SWITCHING_PROTOCOLS: "Switching Protocols",
  PROCESSING: "Processing",
  OK: "The request has succeeded",
  CREATED: "The request has been fulfilled, resulting in the creation of a new resource",
  ACCEPTED: "The request has been accepted for processing, but the processing has not been completed",
  NON_AUTHORITATIVE_INFORMATION: "The server is a transforming proxy that received a 200 OK from its origin but is returning a modified version of the origin's response",
  NO_CONTENT: "The server successfully processed the request and is not returning any content",
  RESET_CONTENT: "The server successfully processed the request, asks that the requester reset its document view, and is not returning any content",
  PARTIAL_CONTENT: "The server is delivering only part of the resource due to a range header sent by the client",
  MULTIPLE_CHOICES: "The request has more than one possible response",
  MOVED_PERMANENTLY: "The URL of the requested resource has been changed permanently",
  FOUND: "The URL of the requested resource has been changed temporarily",
  SEE_OTHER: "The server sent this response to direct the client to get the requested resource at another URI with a GET request",
  NOT_MODIFIED: "Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match",
  TEMPORARY_REDIRECT: "The server is currently responding to the request with a different URI but the client should continue to use the original URI for future requests",
  PERMANENT_REDIRECT: "The server is currently responding to the request with a different URI, and the client should use the new URI for future requests",
  BAD_REQUEST: "The server could not understand the request due to invalid syntax",
  UNAUTHORIZED: "The client must authenticate itself to get the requested response",
  PAYMENT_REQUIRED: "This response code is reserved for future use",
  FORBIDDEN: "The client does not have access rights to the content",
  NOT_FOUND: "The server can not find the requested resource",
  METHOD_NOT_ALLOWED: "The request method is known by the server but is not supported by the target resource",
  NOT_ACCEPTABLE: "The server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers",
  PROXY_AUTHENTICATION_REQUIRED: "The client must first authenticate itself with the proxy",
  REQUEST_TIMEOUT: "The server would like to shut down this unused connection",
  CONFLICT: "This response is sent when a request conflicts with the current state of the server",
  GONE: "This response is sent when the requested content has been permanently deleted from the server, with no forwarding address",
  LENGTH_REQUIRED: "The server rejects the request because the Content-Length header field is not defined and the server requires it",
  PRECONDITION_FAILED: "The client has indicated preconditions in its headers which the server does not meet",
  PAYLOAD_TOO_LARGE: "The request entity is larger than limits defined by server",
  URI_TOO_LONG: "The URI requested by the client is longer than the server is willing to interpret",
  UNSUPPORTED_MEDIA_TYPE: "The media format of the requested data is not supported by the server",
  RANGE_NOT_SATISFIABLE: "The range specified by the Range header field in the request can't be fulfilled",
  EXPECTATION_FAILED: "This response code means the expectation indicated by the Expect request-header field can't be met by the server",
  IM_A_TEAPOT: "The server refuses the attempt to brew coffee with a teapot",
  MISDIRECTED_REQUEST: "The request was directed at a server that is not able to produce a response",
  UNPROCESSABLE_ENTITY: "The request was well-formed but was unable to be followed due to semantic errors",
  LOCKED: "The resource that is being accessed is locked",
  FAILED_DEPENDENCY: "The request failed due to failure of a previous request",
  TOO_EARLY: "Indicates that the server is unwilling to risk processing a request that might be replayed",
  UPGRADE_REQUIRED: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol",
  PRECONDITION_REQUIRED: "The origin server requires the request to be conditional",
  TOO_MANY_REQUESTS: "The user has sent too many requests in a given amount of time ('rate limiting')",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "The server is unwilling to process the request because its header fields are too large",
  UNAVAILABLE_FOR_LEGAL_REASONS: "The server is denying access to the resource as a consequence of a legal demand",
  INTERNAL_SERVER_ERROR: "Internal server error occurred."
};

module.exports = { Codes, Messages };                             
                `
        },
        {
            folder : 'Utils', name : 'validations.js', content :
            `
// Validation.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone number format

/**
 * Validate if a value is a valid email.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return emailRegex.test(email);
}

/**
 * Validate if a value is a valid phone number.
 * @param {string} phoneNumber
 * @returns {boolean}
 */
function isValidPhoneNumber(phoneNumber) {
    return phoneRegex.test(phoneNumber);
}

/**
 * Validate if a value is an empty string.
 * @param {string} str
 * @returns {boolean}
 */
function isEmptyString(str) {
    return typeof str === 'string' && str.trim().length === 0;
}

/**
 * Validate if a value is an empty array.
 * @param {Array} arr
 * @returns {boolean}
 */
function isEmptyArray(arr) {
    return Array.isArray(arr) && arr.length === 0;
}

/**
 * Validate if a value is not null or undefined.
 * @param {*} value
 * @returns {boolean}
 */
function isNotNullOrUndefined(value) {
    return value !== null && value !== undefined;
}

/**
 * Validate if an object has all required fields.
 * @param {Object} obj
 * @param {Array} requiredFields
 * @returns {boolean}
 */
function hasRequiredFields(obj, requiredFields) {
    return requiredFields.every(field => obj.hasOwnProperty(field) && isNotNullOrUndefined(obj[field]));
}

module.exports = {
    isValidEmail,
    isValidPhoneNumber,
    isEmptyString,
    isEmptyArray,
    isNotNullOrUndefined,
    hasRequiredFields
};
            
            `
        },
        {
            folder : 'Middleware', name : 'jwtToken.js', content :
            `'use strict'
// jwtHelper.js
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../Utils/responseHandler');
const { Codes, Messages } = require('../Utils/httpCodesAndMessages');

// Secret key for signing tokens
const SECRET_KEY = process.env.JWT_SECRET || 'X~7W@**TsZ=@}XT/"Z<bo7oDY8gtD(';

class JWTHelper {
    /**
     * Create a new JWT token
     * @param {Object} payload - The payload to include in the token
     * @param {Object} options - Options for token creation, such as 'expiresIn'
     * @returns {String} - The created JWT token
     */
    static createToken(payload, options = {}) {
        const tokenOptions = {};
        if (options.expiresIn) {
            tokenOptions.expiresIn = options.expiresIn;
        }
        return jwt.sign(payload, SECRET_KEY, tokenOptions);
    }

    /**
     * Validate a JWT token
     * @param {String} token - The token to validate
     * @returns {Object} - The decoded token if valid, or an error if invalid
     */
    static validateToken(token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return { valid: true, decoded };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return { valid: false, error: 'Token has expired' };
            }
            return { valid: false, error: error.message };
        }
    }

    /**
     * Middleware to validate JWT token in requests
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     */
    static tokenMiddleware(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ResponseHandler.sendError(res, 'No token provided', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }

        const { valid, decoded, error } = JWTHelper.validateToken(token);
        if (valid) {
            req.user = decoded; // Attach the decoded payload to the request object
            next();
        } else {
            if (error === 'Token has expired') {
                return ResponseHandler.sendError(res, 'Token has expired', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
            }
            return ResponseHandler.sendError(res, 'Invalid token', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }
    }
}

module.exports = JWTHelper;
            
            `
        },
        {
            folder: 'Utils', name: 'responseHandler.js', content:
                `
/**
 * This module provides a utility class for handling HTTP responses in a standardized way.
 * It includes methods for sending success and error responses with customizable status codes and messages.
 * 
 * @module ResponseHandler
 */

const { Codes, Messages } = require('./httpCodesAndMessages');

/**
 * Represents a utility class for handling HTTP responses.
 * 
 * @class ResponseHandler
 */
class ResponseHandler {
  /**
     * Sends a successful HTTP response.
     * 
     * @param {Response} res - The Express response object.
     * @param {*} data - The data to be sent in the response.
     * @param {number} [statusCode=Codes.OK] - The HTTP status code for the response.
     * @param {string} [message=Messages.OK] - The message to be sent in the response.
     */
    static sendSuccess(res, data, statusCode = Codes.OK , message = Messages.OK) {
        if(res.headersSent) return;

        res.status(statusCode).json({
            success: true,
            status: statusCode,
            message: message,
            data: data,
        });
    }

  /**
    * Sends an error HTTP response.
    * 
    * @param {Response} res - The Express response object.
    * @param {*} error - The error to be sent in the response.
    * @param {number} [statusCode=Codes.INTERNAL_SERVER_ERROR] - The HTTP status code for the response.
    * @param {string} [message=Messages.INTERNAL_SERVER_ERROR] - The message to be sent in the response.
  */
    static sendError(res, error, statusCode = Codes.INTERNAL_SERVER_ERROR , message = Messages.INTERNAL_SERVER_ERROR) {
        if(res.headersSent) return;

        res.status(statusCode).json({
            success: false,
            status: statusCode,
            message: message,
            error: error.message || error,
        });
    }
}

module.exports = ResponseHandler;   
` },
        {
            folder: '', name: index, content:
                `
// Importing necessary modules
const express = require("express"); // Express framework for handling server-side logic
const createError = require("http-errors"); // Utility to create HTTP errors
const dotenv = require("dotenv").config(); // Loads environment variables from a .env file into process.env
const cors = require('cors'); // Middleware to enable CORS (Cross-Origin Resource Sharing)
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const app = express(); // Creating an instance of express

const fs = require('fs'); // File system module to handle file operations
app.use(cors()); // Applying CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(bodyParser.json()); // Middleware to parse JSON bodies (redundant with express.json())

const apiV1Router = express.Router(); // Creating a new router for API version 1

// Database initialization
const { connectDB } = require("./config/dbConfig"); // Importing DB connection function
connectDB(); // Connecting to the database

// Model initialization
const { initModels } = require("./config/initModels"); // Importing model initialization function
initModels(); // Initializing models

// Middleware to log requests
app.use((req, res, next) => {
  res.on("finish", () => {
      console.log(req.method + " - " + req.originalUrl + " - " + res.statusCode); // Logging method, URL, and status code of each request
  });
  next(); // Passing control to the next middleware function
});

// Route files
const RoutesHealth = require("./Routes/health.Route"); // Importing health check routes

// API V1 Routes
apiV1Router.use('/uploads', express.static('uploads')); // Serving static files from the uploads directory
apiV1Router.use("/health", RoutesHealth); // Using health routes in the API

// Middleware to handle 404 Not Found error for API v1 routes
apiV1Router.use((req, res, next) => {
    next(createError(404, "Not found")); // Creating a 404 error if no other route matches
});

// Custom error handler middleware for API v1 routes
apiV1Router.use((err, req, res, next) => {
    res.status(err.status || 500); // Setting the response status code
    res.send({
        error: {
            status: err.status || 500, // Error status code
            message: err.message, // Error message
        },
    }); // Sending a JSON response with the error details
});

app.use("/api/v1" , apiV1Router); // Mounting the API v1 router at '/api/v1'

const http = require("https"); // HTTPS module
const PORT = process.env.PORT || 8096; // Port number from environment variable or default to 8096
// Check if HTTPS is enabled via environment variable
if (process.env.IS_HTTPS == "true") {
    const privateKey = fs.readFileSync(process.env.KEYPATH, 'utf8'); // Reading private key for HTTPS
    const certificate = fs.readFileSync(process.env.CARTPATH, 'utf8'); // Reading certificate for HTTPS
    const credentials = { key: privateKey, cert: certificate }; // Creating credentials object
    
    let server = http.createServer(credentials, app); // Creating HTTPS server with credentials and express app
    server.listen(PORT, () => {
        console.log('HTTPS Server started on port :' ,PORT); // Logging HTTPS server start
    });
} else {
    app.listen(PORT, () => {
        console.log('HTTP Server started on port :' ,PORT); // Logging HTTP server start
    });
}
                ` },
        {
            folder: 'config', name: 'dbConfig.js',
            content:
                `
// Importing Sequelize constructor from the sequelize package.
const { Sequelize } = require('sequelize');

// Creating an instance of Sequelize to connect to our MySQL database using environment variables.
let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST, // Database host URL
  dialect: 'mysql', // Database dialect
});

// Asynchronous function to establish a connection to the database and synchronize the models.
const connectDB = async () => {
  try {
    // Synchronizes all defined models to the database.
    // 'alter: false' ensures the database should not be altered.
    await sequelize.sync({ alter: false });
    console.log('Connection has been established successfully.'); // Success message
  } catch (error) {
    console.error('Unable to connect to the database:', error); // Error handling
  }
};

// Exporting the sequelize instance and connectDB function to be used in other parts of the application.
module.exports = { sequelize, connectDB };
                
                ` },{ folder: 'config', name: 'initModels.js',
                content:`
const initModels = () => {
    // Associate models here if necessary
    // e.g., User.hasMany(Posts);
};

module.exports = { initModels };
                `},
        {
            folder: '', name: '.env', content:
                `PORT=3000
DB_HOST=localhost
DB_NAME=test
DB_USER=
DB_PASS=
IS_HTTPS=false
KEYPATH=
CARTPATH=
JWT_SECRET=` }, // Empty .env file
{
    folder: '', name: '.gitignore', content:
        `node_modules
  package-lock.json
  .env
  ` 
  } ,
{
    folder: '', name: 'README.md', content:
        `
# *${Projectname}*

This project was generated using node-initdb, a CLI tool for initializing database configurations, web framework setups, and project structures in Node.js projects. *This setup requires you to choose one option from each category: a database, a web framework, a language, and a package manager.*

## Features

- Preconfigured folder structure for streamlined project development.
- *Database Support:* Choose between MongoDB (via Mongoose) or Sequelize (MySQL).
- *Web Framework:* Set up with Express, Fastify, or Elysia.
- *Language Choice:* Develop in JavaScript or TypeScript.
- *Package Manager:* Use npm, yarn, pnpm, or bun.
- Integrated file upload functionality.
- Pre-configured JWT-based authentication.
- Automatically installs required dependencies based on your selected configuration.

## Folder Structure

The following structure was generated:


- config/
- Controllers/
- Routes/
- Models/
- Middleware/
- uploads/
- Utils/


## Getting Started

### Setup Project

Use the 'node-initdb' command to create the project. *You must select one option from each category:*

- *Database:*
  - MongoDB: '-m' or '--mongo'
  - Sequelize: '-s' or '--seque'
- *Web Framework:*
  - Express: '-e' or '--express'
  - Fastify: '-f' or '--fastify'
  - Elysia: '-el' or '--elysia'
- *Language:*
  - JavaScript: '-j' or '--javascript'
  - TypeScript: '-t' or '--typescript'
- *Package Manager:*
  - npm: '-n' or '--npm'
  - yarn: '-ya' or '--yarn'
  - pnpm: '-pn' or '--pnpm'
  - bun: '-b' or '--bun'

Optionally, add '-y' or '--yes' to skip interactive prompts and use default values.

For example, to set up a project with MongoDB, Express, TypeScript, and npm:

bash
node-initdb -m -e -t -n


### Adding a Module

To add a new module to your project, use the 'node-add' command with the same required options:

bash
node-add <moduleName> [-m / --mongo] [-s / --seque] [-e / --express] [-f / --fastify] [-el / --elysia] [-j / --javascript] [-t / --typescript] [-n / --npm] [-ya / --yarn] [-pn / --pnpm] [-b / --bun]


For example, to add a "user" module for MongoDB, Express, TypeScript, and yarn:

bash
node-add user -m -e -t


## About node-initdb

node-initdb is designed to simplify the setup of database-driven projects by generating a preconfigured folder structure and installing required dependencies based on your chosen database, web framework, language, and package manager.

For more information, visit:
- GitHub: [@MohamedAshraf701](https://github.com/MohamedAshraf701)

---

If you encounter any issues, feel free to reach out at ashrafchauhan567@gmail.com or open an issue on GitHub.

        ` }
    ];
},
    cmd : 'body-parser cors dotenv express fs http-errors https jsonwebtoken sequelize mysql2 multer'
};
export default sequelize;