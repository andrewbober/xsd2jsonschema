'use strict';

const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;

beforeEach(function() {
    this.buildEverythingJsonSchema = function(ref) {
        //var fullJsonSchema = new JsonSchemaFile();
        const xsdFileMock = {
            baseFilename: 'subschemaUnitTest',
            targetNamespace: 'http://www.xsd2jsonschema.org/example/unit/test'
        };

        const fullJsonSchema = new JsonSchemaFile({
            xsd: xsdFileMock,
            baseId: 'http://musicOfTheNight',
            title: 'A nice test',
            mask: 'PhantomOfTheOpera'
        });

//        fullJsonSchema.filename = 'something';
//        fullJsonSchema.targetSchema = fullJsonSchema;
//        fullJsonSchema.targetNamespace = 'something';
//        fullJsonSchema.ref = '#/something';
//        fullJsonSchema.$ref = 'something';
//        fullJsonSchema.id = 'something';
//        fullJsonSchema.subSchemas = [ new JsonSchemaFile() ];
//        fullJsonSchema.$schema = 'something';
//        fullJsonSchema.title = 'something';
        fullJsonSchema.required = [ 'everything' ];
        fullJsonSchema.properties.everything = new JsonSchemaFile({ $ref: 'http://musicOfTheNight/subschemaUnitTest.json#/www.xsd2jsonschema.org/example/unit/test/everything' });
        const everything = fullJsonSchema.addSubSchema('everything', new JsonSchemaFile());
        everything.description = 'something';
        everything.default = { 'something': {} };
        everything.format = 'something';
        everything.multipleOf = 2;
        everything.maximum = 2;
        everything.exclusiveMaximum = true;
        everything.minimum = 2;
        everything.exclusiveMinimum = true;
        everything.maxLength = 2;
        everything.minLength = 2;
        everything.pattern = 'something';
        everything.additionalItems = new JsonSchemaFile();
        everything.items = new JsonSchemaFile();
        everything.maxItems = 2;
        everything.minItems = 2;
        everything.uniqueItems = true;
        everything.maxProperties = 2;
        everything.minProperties = 2;
        everything.required = [ 'something' ];
        everything.additionalProperties = true;
        everything.properties = { 'something' : new JsonSchemaFile() };
        everything.patternProperties = { 'something' : new JsonSchemaFile() };
        everything.dependencies = { 'something' : new JsonSchemaFile() };
        everything.enum = [ 'something' ];
        everything.type = 'object';
        everything.allOf = [ new JsonSchemaFile() ];
        everything.anyOf = [ new JsonSchemaFile() ];
        everything.oneOf = [ new JsonSchemaFile() ];
        everything.not = new JsonSchemaFile();
        everything.definitions = { 'something' : new JsonSchemaFile() };
        return fullJsonSchema;
    };
});
