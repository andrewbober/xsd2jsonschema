const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const XsdFile = require('xsd2jsonschema').XsdFile;
const jsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const jsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;

// const helpers = require('./test/unit/helpers/helpers');

describe('JsonSchemaFile Test -', function() {
    var testJsonSchema;
    var fullJsonSchema;
    beforeEach(function() {
        testJsonSchema = new JsonSchemaFile({});
        fullJsonSchema = new JsonSchemaFile({});
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
    });

    afterEach(function() {});

    // constructor
    it('should create an empty/blank JsonSchemaFile instance', function() {
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

        expect(function() {
            const jsonSchemaError = new JsonSchemaFile();
            throw new Error(jsonSchemaError);  // Won't be executed
        }).toThrow(new Error('Parameter \'parms\' is required'));
    });

    it('should create a ref JsonSchemaFile instance', function() {
        const jsonSchemaRef = new JsonSchemaFile({
            ref: 'something'
        });
        expect(jsonSchemaRef.ref).toEqual('something');
    });

    it('should create a $ref JsonSchemaFile instance', function() {
        const jsonSchema$Ref = new JsonSchemaFile({
            $ref: 'somethingElse'
        });
        expect(jsonSchema$Ref.$ref).toEqual('somethingElse');
    });

    it('should create a fully initialized JsonSchemaFile instance', function() {
        const jsonSchemaPrimary = new JsonSchemaFile({
            xsd: new XsdFile({
                uri: 'test/xmlSchemas/unit/optionalChoice.xsd'
            }),
            baseId: 'musicOfTheNight',
            mask: 'PhantomOfTheOpera'
        });
        expect(jsonSchemaPrimary.filename).toBe('optionalChoice.json');
        expect(jsonSchemaPrimary.id).toBe('optionalChoice.json');
        expect(jsonSchemaPrimary.$schema).toEqual('http://json-schema.org/draft-04/schema#');
        expect(jsonSchemaPrimary.targetNamespace).toEqual('http://www.xsd2jsonschema.org/example');
        expect(jsonSchemaPrimary.title).toMatch('This JSON Schema file was generated from optionalChoice.xsd on.*\\.  For more information please see http://www.xsd2jsonschema.org');
        expect(jsonSchemaPrimary.type).toEqual(jsonSchemaTypes.OBJECT);
    });

    // createNestedSubschema
    it('should create all subschemas identified by an array of subschema names and initializes the targetSchema', function() {
        const xsdFileMock = {
            baseFilename: 'subschemaUnitTest',
            targetNamespace: 'http://www.xsd2jsonschema.org/example/unit/test'
        };

        const jsonSchema = new JsonSchemaFile({
            xsd: xsdFileMock,
            baseId: 'musicOfTheNight',
            mask: 'PhantomOfTheOpera'
        });

/*
        //expect(jsonSchema.subSchemas).toBe(JsonSchemaFile);
        const subSchemaCheck = new JsonSchemaFile({});
        subSchemaCheck.subSchemas['www.xsd2jsonschema.org'] = subSchemaCheck;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org']).toEqual(subSchemaCheck);

        const example = new JsonSchemaFile({});
        subSchemaCheck.subSchemas['www.xsd2jsonschema.org'].subSchemas.example = example;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example).toEqual(example);

        const unit = new JsonSchemaFile({});
        subSchemaCheck.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit = unit;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit).toEqual(unit);

        const test = new JsonSchemaFile({});
        subSchemaCheck.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit.subSchemas.test = test;
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org'].subSchemas.example.subSchemas.unit.subSchemas.test).toEqual(test);

        jsonSchema.addSubSchema(subSchemaCheck);
        expect(jsonSchema.subSchemas['www.xsd2jsonschema.org']).toEqual(subSchemaCheck);
        expect(Object.keys(jsonSchema.subSchemas).length).toEqual(1);
*/
        const subSchemaCheck = new JsonSchemaFile({});
        subSchemaCheck
            .addSubSchema('www.xsd2jsonschema.org', new JsonSchemaFile({}))
            .addSubSchema('example', new JsonSchemaFile({}))
            .addSubSchema('unit', new JsonSchemaFile({}))
            .addSubSchema('test', new JsonSchemaFile({}));

            expect(jsonSchema).not.toEqual(new JsonSchemaFile({}));
            expect(jsonSchema.subSchemas).toEqual(subSchemaCheck.subSchemas);
            
            expect(Object.keys(jsonSchema.subSchemas).length).toEqual(1);
    /*
        expect(jsonSchema.subSchemas).toEqual({
                'www.xsd2jsonschema.org': {
                'example': {
                    'unit': {
                        'test': {}
                    }
                }
            }
        });
*/
    });

    // initializeSubschemas
    it('should initialize subschemas representing the targetNamespace', function() {

    });

    // isEmpty
    it('should return true if the given value is: null, undefined, a zero length string, a zero length array, or an object with no properties', function() {
        expect(testJsonSchema.isEmpty(null)).toBeTruthy();
        expect(testJsonSchema.isEmpty(undefined)).toBeTruthy();
        expect(testJsonSchema.isEmpty('')).toBeTruthy();
        expect(testJsonSchema.isEmpty([])).toBeTruthy();
        expect(testJsonSchema.isEmpty({})).toBeTruthy();
    });

    // isBlank
    it('should return true if the all members of the JsonSchemaFile are empty as defined by isEmpty()', function() {
        expect(testJsonSchema.isBlank()).toBeTruthy();

        let jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.filename = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.targetSchema = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.targetNamespace = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.ref = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.$ref = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.id = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.subSchemas = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.$schema = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.title = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.description = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.default = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.format = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.multipleOf = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.maximum = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.exclusiveMaximum = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.minimum = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.exclusiveMinimum = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.maxLength = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.minLength = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.pattern = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.additionalItems = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.items = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.maxItems = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.minItems = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.uniqueItems = true;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.maxProperties = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.minProperties = 2;
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.required = [ { something:'something' } ];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.additionalProperties = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.properties = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.patternProperties = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.dependencies = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.enum = [ { something:'something' } ];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.type = 'something';
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.allOf = [ { something:'something' } ];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.anyOf = [ { something:'something' } ];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.oneOf = [ { something:'something' } ];
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.not = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();

        jsonSchemaBlank = new JsonSchemaFile({});
        jsonSchemaBlank.definitions = { something:'something' };
        expect(jsonSchemaBlank.isBlank()).toBeFalsy();
    });

    // addSubSchema
    it('should add a subSchema to the targetSchema', function() {
        const jsonSchema = new JsonSchemaFile({});
        const subSchema = new JsonSchemaFile({});
        jsonSchema.addSubSchema('testSubSchema', subSchema);
        expect(Object.keys(jsonSchema.subSchemas).length).toEqual(1); 
    });

    // getSubschema
    it('should return a JsonSchemaFile representing the requested subschema if found', function() {
        const outtereSchema = new JsonSchemaFile({});
        const subSchema = new JsonSchemaFile({});
        const innerSubSchema = new JsonSchemaFile({});
        subSchema.addSubSchema('innerSubSchema', innerSubSchema);
        outtereSchema.addSubSchema('subSchema', subSchema);
        expect(outtereSchema.getSubschema('subSchema')).toEqual(subSchema);
        expect(outtereSchema.getSubschema('innerSubSchema')).toEqual(innerSubSchema);
        expect(outtereSchema.getSubschema('none')).toBeUndefined();
    });

    // RefToSchema
    it('should return a JsonSchemaFile representing a $ref to itself', function() {
        const jsonSchema = new JsonSchemaFile({
            ref: 'baseJsonSchema.id#subschemaStr/typeName'
        });
        const refToSchema = jsonSchema.get$RefToSchema();
        expect(refToSchema.$ref).toEqual(jsonSchema.ref);
        expect(refToSchema.$ref).toEqual('baseJsonSchema.id#subschemaStr/typeName');
    });

    // getSubschemaStr
    it('should Returns a String representation of the targetNamespace, which is generally based on a URL, without the scheme, colon, or any parameters', function() {
        const jsonSchema = new JsonSchemaFile({});
        jsonSchema.targetNamespace = 'http://www.xsd2jsonschema.org/example';
        expect(jsonSchema.getSubschemaStr()).toEqual('/www.xsd2jsonschema.org/example')
    });

    // getGlobalAttributesSchema
    it('should return the subschema used to track global attributes initiazing the subschema if needed', function() {
        const jsonSchema = new JsonSchemaFile({});
        const globalAttributesSchema = jsonSchema.getGlobalAttributesSchema()
        expect(globalAttributesSchema).toEqual(new JsonSchemaFile({}));
    });

    // getJsonSchema
    it('should return a POJO of this jsonSchema', function() {
        // THIS IS WIP
        const jsonSchema = new JsonSchemaFile({});
        Object.keys(jsonSchema).forEach((key) => {
            console.log(key);
        }, jsonSchema);
        console.log(fullJsonSchema.getJsonSchema());
    });

    // clone
    it('should return a deep copy of a JsonSchemaFile', function() {
        const secondSchema = new JsonSchemaFile({
            ref: 'baseJsonSchema.id#subschemaStr/typeName'
        });
        const copy = fullJsonSchema.clone();
        expect(copy).toEqual(fullJsonSchema);
        expect(copy).not.toEqual(secondSchema);
    });

    // addEnum
    it('should add a String value to the enume array', function() {
        
    });

    // addRequired
    it('should add a String value to the required array', function() {});
    // getProperty
    it('should return the JsonSchemaFile property that corresponds to the given propertyName value', function() {});
    // setProperty
    it('should set the value of the given propertyName to the jsonSchema provided in the type parameter', function() {});

    // writeFile
    it('should write out this JsonSchemaFile to the given directory with the provided formatting option', function() {});

    // extend
    it('should extend onvert QName tags to JSON Schema string type with a JSON Schema pattern', function() {});

    // addAttributeProperty
    it('should create a property with a name prefixed by the @sign to represet an XML attribute', function() {});

    // addRequiredAnyOfPropertyByReference
    it('should add the given property and lists it in the anyOf array as a required', function() {});

    // isPropertyDependencyDefined
    it('should returns true if the propertyName parameter represents a defined property dependency.', function() {});

    // addPropertyDependency
    it('should add a property dependency allocating the dependencies array if needed', function() {});

    // addSchemaDependency
    it('should add a property dependency allocating the dependencies array if needed', function() {});

    // removeEmptySchemaFromArray
    it('should remove any empty JsonSchemaFile entries from the given Array', function() {});

    // removeEmptySchemas
    it('should remove empty schemas from this jsonSchemas array properties', function() {});
});
