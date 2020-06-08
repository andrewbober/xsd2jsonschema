'use strict';

const debug = require('debug')('xsd2jsonschema:Xsd2JsonSchema');

const URI = require('urijs');

const XsdFile = require('./xmlschema/xsdFileXmlDom');
const BaseConversionVisitor = require('./visitors/baseConversionVisitor');
const DepthFirstTraversal = require('./depthFirstTraversal');
const BaseSpecialCaseIdentifier = require('./baseSpecialCaseIdentifier');
const NamespaceManager = require('./namespaceManager');
const ConverterDraft04 = require('./converterDraft04');
const ConverterDraft06 = require('./converterDraft06');
const ConverterDraft07 = require('./converterDraft07');
const BuiltInTypeConverter = require('./builtInTypeConverter');
const CONSTANTS = require('./constants');


const baseId_NAME = Symbol();

const namespaceManager_NAME = Symbol();
const visitor_NAME = Symbol();
const generateTitle_NAME = Symbol();

const defaultXsd2JsonSchemaOptions = {
    baseId: undefined,
    namespaceMode: undefined,
    jsonSchemaVersion: CONSTANTS.DRAFT_07,
    uriStandard: CONSTANTS.RFC_3986,
    generateTitle: true
}

/**
 * Class prepresenting an instance of the Xsd2JsonSchema library.
 * 
 */

class Xsd2JsonSchema {
    /**
     * 
     * @param {Object} options - An object used to override default options.
     * @param {string} options.baseId - The base value for the 'id' in any generated JSON Schema files.  The default value is undefined.
     * @param {string} options.builtInTypeConverter - An instance of a subclass of {@link BuiltInTypeConverter|BuiltInTypeConverter}.
     * @param {string} options.converter - An intance of a subclass of {@link ConverterDraft04|ConverterDraft04}.
     * @param {string} options.visitor - A instance of a subclass of {@link BaseConversionVisitor|BaseConversionVisitor}.
     * @param {string} options.namespaceMode - The method of handling namespaces. Must be one of: undefined, SUBSCHEMA, or FILENAME.  The default value is undefined.
     * @param {boolean} options.generateTitle - If true a default title will be generated for top level JSON Schemas.  If false it will not be generated. Default: true.
     */
    constructor(options) {
        var builtInTypeConverter;
        var converter;
        var jsonSchemaVersion;

        if (options != undefined) {
            this.baseId = options.baseId != undefined ? options.baseId : defaultXsd2JsonSchemaOptions.baseId;
            jsonSchemaVersion = options.jsonSchemaVersion != undefined ? options.jsonSchemaVersion : defaultXsd2JsonSchemaOptions.jsonSchemaVersion;

            // BuiltInTypeConverter
            builtInTypeConverter = this.getBuiltInTypeConverter(jsonSchemaVersion, options.builtInTypeConverter);

            // NamespaceManager
            this.namespaceManager = new NamespaceManager({
                jsonSchemaVersion: jsonSchemaVersion
            });
            this.namespaceManager.builtInTypeConverter = builtInTypeConverter;

            // Converter
            converter = this.getConverter(jsonSchemaVersion, options.converter);
            converter.namespaceManager = this.namespaceManager;
            converter.specialCaseIdentifier = new BaseSpecialCaseIdentifier();

            // Visitor
            this.visitor = this.getVisitor(jsonSchemaVersion, options.visitor);
            this.visitor.processor = converter;

            // Generate Title
            this.generateTitle = options.generateTitle == undefined ? defaultXsd2JsonSchemaOptions.generateTitle : options.generateTitle;
        } else {
            this.baseId = defaultXsd2JsonSchemaOptions.baseId;

            // BuiltInTypeConverter
            builtInTypeConverter = this.getBuiltInTypeConverter(defaultXsd2JsonSchemaOptions.jsonSchemaVersion);

            // NamespaceManager
            this.namespaceManager = new NamespaceManager({
                jsonSchemaVersion: defaultXsd2JsonSchemaOptions.jsonSchemaVersion
            });
            this.namespaceManager.builtInTypeConverter = builtInTypeConverter;

            // Converter
            converter = this.getConverter(defaultXsd2JsonSchemaOptions.jsonSchemaVersion);
            converter.namespaceManager = this.namespaceManager;
            converter.specialCaseIdentifier = new BaseSpecialCaseIdentifier();

            // visitor
            this.visitor = new BaseConversionVisitor(converter);
            //JsonSchemaFile.setVersion(defaultXsd2JsonSchemaOptions.jsonSchemaVersion);

            // Generate Title
            this.generateTitle = defaultXsd2JsonSchemaOptions.generateTitle;
        }
    }

    // Getters/Setters
    get baseId() {
        return this[baseId_NAME];
    }
    set baseId(newBaseId) {
        this[baseId_NAME] = newBaseId;
    }

    get generateTitle() {
        return this[generateTitle_NAME];
    }
    set generateTitle(newGenerateTitle) {
        this[generateTitle_NAME] = newGenerateTitle;
    }

    // BuiltInTypeConverter
    // NamespaceManager
    // Converter
    // visitor

    get namespaceManager() {
        return this[namespaceManager_NAME];
    }
    set namespaceManager(newNamespaceManager) {
        this[namespaceManager_NAME] = newNamespaceManager;
    }

