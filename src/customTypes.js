"use strict";

const JsonSchemaFile = require("./jsonschema/jsonSchemaFile");
const utils = require("./utils");
const URI = require("urijs");

var namespaces = { globalAttributes: { customTypes: {} } };

/**
 * This module is a singleton used to manage custom types, which are defined as XML Schema aggregates that
 * have been converted to JSON Schema.  Custom types are arranged by their XML Namespaces. Custom types can
 * be added and retrieved as needed.
 * 
 * This module also manages global attributes.  As a reminder global attributes are global accross all XML
 * Schema files being considered.  This includes schemas that are brought in by an *&lt;include&gt;* tag
 * or by an *&lt;import&gt;* tag.
 * 
 * An obect is used to manage any number of XML Namespaces including a specialized namespace for global
 * attributes.  Namespaces are themselves JSON objects with one property named customTypes.  Initially, the
 * collection of namespaces contains only the globalAttributes specialized namesapce.  Additional namespaces
 * will be added to the collection as they are encountered.
 * 
 * <pre>
 * var namespaces = { globalAttributes:{ customTypes:{} } };
 * </pre>
 * 
 * @module CustomTypes
 */

module.exports = {
	/**
	 * Adds a namespace to the to the collection.  The namespace is initially empty.
	 * 
	 * @param {String} _namespace The name of the XML Namespace.
	 * @see {@link Xsd2JsonSchema#initializeNamespaces|Xsd2JsonSchema.initializeNamespaces()}
	 */
	addNamespace: function (_namespace) {
		var namespace = utils.getSafeNamespace(_namespace);
		if (!namespaces.hasOwnProperty(namespace)) {
			namespaces[namespace] = { customTypes: {} };
		}
	},

	/**
	 * Returns the namespace object for a given namespace.
	 * 
	 * @param {String} namespace The string value of the namespace.  For example: this would be the value of
	 * the "targetNamespace" attribute of the *&lt;schema&gt;* tag in an XML Schema file.
	 * @returns {Object} The namespace if present.
	 */
	getNamespace: function (namespace) {
		return namespaces[namespace];
	},

	/**
	 * Returns the namespaces object.  It will have been initialized with at least the globalAttributes
	 * specialized namespace, but it will include any other namespaces that have been added.
	 * 
	 * @returns {Object} Returns the namespaces object.
	 */
	getNamespaces: function () {
		return namespaces;
	},

	/**
	 * This method returns the requested custom type.  If the type exists in the namesapce of baseJsonSchema the
	 * custom type is return.  If the type does not exist it is created and then returned.
	 * 
	 * @param {String} typeName The name of the custom type to be returned.
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 * Schema file to JSON Schema.
	 * 
	 * @returns {JsonSchemaFile} The request custom type.
	 */
	getCustomType: function (typeName, baseJsonSchema) {
		if (typeName === undefined) {
			throw new Error("\"typeName\" parameter required");
		}
		if (baseJsonSchema === undefined) {
			throw new Error("\"baseJsonSchema\" parameter required");
		}
		var namespace = baseJsonSchema.getSubschemaStr();
		if (namespaces[namespace].customTypes[typeName] === undefined) {
			//console.log("Unable to find custom type: " + type);
			var parms = {};
			parms.ref = baseJsonSchema.id + "#" + baseJsonSchema.getSubschemaStr() + "/" + typeName;
			namespaces[namespace].customTypes[typeName] = new JsonSchemaFile(parms);
		}
		var type = namespaces[namespace].customTypes[typeName];
		var baseId = new URI(baseJsonSchema.id);
		var typeId = new URI(type.ref);
		if (baseId.filename() == typeId.filename()) {
			baseJsonSchema.addRequiredPropertyToBaseSchema(typeName, type);
		}
		return type;
	},

	/**
	 * This method inserts a entry into the type's namespace by reference name rather than by type name.
	 * This way it can be looked up by type name or by reference.
	 * 
	 * @param {String} typeName The name of the custom type to be used for references.
	 * @param {JsonSchemaFile} The custom type to be referenced by its name
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 * Schema file to JSON Schema.
	 */
	addCustomTypeReference: function (refName, type, baseJsonSchema) {
		var namespace = baseJsonSchema.getSubschemaStr();
		namespaces[namespace].customTypes[refName] = type;
		baseJsonSchema.addRequiredPropertyToBaseSchema(refName, type);
	},

	/**
	 * This method returns the requested global attribute.  If the attribute exists in the global attribute
	 * namesapce the attribute is return.  If the attribute does not exist it is created and then returned.
	 * 
	 * @param {String} name The name of the global attribute to be returned.
	 * @param {JsonSchemaFile} baseJsonSchema The JsonSchemaFile being created as a result of converting an XML
	 * Schema file to JSON Schema.
	 * 
	 * @returns {JsonSchemaFile} The request global attribute.
	 */
	getGlobalAtrribute: function (name, baseJsonSchema) {
		if (name === undefined) {
			throw new Error("\"name\" parameter required");
		}
		if (baseJsonSchema === undefined) {
			throw new Error("\"baseJsonSchema\" parameter required");
		}
		var globalAttributesNamespace = namespaces.globalAttributes;
		if (globalAttributesNamespace.customTypes[name] === undefined) {
			var parms = {};
			parms.ref = baseJsonSchema.id + "#" + baseJsonSchema.getSubschemaStr() + "/" + name;
			globalAttributesNamespace.customTypes[name] = new JsonSchemaFile(parms);
		}
		return globalAttributesNamespace.customTypes[name];
	}
}