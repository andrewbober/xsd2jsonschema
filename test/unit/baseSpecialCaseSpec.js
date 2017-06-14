"use strict";

const XsdFile = require("Xsd2JsonSchema").XsdFile;
const BaseSpecialCaseIdentifier = require("Xsd2JsonSchema").BaseSpecialCaseIdentifier;

/*
const Qname = require("./qname");
const customTypes = require("./customTypes");
const parsingState = require("./parsingState");
const XsdElements = require("./xmlschema/xsdElements");
const XsdAttributes = require("./xmlschema/xsdAttributes");
const XsdAttributeValues = require("./xmlschema/xsdAttributeValues");
*/

/**
 * Class representing a collection of logic to identify special cases in XML Schema that cannot be immediately
 * converted to JSON Schmea without inspecting the contents of the tag or the tag's siblings.  Examples:
 * 
 * 1. A <choice> where the goal is really anyOf.  For example:
 * 			<xs:choice>
 *				<xs:sequence>
 *					<xs:element name="DemandingPartyInfo" type="DemandingPartyInfoType"/>
 *					<xs:element name="ResponsiblePartyInfo" type="DemandingPartyInfoType" minOccurs="0"/>
 *					<xs:element name="ArbitrationDecisionInfo" type="DemandingPartyInfoType" minOccurs="0"/>
 *  			</xs:sequence>
 *				<xs:sequence>
 *					<xs:element name="ResponsiblePartyInfo" type="DemandingPartyInfoType"/>
 *					<xs:element name="ArbitrationDecisionInfo" type="DemandingPartyInfoType" minOccurs="0"/>
 *				</xs:sequence>
 *				<xs:element name="ArbitrationDecisionInfo" type="DemandingPartyInfoType"/>
 *			</xs:choice>
 * 2. Sibling <choice>
 * 3. Need a solution for optional <sequence>, <choice>, etc.  Currently just using an empty schema {} as an option.
 *
 */


describe('BaseSpecialCaseIdentifier', function() {
    var sci = new BaseSpecialCaseIdentifier();
    var node;
    var xsd;

    beforeEach(function(){
        sci = new BaseSpecialCaseIdentifier();
        node = null;
        xsd = new XsdFile('test/data/anyOfChoice.xsd');
    });

    afterEach(function(){

    })

// isOptionalSequence()
// isOptionalChoice()
// isSiblingChoice()

// isAnyOfChoice()
    it("should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf", function() {
        var tagName = xsd.schemaElement.prefix == undefined ? 'choice' : xsd.schemaElement.prefix + ":choice";
        node = xsd.schemaElement.getElementsByTagName(tagName)[0];
        expect(sci.isAnyOfChoice(node, xsd)).toBeTruthy();
    });

    it("should not identify a regular <choice> as a specially formed <choice> tag as an instance of the JSON Schema idium anyOf", function() {
        var tagName = xsd.schemaElement.prefix == undefined ? 'choice' : xsd.schemaElement.prefix + ":choice";
        node = xsd.schemaElement.getElementsByTagName(tagName)[1];
        expect(sci.isAnyOfChoice(node, xsd)).not.toBeTruthy();
    });
    
    it("should not identify a <choice> tag as an instance of the JSON Schema idium anyOf if the <choice> tag options don't allow it.  The choice options must increase in count by exactly one.", function() {
        var tagName = xsd.schemaElement.prefix == undefined ? 'choice' : xsd.schemaElement.prefix + ":choice";
        node = xsd.schemaElement.getElementsByTagName(tagName)[2];
        expect(sci.isAnyOfChoice(node, xsd)).not.toBeTruthy();
    });
    
    it("should not identify a <choice> tag an instance of the JSON Schema idium anyOf if the <choice> tag options don't allow it.  The choice options must increase in count by exactly one and prior choices options must be optional.", function() {
        var tagName = xsd.schemaElement.prefix == undefined ? 'choice' : xsd.schemaElement.prefix + ":choice";
        node = xsd.schemaElement.getElementsByTagName(tagName)[3];
        expect(sci.isAnyOfChoice(node, xsd)).not.toBeTruthy();
    });
    
    it("should identify a specially formed <choice> tag as an instance of the JSON Schema idium anyOf", function() {
        var tagName = xsd.schemaElement.prefix == undefined ? 'choice' : xsd.schemaElement.prefix + ":choice";
        node = xsd.schemaElement.getElementsByTagName(tagName)[4];
        expect(sci.isAnyOfChoice(node, xsd)).toBeTruthy();
    });

});