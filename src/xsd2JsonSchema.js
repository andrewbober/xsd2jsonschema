"use strict";

const debug = require("debug")("xsd2jsonschema:Xsd2JsonSchema");

// var XsdFile = require('./xmlschema/xsdFile');
const XsdFile = require("./xmlschema/xsdFileXmlDom");
const JsonSchemaFile = require("./jsonschema/jsonSchemaFile");
const DepthFirstTraversal = require("./depthFirstTraversal");
const DefaultConversionVisitor = require("./visitors/defaultConversionVisitor");
const BaseConversionVisitor = require("./visitors/baseConversionVisitor");
const path = require("path");
const fs = require("fs-extra");


const xsdBaseDir_NAME = Symbol();
const baseId_NAME = Symbol();
const jsonSchema_NAME = Symbol();
const mask_NAME = Symbol();
const outputDir_NAME = Symbol();
const visitor_NAME = Symbol();
const xmlSchemas_NAME = Symbol();

/**
 * Class prepresenting an instance of the Xsd2JsonSchema library.  This needs to be refactored to
 * remove the filesystem focus and work off URI's or possibly just strings/buffers representing the contents
 * of the XML Schema files that are being converted to JSON Schema.
 * 
 * I would like the library to be encapsulated from IO if possible.
 * 
 * The current implementation is really only usable as a cli.
 * 
 * TODO: Set defaults for all options and make the 'options' parameter optional.
 */

 class Xsd2JsonSchema {
    constructor(options) {
        this.xsdBaseDir = options.xsdBaseDir;
        this.baseId = options.baseId;
        this.mask = options.mask;
        this.outputDir = options.outputDir;
        if (options.converter == undefined) {
            if (options.visitor == undefined) {
                this.visitor = new DefaultConversionVisitor();
            } else {
                this.visitor = options.visitor;
            }
        } else {
            this.visitor = new BaseConversionVisitor(options.converter);
        }
        this.xmlSchemas = {};
        this.jsonSchema = {};
    }

    // Getters/Setters
    get xsdBaseDir() {
        return this[xsdBaseDir_NAME];
    }
    set xsdBaseDir(newXsdBaseDirectory) {
        this[xsdBaseDir_NAME] = newXsdBaseDirectory;
    }

    get baseId() {
        return this[baseId_NAME];
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
        return this[mask_NAME];
    }
    set mask(newMask) {
        this[mask_NAME] = newMask;
    }

    get outputDir() {
        return this[outputDir_NAME];
    }
    set outputDir(newOutputDir) {
        this[outputDir_NAME] = newOutputDir;
    }

    get visitor() {
        return this[visitor_NAME];
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
        var xsd = new XsdFile({ uri: uri });
        this.xmlSchemas[xsd.baseFilename] = xsd;
        if (xsd.hasIncludes()) {
            this.loadAllSchemas(xsd.includeUris);
        }
    }

    loadAllSchemas(uris) {
        uris.forEach(function(uri, index, array) {
            this.loadSchema(path.join(this.xsdBaseDir, uri));
            //			this.loadSchema(uri);
        }, this);
        return this.xmlSchemas;
    }

    processSchema(uri) {
        var xsd = this.xmlSchemas[uri];
        if (xsd.hasIncludes()) {
            this.processSchemas(xsd.includeUris);
        }
        if (this.jsonSchemas[uri] === undefined) {
            var traversal = new DepthFirstTraversal();
            this.jsonSchemas[uri] = new JsonSchemaFile({
                xsd: xsd,
                baseId: this.baseId,
                mask: this.mask
            });
            traversal.traverse(this.visitor, this.jsonSchemas[uri], xsd);
        }
    }

    processSchemas(uris) {
        uris.forEach(function(uri, index, array) {
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
        this.jsonSchemas = {};
        this.loadAllSchemas(parms.xsdFilenames);
        this.processSchemas(Object.keys(this.xmlSchemas));
        return this.jsonSchemas;
    }

    writeFiles() {
        try {
            fs.ensureDirSync(this.outputDir);
        } catch (err) {
            debug(err);
        }
        Object.keys(this.jsonSchemas).forEach(function(uri, index, array) {
            this.jsonSchemas[uri].writeFile(this.outputDir, '  ');
        }, this);
    }

    dump() {
        debug("\n*** XML Schemas ***");
        Object.keys(this.xmlSchemas).forEach(function(uri, index, array) {
            debug(index + ") " + uri);
            debug(this.xmlSchemas[uri].includeUris);
        }, this);

        debug("\n*** Namespaces and Types ***");
        debug(this.getNamespaceManager().namespaces);
    }

    dumpSchemas() {
        debug("\n*** JSON Schemas ***");
        Object.keys(this.jsonSchemas).forEach(function(uri, index, array) {
            debug(index + ") " + uri);
            var log = JSON.stringify(this.jsonSchemas[uri].getJsonSchema(), null, 2);
            debug(log);
        }, this);
    }

    getNamespaceManager() {
        return this.visitor.processor.namespaceManager;
    }
}

module.exports = Xsd2JsonSchema;
