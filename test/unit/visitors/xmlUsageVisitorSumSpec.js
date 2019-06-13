'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdElements = require('xsd2jsonschema').XsdElements;
const JsonSchemaFileDraft04 = require('xsd2jsonschema').JsonSchemaFileDraft04;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;

describe('DepthFirstTraversal Test -', function () {
    var xsd;
    var jsonSchema;
    const uri = 'http://xsd2jsonschema.org';
    const tagName = 'simpleType';
    
    beforeEach(function () {
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/attributes.xsd',
            xml: this.readfile('test/xmlSchemas/unit/attributes.xsd')
        });
        jsonSchema = new JsonSchemaFileDraft04({
            baseFilename: xsd.filename,
            targetNamespace: xsd.targetNamespace,
            baseId : "http://www.xsd2jsonschema.org/unit/test"
        });
    });

    it('should ensure the xsd has not already been added to the uris map before beginning', function () {
        var visitor = new XmlUsageVisitorSum();
        var cont = visitor.onBegin(jsonSchema, xsd);
        expect(cont).toBeTruthy();

        visitor = new XmlUsageVisitorSum();
        visitor.addSchema(xsd.uri);
        cont = visitor.onBegin(jsonSchema, xsd);
        expect(cont).toBeFalsy();
    })

    // addSchema
    it('should add a schema to the the uris map', function () {
        const visitor = new XmlUsageVisitorSum();
        expect(Object.keys(visitor.uris).length).toEqual(0);
        visitor.addSchema(uri);
        expect(Object.keys(visitor.uris).length).toEqual(1);
    });

    // addTag
    it('should add tag name to the given schema initializing the count or incrementing the tag count as needed', function () {
        const visitor = new XmlUsageVisitorSum();
        visitor.addSchema(uri);
        visitor.addTag(tagName);
        expect(visitor.tagCounts[tagName]).toEqual(1);
        visitor.addTag(tagName);
        visitor.addTag(tagName);
        visitor.addTag(tagName);
        expect(visitor.tagCounts[tagName]).toEqual(4);
    });

    // visit & dump
    it('should catch log and rethrow an error thrown by the processor', function () {
        const visitor = new XmlUsageVisitorSum();
        const node = xsd.select1('//xs:complexType');
        visitor.visit(node, jsonSchema, xsd);
        expect(Object.keys(visitor.uris).length).toEqual(1);
        expect(visitor.tagCounts.AttributeTestType).toEqual(1);
        visitor.dump();
    });

});