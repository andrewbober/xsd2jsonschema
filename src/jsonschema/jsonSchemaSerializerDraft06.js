'use strict';

const debug = require('debug')('xsd2jsonschema:JsonSchemaFile');

const JsonSchemaSerializerDraft04 = require('./jsonSchemaSerializerDraft04');

const DEFAULT_DRAFT06_ORDER = [
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
    'definitions'
];

/**
 * Class representing a serializer for an instance of JsonSchemaFileDraft06.
 */
class JsonSchemaSerializerDraft06 extends JsonSchemaSerializerDraft04 {
    constructor() {
        super();
        super.defineObjectProperty('jsonSchemaPojo');
        this.jsonSchemaPojo = {};
    }

    serialize(jsonSchema, customOrder) {
        const order = customOrder == undefined ? DEFAULT_DRAFT06_ORDER : customOrder;
        return super.serialize(jsonSchema, order);
    }

    exclusiveMinimum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.exclusiveMinimum)) {
            this.jsonSchemaPojo.exclusiveMinimum = jsonSchema.exclusiveMinimum;
        }
    }
    exclusiveMaximum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.exclusiveMaximum)) {
            this.jsonSchemaPojo.exclusiveMaximum = jsonSchema.exclusiveMaximum;
        }
    }
}

module.exports = JsonSchemaSerializerDraft06;