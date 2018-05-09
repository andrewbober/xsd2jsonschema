'use strict';

const debug = require('debug')('xsd2jsonschema:BaseSpecialCaseIdentifier:AnyOfChoice')

const XsdFile = require('xsd2jsonschema').XsdFile;
const BaseSpecialCaseIdentifier = require('xsd2jsonschema').BaseSpecialCaseIdentifier;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;


describe('BaseSpecialCaseIdentifier AnyOfChoice Test', function () {
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

        // generateAnyOfChoice - check args
        it('should identify a jsonSchmea instance that does not contain an AnyOfChoice', function() {
            const jsonSchema = new JsonSchemaFile();
            sci.generateAnyOfChoice(jsonSchema);
        })

        // generateAnyOfChoice
        it('should generate an AnyOfChoice in JsonSchema', function() {
            const jsonSchema = new JsonSchemaFile();
            const oneOfSchema = new JsonSchemaFile();
            oneOfSchema.setProperty('prop1', new JsonSchemaFile());
            oneOfSchema.setProperty('prop2', new JsonSchemaFile());
            oneOfSchema.setProperty('prop3', new JsonSchemaFile());
            jsonSchema.oneOf.push(oneOfSchema);
            sci.generateAnyOfChoice(jsonSchema);
            expect(jsonSchema.anyOf.length).toEqual(3);
            expect(jsonSchema.oneOf.length).toEqual(0);
        })

        // fixAnyOfChoice
        it('should identify an AnyOfChoice that is also a SiblingChoice and utilize the correct sq', function () {
            const jsonSchema = new JsonSchemaFile();
            const allOfJsonSchema = new JsonSchemaFile();
            sci.fixAnyOfChoice(jsonSchema);

            const oneOfSchema = new JsonSchemaFile();
            oneOfSchema.setProperty('prop1', new JsonSchemaFile());
            oneOfSchema.setProperty('prop2', new JsonSchemaFile());
            oneOfSchema.setProperty('prop3', new JsonSchemaFile());
            allOfJsonSchema.oneOf.push(oneOfSchema);
            allOfJsonSchema.isAnyOfChoice = true;
            jsonSchema.allOf.push(allOfJsonSchema);
            sci.fixAnyOfChoice(jsonSchema);
            expect(allOfJsonSchema.anyOf.length).toEqual(3);
            expect(allOfJsonSchema.oneOf.length).toEqual(0);            
        })

        // fixOptionalChoiceTruthy
        it('should generate an OptionalChoice using a True Schema (e.g. {})', function () {
            const jsonSchema = new JsonSchemaFile();
            const jsonSchemaCheck = jsonSchema.clone();

            // This is currently done inline in baseConverter.js so the jsonSchema should not be changed
            sci.fixOptionalChoiceTruthy(jsonSchema);
            expect(jsonSchema).toEqual(jsonSchemaCheck);
        })

        // fixOptionalChoiceNot
        it('should generate an OptionalChoice using the NOT solution', function () {
            // TBD
        })

        // fixOptionalChoicePropertyDependency
        it('should generate an OptionalChoice using the Property Dependency solution', function () {
            // TBD
        })

        // fixOptionalChoice
        it('should select the appropriate method to generate an OptionalChoice based on the options', function () {
            const jsonSchema = new JsonSchemaFile();
            const jsonSchemaCheck = jsonSchema.clone();

            // This is currently not implemented so the jsonSchema should not be changed
            sci.fixOptionalChoice(jsonSchema);
            expect(jsonSchema).toEqual(jsonSchemaCheck);
        })
    })

});