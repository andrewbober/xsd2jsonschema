'use strict';

const debug = require('debug')('xsd2jsonschema:JsonSchemaFile');

const JsonSchemaSerializerDraft06 = require('./jsonSchemaSerializerDraft06');

const DEFAULT_DRAFT07_ORDER = [
    '$ref',
    'id',
    'subSchemas',
    '$schema',
    'title',
    'description',
    'default',
    'format',
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'additionalItems',
    'items',
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxProperties',
    'minProperties',
    'required',
    'additionalProperties',
    'properties',
    'patternProperties',
    'dependencies',
    'enum',
    'type',
    'allOf',
    'anyOf',
    'oneOf',
    'not',
    'definitions',
    'contentEncoding'
];

/**
 * Class representing a serializer for an instance of JsonSchemaFileDraft06.
 */
class JsonSchemaSerializerDraft07 extends JsonSchemaSerializerDraft06 {
    constructor() {
        super();
        super.defineObjectProperty('jsonSchemaPojo');
        this.jsonSchemaPojo = {};
    }

    serialize(jsonSchema, customOrder) {
        const order = customOrder == undefined ? DEFAULT_DRAFT07_ORDER : customOrder;
        return super.serialize(jsonSchema, order);
    }

    contentEncoding(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.contentEncoding)) {
            this.jsonSchemaPojo.contentEncoding = jsonSchema.contentEncoding;
        }
    }
}

module.exports = JsonSchemaSerializerDraft07;