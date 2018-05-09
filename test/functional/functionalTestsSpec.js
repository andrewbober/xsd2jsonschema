'use strict';

const AnyOfFunctionalTest = require('./anyOfFunctionalTest');
const AttributesFunctionalTest = require('./attributesFunctionalTest');
const OptionalChoiceFunctionalTest = require('./optionalChoiceFunctionalTest');
const OptionalSequenceFunctionalTest = require('./optionalSequenceFunctionalTest');
const SiblingChoiceFunctionalTest = require('./siblingChoiceFunctionalTest');


describe('Functional Test -', function () {

    beforeEach(function () {

    });

    afterEach(function () {

    });

    it('AnyOf should be succesfull', function () {
        const anyOfFunctionalTest = new AnyOfFunctionalTest().runTest();
        expect(anyOfFunctionalTest.testPassed()).toBeTruthy();
    });

/*
    it('Attributes should be succesfull', function () {
        const attributeFunctionalTest = new AttributesFunctionalTest().runTest();
        expect(attributeFunctionalTest.testPassed()).toBeTruthy(attributeFunctionalTest.getErrors());
    });

    it('OptionalChoice should be succesfull', function () {
        const optionalChoiceFunctionalTest = new OptionalChoiceFunctionalTest().runTest();
        expect(optionalChoiceFunctionalTest.testPassed()).toBeTruthy(JSON.stringify(optionalChoiceFunctionalTest.getErrors(), null, 3));
    });

    it('OptionalSequence should be succesfull', function () {
        const optionalSequenceFunctionalTest = new OptionalSequenceFunctionalTest().runTest();
        expect(optionalSequenceFunctionalTest.testPassed()).toBeTruthy(JSON.stringify(optionalSequenceFunctionalTest.getErrors(), null, 3));
    });

    it('SiblingChoice should be succesfull', function () {
        const siblingChoiceFunctionalTest = new SiblingChoiceFunctionalTest().runTest();
        expect(siblingChoiceFunctionalTest.testPassed()).toBeTruthy(JSON.stringify(siblingChoiceFunctionalTest.getErrors(), null, 3));
    });
*/
});
