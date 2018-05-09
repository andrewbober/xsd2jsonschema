"use strict";

const XsdFile = require("xsd2jsonschema").XsdFile;
const BaseConverter = require("xsd2jsonschema").BaseConverter;
const JsonSchemaFile = require("xsd2jsonschema").JsonSchemaFile;

describe("BaseConverter <choice>", function() {
    var bc;
    var xsd;
    var jsonSchema;
    const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <xs:schema attributeFormDefault="unqualified" 
        elementFormDefault="qualified" 
        version="1.1.0" 
        targetNamespace="http://www.xsd2jsonschema.org/example" 
        xmlns="http://www.xsd2jsonschema.org/example" 
        xmlns:xs="http://www.w3.org/2001/XMLSchema">
        <xs:complexType name="ChoiceInChoice">
            <xs:sequence>
                <xs:choice>
                    <xs:element name="Option1" type="xs:string"/>
                    <xs:element name="Option2" type="xs:string"/>
                    <xs:choice>
                        <xs:element name="Option3" type="xs:string"/>
                        <xs:element name="Option4" type="xs:string"/>
                    </xs:choice>
                </xs:choice>
            </xs:sequence>
        </xs:complexType>
    </xs:schema>
    `;

    function enterState(node) {
        const name = XsdFile.getNodeName(node);
        bc.parsingState.enterState({
            name: name,
            workingJsonSchema: undefined
        });
        return name;
    }

    beforeEach(function() {
        bc = new BaseConverter();
        xsd = new XsdFile({ 
            uri: 'choice-in-choice-unit-test',
            xml: xml
        });
        jsonSchema = new JsonSchemaFile({
            baseFilename : xsd.baseFilename,
            baseId : "http://www.xsd2jsonschema.org/unittests/",
            targetNamespace: xsd.targetNamespace
        });
    });

    afterEach(function() {});

    describe("in CHOICE state", function() {
    
        it("should fail because this state is not implemented", function() {
            let node = xsd.select1("//xs:schema");
            let tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType");
            tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence");
            tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:choice");
            tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:choice/xs:choice");
            tagName = enterState(node);
            expect(bc[tagName].bind(bc, node, jsonSchema, xsd)).toThrow(Error('choice() needs to be implemented within choice'));

            //console.log(jsonSchema.toString());
        });
    });

/*
    describe("in COMPLEX_TYPE state", function() {
        it("should test something with choice", function() {
            const nodes = xsd.select("//xs:complexType[@name='optionalChoiceEverythingIsOptionalType']/xs:complextType/xs:choice");
            expect(bc.choice.bind(null, nodes[0], jsonSchema, xsd)).toBeTruthy();
        });
        it("should fail because this state is not implemented", function() {
            let node = xsd.select1("//xs:schema");
            let tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType");
            tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence");
            tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:choice");
            tagName = enterState(node);
            expect(bc[tagName](node, jsonSchema, xsd)).toBeTruthy();
            console.log(jsonSchema.toString());
            
            node = xsd.select1("//xs:schema/xs:complexType/xs:sequence/xs:choice/xs:choice");
            tagName = enterState(node);
            expect(bc[tagName].bind(null, node, jsonSchema, xsd)).toThrow('choice() needs to be implemented within choice');
            try {
                //expect(bc[tagName](node, jsonSchema, xsd)).toThrow('choice() needs to be implemented within choice');
            } catch (error) {
                console.log(error);                
            }
            console.log(jsonSchema.toString());
    });

    describe("in EXTENSION state", function() {
        it("should fail because this state is not implemented", function() {
            const nodes = xsd.select("//xs:complexType[@name='optionalChoiceEverythingIsOptionalType']/xs:extension/xs:choice");
            expect(bc.choice(nodes[0], jsonSchema, xsd)).toThrow();
        });
    });

    describe("in GROUP state", function() {
        it("should pass because this is a fall through and continue processing state", function() {
            const nodes = xsd.select("//xs:complexType[@name='optionalChoiceEverythingIsOptionalType']/xs:group/xs:choice");
            expect(bc.choice(nodes[0], jsonSchema, xsd)).toBeTruthy();
        });
    });

    describe("in RESTRICTION state", function() {
        it("should fail because this state is not implemented", function() {
            const nodes = xsd.select("//xs:complexType[@name='optionalChoiceEverythingIsOptionalType']/xs:restriction/xs:choice");
            expect(bc.choice(nodes[0], jsonSchema, xsd)).toThrow();
        });
    });

    describe("in SEQUENCE state", function() {
        it("should pass because this is a fall through and continue processing state", function() {
            const nodes = xsd.select("//xs:complexType[@name='optionalChoiceEverythingIsOptionalType']/xs:sequence/xs:choice");
            expect(bc.choice(nodes[0], jsonSchema, xsd)).toBeTruthy();
        });
    });
*/
});
