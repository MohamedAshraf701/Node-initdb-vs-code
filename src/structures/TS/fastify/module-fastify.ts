const addModule = {
    folders: ['Controllers', 'Routes', 'Models'],
    mfiles:(name: any) =>{
        return [{folder: 'Models', name: `${name}.Model.ts`, content:
            `
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface I${name} extends Document {
  stringField: string;
  numberField: number;
  dateField?: Date;
  bufferField?: Buffer;
  booleanField: boolean;
  mixedField: any;
  objectIdField?: mongoose.Types.ObjectId;
  arrayField: string[];
  decimal128Field: mongoose.Types.Decimal128;
  mapField: Map<string, string>;
  nestedObject: {
    nestedString: string;
    nestedNumber: number;
  };
  listOfLists: number[][];
  listOfObjects: {
    subField1: string;
    subField2: number;
  }[];
  emailField: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ${name}Schema: Schema<I${name}> = new Schema<I${name}>(
  {
    // String field with required validation, min/max length, and default value
    stringField: {
      type: String,
      required: [true, 'String field is required'],
      minlength: [5, 'String field must be at least 5 characters long'],
      maxlength: [50, 'String field must be less than 50 characters long'],
      default: 'Default String',
    },
    // Number field with required validation, min/max value, and default value
    numberField: {
      type: Number,
      required: [true, 'Number field is required'],
      min: [0, 'Number field must be at least 0'],
      max: [100, 'Number field must be less than or equal to 100'],
      default: 42,
    },
    // Date field with default value set to the current date and time
    dateField: {
      type: Date,
      default: Date.now,
    },
    // Buffer field for storing binary data
    bufferField: Buffer,
    // Boolean field with default value
    booleanField: {
      type: Boolean,
      default: false,
    },
    // Mixed field that can hold any type of value, defaulting to an empty object
    mixedField: {
      type: Schema.Types.Mixed,
      default: {},
    },
    // ObjectId field for referencing another document (self-referencing for ${name})
    objectIdField: {
      type: Schema.Types.ObjectId,
      ref: '${name}Model',
    },
    // Array field containing strings, with default values
    arrayField: {
      type: [String],
      default: ['defaultItem1', 'defaultItem2'],
    },
    // Decimal128 field for high-precision decimal values
    decimal128Field: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
    // Map field for storing key-value pairs of strings
    mapField: {
      type: Map,
      of: String,
      default: new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    },
    // Nested object with fields containing default values
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
    // List of lists containing nested arrays of numbers with default values
    listOfLists: {
      type: [[Number]],
      default: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    },
    // List of objects with subfields and default values
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
    // Email field with validation for format, uniqueness, and trimming
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
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false, // Disables versioning
  }
);

// Add index on emailField for uniqueness
${name}Schema.index({ emailField: 1 }, { unique: true });

// Middleware example (pre-save hook for validation)
${name}Schema.pre<I${name}>('save', function (next) {
  console.log('Saving document...');
  next();
});

// Create the model based on the schema
const ${name}Model: Model<I${name}> = mongoose.model<I${name}>('${name}Model', ${name}Schema);

export default ${name}Model;

`
        },
      
        {
          folder: 'Controllers',
          name: `${name}.Controller.ts`,
          content:
              `
// Importing HTTP status codes and messages from utilities
import { Codes, Messages } from '../Utils/httpCodesAndMessages';
// Importing the response handler utility for managing API responses
import ResponseHandler from '../Utils/responseHandler';
import { FastifyRequest, FastifyReply } from 'fastify';
import ${name}Model from '../Models/${name}.Model';

export default {

  create${name}: async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try {
      const result = await new ${name}Model(req.body).save();
      ResponseHandler.sendSuccess(res, result, Codes.CREATED, Messages.DATA_CREATED_SUCCESS);
      return;
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      return;
    }
  },

  get${name}: async (req: FastifyRequest<{ Querystring: { id?: string; page?: string; limit?: string; } }>, res: FastifyReply): Promise<void> => {
    try {
      const { id, page } = req.query;

      if (id) {
        const result = await ${name}Model.findById(id as string);
        if (!result) {
          return ResponseHandler.sendError(res, "${name} not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
        }
        return ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
      }

      const currentPage = parseInt(page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const skip = (currentPage - 1) * limit;

      const [${name}s, totalItems] = await Promise.all([
        ${name}Model.find().skip(skip).limit(limit),
        ${name}Model.countDocuments()
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      ResponseHandler.sendSuccess(res, { ${name}s, totalPages }, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      return;
    }
  },

  update${name}: async (req: FastifyRequest<{ Querystring: { id?: string; }; }>, res: FastifyReply): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        return ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }

      const updated${name} = await ${name}Model.findByIdAndUpdate(id as string, req.body, { new: true });
      if (!updated${name}) {
        return ResponseHandler.sendError(res, "${name} not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
      }

      ResponseHandler.sendSuccess(res, updated${name}, Codes.OK, Messages.DATA_UPDATED_SUCCESS);
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
    }
  },

  delete${name}: async (req: FastifyRequest<{ Querystring: { id?: string; }; }>, res: FastifyReply): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        return ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }

      const deleted${name} = await ${name}Model.findByIdAndDelete(id as string);
      if (!deleted${name}) {
        return ResponseHandler.sendError(res, "${name} not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
      }

      ResponseHandler.sendSuccess(res, deleted${name}, Codes.OK, Messages.DATA_DELETED_SUCCESS);
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
    }
  }
};
              ` },

        {
          folder: 'Routes',
          name: `${name}.Route.ts`,
          content:
              `
/**
 * This module exports a function that defines routes for user operations.
 * It imports the UserController and sets up routes for creating, getting, updating, and deleting users.
 */

import ${name}Controller from '../Controllers/${name}.Controller';
import { FastifyInstance } from 'fastify';

/**
 * This function is used to define routes for the Fastify server related to user operations.
 * It sets up routes for creating, getting, updating, and deleting users.
 * 
 * @param {Fastify} fastify - The Fastify server instance.
 * @param {Object} options - Options for the route.
 */
async function ${name}Routes(fastify: FastifyInstance) {
    fastify.post("/" ,${name}Controller.create${name});
    fastify.get("/" ,${name}Controller.get${name});
    fastify.put("/" ,${name}Controller.update${name});
    fastify.delete("/" ,${name}Controller.delete${name});
}

export default ${name}Routes;
              ` },
      ];
    },
    sfiles:(name: any) =>{
      return [{folder: 'Models', name: `${name}.Model.ts`, content:`
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/dbConfig"; // Ensure correct path

// ✅ Define TypeScript Interface for Model Attributes
interface ${name}Attributes {
  id?: string;
  stringField: string;
  numberField: number;
  dateField?: Date;
  bufferField?: Buffer | null;
  booleanField: boolean;
  mixedField: any;
  objectIdField?: string;
  arrayField: string[];
  decimal128Field: number;
  mapField: Record<string, string>;
  nestedObject: {
    nestedString: string;
    nestedNumber: number;
  };
  listOfLists: number[][];
  listOfObjects: {
    subField1: string;
    subField2: number;
  }[];
  emailField: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Define TypeScript Interface for Creation (Excluding 'id')
interface ${name}CreationAttributes extends Optional<${name}Attributes, "id"> {}

// ✅ Define ${name}Model Class Extending Sequelize Model
class ${name}Model extends Model<${name}Attributes, ${name}CreationAttributes> implements ${name}Attributes {
  public id!: string;
  public stringField!: string;
  public numberField!: number;
  public dateField!: Date;
  public bufferField!: Buffer | null;
  public booleanField!: boolean;
  public mixedField!: any;
  public objectIdField!: string;
  public arrayField!: string[];
  public decimal128Field!: number;
  public mapField!: Record<string, string>;
  public nestedObject!: {
    nestedString: string;
    nestedNumber: number;
  };
  public listOfLists!: number[][];
  public listOfObjects!: {
    subField1: string;
    subField2: number;
  }[];
  public emailField!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// ✅ Initialize the ${name}Model
${name}Model.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stringField: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "String field is required" },
        len: {
          args: [5, 50],
          msg: "String field must be between 5 and 50 characters long",
        },
      },
      defaultValue: "Default String",
    },
    numberField: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Number field is required" },
        min: {
          args: [0],
          msg: "Number field must be at least 0",
        },
        max: {
          args: [100],
          msg: "Number field must be less than or equal to 100",
        },
      },
      defaultValue: 42,
    },
    dateField: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    bufferField: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    booleanField: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mixedField: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    objectIdField: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    arrayField: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ["defaultItem1", "defaultItem2"],
    },
    decimal128Field: {
      type: DataTypes.DECIMAL(38, 16),
      defaultValue: 0.0,
    },
    mapField: {
      type: DataTypes.JSON,
      defaultValue: { key1: "value1", key2: "value2" },
    },
    nestedObject: {
      type: DataTypes.JSON,
      defaultValue: { nestedString: "Nested Default String", nestedNumber: 10 },
    },
    listOfLists: {
      type: DataTypes.JSON,
      defaultValue: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    },
    listOfObjects: {
      type: DataTypes.JSON,
      defaultValue: [
        { subField1: "Default1", subField2: 100 },
        { subField1: "Default2", subField2: 200 },
      ],
    },
    emailField: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value: string) {
        this.setDataValue("emailField", value.trim().toLowerCase());
      },
      validate: {
        notNull: { msg: "Email is required" },
        isEmail: { msg: "Invalid email address" },
      },
    },
  },
  {
    sequelize,
    tableName: "${name}s",
    timestamps: true, // ✅ Enables createdAt & updatedAt fields
  }
);

// ✅ Export the ${name}Model for usage in other files
export default ${name}Model;

      `},
    {
      folder: 'Controllers',
      name: `${name}.Controller.ts`,
      content:`
// Importing HTTP status codes and messages from utilities
import { Codes, Messages } from '../Utils/httpCodesAndMessages';
// Importing the response handler utility for managing API responses
import ResponseHandler from '../Utils/responseHandler';
import { FastifyRequest, FastifyReply } from 'fastify';
import ${name}Model from '../Models/${name}.Model';

export const ${name}Controller = {
  // Health check endpoint

  create${name}: async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try {
      const result = await ${name}Model.create(req.body);
      ResponseHandler.sendSuccess(res, result, Codes.CREATED, Messages.DATA_CREATED_SUCCESS);
      return;
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      return;
    }
  },

  get${name}: async (req: FastifyRequest<{ Querystring: { id?: string; page?: string; limit?: string; } }>, res: FastifyReply): Promise<void> => {
    try {
      const { id, page } = req.query;

      if (id) {
        const result = await ${name}Model.findByPk(id as string);
        if (!result) {
          return ResponseHandler.sendError(res, "${name} not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
        }
        return ResponseHandler.sendSuccess(res, result, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
      }

      const pages = parseInt(page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 10;
      const offset = (pages - 1) * limit;

      const result = await ${name}Model.findAll({ offset, limit });
      const totalItem = await ${name}Model.count();
      const totalPages = Math.ceil(totalItem / limit);

      ResponseHandler.sendSuccess(res, { result, totalPages }, Codes.OK, Messages.DATA_RETRIEVED_SUCCESS);
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
      return;
    }
  },

  update${name}: async (req: FastifyRequest<{ Querystring: { id?: string; }; }>, res: FastifyReply): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        return ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }

      const [updatedCount, updated${name}s] = await ${name}Model.update(req.body, {
        where: { id: id as string },
        returning: true,
      });

      if (!updatedCount) {
        ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
        return;
      }

      ResponseHandler.sendSuccess(res, updated${name}s[0], Codes.OK, Messages.DATA_UPDATED_SUCCESS);
    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
    }
  },

  delete${name}: async (req: FastifyRequest<{ Querystring: { id?: string; }; }>, res: FastifyReply): Promise<void> => {
    try {
      const { id } = req.query;
      if (!id) {
        return ResponseHandler.sendError(res, "ID not provided", Codes.BAD_REQUEST, Messages.BAD_REQUEST);
      }
      const result = await ${name}Model.destroy({ where: { id: id as string } });
      if (!result) {
        ResponseHandler.sendError(res, "Data not found", Codes.NOT_FOUND, Messages.NOT_FOUND);
        return;
      }
      ResponseHandler.sendSuccess(res, {}, Codes.OK, Messages.DATA_DELETED_SUCCESS);

    } catch (error) {
      ResponseHandler.sendError(res, error, Codes.INTERNAL_SERVER_ERROR, Messages.INTERNAL_SERVER_ERROR);
    }
  }
};
      `

    },
    {
      folder: 'Routes',
      name: `${name}.Route.ts`,
      content:
          `
/**
 * This module exports a function that defines routes for ${name} operations.
 * It imports the ${name}Controller and sets up routes for creating, getting, updating, and deleting ${name}s.
 */

import { FastifyInstance } from 'fastify/fastify';
import { ${name}Controller } from '../Controllers/${name}.Controller';

/**
 * This function is used to define routes for the Fastify server related to ${name} operations.
 * It sets up routes for creating, getting, updating, and deleting ${name}s.
 * 
 * @param {Fastify} fastify - The Fastify server instance.
 * @param {Object} options - Options for the route.
 */

async function ${name}Routes(fastify: FastifyInstance) {
    fastify.post("/" ,${name}Controller.create${name});
    fastify.get("/" ,${name}Controller.get${name});
    fastify.put("/" ,${name}Controller.update${name});
    fastify.delete("/" ,${name}Controller.delete${name});
}

export default ${name}Routes;
          ` }
    ];
    }

};
export default addModule;