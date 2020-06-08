'use strict';

const deepEql = require('deep-eql');

const XsdAttributes = require('xsd2jsonschema').XsdAttributes;
const XsdAttributeValues = require('xsd2jsonschema').XsdAttributeValues;
const XsdElements = require('xsd2jsonschema').XsdElements;
const XsdFile = require('xsd2jsonschema').XsdFile;

const JsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const JsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const JsonSchemaFileDraft04 = require('xsd2jsonschema').JsonSchemaFileDraft04;
const JsonSchemaFileDraft06 = require('xsd2jsonschema').JsonSchemaFileDraft06;
const JsonSchemaFileDraft07 = require('xsd2jsonschema').JsonSchemaFileDraft07;
const JsonSchemaRef = require('xsd2jsonschema').JsonSchemaRef;

const DefaultConversionVisitor = require('xsd2jsonschema').DefaultConversionVisitor;
const BaseConversionVisitor = require('xsd2jsonschema').BaseConversionVisitor;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const Processor = require('xsd2jsonschema').Processor;
const ConverterDraft04 = require('xsd2jsonschema').ConverterDraft04;
const ConverterDraft06 = require('xsd2jsonschema').ConverterDraft06;
const ConverterDraft07 = require('xsd2jsonschema').ConverterDraft07;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const PropertyDefinable = require('xsd2jsonschema').PropertyDefinable;
const DepthFirstTraversal = require('xsd2jsonschema').DepthFirstTraversal;
const ParsingState = require('xsd2jsonschema').ParsingState;
const State = require('xsd2jsonschema').State;
const ForwardReference = require('xsd2jsonschema').ForwardReference;
const CONSTANTS = require('xsd2jsonschema').Constants;

// Library
//const CheckXsdAttributes = require('../../src/xmlschema/xsdAttributes');
//const CheckXsdAttributeValues = require('../../src/xmlschema/xsdAttributeValues');
//const CheckXsdElements = require('../../src/xmlschema/xsdElements');
const CheckXsdFile = require('../../src/xmlschema/xsdFileXmlDom');

//const CheckJsonSchemaTypes = require('../../src/jsonschema/jsonSchemaTypes');
//const CheckJsonSchemaFormats = require('../../src/jsonschema/jsonSchemaFormats');
const CheckJsonSchemaFile = require('../../src/jsonschema/jsonSchemaFile');
const CheckJsonSchemaFileDraft04 = require('../../src/jsonschema/jsonSchemaFileDraft04');
const CheckJsonSchemaFileDraft06 = require('../../src/jsonschema/jsonSchemaFileDraft06');
const CheckJsonSchemaFileDraft07 = require('../../src/jsonschema/jsonSchemaFileDraft07');
const CheckJsonSchemaRef = require('../../src/jsonschema/jsonSchemaRef');

const CheckDefaultConversionVisitor = require('../../src/visitors/defaultConversionVisitor');
const CheckBaseConversionVisitor = require('../../src/visitors/baseConversionVisitor');
const CheckXmlUsageVisitor = require('../../src/visitors/xmlUsageVisitor');
const CheckXmlUsageVisitorSum = require('../../src/visitors/xmlUsageVisitorSum');

const CheckXsd2JsonSchema = require('../../src/xsd2JsonSchema');
const CheckProcessor = require('../../src/processor');
const CheckConverterDraft04 = require('../../src/converterDraft04');
const CheckConverterDraft06 = require('../../src/converterDraft06');
const CheckConverterDraft07 = require('../../src/converterDraft07');
const CheckBaseSpecialCaseIdentifier = require('../../src/baseSpecialCaseIdentifier');
const CheckBuiltInTypeConverter = require('../../src/builtInTypeConverter');
const CheckNamespaceManager = require('../../src/namespaceManager');
const CheckPropertyDefinable = require('../../src/propertyDefinable');
const CheckDepthFirstTraversal = require('../../src/depthFirstTraversal');
const CheckParsingState = require('../../src/parsingState').ParsingState;
const CheckState = require('../../src/parsingState').State;
const CheckForwardReference = require('../../src/forwardReference');

