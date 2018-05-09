'use strict';

const BuiltInTypeConverter = require('xsd2jsonschema').BuiltInTypeConverter;
const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const jsonSchemaTypes = require('xsd2jsonschema').JsonSchemaTypes;
const jsonSchemaFormats = require('xsd2jsonschema').JsonSchemaFormats;
const NamespaceManager = require('xsd2jsonschema').NamespaceManager;
const JSON_SCHEMA_TYPES = require('xsd2jsonschema').JsonSchemaTypes;
const ParsingState = require('xsd2jsonschema').ParsingState;
const XsdElements = require('xsd2jsonschema').XsdElements;

describe('ParsingState Test - ', function() {
    var parsingState;
    const schema = {
        name: 'schema',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const attribute = {
        name: 'attribute',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const complexType = {
        name: 'complexType',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const simpleType = {
        name: 'simpleType',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const restriction = {
        name: 'restriction',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const element = {
        name: 'element',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const documentation = {
        name: 'documentation',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const appInfo = {
        name: 'appinfo',
        workingJsonSchema: {},
        attribute: 'value'
    };
    const choice = {
        name: 'choice',
        workingJsonSchema: {},
        attribute: 'value'
    };

    beforeEach(function() {
        parsingState = new ParsingState();
    });

    // getCurrentState
    it('should return the state most recently entered', function() {
        expect(function() {
            parsingState.getCurrentState();
        }).toThrow(Error('There are no states!'));
        parsingState.enterState(schema);
        expect(function() {
            parsingState.getCurrentState();
        }).toThrow(Error('Not \'in\' a state yet.  We are \'on\' state=\'schema\'!'));
        parsingState.enterState(complexType);
        expect(parsingState.getCurrentState()).toEqual(schema);
        parsingState.enterState(attribute);
        expect(parsingState.getCurrentState()).toEqual(complexType);
        parsingState.enterState(simpleType);
        expect(parsingState.getCurrentState()).toEqual(attribute);
    });

    // inAttribute
    it('should return true if the current state is attribute or false otherwise', function() {
        parsingState.enterState(schema);
        parsingState.enterState(complexType);
        parsingState.enterState(attribute);
        parsingState.enterState(simpleType);
        expect(parsingState.inAttribute()).toBeTruthy();

        parsingState.exitState();
        expect(parsingState.inAttribute()).toBeFalsy();
    });

    // inElement
    it('should return true if the current state is element or false otherwise', function() {
        parsingState.enterState(schema);
        parsingState.enterState(complexType);
        parsingState.enterState(element);
        parsingState.enterState(simpleType);
        expect(parsingState.inElement()).toBeTruthy();

        parsingState.exitState();
        expect(parsingState.inElement()).toBeFalsy();
    });

    // inDocumentation
    it('should return true if the current state is documentation or false otherwise', function() {
        parsingState.enterState(schema);
        parsingState.enterState(complexType);
        parsingState.enterState(documentation);
        parsingState.enterState(simpleType);
        expect(parsingState.inDocumentation()).toBeTruthy();

        parsingState.exitState();
        expect(parsingState.inDocumentation()).toBeFalsy();
    });

    // inAppInfo
    it('should return true if the current state is appinfo or false otherwise', function() {
        parsingState.enterState(schema);
        parsingState.enterState(complexType);
        parsingState.enterState(appInfo);
        parsingState.enterState(simpleType);
        expect(parsingState.inAppInfo()).toBeTruthy();

        parsingState.exitState();
        expect(parsingState.inAppInfo()).toBeFalsy();
    });

    // inChoice
    it('should return true if the current state is choice or false otherwise', function() {
        parsingState.enterState(schema);
        parsingState.enterState(complexType);
        parsingState.enterState(choice);
        parsingState.enterState(element);
        expect(parsingState.inChoice()).toBeTruthy();

        parsingState.exitState();
        expect(parsingState.inChoice()).toBeFalsy();
    });

    //isTopLevelEntity
    it('should return true if the current state represents a top level entitiy', function() {
        parsingState.enterState(schema);
        parsingState.enterState(complexType);
        expect(parsingState.isTopLevelEntity()).toBeTruthy();

        parsingState.enterState(choice);
        expect(parsingState.isTopLevelEntity()).toBeFalsy();
    })
});
