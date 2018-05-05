'use strict';

const PropertyDefinable = require('xsd2jsonschema').PropertyDefinable;

describe('PropertyDefinable using definePropertiesFromArray() for basic getter/setter Test -', function() {
    class Enumerable extends PropertyDefinable {
        constructor() {
            super({
                propertyNames: [ 'property1', 'property2' ]
            });
            this.property1 = 123;
            this.property2 = 'abc';
        }
    }

    var enumerable;

    beforeEach(function() {
        enumerable = new Enumerable();
    });

    it('should be enumerable using Object.keys()', function() {
        let count = 0;
        Object.keys(enumerable).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(2);
    });

    it('should be enumerable using for...of', function() {
        let count = 0;
        for (const key of Object.keys(enumerable)) {
            if (enumerable.hasOwnProperty(key)) {
                count += 1;
            }
        }
        expect(count).toEqual(2);
    });

    it('should be enumerable using for...in', function() {
        let count = 0;
        for (const prop in enumerable) {
            if (enumerable.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        expect(count).toEqual(2);
    });

    it('should be enumerable using Object.entities()', function() {
        let count = 0;
        Object.entries(enumerable).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(2);
    });
});
