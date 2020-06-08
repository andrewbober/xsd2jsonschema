'use strict';

const debug = require('debug')('xsd2jsonschema:JsonSchemaFile');

const PropertyDefinable = require('../propertyDefinable');

const DEFAULT_DRAFT04_ORDER = [
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
 * Class representing a serializer for an instance of JsonSchemaFileDraft04.
 */
class JsonSchemaSerializerDraft04 extends PropertyDefinable {
    constructor() {
        super();
        super.defineObjectProperty('jsonSchemaPojo');
        this.jsonSchemaPojo = {};
    }

    serialize(jsonSchema, customOrder) {
        const order = customOrder == undefined ? DEFAULT_DRAFT04_ORDER : customOrder;
        this.jsonSchemaPojo = {};
        order.forEach(function(fn, index, array) {
            this[fn](jsonSchema);
        }, this);
        return this.jsonSchemaPojo;
    }

    $ref(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.$ref)) {
            this.jsonSchemaPojo.$ref = jsonSchema.$ref;
        }
    }

    id(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.id)) {
            //jsonSchema.id = jsonSchema.id;
            this.jsonSchemaPojo[jsonSchema.schemaId] = jsonSchema.id
        }
    }
    $schema(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.$schema)) {
            this.jsonSchemaPojo.$schema = jsonSchema.$schema;
        }
    }

    // 6.1 Metadata keywords 'title' and 'description'
    title(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.title)) {
            this.jsonSchemaPojo.title = jsonSchema.title;
        }
    }
    description(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.description)) {
            this.jsonSchemaPojo.description = jsonSchema.description;
        }
    }

    // 5.5.  Validation keywords for any instance type (Type moved up here from the rest of 5.5 below for output formatting)
    type(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.type)) {
            this.jsonSchemaPojo.type = jsonSchema.type;
        }
    }

    // 5.1.  Validation keywords for numeric instances (number and integer)
    multipleOf(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.multipleOf)) {
            this.jsonSchemaPojo.multipleOf = jsonSchema.multipleOf;
        }
    }
    minimum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.minimum)) {
            this.jsonSchemaPojo.minimum = jsonSchema.minimum;
        }
    }
    exclusiveMinimum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.exclusiveMinimum) && jsonSchema.exclusiveMinimum !== false) {
            this.jsonSchemaPojo.exclusiveMinimum = jsonSchema.exclusiveMinimum;
        }
    }
    maximum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.maximum)) {
            this.jsonSchemaPojo.maximum = jsonSchema.maximum;
        }
    }
    exclusiveMaximum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.exclusiveMaximum) && jsonSchema.exclusiveMaximum !== false) {
            this.jsonSchemaPojo.exclusiveMaximum = jsonSchema.exclusiveMaximum;
        }
    }

    // 5.2.  Validation keywords for strings
    minLength(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.minLength) && jsonSchema.minLength !== 0) {
            this.jsonSchemaPojo.minLength = jsonSchema.minLength;
        }
    }
    maxLength(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.maxLength)) {
            this.jsonSchemaPojo.maxLength = jsonSchema.maxLength;
        }
    }
    pattern(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.pattern)) {
            this.jsonSchemaPojo.pattern = jsonSchema.pattern;
        }
    }

    // 5.5.  Validation keywords for any instance type
    enum(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.enum)) {
            this.jsonSchemaPojo.enum = jsonSchema.enum;
        }
    }
    allOf(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.allOf)) {
            this.jsonSchemaPojo.allOf = [];
            for (let i = 0; i < jsonSchema.allOf.length; i++) {
                this.jsonSchemaPojo.allOf[i] = jsonSchema.allOf[i].getJsonSchema();
            }
        }
    }
    anyOf(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.anyOf)) {
            this.jsonSchemaPojo.anyOf = [];
            for (let i = 0; i < jsonSchema.anyOf.length; i++) {
                this.jsonSchemaPojo.anyOf[i] = jsonSchema.anyOf[i].getJsonSchema();
            }
        }
    }
    oneOf(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.oneOf)) {
            this.jsonSchemaPojo.oneOf = [];
            for (let i = 0; i < jsonSchema.oneOf.length; i++) {
                this.jsonSchemaPojo.oneOf[i] = jsonSchema.oneOf[i].getJsonSchema();
            }
        }
    }
    not(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.not)) {
            this.jsonSchemaPojo.not = jsonSchema.not.getJsonSchema();
        }
    }

    // 6.2 Default
    default(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.default)) {
            this.jsonSchemaPojo.default = jsonSchema.default;
        }
    }

    // 7 Semantic validation with 'format'
    format(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.format)) {
            this.jsonSchemaPojo.format = jsonSchema.format;
        }
    }

    // 5.4.5.  Dependencies
    dependencies(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.dependencies)) {
            this.jsonSchemaPojo.dependencies = {}
            const propKeys = Object.keys(jsonSchema.dependencies);
            propKeys.forEach(function (key, index, array) {
                if (Array.isArray(jsonSchema.dependencies[key])) {
                    this.jsonSchemaPojo.dependencies[key] = jsonSchema.dependencies[key]; // property dependency
                } else {
                    if (jsonSchema.dependencies[key] !== undefined) {
                        this.jsonSchemaPojo.dependencies[key] = jsonSchema.dependencies[key].getJsonSchema(); // schema dependency
                    }
                }
            }, this);
        }
    }

    // 5.3.  Validation keywords for arrays
    additionalItems(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.additionalItems)) {
            if (typeof (jsonSchema.additionalItems) === 'boolean') {
                this.jsonSchemaPojo.additionalItems = jsonSchema.additionalItems;
            } else {
                this.jsonSchemaPojo.additionalItems = jsonSchema.additionalItems.getJsonSchema();
            }
        }
    }
    maxItems(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.maxItems)) {
            this.jsonSchemaPojo.maxItems = jsonSchema.maxItems;
        }
    }
    minItems(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.minItems) && jsonSchema.minItems != 0) {
            this.jsonSchemaPojo.minItems = jsonSchema.minItems;
        }
    }
    uniqueItems(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.uniqueItems) && jsonSchema.uniqueItems !== false) {
            this.jsonSchemaPojo.uniqueItems = jsonSchema.uniqueItems;
        }
    }
    items(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.items)) {
            if (Array.isArray(jsonSchema.items)) {
                this.jsonSchemaPojo.items = [];
                jsonSchema.items.forEach(function (item, index, array) {
                    this.jsonSchemaPojo.items[index] = item.getJsonSchema();
                }, this);
            } else {
                this.jsonSchemaPojo.items = jsonSchema.items.getJsonSchema();
            }
        }
    }

    // 5.4.  Validation keywords for objects
    maxProperties(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.maxProperties)) {
            this.jsonSchemaPojo.maxProperties = jsonSchema.maxProperties;
        }
    }
    minProperties(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.minProperties) && jsonSchema.minProperties !== 0) {
            this.jsonSchemaPojo.minProperties = jsonSchema.minProperties;
        }
    }
    additionalProperties(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.additionalProperties)) {
            this.jsonSchemaPojo.additionalProperties = jsonSchema.additionalProperties;
        }
    }
    properties(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.properties)) {
            this.jsonSchemaPojo.properties = {};
            const propKeys = Object.keys(jsonSchema.properties);
            propKeys.forEach(function (key, index, array) {
                if (jsonSchema.properties[key] !== undefined) {
                    this.jsonSchemaPojo.properties[key] = jsonSchema.properties[key].getJsonSchema();
                }
            }, this);
        }
    }
    patternProperties(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.patternProperties)) {
            this.jsonSchemaPojo.patternProperties = {};
            const propKeys = Object.keys(jsonSchema.patternProperties);
            propKeys.forEach(function (key, index, array) {
                if (jsonSchema.patternProperties[key] !== undefined) {
                    this.jsonSchemaPojo.patternProperties[key] = jsonSchema.patternProperties[key].getJsonSchema();
                }
            }, this);
        }
    }
    required(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.required)) {
            this.jsonSchemaPojo.required = jsonSchema.required;
        }
    }
    definitions(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.definitions)) {
            this.jsonSchemaPojo.definitions = jsonSchema.definitions.getJsonSchema();
        }
    }
    subSchemas(jsonSchema) {
        if (!jsonSchema.isEmpty(jsonSchema.subSchemas)) {
            const subschemaNames = Object.keys(jsonSchema.subSchemas);
            subschemaNames.forEach(function (subschemaName, index, array) {
                try {
                    this.jsonSchemaPojo[subschemaName] = jsonSchema.subSchemas[subschemaName].getJsonSchema();
                } catch (err) {
                    debug(err);
                    debug(jsonSchema.subSchemas);
                    throw err;
                }
            }, this);
        }
    }
}

module.exports = JsonSchemaSerializerDraft04;