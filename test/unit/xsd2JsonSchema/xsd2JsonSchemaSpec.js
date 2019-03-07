'use strict';

const URI = require('urijs');

const XsdAttributes = require('xsd2jsonschema').XsdAttributes;
const XsdElements = require('xsd2jsonschema').XsdElements;
const XsdFile = require('xsd2jsonschema').XsdFile;

const JsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const JsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;

const DefaultConversionVisitor = require('xsd2jsonschema').DefaultConversionVisitor;
const BaseConversionVisitor = require('xsd2jsonschema').BaseConversionVisitor;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const Processor = require('xsd2jsonschema').Processor;
const BaseConverter = require('xsd2jsonschema').BaseConverter;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;


describe('Xsd2JsonSchema Test -', function() {

    it('should create a xsd2JsonSchema instance with default values', function() {
        const xsd2JsonSchema = new Xsd2JsonSchema();
        expect(xsd2JsonSchema.xsdBaseUri).toEqual(new URI('.'));
        expect(xsd2JsonSchema.outputDir).toEqual(new URI('.'));
        //expect(xsd2JsonSchema.baseId).toEqual('http://www.xsd2jsonschema.org/defaultBaseId');
        expect(xsd2JsonSchema.baseId).toBeUndefined();
        expect(xsd2JsonSchema.mask).toBeUndefined();
        expect(xsd2JsonSchema.visitor).toEqual(new BaseConversionVisitor());
    });

    it('should create a xsd2JsonSchema instance with the given parameters', function() {
        const xsdBaseUri = 'testBaseUri';
        const outputDir = 'testOutputDir';
        const baseId = 'testBaseId';
        const mask = 'testMask';
        const xsd2JsonSchema = new Xsd2JsonSchema({
            xsdBaseUri: xsdBaseUri,
            outputDir: outputDir,
            baseId: baseId,
            mask: mask
        });
        expect(xsd2JsonSchema.xsdBaseUri).toEqual(new URI(xsdBaseUri));
        expect(xsd2JsonSchema.xsdBaseUri instanceof URI).toBeTruthy();
        expect(xsd2JsonSchema.outputDir).toEqual(new URI(outputDir));
        expect(xsd2JsonSchema.outputDir instanceof URI).toBeTruthy();
        expect(xsd2JsonSchema.baseId).toEqual(baseId);
        expect(xsd2JsonSchema.mask).toEqual(mask);
    });

    it('should create a xsd2JsonSchema instance with the given converter', function() {
        const baseConverter = new BaseConverter();
        const xsd2jsonschema = new Xsd2JsonSchema({
            converter : baseConverter
        });
        expect(xsd2jsonschema.visitor.processor).toBe(baseConverter);
    });

    it('should create a xsd2JsonSchema instance with the given visitor', function() {
        const visitor = new DefaultConversionVisitor();
        const xsd2jsonschema = new Xsd2JsonSchema({
            visitor : visitor
        });
        expect(xsd2jsonschema.visitor).toBe(visitor);
    });
});
