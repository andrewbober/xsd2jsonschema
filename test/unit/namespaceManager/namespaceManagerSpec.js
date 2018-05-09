'use strict';

const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const JSON_SCHEMA_TYPES = require('xsd2jsonschema').JsonSchemaTypes;

describe('NamespaceManager Test - ', function() {
    var namespaceManager = new NamespaceManager();
    var node;
    var baseJsonSchema;
    var xsd;

    beforeEach(function() {
        node = null;
        baseJsonSchema = new JsonSchemaFile();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/attributes.xsd'
        });
    });

    // constructor
    it('should initialize the namespaces', function() {
        expect(namespaceManager.namespaces).toEqual({
            globalAttributes: {
                types: {}
            }
        });
    });

    // constructor options
    it('should initialize the namespaces and utilize the given type converter', function() {
        const tc = new BuiltInTypeConverter();
        const ns = new NamespaceManager({
            builtInTypeConverter : tc
        })
        expect(ns.builtInTypeConverter).toBe(tc);
    });

    // getNamespace
    it('should return the namespace correlating to the given name', function() {
        namespaceManager.addNamespace('Andy');
        expect(namespaceManager.getNamespace('Andy')).toEqual({ types: {} });
    });

    // isWellKnownXmlNamespace
    it('should return true if the namespace name is the well known XML namespace name', function() {
        expect(namespaceManager.isWellKnownXmlNamespace('http://www.w3.org/2001/XMLSchema')).toBeTruthy();
    });

    // getBuiltInType
    it('should get the jsonschema representation of the given xml schema built in type.', function() {
        const expectedJsonSchema = new JsonSchemaFile();
        expectedJsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;

        namespaceManager.addNamespace('http://www.w3.org/2001/XMLSchema');
        expect(namespaceManager.getBuiltInType('integer', xsd)).toEqual(expectedJsonSchema);
    });

    // getType
    it('should check for missing parameters', function() {
        expect(function() {
            namespaceManager.getType();
        }).toThrow(Error('\'fullTypeName\' parameter required'));
        expect(function() {
            namespaceManager.getType('someType');
        }).toThrow(Error('\'baseJsonSchema\' parameter required'));
    });

    // getType
    it('should return the built-in type for integer', function() {
        const expectedJsonSchema = new JsonSchemaFile();
        expectedJsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;

        namespaceManager.addNamespace('http://www.w3.org/2001/XMLSchema');
        spyOn(xsd, 'resolveNamespace').and.returnValue('someName');
        spyOn(namespaceManager, 'isWellKnownXmlNamespace').and.returnValue(true);
        expect(namespaceManager.getType('xs:integer', baseJsonSchema, xsd)).toEqual(expectedJsonSchema);
        expect(xsd.resolveNamespace).toHaveBeenCalled();
        expect(namespaceManager.isWellKnownXmlNamespace).toHaveBeenCalled();
    });

    // addTypeReference
    it('should insert an entry into the given namespace by reference rather than by type name', function() {
        const namespaceName = 'myNamespace';
        const typeName = 'myTypeName';
        const type = new JsonSchemaFile();
        namespaceManager.addNamespace(namespaceName);
        spyOn(xsd, 'resolveNamespace').and.returnValue(namespaceName);
        spyOn(baseJsonSchema, 'addRequiredAnyOfPropertyByReference').and.callThrough();
        namespaceManager.addTypeReference(typeName, type, baseJsonSchema, xsd);
        expect(baseJsonSchema.addRequiredAnyOfPropertyByReference).toHaveBeenCalled();
        expect(namespaceManager.namespaces[namespaceName].types[typeName]).toBe(type)
    });

    // getGlobalAttribute
    it('should check all parameters', function() {
        const typeName = 'myTypeName';
        expect(function() {
            namespaceManager.getGlobalAttribute();
        }).toThrow(Error('\'name\' parameter required'));
        expect(function() {
            namespaceManager.getGlobalAttribute(typeName);
        }).toThrow(Error('\'baseJsonSchema\' parameter required'));
    });

    // getGlobalAttribute
    it('should return the requested global attribute', function() {
        const typeName = 'myTypeName';
        baseJsonSchema.id = 'myId';
        const expectedGlobalAtttibuteType = new JsonSchemaFile({
            ref: 'myId#/globalAttributes/myTypeName'
        });
        expect(namespaceManager.getGlobalAttribute(typeName, baseJsonSchema)).toEqual(expectedGlobalAtttibuteType);
    });

    it('should not throw any errors', function() {
        expect(function() {
            namespaceManager.toString();
        }).not.toThrow();
    })

});
