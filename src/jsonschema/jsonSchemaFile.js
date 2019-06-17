'use strict';

const debug = require('debug')('xsd2jsonschema:JsonSchemaFile');

const path = require('path');
const URI = require('urijs');
const clone = require('clone');
const deepEql = require('deep-eql');
const utils = require('../utils');
const Constants = require('../constants');
const PropertyDefinable = require('../propertyDefinable');
const jsonSchemaTypes = require('./jsonSchemaTypes');
const XsdAttributeValues = require('../xmlschema/xsdAttributeValues');

//const parent_NAME = Symbol();
//const targetSchema_NAME = Symbol();

const properties = [
	'namespaceMode',
	'parent',
	'filename',
	'targetSchema',
	'targetNamespace',
	'ref',
	'$ref',
	'id',
	'schemaId',
	'subSchemas',
	'$schema',
	'title',
	'description',
	'default',
	'format',
	'multipleOf',
	'maximum',
	'exclusiveMaximum',
	'minimum',
	'exclusiveMinimum',
	'maxLength',
	'minLength',
	'pattern',
	'additionalItems',
	'items',
	'maxItems',
	'minItems',
	'uniqueItems',
	'maxProperties',
	'minProperties',
	'required',
	'additionalProperties',
	'properties',
	'patternProperties',
	'dependencies',
	'enum',
	'type',
	'allOf',
	'anyOf',
	'oneOf',
	'not',
	'definitions'
]

/**
 * JSON Schema file operations.  This is based on the JSON Schema meta-schema located at http://json-schema.org/draft-04/schema#.  
 * 
 * 
 * Please see http://json-schema.org for more details.
 */

