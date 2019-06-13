'use strict';

const debug = require('debug')('xsd2jsonschema:ForwardReferenceSpec');

const clone = require('clone');
const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFileDraft04 = require('xsd2jsonschema').JsonSchemaFileDraft04;
const JsonSchemaRef = require('xsd2jsonschema').JsonSchemaRef;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const CONSTANTS = require('xsd2jsonschema').Constants;
const ForwardReference = require('xsd2jsonschema').ForwardReference;

describe('ForwardReference Test - ', function() {
    var namespaceManager;
    var jsonSchema;
    var parent;
    var xsd;

    beforeEach(function() {
		namespaceManager = new NamespaceManager({
			jsonSchemaVersion: CONSTANTS.DRAFT_04,
			builtInTypeConverter: new BuiltInTypeConverter()
		});
        namespaceManager.addNamespace('http://www.xsd2jsonschema.org/example');
        jsonSchema = new JsonSchemaFileDraft04();
        parent = new JsonSchemaFileDraft04();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/choice.xsd',
            xml: this.readfile('test/xmlSchemas/unit/choice.xsd')
        });
    });

    it ('shoud instantiate a ForwardReference', function() {
        const forwardRef = new ForwardReference(namespaceManager, 'someNamespace', 'someTypeName', parent, jsonSchema, xsd);
        expect(forwardRef.ref instanceof JsonSchemaRef).toBeTruthy();
    });

    it('should clone the forwardReference', function() {
        const parent = new JsonSchemaFileDraft04();
        const forwardReference = namespaceManager.getTypeReference('anyType', jsonSchema, jsonSchema, xsd);
    
        const clone = forwardReference.clone(parent);
        
        // expect(clone.parent).toBe(parent);
        // expect(clone.namespaceManager).toBe(nameSpaceManager);
    });
});
