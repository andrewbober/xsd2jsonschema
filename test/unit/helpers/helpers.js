'use strict';

const fs = require('fs-extra');
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFileDraft04;
const JsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const JsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;

beforeEach(function() {
    this.buildEverythingJsonSchema = function(namespaceMode) {
        //var fullJsonSchema = new JsonSchemaFile();
        const xsdFileMock = {
            filename: 'unitTestSchema',
            targetNamespace: 'http://www.xsd2jsonschema.org/example/unit/test'
        };

        const fullJsonSchema = new JsonSchemaFile({
            baseId: 'http://musicOfTheNight',
            baseFilename: xsdFileMock.filename,
            targetNamespace: xsdFileMock.targetNamespace,
            title: 'A nice test',
            mask: 'PhantomOfTheOpera',
            namespaceMode: namespaceMode
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
        fullJsonSchema.properties.everything = new JsonSchemaFile({ $ref: 'http://musicOfTheNight/unitTestSchema.json#/www.xsd2jsonschema.org/example/unit/test/everything' });
        const everything = fullJsonSchema.setSubSchema('everything', new JsonSchemaFile());
        everything.description = 'something';
        everything.default = { 'something': {} };
        everything.format = JsonSchemaFormats.URI;
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
        everything.type = JsonSchemaTypes.OBJECT;
        everything.allOf = [ new JsonSchemaFile() ];
        everything.anyOf = [ new JsonSchemaFile() ];
        everything.oneOf = [ new JsonSchemaFile() ];
        everything.not = new JsonSchemaFile();
        everything.definitions = new JsonSchemaFile();
        everything.definitions.setSubSchema( 'something', new JsonSchemaFile());
        return fullJsonSchema;
    };

    this.readfile = function (filename) {
        var data
        try {
            data = fs.readFileSync(filename);
        } catch (error) {
            //winston.info(error)
            console.error(`Unable to load [${filename}]: ${error}`);
        }
        return data.toString();
    }
    
});