class JsonSchemaFile extends PropertyDefinable {
	/**
	 * 
	 * @param {Object} options - And object used to override default options.
	 * @param {string} options.baseFilename - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.baseId - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.targetNamespace - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.title - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.$ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {JsonSchmeaFileV4} options.parent - A reference to the parent JSON Schema.
	 * @param {string} options.namespaceMode - The method of handling namespaces. Must be one of: undefined, SUBSCHEMA, or FILENAME
	 */
	constructor(options) {
		var superProperties;
		if (options != undefined && options.properties !== undefined) {
			superProperties = [ ... new Set(properties.concat(options.properties))];
		} else {
			superProperties = properties;
		}
		super({
			propertyNames: superProperties
		});

		this.parent = undefined;
		this.filename = undefined;
		this.targetSchema = this;
		this.targetNamespace = undefined;
		this.ref = undefined; // used to hold a JSON Pointer reference to this named type (Not used for anonymous types)
		this.$ref = undefined; // used when this schema is an instance of a reference

		// JSON Schema draft v4 (core definitions and terminology referenced)
		// 7.2 URI resolution scope alteration with the 'id'
		this.id = undefined; // uri
		// 3.4 Root schema, subschema  (7.2.2 Usage)
		this.subSchemas = {};
		this.$schema = undefined; // uri

		// JSON Schema Validation specification sections referenced unless otherwise noted
		// 6.1 Metadata keywords 'title' and 'description'
		this.title = undefined;
		this.description = undefined; // Might need to initialize to '' for concatDescription()

		// 6.2 Default
		this.default = undefined; // There are no restrictions placed on the value of this keyword.

		// 7 Semantic validation with 'format'
		this.format = undefined;

		// 5.1.  Validation keywords for numeric instances (number and integer)
		this.multipleOf = undefined; // multiple of 2 is 2, 4, 8, etc. 
		this.maximum = undefined;
		this.exclusiveMaximum = false; // 5.1.2.3
		this.minimum = undefined;
		this.exclusiveMinimum = false; // 5.1. 3.3

		// 5.2.  Validation keywords for strings
		this.maxLength = undefined;
		this.minLength = 0; // 5.2.2.3
		this.pattern = undefined; // 5.2.3.1 ECMA 262 regular expression dialect

		// 5.3.  Validation keywords for arrays
		this.additionalItems = {}; // 5.3.1.1 boolean or a schema
		this.items = {}; // 5.3.1.4 schema or an array of schemas but the default value is an empty schema
		this.maxItems = undefined;
		this.minItems = 0; // 5.3.3.3
		this.uniqueItems = false; // 5.3.4.3

		// 5.4.  Validation keywords for objects
		this.maxProperties = undefined;
		this.minProperties = 0; // 5.4.2.3
		this.required = []; // 5.4.3.1 string array - must have unique values and minimum length=1
		this.additionalProperties = undefined; // boolean or a schema
		this.properties = {}; // 5.4.4.1 MUST be an object. Each property of this object MUST be a valid JSON Schema.
		this.patternProperties = {}; // 5.4.4.1 MUST be an object. Each property name of this object SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect. Each property value of this object MUST be a valid JSON Schema.

		// 5.4.5.  Dependencies
		// This keyword's value MUST be an object. Each value of this object MUST be either an object or an array.
		// If the value is an object, it MUST be a valid JSON Schema. This is called a schema dependency.
		// If the value is an array, it MUST have at least one element. Each element MUST be a string, and elements in the array MUST be unique. This is called a property dependency.
		this.dependencies = {};

		// 5.5.  Validation keywords for any instance type
		this.enum = []; // 5.5.1.1 Elements in the array MUST be unique.
		this.type = undefined; // string or string array limited to the seven primitive types (simpleTypes)

		this.allOf = []; // 5.5.3.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
		this.anyOf = []; // 5.5.4.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
		this.oneOf = []; // 5.5.5.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
		this.not = {}; // 5.5.6.1 This object MUST be a valid JSON Schema.

		this.definitions = undefined; // 5.5.7.1 MUST be an object. Each member value of this object MUST be a valid JSON Schema.

		if (options !== undefined) {
			if (options.schemaId !== undefined) {
				this.schemaId = options.schemaId;
			}
			if (options.title !== undefined) {
				this.title = options.title;
			}
			// This needs to be documented  (CHANGE THIS TO URI AND IMPLEMENT LOCAL REFERENCES)
			if (options.ref !== undefined) {
				this.ref = options.ref;
			}
			// This needs to be documented
			if (options.$ref !== undefined) {
				this.$ref = options.$ref;
			}
			// If available set the reference to the parent schema.
			if (options.parent !== undefined) {
				this.parent = options.parent;
			}

			if (options.baseFilename !== undefined) {
				this.targetNamespace = options.targetNamespace;
				const filePath = path.parse(options.baseFilename);
				const baseFilename = filePath.name;
				// If available set the namespaceMode.  This is used when creating $ref values to suport subschemas.
				if (options.namespaceMode !== undefined) {
					this.namespaceMode = options.namespaceMode;
				}
				if (this.namespaceMode === Constants.FILENAME) {
					this.filename = path.join(filePath.dir, baseFilename + utils.getSafeNamespace(this.targetNamespace).replace(/\//g, '.') + '.json');
				} else {
					this.filename = path.join(filePath.dir, baseFilename + '.json');
				}
				this.id = new URI(options.baseId === undefined ? '' : options.baseId).filename(baseFilename + '.json').toString();
				this.$schema = options.$schema;
				if (this.title === undefined) {
					this.title = `This JSON Schema file was generated from ${options.baseFilename} on ${new Date()}.  For more information please see http://www.xsd2jsonschema.org`;
				}
				this.type = jsonSchemaTypes.OBJECT;
				this.initializeSubschemas();
			}
		}
	}

	/**
	 * Creates a child JsonSchemaFile using the given options. The parent is set automatically.
	 * 
	 * @param {Object} options - And object used to override default options.
	 * @param {string} options.baseFilename - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.baseId - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.targetNamespace - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.title - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.$ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param (JsonSchemaFile) options.parent - this parameter is set to the current JsonSchemaFile.
	 * 
	 * @returns {JsonSchemaFile} - Returns a new JsonSchemaFile that has the current JsonSchemaFile.
	 */
/*
	newJsonSchemaFile(options) {
		debug('Warning: JsonSchemaFile.newJsonSchemaFile() should only be called from JsonSchemaFile and only when ');
		if (this.newJsonSchemaFile.caller != 'JsonSchemaFile') {
			throw new Error('You a junkie or what dude?');
		}
		if (options != undefined) {
			options.parent = this; 
			return new JsonSchemaFile(options);
		} else {
			return new JsonSchemaFile({ parent: this });
		}
	}
*/

	/**
	 * Creates all subschemas identified by an array of subschema names and initializes the targetSchema to the inner-most subschema.
	 * 
	 * @param {JsonSchemaFile} schema - a JsonSchemaFile that will have nested subschemas.
	 * @param {Array} namespaces - An array of String values representing the components of a URL without the scheme.
	 * @returns {void}
	 */
	createNestedSubschema(schema, namespaces) {
		const subschemaName = namespaces.shift();
		const newSubSchema = schema.newJsonSchemaFile();
		schema.subSchemas[subschemaName] = newSubSchema;
		this.targetSchema = newSubSchema; // Track the innermost schema as the target
		if (namespaces.length > 0) {
			this.createNestedSubschema(newSubSchema, namespaces);
		}
	}

	/**
	 * Initializes the subschemas for this JsonSchemaFile from the previously initialized targetNamespace member.  The targetNamespace is
	 * generally represented by a URL.  This URL is broken down into its constituent parts and each part becomes a subschema.
	 * 
	 * @returns {void}
	 */
	initializeSubschemas() {
		if (this.targetNamespace !== undefined && this.namespaceMode === Constants.SUBSCHEMA) {
			var subschemaStr = utils.getSafeNamespace(this.targetNamespace);
			if (!this.isEmpty(subschemaStr)) {
				var namespaces = subschemaStr.split('/');
				if (namespaces.length > 1) {
					namespaces.shift();
				}
				this.createNestedSubschema(this, namespaces);
			}
		} else {
			//this.createNestedSubschema(this, [Constants.DEFINITIONS]);
			
			this.definitions = this.newJsonSchemaFile();
			this.targetSchema = this.definitions;
		}
	}

	/**
	 * Returns true if the val is: null, undefined, a zero length string, a zero length array, or an object with no properties.
	 * 
	 * @param {Object|String|Array} val - The value to determine whether or not is empty.
	 * @returns {Boolean} - Returns true if val is empty.
	 */
	isEmpty(val) {
		if (typeof val == 'undefined' || val == 'undefined' || val == null) {
			return true;
		}
		if (typeof val === 'string' && val.length === 0) {
			return true;
		}
		if (typeof val === 'object') {
			if (Array.isArray(val)) {
				return (val.length === 0)
			} else {
				const symbols = Object.getOwnPropertySymbols(val);
				const keys = Object.keys(val);
				if ((symbols.length === 0) && (keys.length === 0)) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Returns true if the all members of the JsonSchemaFile are empty as defined by isEmpty().
	 * 
	 * @returns {Boolean} - Returns true if the all members of the JsonSchemaFile are empty.
	 */
	isBlank() {
		if (!this.isEmpty(this.parent)) {
			return false;
		}
		if (!this.isEmpty(this.filename)) {
			return false;
		}
		if (!this.isEmpty(this.targetSchema) && this.targetSchema !== this) {
			return false;
		}
		if (!this.isEmpty(this.targetNamespace)) {
			return false;
		}
		if (!this.isEmpty(this.ref)) {
			return false;
		}
		if (!this.isEmpty(this.$ref)) {
			return false;
		}

		// JSON Schema draft v4 (core definitions and terminology referenced)
		// 7.2 URI resolution scope alteration with the 'id'
		if (!this.isEmpty(this.id)) {
			return false;
		}

		// 3.4 Root schema, subschema  (7.2.2 Usage)
		if (!this.isEmpty(this.$schema)) {
			return false;
		}

		// 6.1 Metadata keywords 'title' and 'description'
		if (!this.isEmpty(this.title)) {
			return false;
		}
		if (!this.isEmpty(this.description)) {
			return false;
		}

		// 5.5.  Validation keywords for any instance type (Type moved up here from the rest of 5.5 below for output formatting)
		if (!this.isEmpty(this.type)) {
			return false;
		}

		// 5.1.  Validation keywords for numeric instances (number and integer)
		if (!this.isEmpty(this.multipleOf)) {
			return false;
		}
		if (!this.isEmpty(this.minimum)) {
			return false;
		}
		if (!this.isEmpty(this.exclusiveMinimum) && this.exclusiveMinimum !== false) {
			return false;
		}
		if (!this.isEmpty(this.maximum)) {
			return false;
		}
		if (!this.isEmpty(this.exclusiveMaximum) && this.exclusiveMaximum !== false) {
			return false;
		}

		// 5.2.  Validation keywords for strings
		if (!this.isEmpty(this.minLength) && this.minLength !== 0) {
			return false;
		}
		if (!this.isEmpty(this.maxLength)) {
			return false;
		}
		if (!this.isEmpty(this.pattern)) {
			return false;
		}

		// 5.5.  Validation keywords for any instance type
		if (!this.isEmpty(this.enum)) {
			return false;
		}
		if (!this.isEmpty(this.allOf)) {
			return false;
		}
		if (!this.isEmpty(this.anyOf)) {
			return false;
		}
		if (!this.isEmpty(this.oneOf)) {
			return false;
		}
		if (!this.isEmpty(this.not)) {
			return false;
		}

		// 6.2 Default
		if (!this.isEmpty(this.default)) {
			return false;
		}

		// 7 Semantic validation with 'format'
		if (!this.isEmpty(this.format)) {
			return false;
		}

		// 5.4.5.  Dependencies
		if (!this.isEmpty(this.dependencies)) {
			return false;
		}

		// 5.3.  Validation keywords for arrays
		if (!this.isEmpty(this.additionalItems)) {
			return false;
		}
		if (!this.isEmpty(this.maxItems)) {
			return false;
		}
		if (!this.isEmpty(this.minItems) && this.minItems != 0) {
			return false;
		}
		if (!this.isEmpty(this.uniqueItems) && this.uniqueItems !== false) {
			return false;
		}
		if (!this.isEmpty(this.items)) {
			return false;
		}

		// 5.4.  Validation keywords for objects
		if (!this.isEmpty(this.maxProperties)) {
			return false;
		}
		if (!this.isEmpty(this.minProperties) && this.minProperties !== 0) {
			return false;
		}
		if (!this.isEmpty(this.additionalProperties)) {
			return false;
		}
		if (!this.isEmpty(this.properties)) {
			return false;
		}
		if (!this.isEmpty(this.patternProperties)) {
			return false;
		}
		if (!this.isEmpty(this.required)) {
			return false;
		}

		if (!this.isEmpty(this.definitions)) {
			return this.definitions.isBlank();
		}

		if (!this.isEmpty(this.subSchemas)) {
			return false;
		}

		return true;
	}

	/**
	 * Sets a subSchema on the targetSchema.  The targetSchema is not updated because it represents the active XSD Namespace.
	 * 
	 * @param {String} schemaName - the name of the subschema.
	 * @param {JsonSchemaFile} subSchema - a JsonSchemaFile representing the subschema.
	 * 
	 * @returns {JsonSchemaFile} subSchema - the subSchema parameter is returned for chaining or for use updating the targetSchema
	 * if constructing a schema manually.
	 */
	setSubSchema(schemaName, subSchema) {
		this.targetSchema.subSchemas[schemaName] = subSchema;
		return subSchema;
	}

	/**
	 * Performs a recursive search through all subschemas for a schema with the given name.
	 * 
	 * @param {String} searchName - The name of the subschema to return.
	 * @returns {JsonSchemaFile} - Returns a JsonSchemaFile representing the requested subschema if found.
	 */
	getSubschema(searchName) {
		var retval;
		if (this.subSchemas[searchName] != undefined) {
			retval = this.subSchemas[searchName];
		} else {
			Object.keys(this.subSchemas).forEach(function (subschemaName, index, array) {
				retval = this.subSchemas[subschemaName].getSubschema(searchName);
			}, this);
		}
		return retval;
	}

	// Read-only properties
	/**
	 * Returns a $ref limited to the JSON Pointer in the ref URI fragement if the $ref is being used internally to this file.  Otherwise, the full ref URI is returned.
	 * 
	 * @param {JsonSchemaFile} - the parent of this $ref
	 * @returns {JsonSchemaFile} - a JsonSchemaFile representing a $ref to itself.
	 */
	get$RefToSchema(parent) {
		let refStr;
        if(parent == undefined) {
            throw new Error('Parameter "parent" is required');
        }
		if (this.ref == undefined) {
			refStr = this.$ref
		} else if (Object.is(parent.getTopLevelJsonSchema(), this.getTopLevelJsonSchema())) {
			refStr = '#' + this.ref.fragment();
		} else {
			refStr = this.ref.toString();
		}
		return this.newJsonSchemaFile({
			$ref: refStr,
			parent: parent
		});
	}

	/**
	 * Returns a JSON Pointer representation of the targetNamespace, which is generally based on a URL.
	 * 
	 * @returns {String} - JSON Pointer representation of the targetNamespace.
	 */
	getSubschemaJsonPointer() {
		if (this.namespaceMode == Constants.SUBSCHEMA) {
			return utils.getSafeNamespace(this.targetNamespace);
		}
		return '/' + Constants.DEFINITIONS;
	}

	findTopLevelSchema(type) {
		if (type.parent === undefined) {
			return type;
		}
		return this.findTopLevelSchema(type.parent);
	}

	/**
	 * Returns the top level JSON Schema for this schema by the parent without a parent.
	 * 
	 * @returns {JsonSchemaFile} - The top JsonSchemaFile representing a single file.
	 */
	getTopLevelJsonSchema() {
		if (this.parent === undefined) {
			return this;
		}
		return this.findTopLevelSchema(this.parent);
	}

	/**
	 * Returns the subschema used to track global attributes initiazing the subschema if needed.
	 * 
	 * @returns {JsonSchemaFile} - The subschema used to track global attributes.
	 */
	getGlobalAttributesSchema() {
		if (this.subSchemas[Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME] == undefined) {
			this.subSchemas[Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME] = this.newJsonSchemaFile();
		}
		return this.subSchemas[Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME];
	}

	/**
	 * Returns a POJO of this jsonSchema.  Items are added in the order we wouild like them to appear in the resulting JsonSchema.
	 * 
	 * @returns {Object} - POJO of this jsonSchema.
	 */
	getJsonSchema(jsonSchema) {
		if (jsonSchema == undefined) {
			jsonSchema = {};
		}

		if (!this.isEmpty(this.$ref)) {
			jsonSchema.$ref = this.$ref;
		}

		if (!this.isEmpty(this.id)) {
			//jsonSchema.id = this.id;
			jsonSchema[this.schemaId] = this.id
		}
		if (!this.isEmpty(this.$schema)) {
			jsonSchema.$schema = this.$schema;
		}

		// 6.1 Metadata keywords 'title' and 'description'
		if (!this.isEmpty(this.title)) {
			jsonSchema.title = this.title;
		}
		if (!this.isEmpty(this.description)) {
			jsonSchema.description = this.description;
		}

		// 5.5.  Validation keywords for any instance type (Type moved up here from the rest of 5.5 below for output formatting)
		if (!this.isEmpty(this.type)) {
			jsonSchema.type = this.type;
		}

		// 5.1.  Validation keywords for numeric instances (number and integer)
		if (!this.isEmpty(this.multipleOf)) {
			jsonSchema.multipleOf = this.multipleOf;
		}
		if (!this.isEmpty(this.minimum)) {
			jsonSchema.minimum = this.minimum;
		}
		if (!this.isEmpty(this.exclusiveMinimum) && this.exclusiveMinimum !== false) {
			jsonSchema.exclusiveMinimum = this.exclusiveMinimum;
		}
		if (!this.isEmpty(this.maximum)) {
			jsonSchema.maximum = this.maximum;
		}
		if (!this.isEmpty(this.exclusiveMaximum) && this.exclusiveMaximum !== false) {
			jsonSchema.exclusiveMaximum = this.exclusiveMaximum;
		}

		// 5.2.  Validation keywords for strings
		if (!this.isEmpty(this.minLength) && this.minLength !== 0) {
			jsonSchema.minLength = this.minLength;
		}
		if (!this.isEmpty(this.maxLength)) {
			jsonSchema.maxLength = this.maxLength;
		}
		if (!this.isEmpty(this.pattern)) {
			jsonSchema.pattern = this.pattern;
		}

		// 5.5.  Validation keywords for any instance type
		if (!this.isEmpty(this.enum)) {
			jsonSchema.enum = this.enum;
		}
		if (!this.isEmpty(this.allOf)) {
			jsonSchema.allOf = [];
			for (let i = 0; i < this.allOf.length; i++) {
				jsonSchema.allOf[i] = this.allOf[i].getJsonSchema();
			}
		}
		if (!this.isEmpty(this.anyOf)) {
			jsonSchema.anyOf = [];
			for (let i = 0; i < this.anyOf.length; i++) {
				jsonSchema.anyOf[i] = this.anyOf[i].getJsonSchema();
			}
		}
		if (!this.isEmpty(this.oneOf)) {
			jsonSchema.oneOf = [];
			for (let i = 0; i < this.oneOf.length; i++) {
				jsonSchema.oneOf[i] = this.oneOf[i].getJsonSchema();
			}
		}
		if (!this.isEmpty(this.not)) {
			jsonSchema.not = this.not.getJsonSchema();
		}

		// 6.2 Default
		if (!this.isEmpty(this.default)) {
			jsonSchema.default = this.default;
		}

		// 7 Semantic validation with 'format'
		if (!this.isEmpty(this.format)) {
			jsonSchema.format = this.format;
		}

		// 5.4.5.  Dependencies
		if (!this.isEmpty(this.dependencies)) {
			jsonSchema.dependencies = {}
			const propKeys = Object.keys(this.dependencies);
			propKeys.forEach(function (key, index, array) {
				if (Array.isArray(this.dependencies[key])) {
					jsonSchema.dependencies[key] = this.dependencies[key]; // property dependency
				} else {
					if (this.dependencies[key] !== undefined) {
						jsonSchema.dependencies[key] = this.dependencies[key].getJsonSchema(); // schema dependency
					}
				}
			}, this);
		}

		// 5.3.  Validation keywords for arrays
		if (!this.isEmpty(this.additionalItems)) {
			if (typeof (this.additionalItems) === 'boolean') {
				jsonSchema.additionalItems = this.additionalItems;
			} else {
				jsonSchema.additionalItems = this.additionalItems.getJsonSchema();
			}
		}
		if (!this.isEmpty(this.maxItems)) {
			jsonSchema.maxItems = this.maxItems;
		}
		if (!this.isEmpty(this.minItems) && this.minItems != 0) {
			jsonSchema.minItems = this.minItems;
		}
		if (!this.isEmpty(this.uniqueItems) && this.uniqueItems !== false) {
			jsonSchema.uniqueItems = this.uniqueItems;
		}
		if (!this.isEmpty(this.items)) {
			if (Array.isArray(this.items)) {
				jsonSchema.items = [];
				this.items.forEach(function (item, index, array) {
					jsonSchema.items[index] = item.getJsonSchema();
				}, this);
			} else {
				jsonSchema.items = this.items.getJsonSchema();
			}
		}

		// 5.4.  Validation keywords for objects
		if (!this.isEmpty(this.maxProperties)) {
			jsonSchema.maxProperties = this.maxProperties;
		}
		if (!this.isEmpty(this.minProperties) && this.minProperties !== 0) {
			jsonSchema.minProperties = this.minProperties;
		}
		if (!this.isEmpty(this.additionalProperties)) {
			jsonSchema.additionalProperties = this.additionalProperties;
		}
		if (!this.isEmpty(this.properties)) {
			jsonSchema.properties = {};
			const propKeys = Object.keys(this.properties);
			propKeys.forEach(function (key, index, array) {
				if (this.properties[key] !== undefined) {
					jsonSchema.properties[key] = this.properties[key].getJsonSchema();
				}
			}, this);
		}
		if (!this.isEmpty(this.patternProperties)) {
			jsonSchema.patternProperties = {};
			const propKeys = Object.keys(this.patternProperties);
			propKeys.forEach(function (key, index, array) {
				if (this.patternProperties[key] !== undefined) {
					jsonSchema.patternProperties[key] = this.patternProperties[key].getJsonSchema();
				}
			}, this);
		}
		if (!this.isEmpty(this.required)) {
			jsonSchema.required = this.required;
		}
		if (!this.isEmpty(this.definitions)) {
			jsonSchema.definitions = this.definitions.getJsonSchema();
		}
		if (!this.isEmpty(this.subSchemas)) {
			const subschemaNames = Object.keys(this.subSchemas);
			subschemaNames.forEach(function (subschemaName, index, array) {
				try {
					jsonSchema[subschemaName] = this.subSchemas[subschemaName].getJsonSchema();
				} catch (err) {
					debug(err);
					debug(this.subSchemas);
					throw err;
				}
			}, this);
		}

		return jsonSchema;
	}

	/**
	 * Returns a deep copy of this JsonSchemaFile.
	 * 
	 * @returns {JsonSchemaFile} - A deep copy of this JsonSchemaFile.
	 */
	clone() {
		return clone(this, true);
	}

	/**
	 * Returns true if the a deep copy of this JsonSchemaFile.
	 * 
	 * @param {JsonSchemaFile} other - The JsonSchemaFile to compare with this for equality.
	 * @returns {Boolean} - true if the JsonSchemaFile objects are equal.
	 */
	equals(other) {
		return deepEql(this, other);
	}

	/**
	 * Adds a String value to the enum array removing any duplicates.
	 * 
	 * @param {String} val - The string value to add to the enum array.
	 * @returns {void}
	 */
	addEnum(val) {
		if(this.enum.indexOf(val) == -1) {
			this.enum.push(val);
		}
	}

	/**
	 * Adds a String value to the required array.
	 * 
	 * @param {String} _required - String value to be added to the required array.
	 * @returns {void}
	 */
	addRequired(_required) {
		this.required.push(_required);
	}

	/**
	 * Returns the JsonSchemaFile property that corresponds to the given propertyName value.
	 * 
	 * @param {String} propertyName - The name of the property to return.
	 * @returns {JsonSchemaFile} - The JsonSchemaFile property that corresponds to the given propertyName value.
	 */
	getProperty(propertyName) {
		return this.properties[propertyName];
	}

	/**
	 * Sets the value of the given propertyName to the jsonSchema provided in the type parameter.
	 * 
	 * @param {String} propertyName - The name of the property
	 * @param {JsonSchemaFile} type - The jsonSchema for the given propertyName
	 * @returns {void}
	 */
	setProperty(propertyName, type) {
		this.properties[propertyName] = type;
	}

	/**
	 *  The notion of extending a base schema is implemented in JSON Schema using allOf with schemas.  The base
	 *  type is added to the allOf array as well as a new schema.  The new schema is returned to be built out
	 *  as the working schema.
	 * 
	 * @param {JsonSchemaFile} baseType - JSON Schema of the base type.
	 * @param {JsonSchemaFile} [extensionType] - One of the seven core JSON Schema types.
	 * @returns {void}
	 */
	extend(baseType, extensionType) {
		if (baseType == undefined) {
			throw new Error('Required parameter "baseType" is undefined');
		}
		this.allOf.push(baseType.get$RefToSchema(this));
		const extensionSchema = this.newJsonSchemaFile();
		if (extensionType != undefined) {
			extensionSchema.type = extensionType;
		}
		this.allOf.push(extensionSchema);
		return extensionSchema;
	}

	addOneOfSchema(oneOfSchema) {
		if (this.oneOf === undefined) {
			this.oneOf = this.newJsonSchemaFile();
		}
	}

	/**
	 * Creates a property with a name prefixed by the @sign to represet an XML attribute.
	 * 
	 * @param {String} propertyName - Name of the new property.
	 * @param {JsonSchemaFile} customType - JsonSchema governing the new property.
	 * @param {String} minOccursAttr - If this optional parameter equals 'required' the new property will
	 * be added to the jsonSchema's required array.
	 * @returns {void}
	 */
	addAttributeProperty(propertyName, customType, minOccursAttr) {
		if (propertyName == undefined) {
			throw new Error('Required parameter "propertyName" is undefined');
		}
		if (customType == undefined) {
			throw new Error('Required parameter "customType" is undefined');
		}
		const name = '@' + propertyName;
		if (minOccursAttr === XsdAttributeValues.REQUIRED) {
			this.addRequired(name);
		}
		this.setProperty(name, customType);
	}

	/**
	 * Adds the given property and lists it in the anyOf array as a singular required property.  This is used to
	 * expose a type from a subschema so it can be used in validation.
	 * 
	 * @see {@link NamespaceManager#getType|NamespaceManager.getType()}
	 * @param {String} name - The name of the property to be added.
	 * @param {JsonSchema} type - The property to be added.
	 * @returns {void}
	 */
	addRequiredAnyOfPropertyByReference(name, type) {
		if (name == undefined) {
			throw new Error('Required parameter "name" is undefined');
		}
		if (type == undefined) {
			throw new Error('Required parameter "type" is undefined');
		}
//		if (this.getProperty(name) == undefined) {
			var anyOfProp = this.newJsonSchemaFile();
			anyOfProp.addRequired(name);
			this.anyOf.push(anyOfProp);
			this.setProperty(name, type);
//		} else {
//			const msg = this.id + ' - Unable to add required anyOf property by reference because [' + name + '] is already defined as [' + this.getProperty(name) + ']  Not adding [' + type + ']';
			//debug(msg);
//			throw new Error(msg);
//		}
	}

	/**
	 * Returns true if the propertyName parameter represents a defined property dependency.  A 
	 * dependency is considered a defined property dependency if it is defined as an array. 
	 * 
	 * @param {String} propertyName - The Name of the property that may represent a property dependency
	 * as defined in 5.4.5 above. 
	 * @returns {Boolean} - True if the propertyName parameter represents a defined property dependency.
	 */
	isPropertyDependencyDefined(propertyName) {
		if (propertyName == undefined) {
			throw new Error('Required parameter "propertyName" is undefined');
		}
		if (this.dependencies[propertyName] != undefined && Array.isArray(this.dependencies[propertyName])) {
			return true;
		}
		return false;
	}

	/**
	 * Adds a property dependency allocating the dependency's array if needed.
	 * 
	 * @param {String} propertyName - The name of the property that will have a new dependency added.
	 * @param {String} dependencyProperty - The name of the property that propertyName is dependent on.
	 * @returns {void}
	 */
	addPropertyDependency(propertyName, dependencyProperty) {
		if (propertyName == undefined) {
			throw new Error('Required parameter "propertyname" is undefined');
		}
		if (dependencyProperty == undefined) {
			throw new Error('Required parameter "dependencyProperty" is undefined');
		}
		if (this.isPropertyDependencyDefined(propertyName)) {
			throw new Error('Property dependency already defined. "' + propertyName + '"');
		}
		if (this.dependencies[propertyName] == undefined) {
			this.dependencies[propertyName] = [];
		}
		this.dependencies[propertyName].push(dependencyProperty);
	}

	/**
	 * Adds a jsonSchema as a schema dependency with the given name.
	 * 
	 * @param {String} propertyName - The name of the property that will have a new dependency added.
	 * @param {JsonSchemaFile} dependencySchema - The jsonSchema representing the schema dependecy 
	 * as defined in 5.4.5 above. 
	 * @returns {void}
	 */
	addSchemaDependency(propertyName, dependencySchema) {
		if (propertyName == undefined) {
			throw new Error('Required parameter "propertyname" is undefined');
		}
		if (dependencySchema == undefined) {
			throw new Error('Required parameter "dependencySchema" is undefined');
		}
		if (this.dependencies[propertyName] == undefined) {
			this.dependencies[propertyName] = dependencySchema;
		} else {
			throw new Error('Unable to add schema dependency because [' + propertyName + '] is already defined as [' + this.dependencies[propertyName] + ']  Not adding [' + dependencySchema + ']');
		}
	}

	/**
	 * Removes any empty JsonSchemaFile entries from the given Array.
	 * 
	 * @see {@link BaseConversionVisitor#exitState|BaseConversionVisitor.exitState()}
	 * @param {Array} array - Array from which emtpy JsonSchemas will be removed.
	 * @returns {void}
	 */
	removeEmptySchemasFromArray(array) {
		if (array == undefined) {
			throw new Error('Required parameter "array" is undefined');
		}
		// Run throught the array back to front removing any blank schemas.
		for (let pos = array.length - 1; pos >= 0; pos--) {
			if (array[pos].isBlank()) {
				array.splice(pos, 1);
			}
		}
	}

	/**
	 * Remove empty schema's from this jsonSchema's array properties.
	 * 
	 * @see {@link BaseConversionVisitor#exitState|BaseConversionVisitor.exitState()}
	 * @returns {void}
	 */
	removeEmptySchemas() {
		this.removeEmptySchemasFromArray(this.allOf);
		this.removeEmptySchemasFromArray(this.anyOf);
		this.removeEmptySchemasFromArray(this.oneOf);
	}

	toString() {
		return JSON.stringify(this.getJsonSchema(), null, '\t');
	}

	isForwardRef() {
		return false;
	}

	isRef() {
		return !(this.$ref == undefined)
	}
}

module.exports = JsonSchemaFile;