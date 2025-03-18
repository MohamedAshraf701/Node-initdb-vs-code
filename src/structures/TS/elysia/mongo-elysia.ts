const mongo = {
    folders: ['config', 'Controllers', 'Routes', 'Models', , 'uploads', 'Middleware' , 'Utils'],
    files:(index: any, Projectname: any) =>{return  [
        {
            folder: 'Controllers',
            name: 'health.Controller.ts',
            content:
                `
import ResponseHandler from '../Utils/responseHandler';  // Import the ResponseHandler class
import { Codes, Messages } from '../Utils/httpCodesAndMessages';  // Import HTTP status codes and messages

/**
 * Controller function to get the health status of the server.
 *
 * @param {object} context - Elysia context containing store and response settings.
 *                             'store' provides access to application-level data.
 *                             'set' is used to configure the HTTP response (status, headers, etc.).
 * @returns {object} - Returns a success response indicating the server's health status.
 */
export const getHealth = ({ store, set }: any) => {

  // Send a success response indicating that the health check is okay
  ResponseHandler.sendSuccess(set, "Health Okay!", Codes.OK, Messages.OK);

  // Send another success response with profile data from the store, also indicating health status
  return ResponseHandler.sendSuccess(
    set,
    store.profile,  // Retrieve profile data from the application store
    Codes.OK,  // Set HTTP status code to 200 OK
    "Server Health Okay"  // Provide a message indicating the server's health status
  );

};
                ` },
        {
            folder: 'Routes',
            name: 'health.Route.ts',
            content:
                `
import { Elysia } from "elysia";
import { getHealth} from "../Controllers/health.Controller";
import { config } from "dotenv";

// Load environment variables from .env file
config()

/**
 * Defines health check routes for the application.
 * - Uses JWT authentication for secured access.
 * - Applies authentication middleware before handling requests.
 * - Provides a '/health'endpoint to check server status.
 * 
 * @param {Elysia} app - The Elysia application instance.
 * @returns {Elysia} - The modified application instance with health routes.
 */


export const healthRoutes = (app: Elysia): any=> {
    return app
        .get("/health", getHealth)
};
             
      ` },
        {
            folder: 'Models',
            name: 'example.Model.ts',
            content:
                `
import mongoose, { Schema } from 'mongoose';

// Define the schema
const ExampleSchema = new Schema(
  {
    /**
     * A required string field with validation on length.
     * Default value: "Default String".
     */
    stringField: {
      type: String,
      required: [true, 'String field is required'],
      minlength: [5, 'String field must be at least 5 characters long'],
      maxlength: [50, 'String field must be less than 50 characters long'],
      default: 'Default String',
    },

    /**
     * A required number field with min and max constraints.
     * Default value: 42.
     */
    numberField: {
      type: Number,
      required: [true, 'Number field is required'],
      min: [0, 'Number field must be at least 0'],
      max: [100, 'Number field must be less than or equal to 100'],
      default: 42,
    },

    /**
     * Date field, defaulting to the current timestamp.
     */
    dateField: {
      type: Date,
      default: Date.now,
    },

    /**
     * Buffer field for storing binary data.
     */
    bufferField: Buffer,

    /**
     * Boolean field with a default value of false.
     */
    booleanField: {
      type: Boolean,
      default: false,
    },

    /**
     * A field that can store any data type.
     * Default value: an empty object.
     */
    mixedField: {
      type: Schema.Types.Mixed,
      default: {},
    },

    /**
     * ObjectId reference to another model.
     */
    objectIdField: {
      type: Schema.Types.ObjectId,
      ref: 'ExampleModel',
    },

    /**
     * Array of strings with a default value.
     */
    arrayField: {
      type: [String],
      default: ['defaultItem1', 'defaultItem2'],
    },

    /**
     * Decimal128 field for storing precise decimal values.
     */
    decimal128Field: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },

    /**
     * A Map field that stores key-value pairs.
     */
    mapField: {
      type: Map,
      of: String,
      default: new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    },

    /**
     * A nested object containing specific subfields.
     */
    nestedObject: {
      nestedString: {
        type: String,
        default: 'Nested Default String',
      },
      nestedNumber: {
        type: Number,
        default: 10,
      },
    },

    /**
     * A 2D array of numbers.
     */
    listOfLists: {
      type: [[Number]],
      default: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    },

    /**
     * An array of objects with predefined subfields.
     */
    listOfObjects: {
      type: [
        {
          subField1: {
            type: String,
            default: 'SubField Default',
          },
          subField2: {
            type: Number,
            default: 100,
          },
        },
      ],
      default: [
        { subField1: 'Default1', subField2: 100 },
        { subField1: 'Default2', subField2: 200 },
      ],
    },

    /**
     * Email field with validation, uniqueness, and automatic trimming/lowercasing.
     */
    emailField: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email address'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    versionKey: false, // Disables the __v field (used for versioning)
  }
);

/**
 * Adds a unique index on the email field to enforce uniqueness at the database level.
 */
ExampleSchema.index({ emailField: 1 }, { unique: true });

/**
 * Middleware: Runs before saving a document.
 * This is useful for performing operations like password hashing or logging.
 */
ExampleSchema.pre('save', function (next) {
  console.log('📝 Saving document');
  next();
});

// Create and export the model
const ExampleModel = mongoose.model('ExampleModel', ExampleSchema);
export default ExampleModel;
                
        ` },
        { folder: 'uploads', name: 'dummy', content: '// Dummy file' },
        {
            folder: 'Utils', name: 'httpCodesAndMessages.ts', content:
                `
/**
 * HTTP Status Codes
 * This object maps standard HTTP status codes to their numeric values.
 */
export const Codes = {
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
  } as const
  
  /**
   * HTTP Status Messages
   * This object maps standard HTTP status codes to their default message strings.
   */
  export const Messages = {
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
    INTERNAL_SERVER_ERROR: "Internal server error occurred.",
    DATA_RETRIEVED_SUCCESS: "Data retrieved successfully",
    DATA_CREATED_SUCCESS: "Data created successfully",
    DATA_UPDATED_SUCCESS: "Data updated successfully",
    DATA_DELETED_SUCCESS: "Data deleted successfully",
    VALIDATION_ERROR: "Validation Failed",
    EMAIL_ALREADY_EXISTS: "Email already exists"
  } as const
  
  export type StatusCodes = keyof typeof Codes
  export type StatusMessages = keyof typeof Messages
                `
        },
        {
            folder : 'Utils', name : 'validations.ts', content :
            `
// Validation.ts
const emailRegex: RegExp = /^[^s@]+@[^s@]+.[^s@]+$/;
const phoneRegex: RegExp =  /^\d{3}-\d{3}-\d{4}$/;

/**
 * Validate if a value is a valid email.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email: string): boolean {
    return emailRegex.test(email);
}

/**
 * Validate if a value is a valid phone number.
 * @param {string} phoneNumber
 * @returns {boolean}
 */
function isValidPhoneNumber(phoneNumber: string): boolean {
    return phoneRegex.test(phoneNumber);
}

/**
 * Validate if a value is an empty string.
 * @param {string} str
 * @returns {boolean}
 */
function isEmptyString(str: string): boolean {
    return typeof str === 'string' && str.trim().length === 0;
}

/**
 * Validate if a value is an empty array.
 * @param {Array<any>} arr
 * @returns {boolean}
 */
function isEmptyArray(arr: any[]): boolean {
    return Array.isArray(arr) && arr.length === 0;
}

/**
 * Validate if a value is not null or undefined.
 * @param {*} value
 * @returns {boolean}
 */
function isNotNullOrUndefined(value: any): boolean {
    return value !== null && value !== undefined;
}

/**
 * Validate if an object has all required fields.
 * @param {Object} obj
 * @param {Array<string>} requiredFields
 * @returns {boolean}
 */
function hasRequiredFields(obj: Record<string, any>, requiredFields: string[]): boolean {
    return requiredFields.every(field => obj.hasOwnProperty(field) && isNotNullOrUndefined(obj[field]));
}

export {
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
            folder : 'Middleware', name : 'jwtToken.ts', content :
            `
import { Codes } from "../Utils/httpCodesAndMessages";
import ResponseHandler from "../Utils/responseHandler";

/**
 * Authentication middleware for verifying JWT tokens.
 * 
 * This middleware:
 * - Extracts the token from the 'Authorization' header.
 * - Verifies the token using 'jwt.verify()'.
 * - If valid, attaches the decoded profile to 'store.profile'.
 * - If invalid, responds with appropriate error messages.
 */

export const authMiddleware = async ({ jwt, headers, set, store }: any) => {
  // Extract the Authorization header
  const authHeader: string = headers.authorization;

  /**
   * Check if the Authorization header is missing or improperly formatted.
   * The expected format is: "Bearer <token>"
   */
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return ResponseHandler.sendError(
      set,
      "No token provided",
      Codes.UNAUTHORIZED,
      "Unauthorized: No token provided"
    );
  }

  // Extract the actual token (removes "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and extract the user profile
    const profile = await jwt.verify(token);

    /**
     * If the token is invalid or verification fails, return an unauthorized error.
     */
    if (!profile) {
      return ResponseHandler.sendError(
        set,
        "Invalid token",
        Codes.UNAUTHORIZED,
        "Unauthorized: Invalid token"
      );
    }

    // Store the authenticated user's profile for use in subsequent handlers/controllers
    store.profile = profile;

  } catch (error: any) {
    // Default status code and message for authentication failure
    let statusCode = Codes.UNAUTHORIZED;
    let message = "Authentication failed";

    /**
     * Handle specific JWT errors:
     * - 'TokenExpiredError': Token is no longer valid.
     * - 'JsonWebTokenError': Token is malformed or incorrect.
     */
    if (error.name === "TokenExpiredError") {
      message = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token format";
    }

        // Return the appropriate error response
    return ResponseHandler.sendError(set, error, statusCode, message);
  }
};

export const createToken = async ({ body, jwt }: any ) => {
  // Generate JWT Token
  const token = await jwt.sign({ body });

  return {
    message: "Login successful",
    token,
  };
}
            `
        },
        {
            folder: 'Utils', name: 'responseHandler.ts', content:
                `
import { Codes, Messages } from './httpCodesAndMessages'

/**
 * ResponseHandler class to handle success and error responses for Elysia.
 * @class
 */
class ResponseHandler {
  /**
   * Method to send success response.
   * @param {Object} set - Elysia's set object for response manipulation
   * @param {Object} data - The data to be sent in the response
   * @param {number} statusCode - The status code of the response. Default is 200
   * @param {string} message - The message of the response. Default is 'OK'
   * @returns {Object} The success response
   */
  static sendSuccess(set: any, data: any, statusCode: number = Codes.OK, message: string = Messages.OK) {
    set.status = statusCode;
    return {
        success: true,
        status: statusCode,
        message: message,
        data: data,
    }
}


  /**
   * Method to send error response.
   * @param {Object} set - Elysia's set object for response manipulation
   * @param {Object} error - The error object
   * @param {number} statusCode - The status code of the response. Default is 500
   * @param {string} message - The message of the response. Default is 'Internal Server Error'
   * @returns {Object} The error response
   */
   static sendError(
    set: any,
    error: any,
    statusCode: number = Codes.INTERNAL_SERVER_ERROR,
    message: string = Messages.INTERNAL_SERVER_ERROR
  ) {
    set.status = statusCode
    return {
      success: false,
      status: statusCode,
      message: message,
      error: error.message || error,
    }
  }
}

export default ResponseHandler
` },
        {
            folder: '', name: index, content:
                `
import { Elysia } from "elysia";
import { config } from "dotenv";
import cors from "@elysiajs/cors";
import { mongoDBConnection } from "./config/dbConfig";
import { healthRoutes } from "./Routes/health.Route";
import { rateLimit } from "elysia-rate-limit";
import { helmet } from "elysia-helmet";
import jwt from "@elysiajs/jwt";
import ResponseHandler from "./Utils/responseHandler";
import { Codes, Messages } from "./Utils/httpCodesAndMessages";
import { readFileSync } from 'node:fs'; 
import { node } from '@elysiajs/node'

// Initialize MongoDB connection
mongoDBConnection();

// Load environment variables from .env file
config();


// Set the port, defaulting to 3000 if not defined
const PORT: number = Number(process.env.PORT) || 3000;

//Check for HTTP OR HTTPS
const IS_HTTPS = process.env.IS_HTTPS === "true";
const CARTPATH = process.env.CARTPATH;
const KEYPATH = process.env.KEYPATH;

/**
 * Initializes the Elysia server with essential security and performance features.
 * - Uses rate limiting to prevent abuse.
 * - Adds security headers with Helmet.
 * - Enables CORS for cross-origin requests.
 * - Configures routes for user authentication and health checks.
 * - Starts the server on the specified port.
*/
const app = new Elysia()
 
  // Apply rate limiting to prevent excessive requests
  .use(rateLimit())
  
  // Secure the application by adding various HTTP headers
  .use(helmet())
  
  // Enable CORS for cross-origin requests
  .use(
    cors({
      origin: ["*"], // Update with allowed origins for better security
      })
      )
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET || "your-super-secret-key",
    })
  )
  //Error handler for not found routes
 // Custom error handler
 .onError(({ code, error, set }) => {  // Added 'error' to the parameters
  console.error("Error caught:", code, error); // Log the error
  
  switch (code) {
    case 'NOT_FOUND':
      return ResponseHandler.sendError(set, 404 , Codes.NOT_FOUND, Messages.NOT_FOUND);
      default:  // Handle all other errors (general error handler)
      return ResponseHandler.sendError(set, Codes.INTERNAL_SERVER_ERROR, 500, Messages.INTERNAL_SERVER_ERROR); 
      }
      })

  //endpoint for healthRoutes
  .group("/api/v1", (app: any) => healthRoutes(app))
  
  const startServer = async () => {
    try {
      const options = {
        port: PORT,
      } as any; // Create a base options object and cast to 'any'
  
      if (IS_HTTPS) {
        if (!CARTPATH || !KEYPATH) {
          console.error("CARTPATH and KEYPATH environment variables must be set for HTTPS.");
          process.exit(1); // Exit if HTTPS is enabled but paths are missing
        }
  
        options.cert = readFileSync(CARTPATH);
        options.key = readFileSync(KEYPATH);
      }
  
      // Start the server using the configured options
      app.listen(options);
  
      console.log(IS_HTTPS ? 'HTTPS' : 'HTTP'+ 'Server started on port:', PORT);
  
    } catch (err) {
      console.error("Server startup error:", err); // Corrected log method and message
      process.exit(1);
    }
  };
  
  // Call the startServer function
  startServer();

