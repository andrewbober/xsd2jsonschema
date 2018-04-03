'use strict'

const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;

function buildJsonSchema(ref) {
        var fullJsonSchema = new JsonSchemaFile({});
        fullJsonSchema.filename = 'something';
        fullJsonSchema.targetSchema = { something:'something' };
        fullJsonSchema.targetNamespace = 'something';
        fullJsonSchema.ref = { something:'something' };
        fullJsonSchema.$ref = 'something';
        fullJsonSchema.id = 'something';
        fullJsonSchema.subSchemas = { something:'something' };
        fullJsonSchema.$schema = 'something';
        fullJsonSchema.title = 'something';
        fullJsonSchema.description = 'something';
        fullJsonSchema.default = { something:'something' };
        fullJsonSchema.format = 'something';
        fullJsonSchema.multipleOf = 2;
        fullJsonSchema.maximum = 2;
        fullJsonSchema.exclusiveMaximum = true;
        fullJsonSchema.minimum = 2;
        fullJsonSchema.exclusiveMinimum = true;
        fullJsonSchema.maxLength = 2;
        fullJsonSchema.minLength = 2;
        fullJsonSchema.pattern = 'something';
        fullJsonSchema.additionalItems = { something:'something' };
        fullJsonSchema.items = { something:'something' };
        fullJsonSchema.maxItems = 2;
        fullJsonSchema.minItems = 2;
        fullJsonSchema.uniqueItems = true;
        fullJsonSchema.maxProperties = 2;
        fullJsonSchema.minProperties = 2;
        fullJsonSchema.required = [ { something:'something' } ];
        fullJsonSchema.additionalProperties = 'something';
        fullJsonSchema.properties = { something:'something' };
        fullJsonSchema.patternProperties = { something:'something' };
        fullJsonSchema.dependencies = { something:'something' };
        fullJsonSchema.enum = [ { something:'something' } ];
        fullJsonSchema.type = 'something';
        fullJsonSchema.allOf = [ { something:'something' } ];
        fullJsonSchema.anyOf = [ { something:'something' } ];
        fullJsonSchema.oneOf = [ { something:'something' } ];
        fullJsonSchema.not = { something:'something' };
        fullJsonSchema.definitions = { something:'something' };
        return fullJsonSchema;
}

module.exports = buildJsonSchema;