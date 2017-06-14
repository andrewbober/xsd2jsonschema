"use strict";

const path = require("path");
const fs = require("fs");
const URI = require("urijs");
const utils = require("../utils");
const jsonSchemaTypes = require("./jsonSchemaTypes");

const filename_NAME = Symbol();
// const resolvedFilename_NAME = Symbol();
const targetSchema_NAME = Symbol();
const targetNamespace_NAME = Symbol();
const ref_NAME = Symbol();
const $ref_NAME = Symbol();
const id_NAME = Symbol();
const subSchemas_NAME = Symbol();
const $schema_NAME = Symbol();
const title_NAME = Symbol();
const description_NAME = Symbol();
const default_NAME = Symbol();
const format_NAME = Symbol();
const multipleOf_NAME = Symbol();
const maximum_NAME = Symbol();
const exclusiveMaximum_NAME = Symbol();
const minimum_NAME = Symbol();
const exclusiveMinimum_NAME = Symbol();
const maxLength_NAME = Symbol();
const minLength_NAME = Symbol();
const pattern_NAME = Symbol();
const additionalItems_NAME = Symbol();
const items_NAME = Symbol();
const maxItems_NAME = Symbol();
const minItems_NAME = Symbol();
const uniqueItems_NAME = Symbol();
const maxProperties_NAME = Symbol();
const minProperties_NAME = Symbol();
const required_NAME = Symbol();
const additionalProperties_NAME = Symbol();
const properties_NAME = Symbol();
const patternProperties_NAME = Symbol();
const dependencies_NAME = Symbol();
const enum_NAME = Symbol();
const type_NAME = Symbol();
const allOf_NAME = Symbol();
const anyOf_NAME = Symbol();
const oneOf_NAME = Symbol();
const not_NAME = Symbol();
const definitions_NAME = Symbol();

/**
 * XML Schema file operations.  This is based on the JSON Schema meta-schema located at http://json-schema.org/draft-04/schema#.  
 * 
 * 
 * Please see http://json-schema.org for more details.
 */

class JsonSchemaFile {
	constructor(parms) {
		this.filename = undefined;
//		this.resolvedFilename = undefined;
		this.targetSchema = {};
		this.targetNamespace = undefined;
		this.ref = undefined;  // used to hold a JSON Pointer reference to this named type (Not used for anonymous types)
		this.$ref = undefined; // used when this schema is an instance of a reference

		// JSON Schema draft v4 (core definitions and terminology referenced)
		// 7.2 URI resolution scope alteration with the "id"
		this.id = undefined;  // uri
		// 3.4 Root schema, subschema  (7.2.2 Usage)
		this.subSchemas = {};
		this.$schema = undefined;  // uri

		// JSON Schema Validation specification sections referenced unless otherwise noted
		// 6.1 Metadata keywords "title" and "description"
		this.title = undefined;
		this.description = undefined;  // Might need to initialize to "" for concatDescription()

		// 6.2 Default
		this.default = undefined;

		// 7 Semantic validation with "format"
		this.format = undefined;

		// 5.1.  Validation keywords for numeric instances (number and integer)
		this.multipleOf = undefined;  // multiple of 2 is 2, 4, 8, etc. 
		this.maximum = undefined;
		this.exclusiveMaximum = false;  // 5.1.2.3
		this.minimum = undefined;
		this.exclusiveMinimum = false;  // 5.1. 3.3

		// 5.2.  Validation keywords for strings
		this.maxLength = undefined;
		this.minLength = 0;  // 5.2.2.3
		this.pattern = undefined;  // 5.2.3.1 ECMA 262 regular expression dialect

		// 5.3.  Validation keywords for arrays
		this.additionalItems = {};  // 5.3.1.1 boolean or a schema
		this.items = {};  // 5.3.1.4 schema or an array of schemas but the default value is an empty schema
		this.maxItems = undefined;
		this.minItems = 0;  // 5.3.3.3
		this.uniqueItems = false;  // 5.3.4.3

		// 5.4.  Validation keywords for objects
		this.maxProperties = undefined;
		this.minProperties = 0;  // 5.4.2.3
		this.required = [];  // 5.4.3.1 string array - must have unique values and minimum length=1
		this.additionalProperties = undefined;  // boolean or a schema
		this.properties = {};  // 5.4.4.1 MUST be an object. Each property of this object MUST be a valid JSON Schema.
		this.patternProperties = {};  // 5.4.4.1 MUST be an object. Each property name of this object SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect. Each property value of this object MUST be a valid JSON Schema.

		// 5.4.5.  Dependencies
		// This keyword's value MUST be an object. Each value of this object MUST be either an object or an array.
		// If the value is an object, it MUST be a valid JSON Schema. This is called a schema dependency.
		// If the value is an array, it MUST have at least one element. Each element MUST be a string, and elements in the array MUST be unique. This is called a property dependency.
		this.dependencies = {};

		// 5.5.  Validation keywords for any instance type
		this.enum = [];  // 5.5.1.1 Elements in the array MUST be unique.
		this.type = undefined;  // string or string array limited to the seven primitive types (simpleTypes)

		this.allOf = [];  // 5.5.3.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
		this.anyOf = [];  // 5.5.4.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
		this.oneOf = [];  // 5.5.5.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
		this.not = {};  // 5.5.6.1 This object MUST be a valid JSON Schema.

		this.definitions = {};  // 5.5.7.1 MUST be an object. Each member value of this object MUST be a valid JSON Schema.

		if (parms === undefined) {
			throw new Error("Parameter 'parms' is required");
		}
		if (parms.xsd != undefined) {
			const baseFilename = path.parse(parms.xsd.baseFilename).name;
			const maskedFilename = (parms.mask === undefined) ? baseFilename : baseFilename.replace(parms.mask, "");
			this.filename = maskedFilename + ".json";
			this.id = new URI(parms.baseId).filename(this.filename).toString();
			this.$schema = "http://json-schema.org/draft-04/schema#";
//			this.resolvedFilename = path.join(parms.resolveURI, this.filename);
			this.targetNamespace = parms.xsd.targetNamespace;
			this.title = "This JSON Schema file was generated from " + parms.xsd.baseFilename + " on " + new Date() + ".  For more information please see http://www.xsd2jsonschema.org";
			this.type = jsonSchemaTypes.OBJECT;
		}
		// This needs to be documented
		if (parms.ref !== undefined) {
			this.ref = parms.ref;
		}
		// This needs to be documented
		if (parms.$ref !== undefined) {
			this.$ref = parms.$ref;
		}

		this.initializeSubschemas();
	}

