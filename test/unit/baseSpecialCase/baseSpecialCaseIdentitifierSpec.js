'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const XsdElements = require('xsd2jsonschema').XsdElements;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;

describe('BaseSpecialCaseIdentifier Test -', function () {
    var sci;
    var xsd;
    var jsonSchema;
    
    beforeEach(function () {
        sci = new BaseSpecialCaseIdentifier();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/unit/attributes.xsd'
        });
        jsonSchema = new JsonSchemaFile({
            xsd : xsd,
            baseId : "http://www.xsd2jsonschema.org/unit/test"
        });
    });

    afterEach(function () {

    })

    //addSpecialCase
    it('should add the given special case to the specialCases array', function() {
        sci.addSpecialCase({},{},{});
        expect(sci.specialCases.length).toEqual(1);
    })

    // isOptional
    it('should return true if something', function () {
        const node = xsd.select1('//xs:schema/xs:complexType');
        expect(sci.isOptional(null, xsd, 1)).toBeFalsy();
        expect(sci.isOptional(null, xsd, 0)).toBeTruthy();
        expect(sci.isOptional(node, xsd, undefined)).toBeFalsy();
        expect(sci.isOptional(node, xsd, null)).toBeFalsy();
    });

    // countNonTextNodes
    it('should return seven. There are six ELEMENT nodes and one COMMENT node in attributes.xsd', function () {
        expect(sci.countNonTextNodes(xsd.schemaElement.childNodes)).toEqual(7);
    });

    // locateNewNameType - zero nameTypes
    it('should return undefined because an empty array is passed in', function () {
        expect(sci.locateNewNameType({}, undefined)).toBeUndefined();
    });

    // generateAnyOfChoice - check args
    it('should return undefined because an empty JsonSchema is passed in', function () {
        expect(sci.generateAnyOfChoice(new JsonSchemaFile())).toBeUndefined();
    });

    // generateAnyOfChoice - check args
    it('should return undefined because an empty array is passed in', function () {
        sci.generateAnyOfChoice(new JsonSchemaFile());
    });

});