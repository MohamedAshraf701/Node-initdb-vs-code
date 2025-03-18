const mongo = {
    folders: ['config', 'Controllers', 'Routes', 'Models', , 'uploads', 'Middleware' , 'Utils'],
    files:(index: any, Projectname: any) =>{return  [
        {
            folder: 'Controllers',
            name: 'health.Controller.js',
            content:
                `
/**
 * @file healthController.ts
 * @description Controller for handling server health check requests.
 * @module healthController
 */

// Import necessary utilities and response handlers
import { Codes, Messages } from "../Utils/httpCodesAndMessages.js";
import ResponseHandler from "../Utils/responseHandler.js";

/**
 * @constant healthController
 * @description Defines methods for server health check endpoints.
 */
export const healthController = {
  /**
   * @function getHealth
   * @description Handles a health check request by returning the server's status.
   * @param {object} context - The request context object provided by Elysia.
   * @param {object} context.store - The application's shared store (if available).
   * @param {object} context.set - The response object for setting HTTP status codes.
   * @returns {object} JSON response indicating the server's health status.
   * 
   * @example
   * // Sample response:
   * {
   *   "status": 200,
   *   "message": "Server Health Okay",
   *   "data": { "profile": {...} }
   * }
   */
  getHealth: ({ store, set }) => {
    // Send an initial success response confirming that the server is healthy
    ResponseHandler.sendSuccess(set, "Health Okay!", Codes.OK, Messages.OK);

    // Send another success response with profile data (if available) from the store
    return ResponseHandler.sendSuccess(
      set,
      store.profile,  // Retrieve profile data from the application's shared store
      Codes.OK,       // HTTP status code: 200 OK
      "Server Health Okay"  // Response message indicating the server's health
    );
  }
};

                ` },
        {
            folder: 'Routes',
            name: 'health.Route.js',
            content:
                `
/**
 * @file healthRoutes.ts
 * @description Defines API routes for health checks.
 * @module healthRoutes
 */

// Load environment variables from .env file
import { config } from "dotenv";
config();

// Import the HealthController to handle requests
import { healthController } from "../Controllers/health.Controller.js";

/**
 * @function healthRoutes
 * @description Registers health check routes in the application.
 * @param {object} app - The Elysia app instance where routes are registered.
 * @returns {object} The updated app instance with registered routes.
 * 
 * @example
 * // Register the health routes in the main server file:
 * app.use(healthRoutes);
 */
export const healthRoutes = (app) => {
    return app.get("/health", healthController.getHealth);
};                       
      ` },
        {
            folder: 'Models',
            name: 'example.Model.js',
            content:
                `
/**
 * @file ExampleModel.ts
 * @description Mongoose schema for an example collection with various field types.
 * @module ExampleModel
 */

import mongoose, { Schema } from 'mongoose';

// Define the schema with various field types
const ExampleSchema = new Schema(
  {
    /**
     * @property {string} stringField - A required string with min/max validation.
     * @default "Default String"
     */
    stringField: {
      type: String,
      required: [true, 'String field is required'],
      minlength: [5, 'String field must be at least 5 characters long'],
      maxlength: [50, 'String field must be less than 50 characters long'],
      default: 'Default String',
    },

    /**
     * @property {number} numberField - A required number field with min/max constraints.
     * @default 42
     */
    numberField: {
      type: Number,
      required: [true, 'Number field is required'],
      min: [0, 'Number field must be at least 0'],
      max: [100, 'Number field must be at most 100'],
      default: 42,
    },

    /**
     * @property {Date} dateField - Automatically set to the current timestamp.
     */
    dateField: {
      type: Date,
      default: Date.now,
    },

    /**
     * @property {Buffer} bufferField - Stores binary data.
     */
    bufferField: Buffer,

    /**
     * @property {boolean} booleanField - A boolean field with a default value.
     * @default false
     */
    booleanField: {
      type: Boolean,
      default: false,
    },

    /**
     * @property {any} mixedField - A field that can store any data type.
     * @default {}
     */
    mixedField: {
      type: Schema.Types.Mixed,
      default: {},
    },

    /**
     * @property {ObjectId} objectIdField - A reference to another model.
     */
    objectIdField: {
      type: Schema.Types.ObjectId,
      ref: 'ExampleModel',
    },

    /**
     * @property {string[]} arrayField - An array of strings with a default value.
     * @default ["defaultItem1", "defaultItem2"]
     */
    arrayField: {
      type: [String],
      default: ['defaultItem1', 'defaultItem2'],
    },

    /**
     * @property {Decimal128} decimal128Field - Stores precise decimal values.
     * @default 0.0
     */
    decimal128Field: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },

    /**
     * @property {Map<string, string>} mapField - A key-value map.
     * @default {"key1": "value1", "key2": "value2"}
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
     * @property {object} nestedObject - A nested object with subfields.
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
     * @property {number[][]} listOfLists - A 2D array of numbers.
     * @default [[1,2,3], [4,5,6]]
     */
    listOfLists: {
      type: [[Number]],
      default: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    },

    /**
     * @property {Array<{subField1: string, subField2: number}>} listOfObjects
     * @default [{subField1: "Default1", subField2: 100}, {subField1: "Default2", subField2: 200}]
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
     * @property {string} emailField - A required email field with uniqueness, trimming, and lowercase conversion.
     */
    emailField: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ Adds 'createdAt' & 'updatedAt' fields
    versionKey: false, // ✅ Removes '__v' versioning field
  }
);

/**
 * @description Adds a unique index on 'emailField' to enforce uniqueness at the database level.
 */
ExampleSchema.index({ emailField: 1 }, { unique: true });

/**
 * @description Middleware that runs before saving a document.
 * Used for operations like hashing passwords or logging actions.
 */
ExampleSchema.pre('save', function (next) {
  console.log('📝 Saving document:', this);
  next();
});

/**
 * @constant ExampleModel
 * @description Mongoose model based on 'ExampleSchema'.
 */
const ExampleModel = mongoose.model('ExampleModel', ExampleSchema);

export default ExampleModel;
                
        ` },
        { folder: 'uploads', name: 'dummy', content: '// Dummy file' },
        {
            folder: 'Utils', name: 'httpCodesAndMessages.js', content:
                `

// HTTP Status Codes
// This object maps standard HTTP status codes to their numeric values.
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
};
// HTTP Status Messages
// This object maps standard HTTP status codes to their default message strings.
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
  DATA_DELETED_SUCCESS: "Data deleted successfully"
};
                   
export default { Codes, Messages };
                `
        },
        {
            folder : 'Utils', name : 'validations.js', content :
            `
// Validation.js
const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
const phoneRegex = /^+?[1-9]d{1,14}$/; // E.164 international phone number format

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
            `
'use strict'
// jwtHelper.js

import ResponseHandler from '../Utils/responseHandler.js';
import { Codes, Messages } from '../Utils/httpCodesAndMessages.js';
            
export const authMiddleware = async ({ jwt, headers, set, store }) => {
    // Extract the Authorization header
    const authHeader = headers.authorization;
  
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
  
    } catch (error) {
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
  
  export const createToken = async ({ body, jwt }) => {
    // Generate JWT Token
    const token = await jwt.sign( body );
  
    return {
      message: "Login successful",
      token,
    };
  }               
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
import { Codes, Messages } from './httpCodesAndMessages.js';

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
    static sendSuccess(set, data, statusCode = Codes.OK , message = Messages.OK) {
        // if(set.headersSent) return;     

        set.status =statusCode;

        return {
          success: true,
          status: statusCode,
          message,
          data,
        };
    }

  /**
    * Sends an error HTTP response.
    * 
    * @param {Response} res - The Express response object.
    * @param {*} error - The error to be sent in the response.
    * @param {number} [statusCode=Codes.INTERNAL_SERVER_ERROR] - The HTTP status code for the response.
    * @param {string} [message=Messages.INTERNAL_SERVER_ERROR] - The message to be sent in the response.
  */
    static sendError(set, error, statusCode = Codes.INTERNAL_SERVER_ERROR , message = Messages.INTERNAL_SERVER_ERROR) {
        // if(set.headersSent) return;

        set.status = statusCode;
        return {
          success: false,
          status: statusCode,
          message,
          error: error.message || error,
        };
    }
}

export default ResponseHandler;
                
` },
        {
            folder: '', name: index, content:
                `

import { Elysia } from "elysia"; 
import { node } from '@elysiajs/node'
import { config } from "dotenv";
import cors from '@elysiajs/cors'; // Importing CORS middleware to enable cross-origin requests
import { rateLimit } from'elysia-rate-limit'; // Importing rate-limit middleware to limit request rates
import { helmet } from "elysia-helmet";
import {jwt} from "@elysiajs/jwt"; // Importing JWT middleware for token verification);
import ResponseHandler from "./Utils/responseHandler.js";
import { Codes, Messages } from "./Utils/httpCodesAndMessages.js";
import fs from 'fs'; // Importing file system module for file operations
import { healthRoutes } from "./Routes/health.Route.js";
import  dbConfig  from "./config/dbConfig.js";

dbConfig();
config();

const PORT = process.env.PORT || 8068;
const IS_HTTPS = process.env.IS_HTTPS === "true";
const CARTPATH = process.env.CARTPATH;
const KEYPATH = process.env.KEYPATH;
 
const app = new Elysia({ adapter: node() })

// Apply rate limiting to prevent excessive requests
// .use(rateLimit())
  
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
    .group("/api/v1", (app) => healthRoutes(app))

  const startServer = async () => {
      try {
        const options = {
          port: PORT,
        }; // Create a base options object and cast to 'any'
    
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
                                                                                                                   
                ` },
        {
            folder: 'config', name: 'dbConfig.js',
            content:
                `
import mongoose from 'mongoose'
// This module exports a function that sets up the MongoDB connection using Mongoose.

export default () => {
  // Connect to MongoDB using the connection string and credentials from environment variables.
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME, // Name of the database to connect to.
      user: process.env.DB_USER,   // Database user's name.
      pass: process.env.DB_PASS,   // Database user's password.
      useNewUrlParser: true,       // Use the new URL parser for MongoDB connection strings.
      useUnifiedTopology: true,    // Use the new engine for MongoDB driver's topology management.
    })
    .then(() => {
      console.log('Mongodb connected....') // Log on successful connection.
    })
    .catch(err => console.log(err.message)); // Log any errors that occur during connection.

  // Event listener for successful connection to the database.
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  // Event listener for any connection errors.
  mongoose.connection.on('error', err => {
    console.log(err.message); // Log the error message.
  });

  // Event listener for when the connection is disconnected.
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  // Event listener for SIGINT signal (typically sent from the terminal).
  // This is used to handle graceful shutdown of the application.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => { // Close the MongoDB connection.
      console.log(
        'Mongoose connection is disconnected due to app termination...'
      );
      process.exit(0); // Exit the process after the connection is closed.
    });
  });
};                             
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

