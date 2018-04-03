'use strict';

const debug = require('debug')('xsd2jsonschema:NamespaceManager');

const JsonSchemaFile = require('./jsonschema/jsonSchemaFile');
const Qname = require('./qname');
const BuiltInTypeConverter = require('./builtInTypeConverter');
const Constants = require('./constants');
const URI = require('urijs');


const namespaces_NAME = Symbol();
const xmlSchemaNamespace_NAME = Symbol();
const builtInTypeConverter_NAME = Symbol();

/**
 * Class responsible for managaging namespaced and types within those namespaces, which are defined as 
 * XML Schema aggregates that have been converted to JSON Schema.  Types are arranged by their XML 
 * Namespaces.  Types can be added and retrieved as needed.
 * 
 * This module also manages global attributes.  As a reminder global attributes are global accross all XML
 * Schema files being considered.  This includes schemas that are brought in by an *&lt;include&gt;* tag
 * or by an *&lt;import&gt;* tag.
 * 
 * An obect is used to manage any number of XML Namespaces including a specialized namespace for global
 * attributes.  Namespaces are themselves JSON objects with one property named types.  Initially,
 * the collection of namespaces contains only the globalAttributes specialized namespace.  Additional 
 * namespaces will be added to the collection as they are encountered.
 * 
 * <pre>
 *	this.namespaces = {};
 *	this.namespaces[''] = { types: {} };
 *	this.namespaces.globalAttributes = { types: {} };
 * </pre>
 * 
 * @module NamespaceManager
 */

 class NamespaceManager {
	constructor() {
		this.namespaces = {
			globalAttributes: { 
				types: {}
			}
		};
		this.XML_SCHEMA_NAMESPACE = 'http://www.w3.org/2001/XMLSchema';
		this.builtInTypeConverter = new BuiltInTypeConverter();
	}

	// Getters/Setters

	/**
	 * Returns the namespaces object.  It will have been initialized with at least the globalAttributes
	 * specialized namespace, but it will include any other namespaces that have been added.
	 * 
	 * @returns {Object} Returns the namespaces object.
	 */
	get namespaces() {
		return this[namespaces_NAME];
	}
	set namespaces(newNamespaces) {
		this[namespaces_NAME] = newNamespaces;
	}

	get XML_SCHEMA_NAMESPACE() {
		return this[xmlSchemaNamespace_NAME];
	}
	set XML_SCHEMA_NAMESPACE(newXmlSchemaNamespace) {
		this[xmlSchemaNamespace_NAME] = newXmlSchemaNamespace;
	}

	get builtInTypeConverter() {
		return this[builtInTypeConverter_NAME];
	}
	set builtInTypeConverter(newBuiltInTypeConverter) {
		this[builtInTypeConverter_NAME] = newBuiltInTypeConverter;
	}

	/**
	 * Adds a namespace to the to the collection.  The namespace is initially empty.
	 * 
	 * @param {String} _namespace The name of the XML Namespace.
	 * @see {@link BaseConverter#initializeNamespaces|BaseConverter.initializeNamespaces()}
	 */
	addNamespace(_namespace) {
		//var namespace = utils.getSafeNamespace(_namespace);
		const namespace = _namespace;
		if (!this.namespaces.hasOwnProperty(namespace)) {
			this.namespaces[namespace] = { types: {} };
		}
	}

	/**
	 * Returns the namespace object for a given namespace.
	 * 
	 * @param {String} namespace The name of the namespace.  For example: this could be 
	 * 'targetNamespace' of the *&lt;schema&gt;* tag in an XML Schema file.
	 * @returns {Object} The namespace if present or enstantiats a new namesapce otherwise.
	 */
	getNamespace(namespace) {
		return this.namespaces[namespace];
	}

	isBuiltXmlNamespace(namespace) {
		return namespace === this.XML_SCHEMA_NAMESPACE;	
	}

	getBuiltInType(typeName, xsd) {
		if (this.namespaces[this.XML_SCHEMA_NAMESPACE].types[typeName] === undefined) {
			const newType = new JsonSchemaFile({});
			// The 'node' parameter to the builtInTypeConverter's xml handler methods is not currently
			// used so it is save to pass in null for now.  This is likely a future bug.
			this.builtInTypeConverter[typeName](null, newType, xsd);
			this.namespaces[this.XML_SCHEMA_NAMESPACE].types[typeName] = newType;
		}
		const builtInType = this.namespaces[this.XML_SCHEMA_NAMESPACE].types[typeName];
		return builtInType;
	}

	/**
	 * This method returns the requested type, which can be either a custom type or an XML
	 * built-in type.  If the type exists in the namesapce of baseJsonSchema the
	 * custom type is return.  If the type does not exist it is created and then returned.
	 * 
	 * @param {String} fullTypeName The name of the type to be returned.  The format of this
	 * parameter is 'prefix:localName' where localName is require and the prefix an separating colon are optional. 
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 *  Schema file to JSON Schema.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {JsonSchemaFile} The requested custom type.
	 */
	getType(fullTypeName, baseJsonSchema, xsd) {
		if (fullTypeName === undefined) {
			throw new Error('\'fullTypeName\' parameter required');
		}
		if (baseJsonSchema === undefined) {
			throw new Error('\'baseJsonSchema\' parameter required');
		}
		const namespaceQname = new Qname(fullTypeName);
		const namespace = xsd.resolveNamespace(namespaceQname.getPrefix());
		const typeName = namespaceQname.getLocal();
		if (this.isBuiltXmlNamespace(namespace)) {
			return this.getBuiltInType(typeName);
		}
		var type = this.namespaces[namespace].types[typeName];
		if (type === undefined) {
			// Create the type, which will be filled out later as the XSD is processed, and add it to the namespace.
			const parms = {};
			parms.ref = baseJsonSchema.id + '#' + baseJsonSchema.getSubschemaStr() + '/' + typeName;
			this.namespaces[namespace].types[typeName] = new JsonSchemaFile(parms);
			type = this.namespaces[namespace].types[typeName];

			// Add the type type to the an anyOf in baseJsonSchema so it can be used directly for validation.
			const baseId = new URI(baseJsonSchema.id);
			const typeId = new URI(type.ref);
			if (baseId.filename() == typeId.filename()) {
				baseJsonSchema.addRequiredAnyOfPropertyByReference(typeName, type);
			}
		}
		return type;
	}

	/**
	 * This method inserts a entry into the given namespace by reference name rather than by type name.
	 * This way it can be looked up by type name or by reference.
	 * 
	 * @param {String} fullTypeName The name of the custom type to be used for references.   The format of this
	 * parameter is 'prefix:localName' where localName is require and the prefix and separating colon are optional. 
	 * @param {JsonSchemaFile} The type to be referenced by its name.
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 * Schema file to JSON Schema.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 */
	addTypeReference(fullTypeName, type, baseJsonSchema, xsd) {
		const namespaceQname = new Qname(fullTypeName);
		const namespace = xsd.resolveNamespace(namespaceQname.getPrefix());
		const refName = namespaceQname.getLocal();
		this.namespaces[namespace].types[refName] = type;
		baseJsonSchema.addRequiredAnyOfPropertyByReference(refName, type);
	}

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
	getGlobalAttribute(name, baseJsonSchema) {
		if (name === undefined) {
			throw new Error('\'name\' parameter required');
		}
		if (baseJsonSchema === undefined) {
			throw new Error('\'baseJsonSchema\' parameter required');
		}
		var globalAttributesNamespace = this.namespaces.globalAttributes;
		if (globalAttributesNamespace.types[name] === undefined) {
			var parms = {};
			parms.ref = baseJsonSchema.id + '#/' + Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME + '/' + name;
			globalAttributesNamespace.types[name] = new JsonSchemaFile(parms);
		}
		return globalAttributesNamespace.types[name];
	}

	toString() {
		return JSON.stringify(this.namespaces, null, '\n');
	}
}

module.exports = NamespaceManager;
