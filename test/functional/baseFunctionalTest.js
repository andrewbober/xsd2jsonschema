"use strict";

const debug = require("debug")("xsd2jsonschema:BaseFunctionalTest");
const Xsd2JsonSchema = require("xsd2jsonschema").Xsd2JsonSchema;
const Ajv = require("ajv");
const path = require("path");

const FUNCTIONAL_TEST_SCHEMA = {
    id: "http://www.xsd2jsonschema.org/schema/functionalTestSchema.json",
    $schema: "http://json-schema.org/draft-04/schema#",
    title: "Xsd2JsonSchema Functional Test",
    description: "Defines the format of Xsd2JsonSchema functional tests.  Note:",
    type: "object",
    properties: {
        xsdPath: {
            type: "string"
        },
        xsdFilename: {
            type: "string"
        },
        testInstances: {
            type: "array",
            items: {
                $ref: "#/definitions/TestInstanceType"
            }
        },
        jsonSchema: {
            description: "A ducktyped JSON Schema instance convereted from xsdFilename."
        }
    },
    definitions: {
        TestInstanceType: {
            type: "object",
            properties: {
                expectedToPass: {
                    type: "boolean"
                },
                testData: {
                    description: "A JSON test instance.  Any properly formatted JSON is acceptable."
                },
                testPassed: {
                    type: "boolean",
                    description: "A ducktyped boolean used to store the test result of this test."
                },
                validationErrors: {
                    description: "A ducktyped JSON object containing any validation errors."
                }
            }
        }
    }
};

const test_NAME = Symbol();
const testConverter_NAME = Symbol();
const validator_NAME = Symbol();

class BaseFunctionalTest {
    constructor(test) {
        this.validator = new Ajv({
            allErrors: true,
            verbose: false,
            format: "full"
        });
        this.test = this.validateTest(test);
        this.converter = new Xsd2JsonSchema({
            outputDir: "test/generated_jsonschema",
            baseId: "http://www.xsd2jsonschema.org/schema/",
            xsdBaseDir: "test/"
        });
    }

    // getters/setters

    get test() {
        return this[test_NAME];
    }
    set test(newFunctionalTest) {
        this[test_NAME] = newFunctionalTest;
    }

    get converter() {
        return this[testConverter_NAME];
    }
    set converter(newConverter) {
        this[testConverter_NAME] = newConverter;
    }

    get validator() {
        return this[validator_NAME];
    }
    set validator(newValidator) {
        this[validator_NAME] = newValidator;
    }

    validateTest(test) {
        const validate = this.validator.compile(FUNCTIONAL_TEST_SCHEMA);
        const valid = validate(test);
        if (valid != true) {
            const errMsg = "Invalid functionTest supplied.  " + JSON.stringify(validate.errors);
            debug(errMsg);
            throw new Error(errMsg);
        }
        return test;
    }

    convertSchema() {
        const schemas = this.converter.processAllSchemas({
            xsdFilenames: [
                path.join(this.test.xsdPath, this.test.xsdFilename)
            ]
        });
        this.test.jsonSchema = schemas[this.test.xsdFilename];
    }

    runTest() {
        debug("Running functional test for: " + this.test.xsdFilename);
        this.convertSchema();
        this.converter.writeFiles();
        const validate = this.validator.compile(this.test.jsonSchema.getJsonSchema());
        this.test.testInstances.forEach(function(testInstance) {
            debug("Validating JSON: " + JSON.stringify(testInstance.testData));
            const valid = validate(testInstance.testData);
            if (!valid && testInstance.expectedToValidate) {
                testInstance.validationErrors = validate.errors;
                debug("Validatation FAILED." + JSON.stringify(validate.errors, null, "\t"));
            } else {
                debug("Validatation PASSED.");
            }
            if (valid == testInstance.expectedToValidate) {
                testInstance.testPassed = true;
            } else {
                testInstance.testPassed = false;
            }
        }, this);
        return this;
    }

    testPassed() {
        for (const testInstance of this.test.testInstances) {
            if (testInstance.testPassed != true) {
                return false;
            }
        }
        return true;
    }

    report() {
        if (this.testPassed() == true) {
            console.log(this.constructor.name + " = PASSED");
        } else {
            console.log(this.constructor.name + " = FAILED");
            this.dumpErrors();
        }
    }

    dumpErrors() {
        this.test.testInstances.forEach(function(testInstance, index, array) {
            if(testInstance.testPassed == false) {
                console.log("Test instance: " + JSON.stringify(testInstance, null, "\t"))
            }
        }, this);
    }

    getErrors(dump) {
        const errors = {};
        for (let i = 0; i < this.test.testInstances.length; i++) {
            const testInstance= this.test.testInstances[i]
            const validationErrors = testInstance.validationErrors;
            debug("Test instance: " + JSON.stringify(testInstance, null, "\t"))
            if (validationErrors != undefined) {
                errors[i] = validationErrors;
                if (dump != undefined && dump != false) {
                    debug(i + ") " + JSON.stringify(validationErrors.errors, null, "\t"));
                }
            } else {
                debug("No validation errors to report");
            }
        }
        return errors;
    }
}

module.exports = BaseFunctionalTest;
