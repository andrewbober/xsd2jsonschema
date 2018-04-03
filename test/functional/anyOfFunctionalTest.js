"use strict";

const debug = require("debug")("xsd2jsonschema:AnyOfChoiceFunctionalTest");
const BaseFunctionalTest = require("./baseFunctionalTest");

class AnyOfChoiceFunctionalTest extends BaseFunctionalTest {
    constructor() {
        super({
            xsdPath: "xmlSchemas/functional/",
            xsdFilename: "anyOfChoice.xsd",
            testInstances: [
                {
                    expectedToValidate: true,
                    testData: {
                        AnyOfChoiceValid1: {
                            Option1: "Option1 Value",
                            Option2: "Option2 Value"
                        }
                    }
                },
                {
                    expectedToValidate: true,
                    testData: {
                        AnyOfChoiceValid1: {
                            Option2: "Option2 Value"
                        }
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        AnyOfChoiceValid1: {}
					}
                },
                {
                    expectedToValidate: true,
                    testData: {
                        AnyOfChoiceValid2: {
                            Option1: "Option1 Value",
                            Option2: "Option2 Value",
                            Option3: "Option3 Value"
                        }
					}
                },
                {
                    expectedToValidate: true,
                    testData: {
                        AnyOfChoiceValid2: {
                            Option1: "Option1 Value",
                            Option2: "Option2 Value"
                        }
					}
                },
                {
                    expectedToValidate: true,
                    testData: {
                        AnyOfChoiceValid2: {
                            Option1: "Option1 Value"
                        }
					}
                },
                {
                    expectedToValidate: false,
                    testData: {
                        AnyOfChoiceValid2: {}
					}
                }
			]
		});
    }
}

module.exports = AnyOfChoiceFunctionalTest;