import fs from "fs";
import path from "path";

const uploadDir = "./uploads";

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const upload =  async (context) => {

    // type UploadBody = { file : File | Blob };
    const { body, set } = context;
   if (!body || !body.file) {
     set.status = 400;
     return { error: "No file uploaded" };
   }
 
   const file = body.file; // Ensure the file is treated as a Blob
   const arrayBuffer = await file.arrayBuffer(); // Convert Blob to Buffer
   const buffer = Buffer.from(arrayBuffer);
 
   // Generate a unique filename
   const fileName = Date.now()+'-'+file.name;
   const filePath = path.join(uploadDir, fileName);
 
   // Save file
   fs.writeFileSync(filePath, buffer);
 }

export default upload; // Export configured multer instance
                                                            
                ` },
                {
                  folder: '', name: '.env', content:
`PORT=3000
MONGODB_URI=mongodb://localhost:27017/
DB_NAME=test
DB_USER=
DB_PASS=
IS_HTTPS=false
KEYPATH=
CARTPATH=
JWT_SECRET=
` } ,

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
node-initdb -m -e -t


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
    cmd : '@elysiajs/cors @elysiajs/jwt @elysiajs/node dotenv elysia elysia-helmet elysia-rate-limit fs https mongoose jsonwebtoken'
};

export default mongo;