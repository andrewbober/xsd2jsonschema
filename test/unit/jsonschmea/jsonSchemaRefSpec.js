'use strict'

const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const JsonSchemaRef = require('xsd2jsonschema').JsonSchemaRef;

describe('JsonSchemaRef Test -', function () {
    var baseJsonSchema;
    var parent;
    var xsd;

    beforeEach(function() {
        baseJsonSchema = new JsonSchemaFile({
            uri: 'test/xmlSchemas/unit/attributes.xsd',
            namespaceMode: undefined,
            baseFilename: 'attributes.xsd',
            targetNamespace: '"http://www.xsd2jsonschema.org/tests',
            baseId: 'testBaseId'
        });
        parent = new JsonSchemaFile();
    });

    it('should create a JsonSchemaRef instance', function () {
        const jsonSchemaRef = new JsonSchemaRef({
            ref: 'something',
            forwardReference: {}
        });
        expect(jsonSchemaRef instanceof JsonSchemaRef).toBeTruthy();
        expect(jsonSchemaRef.references.length).toEqual(0);
    });

    it('should check the options parameter and fail to create a JsonSchemaRef instance ', function () {
        expect(function () {
            new JsonSchemaRef();
        }).toThrow(Error('Parameter "options" is required'));
        expect(function () {
            new JsonSchemaRef({});
        }).toThrow(Error('Either options.ref or options.$ref must be supplied'));
        expect(function () {
            new JsonSchemaRef({
                ref: 'something'
            });
        }).toThrow(Error('Parameter options.forwardReference is required'));
    });

    it('should create a ref and save an store a reference to it', function () {
        const parent = new JsonSchemaFile();
        const jsonSchemaRef = new JsonSchemaRef({
            ref: 'something',
            forwardReference: {}
        });
        expect(jsonSchemaRef.references.length).toEqual(0);
        const $ref = jsonSchemaRef.get$RefToSchema(parent);
        expect($ref.$ref).toEqual('something');
        expect($ref.parent).toBe(parent);
        expect(jsonSchemaRef.references.length).toEqual(1);
        expect(jsonSchemaRef.references[0]).toBe($ref);
    });

    it('should create a $Ref and save an store a reference to it', function () {
        const parent = new JsonSchemaFile();
        const jsonSchemaRef = new JsonSchemaRef({
            $ref: 'anything',
            forwardReference: {}
        });
        expect(jsonSchemaRef.references.length).toEqual(0);
        const $ref = jsonSchemaRef.get$RefToSchema(parent);
        expect($ref.$ref).toEqual('anything');
        expect($ref.parent).toBe(parent);
        expect(jsonSchemaRef.references.length).toEqual(1);
        expect(jsonSchemaRef.references[0]).toBe($ref);
    });
});
