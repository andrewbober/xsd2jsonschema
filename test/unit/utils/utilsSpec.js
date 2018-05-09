'use strict'

const Utils = require("./../../../src/utils");

describe("Utils Test - ", function() {
    const url = 'http://xsd2jsonschema.org/here/is/a/test';
    const nonUrl = 'Not a url';

// compactURL
    it("should transform a URL by removing the scheme, colon, and any parameters", function() {
        expect(Utils.compactURL(url)).toEqual('/xsd2jsonschema.org/here/is/a/test');
        expect(Utils.compactURL('not-a-url')).toEqual('/not-a-url');
    });

// getSafeNamespace
    it("should convert identity a URL and tranform it using compactURL()", function() {
        expect(Utils.getSafeNamespace(url)).toEqual('/xsd2jsonschema.org/here/is/a/test');
        expect(Utils.getSafeNamespace(nonUrl)).toEqual(nonUrl);
    });

})
