/**
 *  XML Schema file operations.  This is based on the JSON Schema meta-schema
 *  located at http://json-schema.org/draft-04/schema#.  
 * 
 * 
 *  Please see http://json-schema.org for more details.
 */

"use strict";

var url = require("url");
var path = require("path");
var fs = require('fs');
var utils = require("./utils");
var jsonTypes = require('./jsonTypes');

function JsonSchemaFile(parms) {
	var filename;
	var resolvedFilename;
	var targetSchema = {};
	var targetNamespace;
	var ref;  // used to hold a JSON Pointer reference to this named type (Not used for anonymous types)
	var $ref; // used when this schema is an instance of a reference

	// JSON Schema draft v4 (core definitions and terminology referenced)
	// 7.2 URI resolution scope alteration with the "id"
	var id;  // uri
	// 3.4 Root schema, subschema  (7.2.2 Usage)
	var subSchemas = {};
	var $schema;  // uri

	// JSON Schema Validation specification sections referenced unless otherwise noted
	// 6.1 Metadata keywords "title" and "description"
	var title;
	var description;  // Might nned to initialize to "" for concatDescription()
	
	// 6.2 Default
	var _default

	// 7 Semantic validation with "format"
	var format;
	
	// 5.1.  Validation keywords for numeric instances (number and integer)
	var multipleOf;  // multiple of 2 is 2, 4, 8, etc. 
	var maximum;
	var exclusiveMaximum = false;  // 5.1.2.3
	var minimum;
	var exclusiveMinimum = false;  // 5.1. 3.3

	// 5.2.  Validation keywords for strings
	var maxLength;
	var minLength = 0;  // 5.2.2.3
	var pattern;  // 5.2.3.1 ECMA 262 regular expression dialect

	// 5.3.  Validation keywords for arrays
	var additionalItems = {};  // 5.3.1.1 boolean or a schema
	var items = {};  // 5.3.1.4 schema or an array of schemas but the default value is an empty schema
	var maxItems;
	var minItems = 0;  // 5.3.3.3
	var uniqueItems = false;  // 5.3.4.3

	// 5.4.  Validation keywords for objects
	var maxProperties;
	var minProperties = 0;  // 5.4.2.3
	var required = [];  // 5.4.3.1 string array - must have unique values and minimum length=1
	var additionalProperties;  // boolean or a schema
	var properties = {};  // 5.4.4.1 MUST be an object. Each property of this object MUST be a valid JSON Schema.
	var patternProperties = {};  // 5.4.4.1 MUST be an object. Each property name of this object SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect. Each property value of this object MUST be a valid JSON Schema.

	// 5.4.5.  Dependencies
	// This keyword's value MUST be an object. Each value of this object MUST be either an object or an array.
	// If the value is an object, it MUST be a valid JSON Schema. This is called a schema dependency.
	// If the value is an array, it MUST have at least one element. Each element MUST be a string, and elements in the array MUST be unique. This is called a property dependency.
	var dependencies = {};

	// 5.5.  Validation keywords for any instance type
	var _enum = [];  // 5.5.1.1 Elements in the array MUST be unique.
	var type;  // string or string array limited to the seven primitive types (simpleTypes)

	var allOf = [];  // 5.5.3.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
	var anyOf = [];  // 5.5.4.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
	var oneOf = [];  // 5.5.5.1 Elements of the array MUST be objects. Each object MUST be a valid JSON Schema.
	var not = {};  // 5.5.6.1 This object MUST be a valid JSON Schema.

	var definitions = {};  // 5.5.7.1 MUST be an object. Each member value of this object MUST be a valid JSON Schema.

	if (parms === undefined) {
		throw new Error("Parameter 'parms' is required");
	}
	if (parms.xsd != undefined) {
		var baseFilename = path.parse(parms.xsd.getBaseFilename()).name;
		id = (parms.mask === undefined) ? baseFilename : baseFilename.replace(parms.mask, "");
		$schema = "http://json-schema.org/draft-04/schema#";
		filename = id + ".json";
		resolvedFilename = path.join(parms.resolveURI, filename);
		targetNamespace = parms.xsd.getTargetNamespace();
		title = "This JSON Schema file was generated from " + parms.xsd.getBaseFilename() + " on " + new Date() + ".  For more information please see http://www.xsd2jsonschema.org";
	}
	// This needs to be documented
	if (parms.ref !== undefined) {
		ref = parms.ref;
	}
	// This needs to be documented
	if (parms.$ref !== undefined) {
		$ref = parms.$ref;
	}

	function createNestedSubschema(_subschemas, namespaces) {
		var subschemaName = namespaces.shift();
		_subschemas[subschemaName] = new JsonSchemaFile({});
		targetSchema = _subschemas[subschemaName];  // Track the innermost schema as the target
		if (namespaces.length > 0) {
			createNestedSubschema(_subschemas[subschemaName].getSubSchemas(), namespaces);
		}
	}

	var isEmpty = function (val) {
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
				return (Object.keys(val).length === 0)
			}
		}
		return false;
	};

	function initializeSubschemas() {
		if (targetNamespace === undefined) {
			return;
		}
		var subschemaStr = utils.getSafeNamespace(targetNamespace);
		if (!isEmpty(subschemaStr)) {
			var namespaces = subschemaStr.split("/");
			if (namespaces.length > 1) {
				namespaces.shift();
			}
			createNestedSubschema(subSchemas, namespaces);
		}
	}

	initializeSubschemas();

	this.addSubSchema = function (schemaName, jsonSchema) {
		this.getTargetSchema().getSubSchemas()[schemaName] = jsonSchema;
	};

	// Search through all schemas for a given schema name
	function getSubschema(searchName) {
		var retval;
		if (subSchemas[searchName] != undefined) {
			retval = subSchemas[searchName];
		}
		Object.keys(subSchemas).forEach(function (subschemaName, index, array) {
			retval = subSchemas[subschemaName].getSubschema(searchName);
		});
		return retval;
	}

	// Search through all schemas for a given schema name
	this.getSubschema = function (subschemaName) {
		return getSubschema(subschemaName);
	};

	// Read-only propertys
	this.getTargetSchema = function () {
		if (isEmpty(targetSchema)) {
			targetSchema = this;
		}
		return targetSchema;
	};

	this.getTargetNamespace = function () {
		return targetNamespace;
	};

	this.getFilename = function () {
		return filename;
	}

	this.getResolvedFilename = function () {
		return resolvedFilename;
	}

	this.get$RefToSchema = function () {
		return new JsonSchemaFile({ $ref: ref });
	}

	this.getSubschemaStr = function () {
		return utils.getSafeNamespace(targetNamespace);
	}

	function copy(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	// Return a POJO of this jsonschema
	this.getJsonSchema = function () {
		var propKeys;
		var jsonSchema = {};

		if (!isEmpty($ref)) {
			jsonSchema.$ref = $ref;
		}

		if (!isEmpty(id)) {
			jsonSchema.id = id;
		}
		if (!isEmpty($schema)) {
			jsonSchema.$schema = $schema;
		}

		// 6.1 Metadata keywords "title" and "description"
		if (!isEmpty(title)) {
			jsonSchema.title = title;
		}
		if (!isEmpty(description)) {
			jsonSchema.description = description;
		}

		// 5.5.  Validation keywords for any instance type (Type moved up here from the rest of 5.5 below for output formatting)
		if (!isEmpty(type)) {
			jsonSchema.type = type;
		}

		// 5.1.  Validation keywords for numeric instances (number and integer)
		if (!isEmpty(multipleOf)) {
			jsonSchema.multipleOf = multipleOf;
		}
		if (!isEmpty(minimum)) {
			jsonSchema.minimum = minimum;
		}
		if (!isEmpty(exclusiveMinimum) && exclusiveMinimum !== false) {
			jsonSchema.exclusiveMinimum = exclusiveMinimum;
		}
		if (!isEmpty(maximum)) {
			jsonSchema.maximum = maximum;
		}
		if (!isEmpty(exclusiveMaximum) && exclusiveMaximum !== false) {
			jsonSchema.exclusiveMaximum = exclusiveMaximum;
		}

		// 5.2.  Validation keywords for strings
		if (!isEmpty(minLength) && minLength !== 0) {
			jsonSchema.minLength = minLength;
		}
		if (!isEmpty(maxLength)) {
			jsonSchema.maxLength = maxLength;
		}
		if (!isEmpty(pattern)) {
			jsonSchema.pattern = pattern;
		}

		// 5.5.  Validation keywords for any instance type
		if (!isEmpty(_enum)) {
			jsonSchema.enum = _enum;
		}
		if (!isEmpty(allOf)) {
			jsonSchema.allOf = [];
			for (let i = 0; i < allOf.length; i++) {
				jsonSchema.allOf[i] = allOf[i].getJsonSchema();
			}
		}
		if (!isEmpty(anyOf)) {
			jsonSchema.anyOf = [];
			for (let i = 0; i < anyOf.length; i++) {
				jsonSchema.anyOf[i] = anyOf[i].getJsonSchema();
			}
		}
		if (!isEmpty(oneOf)) {
			jsonSchema.oneOf = [];
			for (let i = 0; i < oneOf.length; i++) {
				jsonSchema.oneOf[i] = oneOf[i].getJsonSchema();
			}
		}
		if (!isEmpty(not)) {
			jsonSchema.not = not;
		}

		// 6.2 Default
		if (!isEmpty(_default)) {
			jsonSchema.default = _default;
		}

		// 7 Semantic validation with "format"
		if (!isEmpty(format)) {
			jsonSchema.format = format;
		}

		// 5.4.5.  Dependencies
		if (!isEmpty(dependencies)) {
			jsonSchema.dependencies = {}
			propKeys = Object.keys(dependencies);
			propKeys.forEach(function (key, index, array) {
				if (Array.isArray(dependencies[key])) {
					jsonSchema.dependencies[key] = dependencies[key];  // property dependency
				} else {
					if (dependencies[key] !== undefined) {
						jsonSchema.dependencies[key] = dependencies[key].getJsonSchema();  // schema dependency
					}
				}
			});
		}

		// 5.3.  Validation keywords for arrays
		if (!isEmpty(additionalItems)) {
			jsonSchema.additionalItems = additionalItems;
		}
		if (!isEmpty(maxItems)) {
			jsonSchema.maxItems = maxItems;
		}
		if (!isEmpty(minItems) && minItems != 0) {
			jsonSchema.minItems = minItems;
		}
		if (!isEmpty(uniqueItems) && uniqueItems !== false) {
			jsonSchema.uniqueItems = uniqueItems;
		}
		if (!isEmpty(items)) {
			if (Array.isArray(items)) {
				jsonSchema.items = [];
				items.forEach(function (item, index, array) {
					jsonSchema.items[index] = item.getJsonSchema();
				});
			} else {
				jsonSchema.items = items.getJsonSchema();
			}
		}

		// 5.4.  Validation keywords for objects
		if (!isEmpty(maxProperties)) {
			jsonSchema.maxProperties = maxProperties;
		}
		if (!isEmpty(minProperties) && minProperties !== 0) {
			jsonSchema.minProperties = minProperties;
		}
		if (!isEmpty(additionalProperties)) {
			jsonSchema.additionalProperties = additionalProperties;
		}
		if (!isEmpty(properties)) {
			jsonSchema.properties = {};
			propKeys = Object.keys(properties);
			propKeys.forEach(function (key, index, array) {
				if (properties[key] !== undefined) {
					jsonSchema.properties[key] = properties[key].getJsonSchema();
				}
			});
		}
		if (!isEmpty(patternProperties)) {
			jsonSchema.patternProperties = {};
			propKeys = Object.keys(patternProperties);
			propKeys.forEach(function (key, index, array) {
				if (patternProperties[key] !== undefined) {
					jsonSchema.patternProperties[key] = patternProperties[key].getJsonSchema();
				}
			});
		}
		if (!isEmpty(required)) {
			jsonSchema.required = required;
		}

		if (!isEmpty(definitions)) {
			jsonSchema.definitions = {};
			propKeys = Object.keys(definitions);
			propKeys.forEach(function (key, index, array) {
				if (definitions[key] !== undefined) {
					jsonSchema.definitions[key] = definitions[key].getJsonSchema();
				}
			});
		}

		if (!isEmpty(subSchemas)) {
			var subschemaNames = Object.keys(subSchemas);
			subschemaNames.forEach(function (subschemaName, index, array) {
				jsonSchema[subschemaName] = subSchemas[subschemaName].getJsonSchema();
			});
		}
		return jsonSchema;
	};
	
	// Getters/Setters
	this.get$Ref = function () {
		return $ref
	};

	this.set$Ref = function (_$ref) {
		$ref = _$ref;
	};

	this.getId = function () {
		return id;
	};

	this.setId = function (_id) {
		id = _id;
	};

	this.getSubSchemas = function () {
		return subSchemas;
	};

	this.setSubSchemas = function (_subSchemas) {
		subSchemas = _subSchemas;
	};

	this.get$schema = function () {
		return $schema;
	};

	this.set$schema = function (_$schema) {
		$schema = _$schema;
	};

	this.getTitle = function () {
		return title;
	};

	this.setTitle = function (_title) {
		title = _title;
	};

	this.getDescription = function () {
		return description;
	};

	this.setDescription = function (_description) {
		description = _description;
	};

	this.concatDescription = function (_description) {
		description += _description;
	};

	// 6.2 Default
	this.getDefault = function () {
		return _default;
	}

	this.setDefault = function (__default) {
		_default = __default;
	}

	// 7 Semantic validation with "format"
	this.getFormat = function () {
		return format;
	}

	this.setFormat = function (_format) {
		format = _format;
	}

	this.getMultipleOf = function () {
		return multipleOf;
	};

	this.setMultipleOf = function (_multipleOf) {
		multipleOf = _multipleOf;
	};

	this.getMaximum = function () {
		return maximum;
	};

	this.setMaximum = function (_maximum) {
		maximum = _maximum;
	};

	this.getExclusiveMaximum = function () {
		return exclusiveMaximum;
	};

	this.setExclusiveMaximum = function (_exclusiveMaximum) {
		exclusiveMaximum = _exclusiveMaximum;
	};

	this.getMinimum = function () {
		return minimum;
	};

	this.setMinimum = function (_minimum) {
		minimum = _minimum;
	};

	this.getExclusiveMinimum = function () {
		return exclusiveMinimum;
	};

	this.setExclusiveManimum = function (_exclusiveMinimum) {
		exclusiveMinimum = _exclusiveMinimum;
	};

	this.getMaxLenth = function () {
		return maxLength;
	};

	this.setMaxLength = function (_maxLength) {
		maxLength = _maxLength;
	};

	this.getMinLength = function () {
		return minLength;
	};

	this.setMinLength = function (_minLength) {
		minLength = _minLength;
	};

	this.getPattern = function () {
		return pattern;
	};

	this.setPattern = function (_pattern) {
		pattern = _pattern;
	};

	this.getAdditionalItems = function () {
		return additionalItems;
	};

	this.setAdditionalItems = function (_additionalItems) {
		additionalItems = _additionalItems;
	};

	this.getItems = function () {
		return items;
	};

	this.setItems = function (_items) {
		items = _items;
	};

	this.getMaxItems = function () {
		return maxItems;
	};

	this.setMaxItems = function (_maxItems) {
		maxItems = _maxItems;
	};

	this.getMinItems = function () {
		return minItems;
	};

	this.setMinItems = function (_minItems) {
		minItems = _minItems;
	};

	this.getUniqueItems = function () {
		return uniqueItems;
	};

	this.setUniqueItems = function (_uniqueItems) {
		uniqueItems = _uniqueItems;
	};

	this.getMaxProperties = function () {
		return maxProperties;
	};

	this.setMaxProperties = function (_maxProperies) {
		maxProperties = _maxProperies;
	};

	this.getMinProperties = function () {
		return minProperties;
	};

	this.setMinProperties = function (_minProperties) {
		minProperties = _minProperties;
	};

	this.getRequired = function () {
		return required;
	};

	this.setRequired = function (_required) {
		required = _required;
	};

	this.addRequired = function (_required) {
		required.push(_required);
	}

	this.getAdditionalProperites = function () {
		return additionalProperties;
	};

	this.setAdditionalProperties = function (_additionalProperties) {
		additionalProperties = _additionalProperties;
	};

	this.getProperties = function () {
		return properties;
	};

	this.setProperties = function (_properties) {
		properties = _properties;
	};

	this.setProperty = function (_property, _type) {
		properties[_property] = _type;
	}

	this.getPatternProperties = function () {
		return patternProperties;
	};

	this.setPatterProperties = function (_patterProperties) {
		patternProperties = _patterProperties;
	};

	this.getDependencies = function () {
		return dependencies;
	};

	this.setDependencies = function (_dependencies) {
		dependencies = _dependencies;
	};

	this.getEnum = function () {
		return _enum;
	};

	this.setEnum = function (__enum) {
		_enum = __enum;
	};

	this.addEnum = function (val) {
		_enum.push(val);
	};

	this.getType = function () {
		return type;
	};

	this.setType = function (_type) {
		type = _type;
	};

	this.getAllOf = function () {
		return allOf;
	};

	this.setAllOf = function (_allOf) {
		allOf = _allOf;
	};

	this.getAnyOf = function () {
		return anyOf;
	};

	this.setAnyOf = function (_anyOf) {
		anyOf = _anyOf;
	};

	this.getOneOf = function () {
		return oneOf;
	};

	this.setOneOf = function (_oneOf) {
		oneOf = _oneOf;
	};

	this.getNot = function () {
		return not;
	};

	this.setNot = function (_not) {
		not = _not;
	};

	this.getDefinitions = function () {
		return definitions;
	};

	this.setDefinitions = function (_definitions) {
		definitions = _definitions;
	};

	this.clone = function (target) {
		if (!isEmpty(id)) {
			target.setId(copy(id));
		}
		if (!isEmpty(subSchemas)) {
			target.setSubSchemas(copy(subSchemas));
		}
		if (!isEmpty($schema)) {
			target.set$schema(copy($schema));
		}

		// 6.1 Metadata keywords "title" and "description"
		if (!isEmpty(title)) {
			target.setTitle(copy(title));
		}
		if (!isEmpty(description)) {
			target.setDescription(copy(description));
		}

		// 6.2 Default
		if (!isEmpty(_default)) {
			target.setDefault(copy(_default));
		}

		// 7 Semantic validation with "format"
		if (!isEmpty(format)) {
			target.setFormat(copy(format));
		}

		// 5.1.  Validation keywords for numeric instances (number and integer)
		if (!isEmpty(multipleOf)) {
			target.setMultipleOf(copy(multipleOf));
		}
		if (!isEmpty(maximum)) {
			target.setMaximum(copy(maximum));
		}
		if (!isEmpty(exclusiveMaximum) && exclusiveMaximum !== false) {
			target.setExclusiveMaximum(copy(exclusiveMaximum));
		}
		if (!isEmpty(minimum)) {
			target.setMinimum(copy(minimum));
		}
		if (!isEmpty(exclusiveMinimum) && exclusiveMinimum !== false) {
			target.setExclusiveMinimum(copy(exclusiveMinimum));
		}

		// 5.2.  Validation keywords for strings
		if (!isEmpty(maxLength)) {
			target.setMaxLength(copy(maxLength));
		}
		if (!isEmpty(minLength) && minLength !== 0) {
			target.setMinLength(copy(minLength));
		}
		if (!isEmpty(pattern)) {
			target.setPattern(copy(pattern));
		}

		// 5.3.  Validation keywords for arrays
		if (!isEmpty(additionalItems)) {
			target.setAdditionalItems(copy(additionalItems));
		}
		if (!isEmpty(items)) {
			target.setItems(copy(items));
		}
		if (!isEmpty(maxItems)) {
			target.setMaxItems(copy(maxItems));
		}
		if (!isEmpty(minItems) && minItems !== 0) {
			target.setMinItems(copy(minItems));
		}
		if (!isEmpty(uniqueItems) && uniqueItems !== false) {
			target.setUniqueItems(copy(uniqueItems));
		}

		// 5.4.  Validation keywords for objects
		if (!isEmpty(maxProperties)) {
			target.setMaxProperties(copy(maxProperties));
		}
		if (!isEmpty(minProperties) && minProperties !== 0) {
			target.setMinProperties(copy(minProperties));
		}
		if (!isEmpty(required)) {
			target.setRequired(copy(required));
		}
		if (!isEmpty(additionalProperties)) {
			target.setAdditionalProperties(copy(additionalProperties));
		}
		if (!isEmpty(properties)) {
			target.setProperties(copy(properties));
		}
		if (!isEmpty(patternProperties)) {
			target.setPatternProperties(copy(patternProperties));
		}

		// 5.4.5.  Dependencies
		if (!isEmpty(dependencies)) {
			target.setDependencies(copy(dependencies));
		}

		// 5.5.  Validation keywords for any instance type
		if (!isEmpty(_enum)) {
			target.setEnum(copy(_enum));
		}
		if (!isEmpty(type)) {
			target.setType(copy(type));
		}

		if (!isEmpty(allOf)) {
			target.setAllOf(copy(allOf));
		}
		if (!isEmpty(anyOf)) {
			target.setAnyOf(copy(anyOf));
		}
		if (!isEmpty(oneOf)) {
			target.setOneOf(copy(oneOf));
		}
		if (!isEmpty(not)) {
			target.setNot(copy(not));
		}

		if (!isEmpty(definitions)) {
			target.setDefinitions(copy(definitions));
		}
	}
	
	this.writeFile = function(dir) {
		var data = JSON.stringify(this.getJsonSchema(), null, '\t');
		fs.writeFileSync(path.join(dir,this.getFilename()), data);
	}

	/*
	 *  The notion of extending a base schema is implemented in JSON Schema using allOf with schemas.  The base
	 *  type is added to the allOf array as well as a new schema.  The new schema is returned to be built out
	 *  as the working schema.
	 * 
	 *  Parameters:
	 *  baseType - (jsonSchemaFile) JSON Schema of the base type.
	 *  extentionType - (jsonTypes) one of the seven core JSON Schema types.
	 */
	this.extend = function (baseType, extentionType) {
		this.getAllOf().push(baseType.get$RefToSchema());
		var extentionSchema = new JsonSchemaFile({});
		extentionSchema.setType(extentionType);
		this.getAllOf().push(extentionSchema);
		return extentionSchema;
	}
}

module.exports = JsonSchemaFile;
