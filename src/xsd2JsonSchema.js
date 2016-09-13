/**
 * Xsd2JsonSchema - Guided conversion from XML Schema to JSON Schema.
 */

"use strict";

var customTypes = require('./customTypes');
var XsdFile = require('./xsdFile');
var JsonSchemaFile = require('./jsonSchemaFile');
var DepthFirstTraversal = require('./depthFirstTraversal');
var path = require('path');
var fs = require('fs');
var util = require('util');

/*
 * 
 *
 */
function Xsd2JsonSchema(customConverter, xsdBaseDirectory, xsdFilenames, _options) {
	var options = _options
	var baseDirectory = xsdBaseDirectory;
	var xmlSchemas = {};
	var jsonSchemas = {};

	var loadSchema = function (uri) {
		if (xmlSchemas[uri] !== undefined) {
			return;
		}
		var xsd = new XsdFile(uri);
		xmlSchemas[xsd.getBaseFilename()] = xsd;
		if (xsd.hasIncludes()) {
			loadAllSchemas(xsd.getIncludes());
		}
	};

	var loadAllSchemas = function (uris) {
		uris.forEach(function (uri, index, array) {
			loadSchema(path.join(baseDirectory, uri));
		});
		return xmlSchemas;
	};

	loadAllSchemas(xsdFilenames);

	var initializeNamespaces = function () {
		Object.keys(xmlSchemas).forEach(function (uri, index, array) {
			var targetNamespace = xmlSchemas[uri].getTargetNamespace();
			customTypes.addNamespace(targetNamespace);
		});
	};

	initializeNamespaces();

	var processSchema = function (visitor, uri) {
		var xsd = xmlSchemas[uri];
		if (xsd.hasIncludes()) {
			processSchemas(visitor, xsd.getIncludes());
		}
		if (jsonSchemas[uri] === undefined) {
			var traversal = new DepthFirstTraversal();
			var parms={};
			parms.xsd = xsd;
			parms.resolveURI = options.resolveURI;
			parms.mask = options.mask;
			jsonSchemas[uri] = new JsonSchemaFile(parms);
			traversal.traverse(visitor, jsonSchemas[uri], xsd);
		}
	};

	var processSchemas = function (visitor, uris) {
		uris.forEach(function (uri, index, array) {
			processSchema(visitor, uri);
		});
	};

	this.processAllSchemas = function (visitor) {
		jsonSchemas = {};
		processSchemas(visitor, Object.keys(xmlSchemas));
		this.writeFiles();
	};

	this.writeFiles = function () {
		try {
			fs.mkdirSync(options.outputDir);
		} catch (err) {
			// log something here
		}
		Object.keys(jsonSchemas).forEach(function (uri, index, array) {
			jsonSchemas[uri].writeFile(options.outputDir);
		});
	}

	this.dump = function () {
		console.log("\n*** XML Schemas ***")
		Object.keys(xmlSchemas).forEach(function (uri, index, array) {
			console.log(index + ") " + uri);
			console.log(xmlSchemas[uri].getIncludes());
		});

		console.log("\n*** Namespaces and Types ***")
		console.log(JSON.stringify(customTypes.getNamespaces(), null, '\t'));
	};

	this.dumpSchemas = function () {
		console.log("\n*** JSON Schemas ***")
		Object.keys(jsonSchemas).forEach(function (uri, index, array) {
			console.log(index + ") " + uri);
			var log = JSON.stringify(jsonSchemas[uri].getJsonSchema(), null, 2);
			console.log(log);
		});
	}

	this.getXmlSchemas = function () {
		return xmlSchemas;
	};

	this.getJsonSchemas = function () {
		return jsonSchemas;
	};

	this.getCustomTypes = function () {
		return customTypes;
	}
}

module.exports = Xsd2JsonSchema;