// Log the server status
console.log('🦊 Elysia is running at app.server?.hostname:app.server?.port');


                ` },
        {
            folder: 'config', name: 'dbConfig.ts',
            content:
                `
import { config } from "dotenv";
import mongoose from "mongoose";
config();

/**
 * Establishes a connection to MongoDB.
 * - Uses the connection string from the environment variable.
 * - Logs success or failure messages.
 */

export const mongoDBConnection = async() => {

  // Fetch MongoDB URI from environment variables
  const mongoUri = process.env.MONGO_URI;

    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUri)

        // Type assertions for Typescript
        console.log("🗄️ Connected to MongoDB");

    }catch(error: any){
        console.log(error.getMessage);
        process.exit(1) // // Exit the process if MongoDB connection fails
    }
}
                ` },
        {
            folder: 'Middleware', name: 'fileUpload.ts',
            content:
                `
/**
 * @fileoverview This module sets up and exports a configured Multer instance 
 * for handling file uploads in a Node.js application. It includes:
 * - Storage configuration for saving uploaded files.
 * - File filtering to allow only image uploads.
 * - File size limit enforcement.
 */

import fs from "fs";
import path from "path";

const uploadDir = "./uploads";

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload =  async (context:any) => {

   type UploadBody = { file : File };
   const { body, set } = context as { body: UploadBody, set: any }; // Extract value inside the function
  if (!body || !body.file) {
    set.status = 400;
    return { error: "No file uploaded" };
  }

  const file = body.file;
  const arrayBuffer = await file.arrayBuffer(); // Convert Blob to Buffer
  const buffer = Buffer.from(arrayBuffer);

  // Generate a unique filename
  const fileName = Date.now() + '-' + file.name;
  const filePath = path.join(uploadDir, fileName);

  // Save file
  fs.writeFileSync(filePath, buffer);
}

export default upload;
                ` },
                {
                  folder: '', name: '.env', content:
`PORT=3000
MONGO_URI=mongodb://localhost:27017/
DB_NAME=test
DB_USER=
DB_PASS=
IS_HTTPS=false
KEYPATH=
CARTPATH=
JWT_SECRET=
` } ,
                {
                  folder: '', name: 'tsconfig.json', content:
                      `
{
  "compilerOptions": {
  "module": "commonjs",
  "esModuleInterop": true,
  "target": "es6",
  "noImplicitAny": true,
  "moduleResolution": "node",
  "sourceMap": true,
  "outDir": "dist",
  "baseUrl": ".",
  "paths": {
  "*": ["node_modules/*", "types/*"]
   }
  },
  "include": ["*"]
}

      ` 
    } ,
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
            ` } // Empty .env file
    ];
  },
    cmd : '@elysiajs/cookie @elysiajs/cors @elysiajs/jwt @types/bcryptjs @types/busboy @types/mongoose @types/multer bcryptjs busboy dotenv elysia elysia-helmet elysia-rate-limit helmet mongoose multer sequelize-typescript @types/jsonwebtoken typescript @elysiajs/node'
};
export default mongo;