'use strict';

const debug = require('debug')('xsd2jsonschema:NamespaceManager');

const URI = require('urijs');
const XsdAttributes = require('./xmlschema/xsdAttributes');
const JsonSchemaFile = require('./jsonschema/jsonSchemaFile');
const Qname = require('./qname');
const BuiltInTypeConverter = require('./builtInTypeConverter');
const Constants = require('./constants');
const ForwardReference = require('./forwardReference');


const namespaces_NAME = Symbol();
const builtInTypeConverter_NAME = Symbol();
const jsonSchema_NAME = Symbol();
const xmlSchemas_NAME = Symbol();
const forwardReferences_NAME = Symbol();

/**
 * Class responsible for managaging namespaces and types within those namespaces, which are defined as 
 * XML Schema aggregates that have been converted to JSON Schema.  Types are arranged by XML 
 * Namespaces.  Types can be added and retrieved as needed.
 * 
 * This module also manages global attributes.  As a reminder global attributes are global accross all XML
 * Schema files being considered.  This includes schemas that are brought in by an *&lt;include&gt;* tag
 * or by an *&lt;import&gt;* tag.
 * 
 * An object is used to manage any number of XML Namespaces including a specialized namespace for global
 * attributes and the XSD well known namespaces.  Namespaces are themselves JSON objects with one property named types.  Initially,
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
	constructor(options) {
		/*
				this.namespaces = {
					globalAttributes: { 
						types: {}
					}
				};
				this.namespaces = {};
				this.namespaces[Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME] = {
					types: {}
				}
		*/
		this.namespaces = {};
		this.addNamespace(Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME);
		this.addNamespace(Constants.XML_SCHEMA_NAMESPACE);
		if (options != undefined) {
			this.builtInTypeConverter = options.builtInTypeConverter != undefined ? options.builtInTypeConverter : new BuiltInTypeConverter();
		} else {
			this.builtInTypeConverter = new BuiltInTypeConverter();
		}
		this.jsonSchemas = {};
		this.xmlSchemas = {};
		this.forwardReferences = [];
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
		throw new Error();
	}
	set XML_SCHEMA_NAMESPACE(newXmlSchemaNamespace) {
		throw new Error();
	}

	get builtInTypeConverter() {
		return this[builtInTypeConverter_NAME];
	}
	set builtInTypeConverter(newBuiltInTypeConverter) {
		this[builtInTypeConverter_NAME] = newBuiltInTypeConverter;
	}

	get jsonSchemas() {
		return this[jsonSchema_NAME];
	}
	set jsonSchemas(newJsonSchema) {
		this[jsonSchema_NAME] = newJsonSchema;
	}

	get xmlSchemas() {
		return this[xmlSchemas_NAME];
	}
	set xmlSchemas(newXmlSchemas) {
		this[xmlSchemas_NAME] = newXmlSchemas;
	}

	get forwardReferences() {
		return this[forwardReferences_NAME];
	}
	set forwardReferences(newForwardReferences) {
		this[forwardReferences_NAME] = newForwardReferences;
	}

	addNewJsonSchema(newJsonSchemaOptions) {
		var jsonSchema = new JsonSchemaFile(newJsonSchemaOptions);
		this.jsonSchemas[newJsonSchemaOptions.uri.toString()] = jsonSchema;
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

	isWellKnownXmlNamespace(namespace) {
		return namespace === Constants.XML_SCHEMA_NAMESPACE;
	}

	/**
	 * 
	 * @param {String} fullTypeName The name of the type to be returned.  One of the seven core JSON Schema types.
	 * @param {JsonSchemaFile} parent The parent of this type.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 *
	 * @returns {JsonSchemaFile} The requested custom type.
	 */
	getBuiltInType(fullTypeName, parent, xsd) {
		const qname = new Qname(fullTypeName);
		const typeName = qname.getLocal();
		if (this.namespaces[Constants.XML_SCHEMA_NAMESPACE].types[typeName] === undefined) {
			const newType = new JsonSchemaFile();
			// The 'node' parameter to the builtInTypeConverter's xml handler methods is not currently
			// used so it is safe to pass in null for now.  This is likely a future bug!
			debug(`Returning JSON Schema type [${typeName}]`);
			this.builtInTypeConverter[typeName](null, newType, xsd);
			this.namespaces[Constants.XML_SCHEMA_NAMESPACE].types[typeName] = newType;
		}
		const builtInType = this.namespaces[Constants.XML_SCHEMA_NAMESPACE].types[typeName].clone();
		builtInType.parent = parent;
		return builtInType;
	}

	getNamespaceName(qname, xsd) {
		let namespaceName = qname.getPrefix();
		if (namespaceName == '' && xsd.resolveNamespace(namespaceName) == undefined) {
			namespaceName = XsdAttributes.TARGET_NAMESPACE;
		}
		return namespaceName;
	}

	getNamespaceValue(qname, xsd) {
		let namespaceName = qname.getPrefix();
		if (namespaceName == '' && xsd.resolveNamespace(namespaceName) == undefined) {
			namespaceName = XsdAttributes.TARGET_NAMESPACE;
		}
		return xsd.resolveNamespace(namespaceName);
	}

	isBuiltInType(fullTypeName, xsd) {
		const qname = new Qname(fullTypeName);
		const namespace = this.getNamespaceValue(qname, xsd);
		return this.isWellKnownXmlNamespace(namespace) && (this.builtInTypeConverter[qname.getLocal()] != undefined);
	}

	createForwardReference(namespace, typeName, parent, baseJsonSchema, xsd) {
		debug('Creating FORWARD REFERENCE to [' + typeName + '] in namespace [' + namespace + '] from [' + xsd.uri.toString() + ']');
		// Create the ForwardReference type, which will be resolved later after the type has been processed.
		const forwardRef = new ForwardReference(this, namespace, typeName, parent, baseJsonSchema, xsd);
		this.forwardReferences.push(forwardRef);
		return forwardRef.ref;
	}

	/**
	 * This method returns a reference to the requested type, which can be either a custom type or an 
	 * XML built-in type.  If the type exists in the namesapce of xsd then a reference to the type is
	 * retuned. If the type does not exist a forwardReference to the type is created and then returned.
	 * 
	 * @param {String} fullTypeName The name of the type to be returned.  The format of this
	 * parameter is 'prefix:localName' as defined {@link http://www.w3.org/TR/xml-names/#NT-QName |here}. 
	 * @param {JsonSchemaFile} parent The parent of this type.
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 *  Schema file to JSON Schema.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {JsonSchemaFile} The requested custom type.
	 */
	getTypeReference(fullTypeName, parent, baseJsonSchema, xsd, createType) {
		if (fullTypeName === undefined) {
			throw new Error('\'fullTypeName\' parameter required');
		}
		if (parent === undefined) {
			throw new Error('\'parent\' parameter required');
		}
		if (baseJsonSchema === undefined) {
			throw new Error('\'baseJsonSchema\' parameter required');
		}
		if (xsd === undefined) {
			throw new Error('\'xsd\' parameter required');
		}
		if (createType != undefined) {
			throw new Error('\'createType\' parameter not allowed');
		}
		const namespaceQname = new Qname(fullTypeName);
		const namespace = this.getNamespaceValue(namespaceQname, xsd);
		if (namespace == undefined) {
			throw new Error('A namespace has not been defined for [' + fullTypeName + ']');
		}
		const typeName = namespaceQname.getLocal();
		if (this.isWellKnownXmlNamespace(namespace)) {
			return this.getBuiltInType(typeName, parent, xsd);
		}
		if (this.namespaces[namespace].types[typeName] === undefined) {
			return this.createForwardReference(namespace, fullTypeName, parent, baseJsonSchema, xsd);
		} else {
			debug('Returning reference to existing type [' + fullTypeName + '] in namespace [' + namespace + ']');
			const baseJsonSchemaForNamespace = this.jsonSchemas[xsd.imports[namespace]] == undefined ? baseJsonSchema : this.jsonSchemas[xsd.imports[namespace]];
			const type = this.namespaces[namespace].types[typeName];
			return type.get$RefToSchema(parent);
		}
	}

	createType(namespace, typeName, parent, baseJsonSchema, xsd) {
		debug('Creating TYPE [' + typeName + '] in namespace [' + namespace + '] from [' + xsd.uri.toString() + ']');
		// Create the type, which will be filled out later as the XSD is processed, and add it to the namespace.
		const baseJsonSchemaForNamespace = this.jsonSchemas[xsd.imports[namespace]] == undefined ? baseJsonSchema : this.jsonSchemas[xsd.imports[namespace]];
		const newType = new JsonSchemaFile({
			ref: new URI(baseJsonSchemaForNamespace.id + '#' + baseJsonSchemaForNamespace.getSubschemaJsonPointer() + '/' + typeName)
		});
		this.namespaces[namespace].types[typeName] = newType;
		// const type = this.namespaces[namespace].types[typeName].clone();
		const type = this.namespaces[namespace].types[typeName];
		type.parent = parent;
		// Add the type type to the anyOf in baseJsonSchema so it can be used directly for validation.
		const baseId = new URI(baseJsonSchema.id);
		const typeId = new URI(newType.ref);
		if (baseId.filename() == typeId.filename()) {
			baseJsonSchema.addRequiredAnyOfPropertyByReference(typeName, type.get$RefToSchema(baseJsonSchema));
		}
		return type;
	}

	/**
	 * This method returns the requested type, which can be either a custom type or an 
	 * XML built-in type.  If the type exists in the namesapce of xsd then the type is
	 * retuned. If the type does not exist it is created and then returned.
	 * 
	 * @param {String} fullTypeName The name of the type to be returned.  The format of this
	 * parameter is 'prefix:localName' as defined {@link http://www.w3.org/TR/xml-names/#NT-QName |here}. 
	 * @param {JsonSchemaFile} parent The parent of this type.
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 *  Schema file to JSON Schema.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {JsonSchemaFile} The requested custom type.
	 */
	getType(fullTypeName, parent, baseJsonSchema, xsd, createType) {
		if (fullTypeName === undefined) {
			throw new Error('\'fullTypeName\' parameter required');
		}
		if (parent === undefined) {
			throw new Error('\'parent\' parameter required');
		}
		if (baseJsonSchema === undefined) {
			throw new Error('\'baseJsonSchema\' parameter required');
		}
		if (xsd === undefined) {
			throw new Error('\'xsd\' parameter required');
		}
		if (createType != undefined) {
			throw new Error('\'createType\' parameter not allowed');
		}
		const namespaceQname = new Qname(fullTypeName);
		const namespace = this.getNamespaceValue(namespaceQname, xsd);
		if (namespace == undefined) {
			throw new Error('A namespace has not been defined for [' + fullTypeName + ']');
		}
		const typeName = namespaceQname.getLocal();
		if (this.isWellKnownXmlNamespace(namespace)) {
			return this.getBuiltInType(typeName, parent, xsd);
		}
		if (this.namespaces[namespace].types[typeName] === undefined) {
			return this.createType(namespace, typeName, parent, baseJsonSchema, xsd);
		} else {
			debug('Returning existing type [' + typeName + '] in namespace [' + namespace + ']');
			let type = this.namespaces[namespace].types[typeName]; //.clone();
			if (type.isForwardRef()) {
				// create the new type
				const newType = this.createType(namespace, typeName, parent, baseJsonSchema, xsd);
				debug(`Replacing forward reference [${type.ref}] with new type [${newType.ref}]`);
				// resolve any references that were created.
				type.resolveRef(newType)
				// remove the forward reference because it does not need to be resolved later.
				const index = this.forwardReferences.indexOf(type.forwardReference);
				this.forwardReferences.splice(index, 1);
				// replace the forward reference with the actual type in the namespace 
				this.namespaces[namespace].types[typeName] = newType;
				type = this.namespaces[namespace].types[typeName];
			}
			return type;
		}
	}

	compilePointer (pointer) {
		if (typeof pointer === 'string') {
		  	pointer = pointer.split('/')
			  if (Array.isArray(pointer)) {
				return pointer
			}
		} 
		throw new Error(`Invalid JSON pointer [${pointer}}]`)
	}

	getReferencedTypeName(type) {
		if (!type.isRef()) {
			return new Error(`ref expected but found ${type.toString()}`);
		}
		var pointer = this.compilePointer(type.$ref);
		return pointer[pointer.length-1];
	}

	/**
	 * This method returns the requested type, which can be either a custom type or an 
	 * XML built-in type.  If the type exists in the namesapce of xsd then the type is
	 * retuned. If the type does not exist it is created and then returned.
	 * 
	 * @param {String} fullTypeName The name of the type to be returned.  The format of this
	 * parameter is 'prefix:localName' as defined {@link http://www.w3.org/TR/xml-names/#NT-QName |here}. 
	 * @param {JsonSchemaFile} parent The parent of this type.
	 * @param {JsonSchemaFile} baseJsonSchema The JsonShemaFile being created as a result of converting an XML
	 *  Schema file to JSON Schema.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {JsonSchemaFile} The requested custom type.
	 */
	getTypeReferenceFromRefChain(fullTypeName, parent, baseJsonSchema, xsd) {
		if (fullTypeName === undefined) {
			throw new Error('\'fullTypeName\' parameter required');
		}
		if (parent === undefined) {
			throw new Error('\'parent\' parameter required');
		}
		if (baseJsonSchema === undefined) {
			throw new Error('\'baseJsonSchema\' parameter required');
		}
		if (xsd === undefined) {
			throw new Error('\'xsd\' parameter required');
		}
		const namespaceQname = new Qname(fullTypeName);
		const namespace = this.getNamespaceValue(namespaceQname, xsd);
		if (namespace == undefined) {
			throw new Error('A namespace has not been defined for [' + fullTypeName + ']');
		}
		const typeName = namespaceQname.getLocal();
		if (this.isWellKnownXmlNamespace(namespace)) {
			return this.getBuiltInType(typeName, parent, xsd);
		}
		if (this.namespaces[namespace].types[typeName] === undefined) {
			return this.createForwardReference(namespace, fullTypeName, parent, baseJsonSchema, xsd);
		} else {
			debug('Returning reference to existing type [' + fullTypeName + '] in namespace [' + namespace + ']');
			const baseJsonSchemaForNamespace = this.jsonSchemas[xsd.imports[namespace]] == undefined ? baseJsonSchema : this.jsonSchemas[xsd.imports[namespace]];
			const type = this.namespaces[namespace].types[typeName];
			// Return a reference to a type.  Don't return a reference to a reference.
			if (type.isRef()) {
				return this.getTypeReferenceFromRefChain(this.getReferencedTypeName(type), parent, baseJsonSchema, xsd)
			} else {
				return type.get$RefToSchema(parent);
			}
		}
	}	
	
	dumpForwardReferences() {
		debug('Begin Forward References (' + this.forwardReferences.length + ')');
		this.forwardReferences.forEach(function (fRef, index, array) {
			if (fRef.ref.ref == undefined) {
				debug(index + ') $ref:' + fRef.ref.$ref.toString());
			} else {
				debug(index + ') ref:' + fRef.ref.ref.toString());
			}
		}, this);
	}

	resolveForwardReferenceOld(fRef) {
		const type = this.getTypeReferenceFromRefChain(fRef.fullTypeName, fRef.parent, fRef.baseJsonSchema, fRef.xsd);
		//const displayRef = type.ref == undefined ? type.$ref : type.ref;
		const fromType = fRef.ref.$ref;
		const toType = type.ref == undefined ? type.$ref : type.ref;
		debug(`Resolving type [${fRef.ref.$ref}] to [${type.ref == undefined ? type.$ref : type.ref}]`);
		if(type.resolved != undefined && type.resolved != true && fromType != toType) {
			this.resolveForwardReference(type.forwardReference);
		}
		let newRef = (type.ref != undefined ? type.ref : type.$ref)
		debug('Updating ' + fRef.ref.$ref.toString() + ' to ' + newRef.toString() + ', from ' + fRef.baseJsonSchema.filename);
		fRef.ref.resolveRef(type);
	}

	resolveForwardReference(fRef) {
		const type = this.getTypeReferenceFromRefChain(fRef.fullTypeName, fRef.parent, fRef.baseJsonSchema, fRef.xsd);
		const fromType = fRef.ref.$ref;
		const toType = type.ref == undefined ? type.$ref : type.ref;
		debug(`Resolving type [${fRef.ref.$ref}] to [${type.ref == undefined ? type.$ref : type.ref}]`);
		if(type.resolved != undefined && type.resolved != true && fromType != toType) {
			this.resolveForwardReference(type.forwardReference);
		}
		debug(`'Updating [${fromType}] to [${toType}] from ${fRef.baseJsonSchema.filename}`);
		fRef.ref.resolveRef(type);
	}

	resolveForwardReferences() {
		this.forwardReferences.forEach(function (fRef, index, array) {
			this.resolveForwardReference(fRef);
		}, this);
		this.dumpForwardReferences();
	}

	cloneForwardReference(forwardRef) {
		for(let i=0; i<this.forwardReferences.length; i++) {
			let fRef = this.forwardReferences[i];
			if(forwardRef.equals(fRef.ref)) {
				const cloneRef = this.getTypeReference(fRef.fullTypeName, fRef.parent, fRef.baseJsonSchema, fRef.xsd);
				return cloneRef;
			}
		}
		return undefined;
	}

	/**
	 * This method returns true if the type exists in the namespace of the .
	 * 
	 * @param {String} fullTypeName The name of the type to be returned.  The format of this
	 * parameter is 'prefix:localName' as defined {@link http://www.w3.org/TR/xml-names/#NT-QName |here}. 
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {boolean} The requested custom type.
	 */
	typeExists(fullTypeName, xsd) {
		if (fullTypeName === undefined) {
			throw new Error('\'fullTypeName\' parameter required');
		}
		const namespaceQname = new Qname(fullTypeName);
		const namespace = this.getNamespaceValue(namespaceQname, xsd);
		if (namespace == undefined) {
			throw new Error('A namespace has not been defined for [' + fullTypeName + ']');
		}
		const typeName = namespaceQname.getLocal();
		return this.namespaces[namespace].types[typeName] != undefined;
	}

	/**
	 * This method inserts an entry into the given namespace by reference name rather than by type name.
	 * This way it can be looked up by type name or by reference.
	 * 
	 * @param {String} fullTypeName - The name of the custom type to be used for references.   The format of this
	 * parameter is 'prefix:localName' where localName is require and the prefix and separating colon are optional. 
	 * @param {JsonSchemaFile} type - The type to be referenced by its name.
	 * @param {JsonSchemaFile} baseJsonSchema - The JsonShemaFile being created as a result of converting an XML
	 * Schema file to JSON Schema.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 */
	addTypeReference(fullTypeName, type, baseJsonSchema, xsd) {
		const namespaceQname = new Qname(fullTypeName);
		const namespaceName = this.getNamespaceName(namespaceQname, xsd);
		const namespace = xsd.resolveNamespace(namespaceName);
		const refName = namespaceQname.getLocal();
		if (this.namespaces[namespace].types[refName] === undefined) {
			debug('Creating reference [' + refName + '] in namespace [' + namespace + '] from [' + xsd.uri.toString() + ']');
			this.namespaces[namespace].types[refName] = type;
			baseJsonSchema.addRequiredAnyOfPropertyByReference(refName, type);
		} else {
			debug('Reference [' + refName + '] already exists in namespace [' + namespace + '] from [' + xsd.uri.toString() + ']');
		}
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
			globalAttributesNamespace.types[name] = new JsonSchemaFile({
				ref: new URI(baseJsonSchema.id + '#/' + Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME + '/' + name)
			});
		}
		return globalAttributesNamespace.types[name].clone();
	}

	toString() {
		//return JSON.stringify(this.namespaces, null, '\n');
	}
}

module.exports = NamespaceManager;
