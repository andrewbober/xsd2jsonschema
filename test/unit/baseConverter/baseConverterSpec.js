'use strict';

const XsdFile = require('xsd2jsonschema').XsdFile;
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;
const BaseConverter = require('xsd2jsonschema').BaseConverter;
const Constants = require('xsd2jsonschema').Constants;

describe('BaseConverter Test -', function () {
    var bc;
    var xsd;
    var jsonSchema;
    
    beforeEach(function () {
        bc = new BaseConverter();
        xsd = new XsdFile({ 
            uri: 'test/xmlSchemas/functional/optionalChoice.xsd'
        });
        jsonSchema = new JsonSchemaFile({
            baseFilename: xsd.baseFilename,
            targetNamespace: xsd.targetNamespace,
            baseId : "http://www.xsd2jsonschema.org/unittests/"
        });
    });

    afterEach(function () {

    })

    it('should confirm a newly allocated BaseConverter was properly initiialized', function () {
        const blankNamespaces = {};
        blankNamespaces[Constants.XML_SCHEMA_NAMESPACE] =  { types: {} }
        blankNamespaces[Constants.GLOBAL_ATTRIBUTES_SCHEMA_NAME] =  { types: {} }

        expect(bc.builtInTypeConverter).not.toBeUndefined();
        expect(bc.specialCaseIdentifier).not.toBeUndefined();
        expect(bc.namespaceManager.namespaces).toEqual(blankNamespaces);
    });

});