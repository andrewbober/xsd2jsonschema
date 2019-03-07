'use strict';

const debug = require('debug')('xsd2jsonschema:Xsd2JsonSchema');

const path = require('path');
const fs = require('fs-extra');
const URI = require('urijs');

// var XsdFile = require('./xmlschema/xsdFile');
const XsdFile = require('./xmlschema/xsdFileXmlDom');
const JsonSchemaFile = require('./jsonschema/jsonSchemaFile');
const DepthFirstTraversal = require('./depthFirstTraversal');
const DefaultConversionVisitor = require('./visitors/defaultConversionVisitor');
const BaseConversionVisitor = require('./visitors/baseConversionVisitor');
const Constants = require('./constants');
const NamespaceManager = require('./namespaceManager');
const BaseConverter = require('./baseConverter');


const xsdBaseUri_NAME = Symbol();
const outputDir_NAME = Symbol();
const baseId_NAME = Symbol();
const mask_NAME = Symbol();
const visitor_NAME = Symbol();
const NamespaceManager_NAME = Symbol();

const defaultXsd2JsonSchemaOptions = {
    xsdBaseUri: new URI('.'),
    outputDir: new URI('.'),
    baseId: undefined,
    mask: undefined,
    namespaceMode: undefined
}

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
 * 
 */

class Xsd2JsonSchema {
    /**
     * 
     * @param {Object} options - An object used to override default options.
     * @param {URI} options.xsdBaseUri - The directory from which xml schema's should be loaded.  The default value is the current directory.
     * @param {URI} options.outputDir - The destination directory for generated JSON Schema files.  The default value is the current directory.
     * @param {string} options.baseId - The base value for the 'id' in any generated JSON Schema files.  The default value is undefined.
     * @param {string} options.mask - A regular expression used to reduce generated JSON Schema filenames as needed.  The default value is 'undefined'.
     * @param {string} options.builtInTypeConverter - An instance of a subclass of {@link BuiltInTypeConverter|BuiltInTypeConverter}.
     * @param {string} options.converter - A subclass of {@link BaseConverter|BaseConverter}.  This is the class NOT an instance of the class.
     * @param {string} options.visitor - A subclass of {@link BaseConversionVisitor|BaseConversionVisitor}.  This is the class NOT an instance of the class.
     * @param {string} options.namespaceMode - The method of handling namespaces. Must be one of: undefined, SUBSCHEMA, or FILENAME
     */
    constructor(options) {
        if (options != undefined) {
            this.xsdBaseUri = options.xsdBaseUri != undefined ? new URI(options.xsdBaseUri) : defaultXsd2JsonSchemaOptions.xsdBaseUri;
            this.outputDir = options.outputDir != undefined ? new URI(options.outputDir) : defaultXsd2JsonSchemaOptions.outputDir;
            this.baseId = options.baseId != undefined ? options.baseId : defaultXsd2JsonSchemaOptions.baseId;
            this.mask = options.mask != undefined ? options.mask : defaultXsd2JsonSchemaOptions.mask;
            // NamespaceManager
            this.namespaceManager = new NamespaceManager();
            if (options.builtInTypeConverter != undefined) {
                this.namespaceManager.builtInTypeConverter = options.builtInTypeConverter;
            }
            // Converter
            if (options.converter != undefined) {
                this.converter = options.converter;
            } else {
                this.converter = new BaseConverter();
            }
            // Visitor
            if (options.visitor != undefined) {
                this.visitor = options.visitor;
            } else {
                this.visitor = new BaseConversionVisitor();
            }
        } else {
            this.xsdBaseUri = defaultXsd2JsonSchemaOptions.xsdBaseUri;
            this.outputDir = defaultXsd2JsonSchemaOptions.outputDir;
            this.baseId = defaultXsd2JsonSchemaOptions.baseId;
            this.mask = defaultXsd2JsonSchemaOptions.mask;
            this.namespaceManager = new NamespaceManager();
            this.converter = new BaseConverter();
            this.visitor = new BaseConversionVisitor();

        }
        this.converter.namespaceManager = this.namespaceManager;
        this.visitor.processor = this.converter;
    }

    // Getters/Setters
    get xsdBaseUri() {
        return this[xsdBaseUri_NAME];
    }
    set xsdBaseUri(newXsdBaseUri) {
        this[xsdBaseUri_NAME] = newXsdBaseUri;
    }

