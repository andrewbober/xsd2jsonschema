'use strict'

const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdAttributeValues = require('xsd2jsonschema').XsdAttributeValues;
const JsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const JsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;

describe('JsonSchemaFile Test -', function () {
    var testJsonSchema;
    var fullJsonSchema;

    beforeEach(function () {
        testJsonSchema = new JsonSchemaFile();
        fullJsonSchema = this.buildEverythingJsonSchema();
    });

    afterEach(function () {});

    // constructor
    it('should create an empty/blank JsonSchemaFile instance', function () {
        expect(testJsonSchema.filename).toBe(undefined);
        expect(testJsonSchema.targetSchema).toEqual(testJsonSchema);
        expect(testJsonSchema.targetNamespace).toBe(undefined);
        expect(testJsonSchema.ref).toBe(undefined);
        expect(testJsonSchema.$ref).toBe(undefined);
        expect(testJsonSchema.id).toBe(undefined);
        expect(testJsonSchema.subSchemas).toEqual({});
        expect(testJsonSchema.$schema).toBe(undefined);
        expect(testJsonSchema.title).toBe(undefined);
        expect(testJsonSchema.description).toBe(undefined);
        expect(testJsonSchema.default).toBe(undefined);
        expect(testJsonSchema.format).toBe(undefined);
        expect(testJsonSchema.multipleOf).toBe(undefined);
        expect(testJsonSchema.maximum).toBe(undefined);
        expect(testJsonSchema.exclusiveMaximum).toEqual(false);
        expect(testJsonSchema.minimum).toBe(undefined);
        expect(testJsonSchema.exclusiveMinimum).toEqual(false);
        expect(testJsonSchema.maxLength).toBe(undefined);
        expect(testJsonSchema.minLength).toEqual(0);
        expect(testJsonSchema.pattern).toBe(undefined);
        expect(testJsonSchema.additionalProperties).toBe(undefined);
        expect(testJsonSchema.items).toEqual({});
        expect(testJsonSchema.maxItems).toBe(undefined);
        expect(testJsonSchema.minItems).toBe(0);
        expect(testJsonSchema.uniqueItems).toEqual(false);
        expect(testJsonSchema.maxProperties).toBe(undefined);
        expect(testJsonSchema.minProperties).toEqual(0);
        expect(testJsonSchema.required).toEqual([]);
        expect(testJsonSchema.properties).toEqual({});
        expect(testJsonSchema.patternProperties).toEqual({});
        expect(testJsonSchema.dependencies).toEqual({});
        expect(testJsonSchema.enum).toEqual([]);
        expect(testJsonSchema.type).toBe(undefined);
        expect(testJsonSchema.allOf).toEqual([]);
        expect(testJsonSchema.anyOf).toEqual([]);
        expect(testJsonSchema.oneOf).toEqual([]);
        expect(testJsonSchema.not).toEqual({});
        expect(testJsonSchema.definitions).toEqual({});
    });

    it('should create a ref JsonSchemaFile instance', function () {
        const jsonSchemaRef = new JsonSchemaFile({
            ref: 'something'
        });
        expect(jsonSchemaRef.ref).toEqual('something');
    });

    it('should create a $ref JsonSchemaFile instance', function () {
        const jsonSchema$Ref = new JsonSchemaFile({
            $ref: 'somethingElse'
        });
        expect(jsonSchema$Ref.$ref).toEqual('somethingElse');
        expect(jsonSchema$Ref.get$RefToSchema().$ref).toEqual('somethingElse');
    });

    it('should create a fully initialized JsonSchemaFile instance', function () {
        const xsd = new XsdFile({
            uri: 'test/xmlSchemas/unit/optionalChoice.xsd'
        });
        const jsonSchemaPrimary = new JsonSchemaFile({
            baseId: 'musicOfTheNight',
            baseFilename: xsd.baseFilename,
            targetNamespace: xsd.targetNamespace
        });
        expect(jsonSchemaPrimary.filename).toBe('optionalChoice.json');
        expect(jsonSchemaPrimary.id).toBe('optionalChoice.json');
        expect(jsonSchemaPrimary.$schema).toEqual('http://json-schema.org/draft-04/schema#');
        expect(jsonSchemaPrimary.targetNamespace).toEqual('http://www.xsd2jsonschema.org/example');
        expect(jsonSchemaPrimary.title).toMatch('This JSON Schema file was generated from optionalChoice.xsd on.*\\.  For more information please see http://www.xsd2jsonschema.org');
        expect(jsonSchemaPrimary.type).toEqual(JsonSchemaTypes.OBJECT);
    });

    // createNestedSubschema
    it('should create all subschemas identified by an array of subschema names and initializes the targetSchema', function () {
        const jsonSchema = new JsonSchemaFile();
        const subSchemaCheck = new JsonSchemaFile();

        jsonSchema.subSchemas['www.xsd2jsonschema.org'] = subSchemaCheck;
        var subSchema = jsonSchema.subSchemas['www.xsd2jsonschema.org'];
        expect(subSchema).toBe(subSchemaCheck);

        const example = new JsonSchemaFile();
        jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example = example;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example).toBe(example);

        const unit = new JsonSchemaFile();
        jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit = unit;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit).toBe(unit);

        const test = new JsonSchemaFile();
        jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit.subSchemas.test = test;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit.subSchemas.test).toBe(test);
    });

    // createNestedSubschema
    it('should create all subschemas identified by an array of subschema names and initializes the targetSchema', function () {
        const jsonSchema = new JsonSchemaFile();
        const subSchemaCheck = new JsonSchemaFile();

        subSchemaCheck
            .addSubSchema('example', new JsonSchemaFile())
            .addSubSchema('unit', new JsonSchemaFile())
            .addSubSchema('test', new JsonSchemaFile());

        expect(Object.keys(subSchemaCheck.subSchemas).length).toEqual(1);
        jsonSchema.addSubSchema('www.xsd2jsonschema.org', subSchemaCheck);
        expect(Object.keys(jsonSchema.subSchemas).length).toEqual(1);
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org']).toBe(subSchemaCheck);

        var schemaStr = jsonSchema.getJsonSchema();
        expect(schemaStr).toEqual({
            'www.xsd2jsonschema.org': {
                example: {
                    unit: {
                        test: {}
                    }
                }
            }
        });
    });

    // initializeSubschemas
    it('should initialize subschemas representing the targetNamespace', function () {
        expect(Object.keys(fullJsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit.subSchemas.test.subSchemas).length).toEqual(1);
        expect(fullJsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit.subSchemas.test.subSchemas.everything.description).toEqual('something');
    });

    // isEmpty
    it('should return true if the given value is: null, undefined, a zero length string, a zero length array, or an object with no properties', function () {
        expect(testJsonSchema.isEmpty(null)).toBeTruthy();
        expect(testJsonSchema.isEmpty(undefined)).toBeTruthy();
        expect(testJsonSchema.isEmpty('')).toBeTruthy();
        expect(testJsonSchema.isEmpty([])).toBeTruthy();
        expect(testJsonSchema.isEmpty({})).toBeTruthy();
    });

    // isBlank
    it('should return true if the all members of the JsonSchemaFile are empty as defined by isEmpty()', function () {
        expect(testJsonSchema.isBlank()).toBeTruthy();

        let jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.filename = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.targetSchema = {
            something: 'something'
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.targetNamespace = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.ref = {
            something: 'something'
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.$ref = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.id = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.subSchemas = {
            something: new JsonSchemaFile()
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.$schema = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.title = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.description = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.default = {
            something: 'something'
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.format = JsonSchemaFormats.URI;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.multipleOf = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.maximum = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.exclusiveMaximum = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.minimum = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.exclusiveMinimum = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.maxLength = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.minLength = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.pattern = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.additionalItems = new JsonSchemaFile();
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.items = new JsonSchemaFile();
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.maxItems = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.minItems = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.uniqueItems = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.maxProperties = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.minProperties = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.required = ['something'];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.additionalProperties = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.properties = {
            something: new JsonSchemaFile()
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.patternProperties = {
            something: new JsonSchemaFile()
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.dependencies = {
            something: new JsonSchemaFile()
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.enum = ['something'];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.type = JsonSchemaTypes.INTEGER;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.allOf = [new JsonSchemaFile()];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.anyOf = [new JsonSchemaFile()];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.oneOf = [new JsonSchemaFile()];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.not = new JsonSchemaFile();
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile();
        jsonSchemaBlank.definitions = {
            something: new JsonSchemaFile()
        };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();
    });

    // addSubSchema
    it('should add a subSchema to the targetSchema', function () {
        const jsonSchema = new JsonSchemaFile();
        const subSchema = new JsonSchemaFile();
        jsonSchema.addSubSchema('testSubSchema', subSchema);
        expect(Object.keys(jsonSchema.subSchemas).length).toEqual(1);
    });

    // getSubschema
    it('should return a JsonSchemaFile representing the requested subschema if found', function () {
        const outtereSchema = new JsonSchemaFile();
        const subSchema = new JsonSchemaFile();
        const innerSubSchema = new JsonSchemaFile();
        subSchema.addSubSchema('innerSubSchema', innerSubSchema);
        outtereSchema.addSubSchema('subSchema', subSchema);
        expect(outtereSchema.getSubschema('subSchema')).toEqual(subSchema);
        expect(outtereSchema.getSubschema('innerSubSchema')).toEqual(innerSubSchema);
        expect(outtereSchema.getSubschema('none')).toBeUndefined();
    });

    // RefToSchema
    it('should return a JsonSchemaFile representing a $ref to itself', function () {
        const jsonSchema = new JsonSchemaFile({
            ref: 'baseJsonSchema.id#subschemaStr/typeName'
        });
        const refToSchema = jsonSchema.get$RefToSchema();
        expect(refToSchema.$ref).toEqual(jsonSchema.ref);
        expect(refToSchema.$ref).toEqual('baseJsonSchema.id#subschemaStr/typeName');
    });

    // getSubschemaStr
    it('should Returns a String representation of the targetNamespace, which is generally based on a URL, without the scheme, colon, or any parameters', function () {
        const jsonSchema = new JsonSchemaFile();
        jsonSchema.targetNamespace = 'http://www.xsd2jsonschema.org/example';
        expect(jsonSchema.getSubschemaStr()).toEqual('/www.xsd2jsonschema.org/example');
    });

    // getGlobalAttributesSchema
    it('should return the subschema used to track global attributes initiazing the subschema if needed', function () {
        const jsonSchema = new JsonSchemaFile();
        const globalAttributesSchema = jsonSchema.getGlobalAttributesSchema();
        expect(globalAttributesSchema).toEqual(new JsonSchemaFile());
    });

    // getJsonSchema
    it('should return a POJO of this jsonSchema', function () {
        const pojo = fullJsonSchema.getJsonSchema();
        expect(pojo).toEqual({
            $schema: 'http://json-schema.org/draft-04/schema#',
            id: 'http://musicOfTheNight/unitTestSchema.json',
            title: 'A nice test',
            type: JsonSchemaTypes.OBJECT,
            required: ['everything'],
            properties: {
                everything: {
                    $ref: 'http://musicOfTheNight/unitTestSchema.json#/www.xsd2jsonschema.org/example/unit/test/everything'
                }
            },
            'www.xsd2jsonschema.org': {
                example: {
                    unit: {
                        test: {
                            everything: {
                                description: 'something',
                                default: {
                                    something: {}
                                },
                                format: JsonSchemaFormats.URI,
                                multipleOf: 2,
                                maximum: 2,
                                exclusiveMaximum: true,
                                minimum: 2,
                                exclusiveMinimum: true,
                                maxLength: 2,
                                minLength: 2,
                                pattern: 'something',
                                additionalItems: {},
                                items: {},
                                maxItems: 2,
                                minItems: 2,
                                uniqueItems: true,
                                maxProperties: 2,
                                minProperties: 2,
                                required: ['something'],
                                additionalProperties: true,
                                properties: {
                                    something: {}
                                },
                                patternProperties: {
                                    something: {}
                                },
                                dependencies: {
                                    something: {}
                                },
                                enum: ['something'],
                                type: 'object',
                                allOf: [{}],
                                anyOf: [{}],
                                oneOf: [{}],
                                not: {},
                                definitions: {
                                    something: {}
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    // getJsonSchema
    it('should return a POJO of this jsonSchema', function () {
        const schema = fullJsonSchema.getSubschema('everything');
        schema.additionalItems = false;
        schema.items = [new JsonSchemaFile()];
        schema.dependencies = {
            dependency: ['something']
        }
        const pojo = fullJsonSchema.getJsonSchema();
        expect(pojo).toEqual({
            $schema: 'http://json-schema.org/draft-04/schema#',
            id: 'http://musicOfTheNight/unitTestSchema.json',
            title: 'A nice test',
            type: JsonSchemaTypes.OBJECT,
            required: ['everything'],
            properties: {
                everything: {
                    $ref: 'http://musicOfTheNight/unitTestSchema.json#/www.xsd2jsonschema.org/example/unit/test/everything'
                }
            },
            'www.xsd2jsonschema.org': {
                example: {
                    unit: {
                        test: {
                            everything: {
                                description: 'something',
                                default: {
                                    something: {}
                                },
                                format: JsonSchemaFormats.URI,
                                multipleOf: 2,
                                maximum: 2,
                                exclusiveMaximum: true,
                                minimum: 2,
                                exclusiveMinimum: true,
                                maxLength: 2,
                                minLength: 2,
                                pattern: 'something',
                                additionalItems: false,
                                items: [{}],
                                maxItems: 2,
                                minItems: 2,
                                uniqueItems: true,
                                maxProperties: 2,
                                minProperties: 2,
                                required: ['something'],
                                additionalProperties: true,
                                properties: {
                                    something: {}
                                },
                                patternProperties: {
                                    something: {}
                                },
                                dependencies: {
                                    dependency: ['something']
                                },
                                enum: ['something'],
                                type: 'object',
                                allOf: [{}],
                                anyOf: [{}],
                                oneOf: [{}],
                                not: {},
                                definitions: {
                                    something: {}
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    // getJsonSchema
    it('should fail trying to return a POJO of this jsonSchema', function () {
        fullJsonSchema.addSubSchema('invalid', {});
        expect(function () {
            fullJsonSchema.getJsonSchema()
        }).toThrow(TypeError('this.subSchemas[subschemaName].getJsonSchema is not a function'));
    });

    // clone
    it('should return a deep copy of a JsonSchemaFile', function () {
        const secondSchema = new JsonSchemaFile({
            ref: 'baseJsonSchema.id#subschemaStr/typeName'
        });
        const copy = fullJsonSchema.clone();
        expect(copy).toEqual(fullJsonSchema);
        expect(copy).not.toEqual(secondSchema);
    });

    // addEnum
    it('should add a String value to the enum array', function () {
        const ENUM_VALUE = 'ENUM_VALUE';
        expect(fullJsonSchema.enum.indexOf(ENUM_VALUE)).toEqual(-1);
        fullJsonSchema.addEnum(ENUM_VALUE);
        expect(fullJsonSchema.enum.indexOf(ENUM_VALUE)).toEqual(0);
        expect(fullJsonSchema.enum.pop()).toEqual('ENUM_VALUE');
    });

    // addRequired
    it('should add a String value to the required array', function () {});

    // getProperty
    it('should return the JsonSchemaFile property that corresponds to the given propertyName value', function () {});

    // setProperty
    it('should set the value of the given propertyName to the jsonSchema provided in the type parameter', function () {});

    // extend
    it('should add given base type to allOf, add a newly allocated extension schema to allOf, and return the empty extension schema', function () {
        expect(fullJsonSchema.extend).toThrow(Error('Required parameter "baseType" is undefined'));
        const size = fullJsonSchema.allOf.length;
        const extensionSchema = fullJsonSchema.extend(testJsonSchema);
        expect(fullJsonSchema.allOf.length).toEqual(size + 2);
        expect(extensionSchema.isBlank()).toBeTruthy();
    });

    it('should add given base type to allOf, add a newly allocated extension schema to allOf, and return the extension schema with the given type applied', function () {
        expect(fullJsonSchema.extend).toThrow(Error('Required parameter "baseType" is undefined'));
        const size = fullJsonSchema.allOf.length;
        const extensionSchema = fullJsonSchema.extend(testJsonSchema, JsonSchemaTypes.STRING);
        expect(fullJsonSchema.allOf.length).toEqual(size + 2);
        expect(extensionSchema.isBlank()).toBeFalsy();
        expect(extensionSchema.type).toEqual(JsonSchemaTypes.STRING);
    });

    // addAttributeProperty
    it('should create a property with a name prefixed by the @sign to represent an XML attribute', function () {
        const optionalPropertyName = "sing";
        expect(fullJsonSchema.addAttributeProperty).toThrow(Error('Required parameter "propertyName" is undefined'));
        expect(function () {
            fullJsonSchema.addAttributeProperty(optionalPropertyName);
        }).toThrow(Error('Required parameter "customType" is undefined'));
        fullJsonSchema.addAttributeProperty(optionalPropertyName, testJsonSchema);
        expect(fullJsonSchema.getProperty('@' + optionalPropertyName)).toEqual(testJsonSchema);
        expect(fullJsonSchema.getProperty('@' + optionalPropertyName)).toBe(testJsonSchema);
        expect(fullJsonSchema.required.indexOf('@' + optionalPropertyName)).toEqual(-1);
    });

    // addAttributeProperty
    it('should create a property with a name prefixed by the @sign to represent an XML attribute and add it to the required array', function () {
        const requiredPropertyName = "opera";
        expect(fullJsonSchema.addAttributeProperty).toThrow(Error('Required parameter "propertyName" is undefined'));
        expect(function () {
            fullJsonSchema.addAttributeProperty(requiredPropertyName);
        }).toThrow(Error('Required parameter "customType" is undefined'));
        fullJsonSchema.addAttributeProperty(requiredPropertyName, testJsonSchema, XsdAttributeValues.REQUIRED);
        expect(fullJsonSchema.getProperty('@' + requiredPropertyName)).toEqual(testJsonSchema);
        expect(fullJsonSchema.getProperty('@' + requiredPropertyName)).toBe(testJsonSchema);
        expect(fullJsonSchema.required.indexOf('@' + requiredPropertyName)).toEqual(1);
    });

    // addRequiredAnyOfPropertyByReference
    it('should add the given property and lists it in the anyOf array as a required', function () {
        const propertyName = 'phantom';
        expect(fullJsonSchema.addRequiredAnyOfPropertyByReference).toThrow(Error('Required parameter "name" is undefined'));
        expect(function () {
            fullJsonSchema.addRequiredAnyOfPropertyByReference(propertyName);
        }).toThrow(Error('Required parameter "type" is undefined'));
        fullJsonSchema.addRequiredAnyOfPropertyByReference(propertyName, testJsonSchema);
        expect(fullJsonSchema.getProperty(propertyName)).toBe(testJsonSchema);
        expect(function () {
            fullJsonSchema.addRequiredAnyOfPropertyByReference(propertyName, testJsonSchema);
        }).toThrow(Error('Unable to add required anyOf property by reference because [phantom] is already defined as [{}]  Not adding [{}]'));
    });

    // isPropertyDependencyDefined
    it('should return true if the propertyName parameter represents a defined property dependency.', function () {
        const propertyName = 'mask';
        expect(fullJsonSchema.isPropertyDependencyDefined).toThrow(Error('Required parameter "propertyName" is undefined'));
        expect(fullJsonSchema.isPropertyDependencyDefined(propertyName)).toBeFalsy();
        fullJsonSchema.dependencies[propertyName] = [];
        fullJsonSchema.dependencies[propertyName].push(testJsonSchema);
        expect(fullJsonSchema.isPropertyDependencyDefined(propertyName)).toBeTruthy();
    });

    // addPropertyDependency
    it('should add a property dependency allocating the dependencies array if needed', function () {
        const propertyName = 'art';
        expect(fullJsonSchema.addPropertyDependency).toThrow(Error('Required parameter "propertyname" is undefined'));
        expect(function () {
            fullJsonSchema.addPropertyDependency(propertyName);
        }).toThrow(Error('Required parameter "dependencyProperty" is undefined'));
        fullJsonSchema.addPropertyDependency(propertyName, 'name');
        expect(fullJsonSchema.isPropertyDependencyDefined(propertyName)).toBeTruthy();
        expect(function () {
            fullJsonSchema.addPropertyDependency(propertyName, 'name');
        }).toThrow(Error('Property dependency already defined. "art"'));
    });

    // addSchemaDependency
    it('should add a property dependency allocating the dependencies array if needed', function () {
        const propertyName = 'stage';
        expect(fullJsonSchema.addSchemaDependency).toThrow(Error('Required parameter "propertyname" is undefined'));
        expect(function () {
            fullJsonSchema.addSchemaDependency(propertyName);
        }).toThrow(Error('Required parameter "dependencySchema" is undefined'));
        fullJsonSchema.addSchemaDependency(propertyName, testJsonSchema);
        expect(fullJsonSchema.dependencies[propertyName]).toBe(testJsonSchema);
        expect(function () {
            fullJsonSchema.addSchemaDependency(propertyName, testJsonSchema);
        }).toThrow(Error('Unable to add schema dependency because [stage] is already defined as [{}]  Not adding [{}]'));
    });

    // removeEmptySchemasFromArray
    it('should remove any empty JsonSchemaFile entries from the given Array', function () {
        const array = [new JsonSchemaFile(), new JsonSchemaFile(), new JsonSchemaFile()];
        expect(fullJsonSchema.removeEmptySchemasFromArray).toThrow(Error('Required parameter "array" is undefined'));
        fullJsonSchema.removeEmptySchemasFromArray(array);
        expect(array.length).toEqual(0);
    });

    // removeEmptySchemas
    it('should remove empty schemas from this jsonSchemas array properties', function () {
        const everything = fullJsonSchema.getSubschema('everything');
        expect(everything.allOf.length).toEqual(1);
        expect(everything.anyOf.length).toEqual(1);
        expect(everything.oneOf.length).toEqual(1);
        everything.removeEmptySchemas();
        expect(everything.allOf.length).toEqual(0);
        expect(everything.anyOf.length).toEqual(0);
        expect(everything.oneOf.length).toEqual(0);
    });
});