    get visitor() {
        return this[visitor_NAME];
    }
    set visitor(newVisitor) {
        this[visitor_NAME] = newVisitor;
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

    getBuiltInTypeConverter(jsonSchemaVersion, builtInTypeConverter) {
        switch (jsonSchemaVersion) {
            case CONSTANTS.DRAFT_04:
            case CONSTANTS.DRAFT_06:
            case CONSTANTS.DRAFT_07:
                if (builtInTypeConverter != undefined) {
                    return builtInTypeConverter;
                } else {
                    return new BuiltInTypeConverter();
                }
                break;
            default: throw new Error(`Unknown JSON Schema Version supplied [${jsonSchemaVersion}]`);
        }
    }

    validateConverter(jsonSchemaVersion, converterForJsonSchemaVersion, converter) {
        if (converter == undefined) {
            return false;
        }
        if (converterForJsonSchemaVersion === converter) {
            return true;
        }
        if (converterForJsonSchemaVersion.prototype.isPrototypeOf(converter)) {
            return true;
        } else {
            throw new Error(`JSON Schema converter version missmatch. The provided converter [${converter.constructor.name}] does not extend the proper converter [${converterForJsonSchemaVersion.name}] for the version of JSON Schema specified [${jsonSchemaVersion}]`);
        }
    }

    getConverter(jsonSchemaVersion, converter) {
        var customConverterMsg = 'Converting XML Schema to JSON Schema using custom converter';
        var defaultConverterMsg = 'Convertering XML Schema to JSON Schema using default converter for';
        var conv;
        switch (jsonSchemaVersion) {
            case CONSTANTS.DRAFT_04:
                if (this.validateConverter(CONSTANTS.DRAFT_04, ConverterDraft04, converter)) {
                    debug(`${customConverterMsg} [${converter.constructor.name}] for ${CONSTANTS.DRAFT_04}`);
                    conv = converter;
                } else {
                    debug(`${defaultConverterMsg} ${CONSTANTS.DRAFT_04}`);
                    conv = new ConverterDraft04();
                }
                break;
            case CONSTANTS.DRAFT_06:
                if (this.validateConverter(CONSTANTS.DRAFT_06, ConverterDraft06, converter)) {
                    debug(`${customConverterMsg} [${converter.constructor.name}] for ${CONSTANTS.DRAFT_06}`);
                    conv = converter;
                } else {
                    debug(`${defaultConverterMsg} ${CONSTANTS.DRAFT_06}`);
                    conv = new ConverterDraft06();
                }
                break;
            case CONSTANTS.DRAFT_07:
                if (this.validateConverter(CONSTANTS.DRAFT_07, ConverterDraft07, converter)) {
                    debug(`${customConverterMsg} [${converter.constructor.name}] for ${CONSTANTS.DRAFT_07}`);
                    conv = converter;
                } else {
                    debug(`${defaultConverterMsg} ${CONSTANTS.DRAFT_07}`);
                    conv = new ConverterDraft07();
                }
                break;
            default: throw new Error(`Unknown JSON Schema Version supplied [${jsonSchemaVersion}]`);
        }
        return conv;
    }

    getVisitor(jsonSchemaVersion, visitor) {
        var vis;
        switch (jsonSchemaVersion) {
            case CONSTANTS.DRAFT_04:
            case CONSTANTS.DRAFT_06:
            case CONSTANTS.DRAFT_07:
                if (visitor != undefined) {
                    vis = visitor;
                } else {
                    vis = new BaseConversionVisitor();
                }
                break;
            default: throw new Error(`Unknown JSON Schema Version supplied [${jsonSchemaVersion}]`);
        }
        return vis;
    }

    loadSchema(uri, xml) {
        if (this.namespaceManager.xmlSchemas[uri.toString()] !== undefined) {
            return;
        }
        var xsd = new XsdFile({
            xml: xml,
            uri: uri
        });
        this.namespaceManager.xmlSchemas[uri.toString()] = xsd;
    }

    loadSchemas(schemas) {
        const uris = Object.keys(schemas);
        uris.forEach(function (uri, index, array) {
            this.loadSchema(uri, schemas[uri]);
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
            // because nothing in ConverterDraft04 is setting it otherwise.
            anotherPass = traversal.traverse(this.visitor, jsonSchema, xsd);
        }
    }

    processSchemas() {
        const filenames = Object.keys(this.namespaceManager.xmlSchemas);

        // prime the jsoonSchema map to support forward references in namespaceManager.
        filenames.forEach(function (filename, index, array) {
            const xsd = this.namespaceManager.xmlSchemas[filename];
            const uri = new URI(filename);
            this.namespaceManager.addNewJsonSchema({
                uri: uri,
                namespaceMode: this.namespaceMode,
                baseFilename: filename,
                targetNamespace: xsd.targetNamespace,
                baseId: this.baseId,
                title: this.generateTitle ? undefined : ''
            });
        }, this);

        // process each schema
        filenames.forEach(function (filename, index, array) {
            this.processSchema(new URI(filename));
        }, this);
    }

    processAllSchemas(parms) {
        if (parms == undefined) {
            throw new Error('The parameter "parms" is required');
        }
        if (parms.schemas == undefined) {
            throw new Error('"parms.schemas" is required');
        }
        if (parms.visitor != undefined) {
            this.visitor = parms.visitor;
        }
        this.namespaceManager.reset();
        this.loadSchemas(parms.schemas);
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
