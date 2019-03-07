"use strict";

const debug = require("debug")("xsd2jsonschema:SiblingChoiceFunctionalTest");
const BaseFunctionalTest = require("./baseFunctionalTest");

class SiblingChoiceFunctionalTest extends BaseFunctionalTest {
    constructor() {
        super({
            xsdPath: "test/xmlschemas/functional/",
            xsdFilename: "siblingChoice.xsd",
            testInstances: [
                {
                    expectedToValidate: true,
                    testData: {
                        SiblingAnyOfChoiceType: {
							OptionA: "something from the first sibling",
							OptionB: "something else from the first sibling",
							Separator1: "sep1",
							Separator2: false,
							Option3: "something from the second sibling"
						}
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        SiblingAnyOfChoiceType: {
							OptionA: "something from the first sibling",
							Separator1: "sep1",
							Option1: "something from the second sibling"
						}
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        SiblingAnyOfChoiceType: {}
                    }
                },
                {
                    expectedToValidate: true,
                    testData: {
                        SiblingAnyOfChoiceType: {
							OptionA: "something from the first sibling",
							Separator1: "Separate this!",
							Separator2: true,
							Option1: "something from the second sibling",
							Option2: "something else from the second sibling",
							Option3: "What's with all this stuff from the second sibling?",
						}
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        SiblingAnyOfChoiceType: {
							Option1: "This an't gonna work",
							Option2: "just stuff from the second sibling"
						}
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        SiblingAnyOfChoiceType: {
							Separator1: "Separate this!",
							Separator2: true,
							Option1: "Peace bother"
						}
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        SiblingAnyOfChoiceType: {}
                    }
				},
				{
                    expectedToValidate: true,
                    testData: {
						SiblingChoice1Type: {
							OptionE: "something from the first sibling",
							OptionD: "something else from the first sibling",
							Option0: "something from the second sibling"
						}
					}
				},
				{
                    expectedToValidate: true,
                    testData: {
						SiblingChoice1Type: {
							OptionE: "something from the first sibling",
							OptionC: "something else from the first sibling",
							Option1: "something from the second sibling"
						}
					}
				},
				{
                    expectedToValidate: true,
                    testData: {
						SiblingChoice1Type: {
							OptionA: true,
							Option0: "Are we there yet?"
						}
					}
				},
				{
                    expectedToValidate: true,
                    testData: {
						SiblingChoice1Type: {
							OptionE: "something from the first sibling",
							OptionD: "something else from the first sibling",
							Option6: "something from the second sibling",
							Option7: "something else from the second sibling just me make everyone happy"
						}
					}
				},
                {
                    expectedToValidate: true,
                    testData: {
                        ReqularAnyOfChoiceType: {
							Option1: "some string",
							Option2: "another string"
						}
                    }
                },
                {
                    expectedToValidate: true,
                    testData: {
                        ReqularAnyOfChoiceType: {
							Option1: "some string"
						}
                    }
                },
                {
                    expectedToValidate: false,
                    testData: {
                        ReqularAnyOfChoiceType: {
							OptionZ: "What the hell is OptionZ?"
						}
                    }
				},
                {
                    expectedToValidate: false,
                    testData: {
                        ReqularAnyOfChoiceType: {}
                    }
				}
            ]
        });
    }
}

module.exports = SiblingChoiceFunctionalTest;
