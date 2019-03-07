'use strict';

const URI = require('urijs');
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const JSON_SCHEMA_TYPES = require('xsd2jsonschema').JsonSchemaTypes;
const Constants = require('xsd2jsonschema').Constants;

describe('NamespaceManager Test - ', function() {
    var namespaceManager;
    var node;
    var baseJsonSchema;
    var parent;
    var xsd;

    beforeEach(function() {
        namespaceManager = new NamespaceManager();
        node = null;
        baseJsonSchema = new JsonSchemaFile({
            uri: 'test/xmlSchemas/unit/attributes.xsd',
            namespaceMode: undefined,
            baseFilename: 'attributes.xsd',
            targetNamespace: '"http://www.xsd2jsonschema.org/tests',
            baseId: 'testBaseId'
        });
        parent = new JsonSchemaFile();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/attributes.xsd'
        });
    });

    // constructor
    it('should initialize the namespaces', function() {
        const blankNamespaces = {};
        blankNamespaces[Constants.XML_SCHEMA_NAMESPACE] =  { types: {} }
        blankNamespaces[Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME] =  { types: {} }
        expect(namespaceManager.namespaces).toEqual(blankNamespaces);
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
        expectedJsonSchema.parent = baseJsonSchema;

        // Adding the default namespace should do nothing
        const originalNamespaceCount = Object.keys(namespaceManager.namespaces).length
        namespaceManager.addNamespace('http://www.w3.org/2001/XMLSchema');
        expect(originalNamespaceCount).toEqual(originalNamespaceCount);

        const type = namespaceManager.getBuiltInType('integer', baseJsonSchema, xsd);
        expect(type).toEqual(expectedJsonSchema);
    });

    // getType
    it('should check for missing parameters', function() {
        expect(function() {
            namespaceManager.getType();
        }).toThrow(Error('\'fullTypeName\' parameter required'));
        expect(function() {
            namespaceManager.getType('someType');
        }).toThrow(Error('\'parent\' parameter required'));
        expect(function() {
            namespaceManager.getType('someType', baseJsonSchema);
        }).toThrow(Error('\'baseJsonSchema\' parameter required'));
        expect(function() {
            namespaceManager.getType('someType', baseJsonSchema, baseJsonSchema);
        }).toThrow(Error('\'xsd\' parameter required'));
    });

    // getType
    it('should return the built-in type for integer', function() {
        const expectedJsonSchema = new JsonSchemaFile();
        expectedJsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
        expectedJsonSchema.parent = baseJsonSchema;

        namespaceManager.addNamespace('http://www.w3.org/2001/XMLSchema');
        spyOn(xsd, 'resolveNamespace').and.returnValue('someName');
        spyOn(namespaceManager, 'isWellKnownXmlNamespace').and.returnValue(true);
        var type1 = namespaceManager.getType('xs:integer', baseJsonSchema, baseJsonSchema, xsd);
        expect(type1).toEqual(expectedJsonSchema);
        expect(xsd.resolveNamespace).toHaveBeenCalled();
        expect(namespaceManager.isWellKnownXmlNamespace).toHaveBeenCalled();
    
        type1.description = 'This should be unique per instance'; 
        var type2 = namespaceManager.getType('xs:integer', baseJsonSchema, baseJsonSchema, xsd);
        expect(type2.description).toBeUndefined();
        expect(type2).not.toBe(type1);
    });

    // getType
    it('should return the custom type', function() {
        namespaceManager.addNamespace('http://www.xsd2jsonschema.org/tests');
        const parent = new JsonSchemaFile();
        const type = namespaceManager.getType('TestType', parent, baseJsonSchema, xsd);
        expect(type.parent).toBe(parent);
        expect(type.ref.toString()).toEqual('attributes.json#/definitions/TestType')
    })

    // getTypeReference
    it ('test something here', function() {
    });


    // cloneForwardReference
    it('should return a clone of the JsonSchemaFile that represents a reference to a type', function() {
        namespaceManager.addNamespace('http://www.xsd2jsonschema.org/tests');
        const parent = new JsonSchemaFile();
        const fReference = namespaceManager.getTypeReference('TestType', parent, baseJsonSchema, xsd);
        expect(namespaceManager.forwardReferences.length).toEqual(1);
        const fClone = namespaceManager.cloneForwardReference(fReference);
        expect(namespaceManager.forwardReferences.length).toEqual(2);
        expect(fClone).toEqual(fReference);
        expect(fClone).not.toBe(fReference);
    })

    // cloneForwardReference
    it('should not return a clone of when an original does not exist', function() {
        namespaceManager.addNamespace('http://www.xsd2jsonschema.org/tests');
        const parent = new JsonSchemaFile();
        const fReference = new JsonSchemaFile();
        expect(namespaceManager.forwardReferences.length).toEqual(0);
        const fClone = namespaceManager.cloneForwardReference(fReference);
        expect(namespaceManager.forwardReferences.length).toEqual(0);
        expect(fClone).toBeUndefined(fReference);
    })

    // getTypeReference
    it('should return a reference to the custom type for use from a file other than the file that declared the type', function() {
        namespaceManager.addNamespace('http://www.xsd2jsonschema.org/tests');
        const parent = new JsonSchemaFile();
        const fReference = namespaceManager.getTypeReference('TestType', parent, baseJsonSchema, xsd);
        expect(fReference.parent).toBe(parent);
        expect(fReference.$ref.toString()).toEqual('FORWARD_REFERENCE#/to/http://www.xsd2jsonschema.org/tests/TestType')
    })

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
            ref: new URI('myId#/globalAttributes/myTypeName')
        });
        expect(namespaceManager.getGlobalAttribute(typeName, baseJsonSchema)).toEqual(expectedGlobalAtttibuteType);
    });

    it('should not throw any errors', function() {
        expect(function() {
            namespaceManager.toString();
        }).not.toThrow();
    })

});
