'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdElements = require('xsd2jsonschema').XsdElements;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const BaseConversionVisitor = require('xsd2jsonschema').BaseConversionVisitor;
const DepthFirstTraversal = require('xsd2jsonschema').DepthFirstTraversal;

describe('BaseConversionVisitor Test -', function () {
    var traversal;
    var xsd;
    var jsonSchema;
    
    beforeEach(function () {
        traversal = new DepthFirstTraversal();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/attributes.xsd'
        });
        jsonSchema = new JsonSchemaFile({
            xsd : xsd,
            baseId : "http://www.xsd2jsonschema.org/unit/test"
        });
    });

    afterEach(function () {

    })

    // baseConversionVisitor
    it('should confirm a newly allocated BaseConverter was properly initiialized', function () {
        /*
        The test/xmlSchemas/unit/attribute.xsd file has the following nodes:
        ---------------
        1 COMMENT_NODE
        17 ELEMENT_NODE
        23 TEXT_NODE
        ---------------
        41 Total NODES
        */
        const visitor = new BaseConversionVisitor();
        spyOn(visitor, 'enterState').and.callThrough();
        spyOn(visitor, 'exitState').and.callThrough();
        spyOn(visitor, 'visit').and.callThrough();
        spyOn(visitor, 'onBegin').and.callThrough();
        spyOn(visitor, 'onEnd').and.callThrough();
        traversal.traverse(visitor, jsonSchema, xsd);
        expect(visitor.enterState).toHaveBeenCalledTimes(41);
        expect(visitor.exitState).toHaveBeenCalledTimes(41);
        expect(visitor.visit).toHaveBeenCalledTimes(41);
        expect(visitor.onBegin).toHaveBeenCalledTimes(1);
        expect(visitor.onEnd).toHaveBeenCalledTimes(1);
    });

    // baseConversionVisitor - exitState
    it('should set the workingschema on the processor on exit if a schema was included in the state', function () {
        const visitor = new BaseConversionVisitor();
        const workingJsonSchema = new JsonSchemaFile();
        spyOn(workingJsonSchema, 'removeEmptySchemas').and.callThrough();
        spyOn(visitor.processor.parsingState, 'exitState').and.returnValue({
            name: XsdElements.SIMPLE_TYPE,
            workingJsonSchema: workingJsonSchema
        });
        visitor.exitState()
        expect(visitor.processor.workingJsonSchema).toBe(workingJsonSchema);
        expect(workingJsonSchema.removeEmptySchemas).toHaveBeenCalled();
    });

    // baseConversionVisitor - Error
    it('should catch log and rethrow an error thrown by the processor', function () {
        const visitor = new BaseConversionVisitor();
        spyOn(visitor.processor, 'process').and.throwError(Error('Something went very wrong'));
        expect(function() {
            traversal.traverse(visitor, jsonSchema, xsd);
        }).toThrow(Error('Something went very wrong'));
    });

});