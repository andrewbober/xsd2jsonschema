'use strict';

const debug = require('debug')('xsd2jsonschema:ForwardReferenceSpec');

const clone = require('clone');
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const JsonSchemaRef = require('xsd2jsonschema').JsonSchemaRef;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const ForwardReference = require('xsd2jsonschema').ForwardReference;

describe('ForwardReference Test - ', function() {
    var namespaceManager;
    var jsonSchema;
    var parent;
    var xsd;

    beforeEach(function() {
        namespaceManager = new NamespaceManager();
        namespaceManager.addNamespace('http://www.xsd2jsonschema.org/example');
        jsonSchema = new JsonSchemaFile();
        parent = new JsonSchemaFile();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/choice.xsd'
        });
    });

    it ('shoud instantiate a ForwardReference', function() {
        const forwardRef = new ForwardReference(namespaceManager, 'someNamespace', 'someTypeName', parent, jsonSchema, xsd);
        expect(forwardRef.ref instanceof JsonSchemaRef).toBeTruthy();
    });

    it('should clone the forwardReference', function() {
        const parent = new JsonSchemaFile();
        const forwardReference = namespaceManager.getTypeReference('anyType', jsonSchema, jsonSchema, xsd);
    
        const clone = forwardReference.clone(parent);
        
        // expect(clone.parent).toBe(parent);
        // expect(clone.namespaceManager).toBe(nameSpaceManager);
    });
});
