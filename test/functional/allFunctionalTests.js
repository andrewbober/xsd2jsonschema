'use strict'

const AnyOfFunctionalTest = require('./anyOfFunctionalTest');
const AttributesFunctionalTest = require('./attributesFunctionalTest');
const OptionalChoiceFunctionalTest = require('./optionalChoiceFunctionalTest');
const OptionalSequenceFunctionalTest = require('./optionalSequenceFunctionalTest');
const SiblingChoiceFunctionalTest = require('./siblingChoiceFunctionalTest');

const functionalTests = [];

functionalTests.push(new AnyOfFunctionalTest());
functionalTests.push(new AttributesFunctionalTest());
functionalTests.push(new OptionalChoiceFunctionalTest());
functionalTests.push(new OptionalSequenceFunctionalTest());
functionalTests.push(new SiblingChoiceFunctionalTest());

for (const test of functionalTests) {
    test.runTest();
}

for (const test of functionalTests) {
    test.report();
}