	createNestedSubschema(_subschemas, namespaces) {
		var subschemaName = namespaces.shift();
		_subschemas[subschemaName] = new JsonSchemaFile({});
		this.targetSchema = _subschemas[subschemaName];  // Track the innermost schema as the target
		if (namespaces.length > 0) {
			this.createNestedSubschema(_subschemas[subschemaName].subSchemas, namespaces);
		}
	}

	isEmpty(val) {
		if (typeof val == "undefined" || val == "undefined" || val == null) {
			return true;
		}
		if (typeof val === "string" && val.length === 0) {
			return true;
		}
		if (typeof val === "object") {
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

	initializeSubschemas() {
		if (this.targetNamespace === undefined) {
			return;
		}
		var subschemaStr = utils.getSafeNamespace(this.targetNamespace);
		if (!this.isEmpty(subschemaStr)) {
			var namespaces = subschemaStr.split("/");
			if (namespaces.length > 1) {
				namespaces.shift();
			}
			this.createNestedSubschema(this.subSchemas, namespaces);
		}
	}

	addSubSchema(schemaName, jsonSchema) {
		this.getTargetSchema().subSchemas[schemaName] = jsonSchema;
	}

	// Search through all schemas for a given schema name
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

	/*
		// Search through all schemas for a given schema name
		getSubschema(subschemaName) {
			return this.getSubschema(subschemaName);
		}
	*/

	// Read-only properties
	getTargetSchema() {
		if (this.isEmpty(this.targetSchema)) {
			this.targetSchema = this;
		}
		return this.targetSchema;
	}

	getTargetNamespace() {
		return this.targetNamespace;
	}

	getFilename() {
		return this.filename;
	}

	get$RefToSchema() {
		return this.ref == undefined ? this : new JsonSchemaFile({ $ref: this.ref });
	}

	getSubschemaStr() {
		return utils.getSafeNamespace(this.targetNamespace);
	}

	copy(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	// Return a POJO of this jsonschema
	getJsonSchema() {
		var propKeys;
		var jsonSchema = {};

		if (!this.isEmpty(this.$ref)) {
			jsonSchema.$ref = this.$ref;
		}

		if (!this.isEmpty(this.id)) {
			jsonSchema.id = this.id;
		}
		if (!this.isEmpty(this.$schema)) {
			jsonSchema.$schema = this.$schema;
		}

		// 6.1 Metadata keywords "title" and "description"
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
			jsonSchema.not = this.not;
		}

		// 6.2 Default
		if (!this.isEmpty(this.default)) {
			jsonSchema.default = this.default;
		}

		// 7 Semantic validation with "format"
		if (!this.isEmpty(this.format)) {
			jsonSchema.format = this.format;
		}

		// 5.4.5.  Dependencies
		if (!this.isEmpty(this.dependencies)) {
			jsonSchema.dependencies = {}
			propKeys = Object.keys(this.dependencies);
			propKeys.forEach(function (key, index, array) {
				if (Array.isArray(this.dependencies[key])) {
					jsonSchema.dependencies[key] = this.dependencies[key];  // property dependency
				} else {
					if (this.dependencies[key] !== undefined) {
						jsonSchema.dependencies[key] = this.dependencies[key].getJsonSchema();  // schema dependency
					}
				}
			}, this);
		}

		// 5.3.  Validation keywords for arrays
		if (!this.isEmpty(this.additionalItems)) {
			jsonSchema.additionalItems = this.additionalItems;
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
			propKeys = Object.keys(this.properties);
			propKeys.forEach(function (key, index, array) {
				if (this.properties[key] !== undefined) {
					jsonSchema.properties[key] = this.properties[key].getJsonSchema();
				}
			}, this);
		}
		if (!this.isEmpty(this.patternProperties)) {
			jsonSchema.patternProperties = {};
			propKeys = Object.keys(this.patternProperties);
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
			jsonSchema.definitions = {};
			propKeys = Object.keys(this.definitions);
			propKeys.forEach(function (key, index, array) {
				if (this.definitions[key] !== undefined) {
					jsonSchema.definitions[key] = this.definitions[key].getJsonSchema();
				}
			}, this);
		}

		if (!this.isEmpty(this.subSchemas)) {
			const subschemaNames = Object.keys(this.subSchemas);
			subschemaNames.forEach(function (subschemaName, index, array) {
				try {
					jsonSchema[subschemaName] = this.subSchemas[subschemaName].getJsonSchema();
				} catch (err) {
					console.log(err);
					console.log(this.subSchemas);
				}
			}, this);
		}

		return jsonSchema;
	}

	// Getters/Setters

	// filename
	get filename() {
		return this[filename_NAME];
	}
	set filename(newFilename) {
		this[filename_NAME] = newFilename;
	}

/*
	// resolvedFilename
	get resolvedFilename() {
		return this[resolvedFilename_NAME];
	}
	set resolvedFilename(newResolvedFilename) {
		this[resolvedFilename_NAME] = newResolvedFilename;
	}
*/

	// targetSchema
	get targetSchema() {
		return this[targetSchema_NAME];
	}
	set targetSchema(newTargetSchema) {
		this[targetSchema_NAME] = newTargetSchema
	}

	// targetNamespace
	get targetNamespace() {
		return this[targetNamespace_NAME];
	}
	set targetNamespace(newTargetNamespace) {
		this[targetNamespace_NAME] = newTargetNamespace;
	}

	// ref
	// used to hold a JSON Pointer reference to this named type (Not used for anonymous types)
	get ref() {
		return this[ref_NAME];
	}
	set ref(newRef) {
		this[ref_NAME] = newRef;
	}

	// $ref
	// used when this schema is an instance of a reference
	get $ref() {
		return this[$ref_NAME];
	}
	set $ref(new$ref) {
		this[$ref_NAME] = new$ref;
	}

	// id
	// JSON Schema draft v4 (core definitions and terminology referenced)
	// 7.2 URI resolution scope alteration with the "id"
	get id() {
		return this[id_NAME];  // uri
	}
	set id(newId) {
		this[id_NAME] = newId;  // uri
	}

	// subSchemas
	// 3.4 Root schema, subschema  (7.2.2 Usage)
	get subSchemas() {
		return this[subSchemas_NAME];
	}
	set subSchemas(newSubSchemas) {
		this[subSchemas_NAME] = newSubSchemas;
	}

	// $schema
	get $schema() {
		return this[$schema_NAME];  // uri
	}
	set $schema(new$schema) {
		this[$schema_NAME] = new$schema;  // uri
	}

	// title
	// JSON Schema Validation specification sections referenced unless otherwise noted
	// 6.1 Metadata keywords "title" and "description"
	get title() {
		return this[title_NAME];
	}
	set title(newTitle) {
		this[title_NAME] = newTitle;
	}

	// description
	get description() {
		return this[description_NAME];
	}
	set description(newDescription) {
		this[description_NAME] = newDescription;
	}

	// default
	get default() {
		return this[default_NAME];
	}
	set default(newDefault) {
		this[default_NAME] = newDefault;
	}

	// format
	get format() {
		return this[format_NAME];
	}
	set format(newFormat) {
		this[format_NAME] = newFormat;
	}

	// 5.1.  Validation keywords for numeric instances (number and integer)

	// multiple
	// multiple of 2 is 2, 4, 8, etc.
	get multipleOf() {
		return this[multipleOf_NAME];
	}
	set multipleOf(newMultipleOf) {
		this[multipleOf_NAME] = newMultipleOf;
	}

	// maximum
	get maximum() {
		return this[maximum_NAME];
	}
	set maximum(newMaximum) {
		this[maximum_NAME] = newMaximum;
	}

	// exclusiveMaximum
	get exclusiveMaximum() {
		return this[exclusiveMaximum_NAME];  // 5.1.2.3
	}
	set exclusiveMaximum(newExclusiveMaximum) {
		this[exclusiveMaximum_NAME] = newExclusiveMaximum;  // 5.1.2.3
	}

	// minimum
	get minimum() {
		return this[minimum_NAME];
	}
	set minimum(newMinimum) {
		this[minimum_NAME] = newMinimum;
	}

	// exclusiveMinimum
	get exclusiveMinimum() {
		return this[exclusiveMinimum_NAME];  // 5.1. 3.3
	}
	set exclusiveMinimum(newExclusivMinimum) {
		this[exclusiveMinimum_NAME] = newExclusivMinimum;  // 5.1. 3.3
	}

	// 5.2.  Validation keywords for strings

	// maxLength
	get maxLength() {
		return this[maxLength_NAME];
	}
	set maxLength(newMaxLength) {
		this[maxLength_NAME] = newMaxLength;
	}

	// minLength
	get minLength() {
		return this[minLength_NAME];  // 5.2.2.3
	}
	set minLength(newMinLength) {
		this[minLength_NAME] = newMinLength;  // 5.2.2.3
	}

	// pattern
	// 5.2.3.1 ECMA 262 regular expression dialect
	get pattern() {
		return this[pattern_NAME];
	}
	set pattern(newPattern) {
		this[pattern_NAME] = newPattern;
	}

	// 5.3.  Validation keywords for arrays

	// additionalItems
	// 5.3.1.1 boolean or a schema
	get additionalItems() {
		return this[additionalItems_NAME];
	}
	set additionalItems(newAdditionalItems) {
		this[additionalItems_NAME] = {};
	}

	// items
	// 5.3.1.4 schema or an array of schemas but the default value is an empty schema
	get items() {
		return this[items_NAME];
	}
	set items(newItems) {
		this[items_NAME] = newItems;
	}

	// maxItems
	get maxItems() {
		return this[maxItems_NAME];
	}
	set maxItems(newMaxItems) {
		this[maxItems_NAME] = newMaxItems;
	}

	// minItems
	get minItems() {
		return this[minItems_NAME];  // 5.3.3.3
	}
	set minItems(newMinItems) {
		this[minItems_NAME] = newMinItems;  // 5.3.3.3
	}

	// uniqueItems
	get uniqueItems() {
		return this[uniqueItems_NAME];  // 5.3.4.3
	}
	set uniqueItems(newUniqueItems) {
		this[uniqueItems_NAME] = newUniqueItems;  // 5.3.4.3
	}

	// 5.4.  Validation keywords for objects

	// maxProperties
	get maxProperties() {
		return this[maxProperties_NAME];
	}
	set maxProperties(newMaxProperties) {
		this[maxProperties_NAME] = newMaxProperties;
	}

	// minProperties
	get minProperties() {
		return this[minProperties_NAME];  // 5.4.2.3
	}
	set minProperties(newMinProperties) {
		this[minProperties_NAME] = newMinProperties;  // 5.4.2.3
	}

	// required
	// 5.4.3.1 string array - must have unique values and minimum length=1
	get required() {
		return this[required_NAME];
	}
	set required(newRequired) {
		this[required_NAME] = newRequired;
	}

	// additionalProperties
	get additionalProperties() {
		return this[additionalProperties_NAME];  // boolean or a schema
	}
	set additionalProperties(newAdditionalProperties) {
		this[additionalProperties_NAME] = newAdditionalProperties;  // boolean or a schema
	}

	// properties
	// 5.4.4.1 MUST be an object. Each property of this object MUST be a valid JSON Schema.
	get properties() {
		return this[properties_NAME];
	}
	set properties(newProperties) {
		this[properties_NAME] = newProperties;
	}

	// patternProperties
	// 5.4.4.1 MUST be an object. Each property name of this object SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect. Each property value of this object MUST be a valid JSON Schema.
	get patternProperties() {
		return this[patternProperties_NAME];
	}
	set patternProperties(newPatternProperties) {
		this[patternProperties_NAME] = newPatternProperties;
	}

	// dependencies
	// This keyword's value MUST be an object. Each value of this object MUST be either an object or an array.
	// If the value is an object, it MUST be a valid JSON Schema. This is called a schema dependency.
	// If the value is an array, it MUST have at least one element. Each element MUST be a string, and elements in the array MUST be unique. This is called a property dependency.
	get dependencies() {
		return this[dependencies_NAME];
	}
	set dependencies(newDependancies) {
		this[dependencies_NAME] = newDependancies;
	}

	// 5.5.  Validation keywords for any instance type

	// enum
	// 5.5.1.1 Elements in the array MUST be unique.
	get enum() {
		return this[enum_NAME];
	}
	set enum(newEnum) {
		this[enum_NAME] = newEnum;
	}

	// type
	// string or string array limited to the seven primitive types (simpleTypes)
	get type() {
		return this[type_NAME];
	}
	set type(newType) {
		this[type_NAME] = newType;
	}

	// allOf
	// 5.5.3.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
	get allOf() {
		return this[allOf_NAME];
	}
	set allOf(newAllOf) {
		this[allOf_NAME] = newAllOf;
	}

	// anyOf
	// 5.5.4.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
	get anyOf() {
		return this[anyOf_NAME];
	}
	set anyOf(newAnyOf) {
		this[anyOf_NAME] = newAnyOf;
	}

	// oneOf
	// 5.5.5.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
	get oneOf() {
		return this[oneOf_NAME];
	}
	set oneOf(newOneOf) {
		this[oneOf_NAME] = newOneOf;
	}

	// not
	// 5.5.6.1 This object MUST be a valid JSON Schema.
	get not() {
		return this[not_NAME];
	}
	set not(newNot) {
		this[not_NAME] = newNot;
	}

	// definitions
	// 5.5.7.1 MUST be an object. Each member value of this object MUST be a valid JSON Schema.
	get definitions() {
		return this[definitions_NAME];
	}
	set definitions(newDefinitions) {
		this[definitions_NAME] = newDefinitions;
	}


	clone() {
		var target = new JsonSchemaFile({});
		if (!this.isEmpty(this.ref)) {
			target.ref = this.copy(this.ref);
		}
		if (!this.isEmpty(this.$ref)) {
			target.$ref = this.copy(this.$ref);
		}
		if (!this.isEmpty(this.id)) {
			target.id = this.copy(this.id);
		}
		if (!this.isEmpty(this.subSchemas)) {
			target.subSchemas = this.copy(this.subSchemas);
		}
		if (!this.isEmpty(this.$schema)) {
			target.$schema = this.copy(this.$schema);
		}

		// 6.1 Metadata keywords "title" and "description"
		if (!this.isEmpty(this.title)) {
			target.title = this.copy(this.title);
		}
		if (!this.isEmpty(this.description)) {
			target.description = this.copy(this.description);
		}

		// 6.2 Default
		if (!this.isEmpty(this.default)) {
			target.default = this.copy(this.default);
		}

		// 7 Semantic validation with "format"
		if (!this.isEmpty(this.format)) {
			target.format = this.copy(this.format);
		}

		// 5.1.  Validation keywords for numeric instances (number and integer)
		if (!this.isEmpty(this.multipleOf)) {
			target.multipleOf = this.copy(this.multipleOf);
		}
		if (!this.isEmpty(this.maximum)) {
			target.maximum = this.copy(this.maximum);
		}
		if (!this.isEmpty(this.exclusiveMaximum) && this.exclusiveMaximum !== false) {
			target.exclusiveMaximum = this.copy(this.exclusiveMaximum);
		}
		if (!this.isEmpty(this.minimum)) {
			target.minimum = this.copy(this.minimum);
		}
		if (!this.isEmpty(this.exclusiveMinimum) && this.exclusiveMinimum !== false) {
			target.exclusiveMinimum = this.copy(this.exclusiveMinimum);
		}

		// 5.2.  Validation keywords for strings
		if (!this.isEmpty(this.maxLength)) {
			target.setMaxLength(this.copy(this.maxLength));
		}
		if (!this.isEmpty(this.minLength) && this.minLength !== 0) {
			target.setMinLength(this.copy(this.minLength));
		}
		if (!this.isEmpty(this.pattern)) {
			target.setPattern(this.copy(this.pattern));
		}

		// 5.3.  Validation keywords for arrays
		if (!this.isEmpty(this.additionalItems)) {
			target.additionalItems = this.copy(this.additionalItems);
		}
		if (!this.isEmpty(this.items)) {
			target.items = this.copy(this.items);
		}
		if (!this.isEmpty(this.maxItems)) {
			target.maxItems = this.copy(this.maxItems);
		}
		if (!this.isEmpty(this.minItems) && this.minItems !== 0) {
			target.minItems = this.copy(this.minItems);
		}
		if (!this.isEmpty(this.uniqueItems) && this.uniqueItems !== false) {
			target.uniqueItems = this.copy(this.uniqueItems);
		}

		// 5.4.  Validation keywords for objects
		if (!this.isEmpty(this.maxProperties)) {
			target.maxProperties = this.copy(this.maxProperties);
		}
		if (!this.isEmpty(this.minProperties) && this.minProperties !== 0) {
			target.minProperties = this.copy(this.minProperties);
		}
		if (!this.isEmpty(this.required)) {
			target.required = this.copy(this.required);
		}
		if (!this.isEmpty(this.additionalProperties)) {
			target.additionalProperties = this.copy(this.additionalProperties);
		}
		if (!this.isEmpty(this.properties)) {
			target.properties = this.copy(this.properties);
		}
		if (!this.isEmpty(this.patternProperties)) {
			target.patternProperties = this.copy(this.patternProperties);
		}

		// 5.4.5.  Dependencies
		if (!this.isEmpty(this.dependencies)) {
			target.dependencies = this.copy(this.dependencies);
		}

		// 5.5.  Validation keywords for any instance type
		if (!this.isEmpty(this.enum)) {
			target.enum = this.copy(this.enum);
		}
		if (!this.isEmpty(this.type)) {
			target.type = this.copy(this.type);
		}

		if (!this.isEmpty(this.allOf)) {
			target.allOf = this.copy(this.allOf);
		}
		if (!this.isEmpty(this.anyOf)) {
			target.anyOf = this.copy(this.anyOf);
		}
		if (!this.isEmpty(this.oneOf)) {
			target.oneOf = this.copy(this.oneOf);
		}
		if (!this.isEmpty(this.not)) {
			target.not = this.copy(this.not);
		}

		if (!this.isEmpty(this.definitions)) {
			target.definitions = this.copy(this.definitions);
		}
		return target;
	}

	addEnum(val) {
		this.enum.push(val);
	}

	addRequired(_required) {
		this.required.push(_required);
	}

	getProperty(propertyName) {
		return this.properties[propertyName];
	}

	setProperty(propertyName, type) {
		this.properties[propertyName] = type;
	}

	writeFile(dir) {
		var data = JSON.stringify(this.getJsonSchema(), null, '\t');
		fs.writeFileSync(path.join(dir, this.filename), data);
	}

	/*
	 *  The notion of extending a base schema is implemented in JSON Schema using allOf with schemas.  The base
	 *  type is added to the allOf array as well as a new schema.  The new schema is returned to be built out
	 *  as the working schema.
	 * 
	 *  Parameters:
	 *  baseType - (jsonSchemaFile) JSON Schema of the base type.
	 *  extentionType - (jsonSchemaTypes) one of the seven core JSON Schema types.
	 */
	extend(baseType, extentionType) {
		this.allOf.push(baseType.get$RefToSchema());
		var extentionSchema = new JsonSchemaFile({});
		extentionSchema.type = extentionType;
		this.allOf.push(extentionSchema);
		return extentionSchema;
	}

	addAttributeProperty(propertyName, customType, minOccursAttr) {
		var name = "@" + propertyName;
		if (minOccursAttr === "required") {
			this.addRequired(name);
		}
		this.setProperty(name, customType);
	}
	
	addRequiredPropertyToBaseSchema(name, type) {
		if (this.getProperty(name) == undefined) {
			var anyOfProp = new JsonSchemaFile({});
			anyOfProp.addRequired(name);
			this.anyOf.push(anyOfProp);
			this.setProperty(name, type.get$RefToSchema());
		}		
	}
}

module.exports = JsonSchemaFile;
