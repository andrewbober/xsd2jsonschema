"use strict";

const customTypes = require("./customTypes");
// var XsdFile = require("./xmlschema/xsdFile");
const XsdFile = require("./xmlschema/xsdFileXmlDom");
const JsonSchemaFile = require("./jsonschema/jsonSchemaFile");
const DepthFirstTraversal = require("./depthFirstTraversal");
const DefaultConversionVisitor = require('./visitors/defaultConversionVisitor');
const path = require("path");
const fs = require('fs-extra');

const xsdBaseDir_NAME = Symbol();
const baseId_NAME = Symbol();
const jsonSchema_NAME = Symbol();
const mask_NAME = Symbol();
const outputDir_NAME = Symbol();
const visitor_NAME = Symbol();
const xmlSchemas_NAME = Symbol();


/**
 * Class prepresenting an instance of the Xsd2JsonSchema library.  This needs to be refactored to
 * remove the filesystem focus and work off URI's or possibly just strings represending the contents
 * of the XML Schema files being converted to JSON Schema.
 * 
 * I would like the library to be encapsulated from IO if possible.
 * 
 * In the current implementation is is really only usable as a cli.
 */
class Xsd2JsonSchema {
	constructor(options) {
		this.xsdBaseDir = options.xsdBaseDir;
		this.baseId = options.baseId;
		this.mask = options.mask;
		this.outputDir = options.outputDir;
		if (options.visitor == undefined) {
			this.visitor = new DefaultConversionVisitor();
		} else {
			this.visitor = options.visitor;
		}
		this.xmlSchemas = {};
		this.jsonSchema = {};
	}

	get xsdBaseDir() {
		return this[xsdBaseDir_NAME]
	}
	set xsdBaseDir(newXsdBaseDirectory) {
		this[xsdBaseDir_NAME] = newXsdBaseDirectory;
	}

	get baseId() {
		return this[baseId_NAME]
	}
	set baseId(newBaseId) {
		this[baseId_NAME] = newBaseId;
	}

	get jsonSchema() {
		return this[jsonSchema_NAME];
	}
	set jsonSchema(newJsonSchema) {
		this[jsonSchema_NAME] = newJsonSchema;
	}

	get mask() {
		return this[mask_NAME]
	}
	set mask(newMask) {
		this[mask_NAME] = newMask;
	}

	get outputDir() {
		return this[outputDir_NAME]
	}
	set outputDir(newOutputDir) {
		this[outputDir_NAME] = newOutputDir;
	}

	get visitor() {
		return this[visitor_NAME]
	}
	set visitor(newVisitor) {
		this[visitor_NAME] = newVisitor;
	}

	get xmlSchemas() {
		return this[xmlSchemas_NAME];
	}
	set xmlSchemas(newXmlSchemas) {
		this[xmlSchemas_NAME] = newXmlSchemas;
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
			this.loadSchema(path.join(this.xsdBaseDir, uri));
			//			this.loadSchema(uri);
		}, this);
		return this.xmlSchemas;
	}

	/**
	 * Runs through the list of XML Schema files and creates namespaces for all targetNamespaces
	 * discovered.
	 * 
	 * NOTE: This needs to be reviewed because it only supports targetNamespaces.  Technically,
	 * any element could have a namespace associated with it.
	 */
	initializeNamespaces() {
		Object.keys(this.xmlSchemas).forEach(function (uri, index, array) {
			var targetNamespace = this.xmlSchemas[uri].targetNamespace;
			customTypes.addNamespace(targetNamespace);
		}, this);
	}

	processSchema(uri) {
		var xsd = this.xmlSchemas[uri];
		if (xsd.hasIncludes()) {
			this.processSchemas(xsd.getIncludes());
		}
		if (this.jsonSchemas[uri] === undefined) {
			var traversal = new DepthFirstTraversal();
			var parms = {};
			parms.xsd = xsd;
			parms.baseId = this.baseId;
			parms.mask = this.mask;
			this.jsonSchemas[uri] = new JsonSchemaFile(parms);
			traversal.traverse(this.visitor, this.jsonSchemas[uri], xsd);
		}
	}

	processSchemas(uris) {
		uris.forEach(function (uri, index, array) {
			this.processSchema(uri);
		}, this);
	}

	processAllSchemas(parms) {
		if (parms.xsdBaseDir != undefined) {
			this.xsdBaseDir = parms.xsdBaseDir;
		}
		if (parms.visitor != undefined) {
			this.visitor = parms.visitor;
		}
		this.loadAllSchemas(parms.xsdFilenames);
		this.initializeNamespaces();
		this.jsonSchemas = {};
		this.processSchemas(Object.keys(this.xmlSchemas));
	}

	writeFiles() {
		try {
			fs.ensureDirSync(this.outputDir);
		} catch (err) {
			console.error(err);
		}
		Object.keys(this.jsonSchemas).forEach(function (uri, index, array) {
			this.jsonSchemas[uri].writeFile(this.outputDir);
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
