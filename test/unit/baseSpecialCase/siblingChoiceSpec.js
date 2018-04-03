'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;


describe('BaseSpecialCaseIdentifier Test -', function () {
    var sci = new BaseSpecialCaseIdentifier();
    var node;
    var anyOfChoiceXsd;
    var optionalChoiceXsd;
    var optionalSequenceXsd;
    var siblingChoiceXsd;

    beforeEach(function () {
        sci = new BaseSpecialCaseIdentifier();
        node = null;
        anyOfChoiceXsd = new XsdFile({ uri: 'test/xmlSchemas/functional/anyOfChoice.xsd' });
        optionalChoiceXsd = new XsdFile({ uri: 'test/xmlSchemas/functional/optionalChoice.xsd' });
        optionalSequenceXsd = new XsdFile({ uri: 'test/xmlSchemas/functional/optionalSequence.xsd' });
        siblingChoiceXsd = new XsdFile({ uri: 'test/xmlSchemas/functional/siblingChoice.xsd' });
    });

    afterEach(function () {

    });


    // **** isOptionalSequence() ****
    it('should identify a <sequence> that as optional because it has the attribute \'minOccurs\' set to zero', function () {
        const nodes = optionalSequenceXsd.select('//xs:complexType[@name=\'optionalSequenceOneRequiredOptionType\']/xs:sequence/xs:sequence');
        nodes.forEach(function (node) {
            expect(sci.isOptionalSequence(node, optionalSequenceXsd)).toBeTruthy();
        });
    });

    it('should identify a <sequence> that as optional because it has the attribute \'minOccurs\' set to zero', function () {
        const nodes = optionalSequenceXsd.select('//xs:complexType[@name=\'optionalSequenceTwoRequiredOptionAndOneOptionalType\']/xs:sequence/xs:sequence');
        nodes.forEach(function (node) {
            expect(sci.isOptionalSequence(node, optionalSequenceXsd)).toBeTruthy();
        });
    });


    // **** isOptionalChoice() ****
    it('should identify a <choice> that as optional because it has the attribute \'minOccurs\' set to zero', function () {
        const nodes = optionalChoiceXsd.select('//xs:complexType[@name=\'optionalChoiceEverythingIsOptionalType\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isOptionalChoice(node, optionalChoiceXsd)).toBeTruthy();
        });
    });

    it('should identify a <choice> that as optional because it has the attribute \'minOccurs\' set to zero', function () {
        const nodes = optionalChoiceXsd.select('//xs:complexType[@name=\'optionalChoiceAllOptionsRequiredType\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isOptionalChoice(node, optionalChoiceXsd)).toBeTruthy();
        });
    });


    // **** isSiblingChoice() ****
    it('should identify a <choice> that happens to be an \'anyOfChoice\' as a \'siblingChoice\' because the tag\'s parent contains more than one <choice> tag', function () {
        const nodes = siblingChoiceXsd.select('//xs:complexType[@name=\'SiblingAnyOfChoiceType\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isSiblingChoice(node, siblingChoiceXsd)).toBeTruthy();
        });
    });

    it('should not identify a <choice> that happens to be an \'anyOfChoice\' as a \'siblingChoice\' because the tag\'s parent contains a single <choice> tag', function () {
        const nodes = siblingChoiceXsd.select('//xs:complexType[@name=\'ReqularAnyOfChoiceType\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isSiblingChoice(node, siblingChoiceXsd)).not.toBeTruthy();
        });
    });

    it('should identify a <choice> as a \'siblingChoice\' because the tag\'s parent contains more than one <choice> tag', function () {
        const nodes = siblingChoiceXsd.select('//xs:complexType[@name=\'SiblingChoice1Type\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isSiblingChoice(node, siblingChoiceXsd)).toBeTruthy();
        });
    });

    it('should identify a <choice> as a \'siblingChoice\' because the tag\'s parent contains more than one <choice> tag', function () {
        const nodes = siblingChoiceXsd.select('//xs:complexType[@name=\'SiblingChoice2Type\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isSiblingChoice(node, siblingChoiceXsd)).toBeTruthy();
        });
    });

    it('should not identify a <choice> as a \'siblingChoice\' because the tag\'s parent contains a single <choice> tag', function () {
        const nodes = siblingChoiceXsd.select('//xs:complexType[@name=\'ReqularChoiceType\']/xs:sequence/xs:choice');
        nodes.forEach(function (node) {
            expect(sci.isSiblingChoice(node, siblingChoiceXsd)).not.toBeTruthy();
        });
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

});