const addModule= {
    folders: ['Controllers', 'Routes', 'Models'],
    mfiles:(name:any) =>{
        return [{folder: 'Models', name: `${name}.Model.js`, content:
            `
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const ${name}Schema = new Schema({
  // String field with required validation, minimum length, maximum length, and default value
  stringField: {
    type: String,
    required: [true, 'String field is required'], // Field is required
    minlength: [5, 'String field must be at least 5 characters long'], // Minimum length constraint
    maxlength: [50, 'String field must be less than 50 characters long'], // Maximum length constraint
    default: 'Default String' // Default value if not provided
  },
  // Number field with required validation, minimum value, maximum value, and default value
  numberField: {
    type: Number,
    required: [true, 'Number field is required'], // Field is required
    min: [0, 'Number field must be at least 0'], // Minimum value constraint
    max: [100, 'Number field must be less than or equal to 100'], // Maximum value constraint
    default: 42 // Default value if not provided
  },
  // Date field with default value set to current date and time
  dateField: {
    type: Date,
    default: Date.now // Default value set to current date and time
  },
  // Buffer field for storing binary data (no specific validation or default value provided here)
  bufferField: Buffer,
  // Boolean field with default value
  booleanField: {
    type: Boolean,
    default: false // Default value if not provided
  },
  // Mixed field that can hold any type of value, with an empty object as default
  mixedField: {
    type: Schema.Types.Mixed,
    default: {} // Default value is an empty object
  },
  // ObjectId field for referencing another document (self-referencing for ${name})
  objectIdField: {
    type: Schema.Types.ObjectId,
    ref: '${name}Model' // Reference to self (${name} purposes only)
  },
  // Array field containing strings, with default values
  arrayField: {
    type: [String],
    default: ['defaultItem1', 'defaultItem2'] // Default array with two items
  },
  // Decimal128 field for high-precision decimal values
  decimal128Field: {
    type: Schema.Types.Decimal128,
    default: 0.0 // Default value is 0.0
  },
  // Map field for storing key-value pairs of strings
  mapField: {
    type: Map,
    of: String,
    default: new Map([['key1', 'value1'], ['key2', 'value2']]) // Default map with key-value pairs
  },
  // Nested object with fields containing default values
  nestedObject: {
    nestedString: {
      type: String,
      default: 'Nested Default String' // Default value for nestedString
    },
    nestedNumber: {
      type: Number,
      default: 10 // Default value for nestedNumber
    }
  },
  // List of lists containing nested arrays of numbers with default values
  listOfLists: {
    type: [[Number]],
    default: [[1, 2, 3], [4, 5, 6]] // Default list of lists with nested numbers
  },
  // List of objects with subfields and default values
  listOfObjects: {
    type: [{
      subField1: {
        type: String,
        default: 'SubField Default' // Default value for subField1
      },
      subField2: {
        type: Number,
        default: 100 // Default value for subField2
      }
    }],
    default: [{ subField1: 'Default1', subField2: 100 }, { subField1: 'Default2', subField2: 200 }] // Default array of objects
  },
  // Email field with validation for format, uniqueness, and trimming
  emailField: {
    type: String,
    required: [true, 'Email is required'], // Field is required
    unique: true, // Ensure uniqueness
    lowercase: true, // Convert to lowercase
    trim: true, // Trim whitespace
    match: [/\S+@\S+\.\S+/, 'Invalid email address'] // Validate format using regex
  }
}, {
  timestamps: true, // Add createdAt and updatedAt timestamps
  versionKey: false // Disable versioning
});

// Add index on emailField for uniqueness
${name}Schema.index({ emailField: 1 }, { unique: true });

// Middleware ${name} (pre-save hook for validation)
${name}Schema.pre('save', function(next) {
  // Add custom logic before saving
  console.log('Saving document...');
  next();
});

// Create the model based on the schema
const ${name}Model = mongoose.model('${name}', ${name}Schema);

// Export the model for use in other parts of the application
module.exports = ${name}Model;`
        },
      
        {
          folder: 'Controllers',
          name: `${name}.Controller.js`,
          content:
              `
// Importing HTTP status codes and messages from utilities
const { Codes, Messages } = require("../Utils/httpCodesAndMessages");
// Importing the response handler utility for managing API responses
const ResponseHandler = require("../Utils/responseHandler");
const ${name}Model = require("../Models/${name}.Model");

module.exports = {
  create${name}: async (req, res, next) => {
    try {
      const result = await ${name}Model(req.body).save();;
      ResponseHandler.sendSuccess(res, result, Codes.CREATED, Messages.DATA_CREATED_SUCCESS);
      return;
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
      return;
    }
  },

  get${name}: async (req, res, next) => {
    try {
      if (req.query.id) {
        const result = await ${name}Model.findById(req.query.id);
        if (!result) {
          ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
          return;
        }
        ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
        return;
      } else {
        let page = req.query.page || 1
        let limit = 10
        const skip = (page - 1) * limit
        const result = await ${name}Model.find().skip(skip).limit(limit);
        const totalItem = await ${name}Model.countDocuments()
        const totalPages = Math.ceil(totalItem / limit)
        const results = { result, totalPages }
        ResponseHandler.sendSuccess(res, results, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
        return;
      }
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
      return;
    }
  },

  update${name}: async (req, res, next) => {
    try {
      if (req.query.id) {
        const result = await ${name}Model.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!result) {
          ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
          return;
        }
        ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_UPDATED_SUCCESS);
        return;
      } else {
        ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
        return;
      }
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
    }
  },

  delete${name}: async (req, res, next) => {
    try {
      if (req.query.id) {
        const result = await ${name}Model.findByIdAndDelete(req.query.id);
        if (!result) {
          ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
          return;
        }
        ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
        return;
      }else {
        ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
        return;
      }
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
    }
  }
}
              ` },


        {
          folder: 'Routes',
          name: `${name}.Route.js`,
          content:
              `
const express = require("express");
// Creating a router instance from express to define route handlers
const router = express.Router();

// Importing the Controllers 
const ${name}Controller = require("../Controllers/${name}.Controller")

// Defining a route 
router.post("/" ,${name}Controller.create${name});
router.get("/" ,${name}Controller.get${name});
router.put("/" ,${name}Controller.update${name});
router.delete("/" ,${name}Controller.delete${name});

// Exporting the router instance to be used in other parts of the application
module.exports = router;
              ` },
      
      
      ]
    },
    sfiles:(name:any) =>{
      return [{folder: 'Models', name: `${name}.Model.js`, content:`
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Update the path as necessary

const ${name}Model = sequelize.define('${name}Model', {
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
    // ObjectId field for referencing another document (self-referencing for ${name})
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
    tableName: '${name}_models',
    timestamps: true
});

// Add index on emailField for uniqueness
${name}Model.addIndex({
    fields: ['emailField'],
    unique: true
});

// Middleware ${name} (beforeCreate hook for validation)
${name}Model.beforeCreate((${name}, options) => {
    console.log('Creating document...');
});

module.exports = ${name}Model;
      `},
    {
      folder: 'Controllers',
      name: `${name}.Controller.js`,
      content:`
// Importing HTTP status codes and messages from utilities
const { Codes, Messages } = require("../Utils/httpCodesAndMessages");
// Importing the response handler utility for managing API responses
const ResponseHandler = require("../Utils/responseHandler");
const ${name}Model = require("../Models/${name}.Model");

module.exports = {
  create${name}: async (req, res, next) => {
    try {
      const result = await ${name}Model.create(req.body);
      ResponseHandler.sendSuccess(res, result, Codes.CREATED, Messages.DATA_CREATED_SUCCESS);
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
    }
  },

  get${name}: async (req, res, next) => {
    try {
      if (req.query.id) {
        const result = await ${name}Model.findByPk(req.query.id);
        if (!result) {
          ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
          return;
        }
        ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
      } else {
        let page = req.query.page || 1;
        let limit = 10;
        const offset = (page - 1) * limit;
        const result = await ${name}Model.findAll({ offset, limit });
        const totalItem = await ${name}Model.count();
        const totalPages = Math.ceil(totalItem / limit);
        const results = { result, totalPages };
        ResponseHandler.sendSuccess(res, results, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
      }
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
    }
  },

  update${name}: async (req, res, next) => {
    try {
      if (req.query.id) {
        const updated${name} = await ${name}Model.update(req.body, {
          where: { id: req.query.id },
          returning: true
        });
        if (!updated${name}[0]) {
          ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
          return;
        }
        ResponseHandler.sendSuccess(res, updated${name}[1][0], Codes.OK, Messages.DATA_UPDATED_SUCCESS);
      } else {
        ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
    }
  },

  delete${name}: async (req, res, next) => {
    try {
      if (req.query.id) {
        const result = await ${name}Model.destroy({ where: { id: req.query.id } });
        if (!result) {
          ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
          return;
        }
        ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_DELETED_SUCCESS);
      } else {
        ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      next(error);
    }
  }
}
      `

    },
    {
      folder: 'Routes',
      name: `${name}.Route.js`,
      content:
          `
const express = require("express");
// Creating a router instance from express to define route handlers
const router = express.Router();

// Importing the Controllers 
const ${name}Controller = require("../Controllers/${name}.Controller")

// Defining a route 
router.post("/" ,${name}Controller.create${name});
router.get("/" ,${name}Controller.get${name});
router.put("/" ,${name}Controller.update${name});
router.delete("/" ,${name}Controller.delete${name});

// Exporting the router instance to be used in other parts of the application
module.exports = router;
          ` }
    ]
    }

}
export default addModule;