'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;


describe('BaseSpecialCaseIdentifier Test', function () {
    describe('OptionalChoice', function () {
        var sci = new BaseSpecialCaseIdentifier();
        var optionalChoiceXsd;

        beforeEach(function () {
            sci = new BaseSpecialCaseIdentifier();
            optionalChoiceXsd = new XsdFile({ uri: 'test/xmlSchemas/functional/optionalChoice.xsd' });
        });

        afterEach(function () {

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

    });
});
