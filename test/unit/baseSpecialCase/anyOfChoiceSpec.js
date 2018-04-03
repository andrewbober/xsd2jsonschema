'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;


describe('BaseSpecialCaseIdentifier Test', function () {
    describe('AnyOfChoice', function () {

        var sci = new BaseSpecialCaseIdentifier();
        var node;
        var anyOfChoiceXsd;

        beforeEach(function () {
            sci = new BaseSpecialCaseIdentifier();
            node = null;
            anyOfChoiceXsd = new XsdFile({ uri: 'test/xmlSchemas/functional/anyOfChoice.xsd' });
        });

        afterEach(function () {

        });

        // **** isAnyOfChoice() ****
        it('should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[0];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).toBeTruthy();
        });

        it('should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[1];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).toBeTruthy();
        });

        it('should not identify a regular <choice> as a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[2];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).not.toBeTruthy();
        });

        it('should not identify a <choice> tag as an instance of the JSON Schema idium anyOf if the <choice> tag options don\'t allow it.  The choice options must increase in count by exactly one.', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[3];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).not.toBeTruthy();
        });

        it('should not identify a <choice> tag an instance of the JSON Schema idium anyOf if the <choice> tag options don\'t allow it.  The choice options must increase in count by exactly one and prior choices options must be optional.', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[4];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).not.toBeTruthy();
        });

        it('should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf', function () {
            var tagName = anyOfChoiceXsd.schemaElement.prefix == undefined ? 'choice' : anyOfChoiceXsd.schemaElement.prefix + ':choice';
            node = anyOfChoiceXsd.schemaElement.getElementsByTagName(tagName)[5];
            expect(sci.isAnyOfChoice(node, anyOfChoiceXsd)).toBeTruthy();
        });
    })

});