    get baseId() {
        return this[baseId_NAME];
    }
    set baseId(newBaseId) {
        this[baseId_NAME] = newBaseId;
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

	get namespaceManager() {
		return this[NamespaceManager_NAME];
	}
	set namespaceManager(newNamespaceManager) {
		this[NamespaceManager_NAME] = newNamespaceManager;
	}

    get jsonSchemas() {
        throw new Error('Unsupported operation');
    }
    set jsonSchemas(newJsonSchema) {
        throw new Error('Unsupported operation');
    }

    get xmlSchemas() {
        throw new Error('Unsupported operation');
    }
    set xmlSchemas(newXmlSchemas) {
        throw new Error('Unsupported operation');
    }

    loadSchema(uri) {
        if (this.namespaceManager.xmlSchemas[uri.toString()] !== undefined) {
            return;
        }
        var xsd = new XsdFile({
            uri: uri
        });
        this.namespaceManager.xmlSchemas[uri.toString()] = xsd;
        if (xsd.hasIncludes()) {
            this.loadSchemas(new URI(xsd.directory), xsd.includeUris);
        }
        if (xsd.hasImports()) {
            this.loadSchemas(new URI(xsd.directory), xsd.importUris);
        }
    }

    loadSchemas(baseUri, filenames) {
        filenames.forEach(function (filename, index, array) {
            this.loadSchema(new URI(baseUri).segment(filename));
        }, this);
        return this.namespaceManager.xmlSchemas;
    }

    processSchema(uri) {
        debug(`Processing XML [${uri.filename()}]`);
        const xsd = this.namespaceManager.xmlSchemas[uri.toString()];
        const traversal = new DepthFirstTraversal();
        var anotherPass = true;
        while (anotherPass) {
            var jsonSchema = this.namespaceManager.jsonSchemas[uri.toString()];
            debug(`About to traverse XML [${xsd.uri.filename()}]`);
            // This is a future I hope never comes. For now anotherPass will always come back as false
            // because nothing in BaseConverter is setting it otherwise.
            anotherPass = traversal.traverse(this.visitor, jsonSchema, xsd);
        }
    }

    processSchemas() {
        const filenames = Object.keys(this.namespaceManager.xmlSchemas);

        // prime the jsoonSchema map to support forward references in namespaceManager.
        filenames.forEach(function (filename, index, array) {
            const xsd = this.namespaceManager.xmlSchemas[filename];
            const relativeUri = new URI(path.relative(this.xsdBaseUri.toString(), filename));
            const maskedFilename = this.getMaskedFileName(relativeUri.filename());
            const baseFilename = path.join(relativeUri.directory(), maskedFilename);
            const uri = new URI(filename);
            this.namespaceManager.addNewJsonSchema({
                uri: uri, 
                namespaceMode: this.namespaceMode,
                baseFilename: baseFilename,
                targetNamespace: xsd.targetNamespace,
                baseId: this.baseId
            });
        }, this);

        // process each schema
        filenames.forEach(function (filename, index, array) {
            this.processSchema(new URI(filename));
        }, this);
    }

    processAllSchemas(parms) {
        if (parms.xsdBaseUri != undefined) {
            this.xsdBaseUri = new URI(parms.xsdBaseUri);
        }
        if (parms.visitor != undefined) {
            this.visitor = parms.visitor;
        }
        this.namespaceManager.jsonSchemas = {};  // is this really needed?
        this.loadSchemas(this.xsdBaseUri, parms.xsdFilenames);
        this.processSchemas();
        this.namespaceManager.resolveForwardReferences();
        return this.namespaceManager.jsonSchemas;
    }

    getMaskedFileName(unmaskedFilename) {
        if (unmaskedFilename == undefined) {
            throw new Error('The parameter unmaskedFilename is required');
        }
        return (this.mask === undefined) ? unmaskedFilename : unmaskedFilename.replace(this.mask, '');
    }

    /**
     * Writes out a JsonSchemaFile to the output directory directory with the provided formatting option.
     * 
     * @param {JsonSchemaFile} jsonSchema - The jsonSchema to be writen out to a file.
     * @param {String} spacing - Adds indentation, white space, and line break characters to the JSON file written to disk.  The 
     * default value is '\t'.  This is used as the last parameter to JSON.stringify().
     * @returns {void}
     */
    writeFile(jsonSchema, spacing) {
        if (jsonSchema == undefined) {
            throw new Error('The parameter jsonSchema is required');
        }
        if (spacing == undefined) {
            spacing = '\t';
        }
        const dir = new URI(this.outputDir).segment(jsonSchema.filename);
        const data = JSON.stringify(jsonSchema.getJsonSchema(), null, spacing);
        //const maskedFilename = this.getMaskedFileName(jsonSchema.filename);
        fs.ensureDirSync(dir.directory())
        fs.writeFileSync(dir.toString(), data);
    }

    writeFiles() {
        try {
            fs.ensureDirSync(this.outputDir.toString());
        } catch (err) {
            debug(err);
        }
        Object.keys(this.namespaceManager.jsonSchemas).forEach(function (uri, index, array) {
            this.writeFile(this.namespaceManager.jsonSchemas[uri], '  ');
        }, this);
    }

    dump() {
        debug('\n*** XML Schemas ***');
        Object.keys(this.namespaceManager.xmlSchemas).forEach(function (uri, index, array) {
            debug(index + ') ' + uri);
            debug(this.namespaceManager.xmlSchemas[uri].includeUris);
        }, this);

        debug('\n*** Namespaces and Types ***');
        debug(this.namespaceManager.namespaces);
    }

    dumpSchemas() {
        debug('\n*** JSON Schemas ***');
        Object.keys(this.namespaceManager.jsonSchemas).forEach(function (uri, index, array) {
            debug(index + ') ' + uri);
            var log = JSON.stringify(this.namespaceManager.jsonSchemas[uri].getJsonSchema(), null, 2);
            debug(log);
        }, this);
    }

}

module.exports = Xsd2JsonSchema;