describe('The Library Test -', function () {

    //const xsdAttributes = new XsdAttributes();
    //const xsdAttributeValues = new XsdAttributeValues();
    //const xsdElements = new XsdElements();
    // xsdFile - Loaded below to leverage helper function: this.readfile().


    //const jsonSchemaTypes = new JsonSchemaTypes();
    //const jsonSchemaFormats = new JsonSchemaFormats();
    const jsonSchemaFile = new JsonSchemaFile();
    const jsonSchemaFileDraft04 = new JsonSchemaFileDraft04();
    const jsonSchemaFileDraft06 = new JsonSchemaFileDraft06();
    const jsonSchemaFileDraft07 = new JsonSchemaFileDraft07();
    const jsonSchemaRef = new JsonSchemaRef({
        ref: {},
        forwardReference: {}
    });

    const defaultConversionVisitor = new DefaultConversionVisitor();
    const baseConversionVisitor = new BaseConversionVisitor();
    const xmlUsageVisitor = new XmlUsageVisitor();
    const xmlUsageVisitorSum = new XmlUsageVisitorSum();

    const xsd2JsonSchema = new Xsd2JsonSchema({
        baseId: undefined
    });
    const processor = new Processor();
    const converterDraft04 = new ConverterDraft04();
    const converterDraft06 = new ConverterDraft06();
    const converterDraft07 = new ConverterDraft07();
    const baseSpecialCaseIdentifier = new BaseSpecialCaseIdentifier();
    const builtInTypeConverter = new BuiltInTypeConverter();
    const namespaceManager = new NamespaceManager({
        jsonSchemaVersion: CONSTANTS.DRAFT_07
    });
    const propertyDefinable = new PropertyDefinable();
    const depthFirstTraversal = new DepthFirstTraversal();
    const parsingState = new ParsingState();
    const state = new State({
        node: 'anything',
        workingSchema: 'anything',
        attribute: 'anything'
    });
    const forwardReference = new ForwardReference(
        'anything', // namespaceManager
        'anything', // namespace
        'anything', // fullTypeName
        {},         // parent
        'anything', // baseJsonSchema
        'anything'  // xsd
    );

    it('xsdFile should be an instantOf the XsdFile class', function () {
        const xsdFile = new XsdFile({
            uri: 'test/xmlSchemas/unit/attributes.xsd',
            xml: this.readfile('test/xmlSchemas/unit/attributes.xsd')
        });
        expect(xsdFile instanceof CheckXsdFile).toBeTruthy();
        expect(xsdFile).toEqual(jasmine.any(CheckXsdFile));
    });

    it('jsonSchemaFile should be an instantOf the JsonSchemaFile class', function () {
        expect(jsonSchemaFile instanceof CheckJsonSchemaFile).toBeTruthy();
        expect(jsonSchemaFile).toEqual(jasmine.any(CheckJsonSchemaFile));
    });

    it('jsonSchemaFileDraft04 should be an instantOf the JsonSchemaFileDraft04 class', function () {
        expect(jsonSchemaFileDraft04 instanceof CheckJsonSchemaFileDraft04).toBeTruthy();
        expect(jsonSchemaFileDraft04).toEqual(jasmine.any(CheckJsonSchemaFileDraft04));
        expect(JsonSchemaFileDraft04.name).toEqual(CheckJsonSchemaFileDraft04.name);
    });

    it('jsonSchemaFileDraft06 should be an instantOf the JsonSchemaFileDraft06 class', function () {
        expect(jsonSchemaFileDraft06 instanceof CheckJsonSchemaFileDraft06).toBeTruthy();
        expect(jsonSchemaFileDraft06).toEqual(jasmine.any(CheckJsonSchemaFileDraft06));
        expect(JsonSchemaFileDraft06.name).toEqual(CheckJsonSchemaFileDraft06.name);
    });

    it('jsonSchemaFileDraft07 should be an instantOf the JsonSchemaFileDraft07 class', function () {
        expect(jsonSchemaFileDraft07 instanceof CheckJsonSchemaFileDraft07).toBeTruthy();
        expect(jsonSchemaFileDraft07).toEqual(jasmine.any(CheckJsonSchemaFileDraft07));
        expect(JsonSchemaFileDraft07.name).toEqual(CheckJsonSchemaFileDraft07.name);
    });

    it('jsonSchemaFile should be an instantOf the JsonSchemaRef class', function () {
        expect(jsonSchemaRef instanceof CheckJsonSchemaRef).toBeTruthy();
        expect(jsonSchemaRef).toEqual(jasmine.any(CheckJsonSchemaRef));
    });

    it('defaultConversionVisitor should be an instantOf the DefaultConversionVisitor class', function () {
        expect(defaultConversionVisitor instanceof CheckDefaultConversionVisitor).toBeTruthy();
        expect(defaultConversionVisitor).toEqual(jasmine.any(CheckDefaultConversionVisitor));
    });

    it('baseConvertionVisitor should be an instantOf the BaseConvertionVisitor class', function () {
        expect(baseConversionVisitor instanceof CheckBaseConversionVisitor).toBeTruthy();
        expect(baseConversionVisitor).toEqual(jasmine.any(CheckBaseConversionVisitor));
    });

    it('xmlUsageVisitor should be an instantOf the XmlUsageVisitor class', function () {
        expect(xmlUsageVisitor instanceof CheckXmlUsageVisitor).toBeTruthy();
        expect(xmlUsageVisitor).toEqual(jasmine.any(CheckXmlUsageVisitor));
    });

    it('xmlUsageVisitorSum should be an instantOf the XmlUsageVisitorSum class', function () {
        expect(xmlUsageVisitorSum instanceof CheckXmlUsageVisitorSum).toBeTruthy();
        expect(xmlUsageVisitorSum).toEqual(jasmine.any(CheckXmlUsageVisitorSum));
    });

    it('xsd2JsonSchema should be an instantOf the Xsd2JsonSchema class', function () {
        expect(xsd2JsonSchema instanceof CheckXsd2JsonSchema).toBeTruthy();
        expect(xsd2JsonSchema).toEqual(jasmine.any(CheckXsd2JsonSchema));
    });

    it('processor should be an instantOf the Processor class', function () {
        expect(processor instanceof CheckProcessor).toBeTruthy();
        expect(processor).toEqual(jasmine.any(CheckProcessor));
    });

/*
    it('baseConverter should be an instantOf the BaseConverter class', function () {
        expect(baseConverter instanceof CheckBaseConverter).toBeTruthy();
        expect(baseConverter).toEqual(jasmine.any(CheckBaseConverter));
    });
*/
    it('converterDraft04 should be an instantOf the ConverterDraft04 class', function () {
        expect(converterDraft04 instanceof CheckConverterDraft04).toBeTruthy();
        expect(converterDraft04).toEqual(jasmine.any(CheckConverterDraft04));
    });

    it('converterDraft06 should be an instantOf the ConverterDraft06 class', function () {
        expect(converterDraft06 instanceof CheckConverterDraft06).toBeTruthy();
        expect(converterDraft06).toEqual(jasmine.any(CheckConverterDraft06));
    });

    it('converterDraft07 should be an instantOf the ConverterDraft07 class', function () {
        expect(converterDraft07 instanceof CheckConverterDraft07).toBeTruthy();
        expect(converterDraft07).toEqual(jasmine.any(CheckConverterDraft07));
    });

    it('baseSpecialCaseIdentifier should be an instantOf the BaseSpecialCaseIdentifier class', function () {
        expect(baseSpecialCaseIdentifier instanceof CheckBaseSpecialCaseIdentifier).toBeTruthy();
        expect(baseSpecialCaseIdentifier).toEqual(jasmine.any(CheckBaseSpecialCaseIdentifier));
    });

    it('builtInTypeConverter should be an instantOf the BuiltInTypeConverter class', function () {
        expect(builtInTypeConverter instanceof CheckBuiltInTypeConverter).toBeTruthy();
        expect(builtInTypeConverter).toEqual(jasmine.any(CheckBuiltInTypeConverter));
    });

    it('namespaceManager should be an instantOf the NamespaceManager class', function () {
        expect(namespaceManager instanceof CheckNamespaceManager).toBeTruthy();
        expect(namespaceManager).toEqual(jasmine.any(CheckNamespaceManager));
    });

    it('propertyDefinalble should be an instantOf the PropertyDefinable class', function () {
        expect(propertyDefinable instanceof PropertyDefinable).toBeTruthy();
        expect(propertyDefinable).toEqual(jasmine.any(CheckPropertyDefinable));
    });

    it('depthFirstTraversal should be an instantOf the DepthFirstTraversal class', function () {
        expect(depthFirstTraversal instanceof DepthFirstTraversal).toBeTruthy();
        expect(depthFirstTraversal).toEqual(jasmine.any(CheckDepthFirstTraversal));
    });

    it('parsingState should be an instantOf the ParsingState class', function () {
        expect(parsingState instanceof ParsingState).toBeTruthy();
        expect(parsingState).toEqual(jasmine.any(CheckParsingState));
    });

    it('state should be an instantOf the State class', function () {
        expect(state instanceof State).toBeTruthy();
        expect(state).toEqual(jasmine.any(CheckState));
    });

    it('forwardReference should be an instantOf the ForwardReference class', function () {
        expect(forwardReference instanceof ForwardReference).toBeTruthy();
        expect(forwardReference).toEqual(jasmine.any(CheckForwardReference));
    });
})
