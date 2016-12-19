/**
 * Xsd2JsonSchema - Guided conversion from XML Schema to JSON Schema.
 */

"use strict";

var customTypes = require("./customTypes");
// var XsdFile = require("./xsdFile");
var XsdFile = require("./xsdFileXmlDom");
var JsonSchemaFile = require("./jsonSchemaFile");
var DepthFirstTraversal = require("./depthFirstTraversal");
var path = require("path");
var fs = require("fs");

/*
 * 
 *
 */
var options_NAME = Symbol();
var baseDirectory_NAME = Symbol();
var xmlSchemas_NAME = Symbol();
var jsonSchema_NAME = Symbol();

class Xsd2JsonSchema {
	constructor(xsdBaseDirectory, xsdFilenames, _options) {
		this.options = _options;
		this.baseDirectory = xsdBaseDirectory;
		this.xmlSchemas = {};
		this.jsonSchema = {};
		this.loadAllSchemas(xsdFilenames);
		this.initializeNamespaces();
	}

	get options() {
		return this[options_NAME];
	}
	set options(newOptions) {
		this[options_NAME] = newOptions;
	}

	get baseDirectory() {
		return this[baseDirectory_NAME]
	}
	set baseDirectory(newbaseDirectory) {
		this[baseDirectory_NAME] = newbaseDirectory;
	}

	get xmlSchemas() {
		return this[xmlSchemas_NAME];
	}
	set xmlSchemas(newXmlSchemas) {
		this[xmlSchemas_NAME] = newXmlSchemas;
	}

	get jsonSchema() {
		return this[jsonSchema_NAME];
	}
	set jsonSchema(newJsonSchema) {
		this[jsonSchema_NAME] = newJsonSchema;
	}

	loadSchema(uri) {
		if (this.xmlSchemas[uri] !== undefined) {
			return;
		}
		var xsd = new XsdFile(uri);
		this.xmlSchemas[xsd.baseFilename] = xsd;
		if (xsd.hasIncludes()) {
			this.loadAllSchemas(xsd.getIncludes());
		}
	}

	loadAllSchemas(uris) {
		uris.forEach(function (uri, index, array) {
			this.loadSchema(path.join(this.baseDirectory, uri));
		}, this);
		return this.xmlSchemas;
	}


	initializeNamespaces() {
		Object.keys(this.xmlSchemas).forEach(function (uri, index, array) {
			var targetNamespace = this.xmlSchemas[uri].targetNamespace;
			customTypes.addNamespace(targetNamespace);
		}, this);
	}

	processSchema(visitor, uri) {
		var xsd = this.xmlSchemas[uri];
		if (xsd.hasIncludes()) {
			this.processSchemas(visitor, xsd.getIncludes());
		}
		if (this.jsonSchemas[uri] === undefined) {
			var traversal = new DepthFirstTraversal();
			var parms = {};
			parms.xsd = xsd;
			parms.resolveURI = this.options.resolveURI;
			parms.mask = this.options.mask;
			this.jsonSchemas[uri] = new JsonSchemaFile(parms);
			traversal.traverse(visitor, this.jsonSchemas[uri], xsd);
		}
	}

	processSchemas(visitor, uris) {
		uris.forEach(function (uri, index, array) {
			this.processSchema(visitor, uri);
		}, this);
	}

	processAllSchemas(visitor) {
		this.jsonSchemas = {};
		this.processSchemas(visitor, Object.keys(this.xmlSchemas));
	}

	writeFiles() {
		try {
			fs.mkdirSync(this.options.outputDir);
		} catch (err) {
			// log something here
		}
		Object.keys(this.jsonSchemas).forEach(function (uri, index, array) {
			this.jsonSchemas[uri].writeFile(this.options.outputDir);
		}, this);
	}

	dump() {
		console.log("\n*** XML Schemas ***")
		Object.keys(this.xmlSchemas).forEach(function (uri, index, array) {
			console.log(index + ") " + uri);
			console.log(this.xmlSchemas[uri].getIncludes());
		}, this);

		console.log("\n*** Namespaces and Types ***")
		console.log(JSON.stringify(customTypes.getNamespaces(), null, '\t'));
	}

	dumpSchemas() {
		console.log("\n*** JSON Schemas ***")
		Object.keys(this.jsonSchemas).forEach(function (uri, index, array) {
			console.log(index + ") " + uri);
			var log = JSON.stringify(this.jsonSchemas[uri].getJsonSchema(), null, 2);
			console.log(log);
		}, this);
	}

	getCustomTypes() {
		return customTypes;
	}
}

module.exports = Xsd2JsonSchema;
