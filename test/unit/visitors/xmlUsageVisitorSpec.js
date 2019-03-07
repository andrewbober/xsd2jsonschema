'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdElements = require('xsd2jsonschema').XsdElements;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;

describe('DepthFirstTraversal Test -', function () {
    var xsd;
    var jsonSchema;
    const uri = 'http://xsd2jsonschema.org';
    const tagName = 'simpleType';
    
    beforeEach(function () {
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/attributes.xsd'
        });
        jsonSchema = new JsonSchemaFile({
            xsd : xsd,
            baseId : "http://www.xsd2jsonschema.org/unit/test"
        });
    });

    it('should ensure the xsd has not already been added to the uris map before beginning', function () {
        var visitor = new XmlUsageVisitor();
        var cont = visitor.onBegin(jsonSchema, xsd);
        expect(cont).toBeTruthy();

        visitor = new XmlUsageVisitor();
        visitor.addSchema(xsd.uri);
        cont = visitor.onBegin(jsonSchema, xsd);
        expect(cont).toBeFalsy();
    })

    // addSchema
    it('should add a schema to the the uris map', function () {
        const visitor = new XmlUsageVisitor();
        expect(Object.keys(visitor.uris).length).toEqual(0);
        visitor.addSchema(uri);
        expect(Object.keys(visitor.uris).length).toEqual(1);
    });

    // addTag
    it('should add tag name to the given schema initializing the count or incrementing the tag count as needed', function () {
        const visitor = new XmlUsageVisitor();
        visitor.addSchema(uri);
        visitor.addTag(uri, tagName);
        expect(visitor.uris[uri].tagCounts[tagName]).toEqual(1);
        visitor.addTag(uri, tagName);
        visitor.addTag(uri, tagName);
        visitor.addTag(uri, tagName);
        expect(visitor.uris[uri].tagCounts[tagName]).toEqual(4);
    });

    // visit & dump
    it('should catch log and rethrow an error thrown by the processor', function () {
        const visitor = new XmlUsageVisitor();
        const node = xsd.select1('//xs:complexType');
        visitor.visit(node, jsonSchema, xsd);
        expect(Object.keys(visitor.uris).length).toEqual(1);
        expect(visitor.uris[xsd.uri].tagCounts.AttributeTestType).toEqual(1);
        visitor.dump();
    });

});