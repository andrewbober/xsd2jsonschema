
'use strict';

const XsdNodeTypes = require('xsd2jsonschema').XsdNodeTypes;

describe('JsonSchemaFile Test -', function() {
    it('should return the name of the type when given the numeric code', function() {
        const ELEMENT_NODE = XsdNodeTypes.getTypeName(1);
        expect(ELEMENT_NODE).toEqual('ELEMENT_NODE');
    });
});