'use strict';

const URI = require('urijs');

const XsdAttributes = require('xsd2jsonschema').XsdAttributes;
const XsdElements = require('xsd2jsonschema').XsdElements;
const XsdFile = require('xsd2jsonschema').XsdFile;

const JsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const JsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;
const JsonSchemaFileDraft04 = require('xsd2jsonschema').JsonSchemaFileDraft04;

const DefaultConversionVisitor = require('xsd2jsonschema').DefaultConversionVisitor;
const BaseConversionVisitor = require('xsd2jsonschema').BaseConversionVisitor;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const Processor = require('xsd2jsonschema').Processor;
const ConverterDraft06 = require('xsd2jsonschema').ConverterDraft06;
const ConverterDraft07 = require('xsd2jsonschema').ConverterDraft07;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const CONSTANTS = require('xsd2jsonschema').Constants;


describe('Xsd2JsonSchema Test -', function() {

    it('should create a xsd2JsonSchema instance with default values', function() {
        const xsd2JsonSchema = new Xsd2JsonSchema();
        //expect(xsd2JsonSchema.baseId).toEqual('http://www.xsd2jsonschema.org/defaultBaseId');
        expect(xsd2JsonSchema.baseId).toBeUndefined();
        // BuiltInTypeConverter
        expect(xsd2JsonSchema.namespaceManager.builtInTypeConverter).toEqual(new BuiltInTypeConverter());
        // NamespaceManager
        expect(xsd2JsonSchema.namespaceManager).toEqual(new NamespaceManager({
            jsonSchemaVersion: CONSTANTS.DRAFT_07
        }));
        // Converter
        expect(xsd2JsonSchema.visitor.processor).toEqual(new ConverterDraft07());
        // visitor
        expect(xsd2JsonSchema.visitor).toEqual(new BaseConversionVisitor());
        // generateTitle
        expect(xsd2JsonSchema.getBuiltInTypeConverter).toBeTruthy();
    });

    it('should create a xsd2JsonSchema instance with the given parameters', function() {
        const baseId = 'testBaseId';
        const xsd2JsonSchema = new Xsd2JsonSchema({
            baseId: baseId
        });
        expect(xsd2JsonSchema.baseId).toEqual(baseId);
    });

    it('should create a xsd2JsonSchema instance with the given builtInTypeConverter', function() {
        const converter = new ConverterDraft06();
        const xsd2jsonschema = new Xsd2JsonSchema({
            jsonSchemaVersion: CONSTANTS.DRAFT_06,
            converter : converter
        });
        expect(xsd2jsonschema.visitor.processor).toBe(converter);
    });

    it('should create a xsd2JsonSchema instance with the given converter', function() {
        const converter = new ConverterDraft06();
        const xsd2jsonschema = new Xsd2JsonSchema({
            jsonSchemaVersion: CONSTANTS.DRAFT_06,
            converter : converter
        });
        expect(xsd2jsonschema.visitor.processor).toBe(converter);
    });

    it('should create a xsd2JsonSchema instance with the given visitor', function() {
        const visitor = new DefaultConversionVisitor();
        const xsd2jsonschema = new Xsd2JsonSchema({
            visitor : visitor
        });
        expect(xsd2jsonschema.visitor).toBe(visitor);
    });

    it('should create a xsd2JsonSchema instance with the generateTitle options set to false', function() {
        const xs2js = new Xsd2JsonSchema({
            generateTitle : false
        });
        expect(xs2js.generateTitle).toBeFalsy();
    })
});
