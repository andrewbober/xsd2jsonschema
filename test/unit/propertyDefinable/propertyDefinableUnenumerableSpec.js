'use strict';

describe('PropertyDefinable Unenumerable - demonstrates the problem using es6 classes properties with labels -', function() {
    const property1_NAME = Symbol();
    const property2_NAME = Symbol();

    class Unenumerable {
        constructor() {
            this.property1 = 123;
            this.property2 = 'abc';
        }

        // Getters/Setters
        get property1() {
            return this[property1_NAME];
        }
        set property1(newProperty1) {
            if (typeof newProperty1 !== 'number' || newProperty1 < 0) {
                throw new Error('property1 must be a positive integer');
            }
            this[property1_NAME] = newProperty1;
        }

        get property2() {
            return this[property2_NAME];
        }
        set property2(newProperty2) {
            if (typeof newProperty2 !== 'string') {
                throw new Error('property2 must be a string');
            }
            this[property2_NAME] = newProperty2;
        }
    }

    var unenumerable;

    beforeEach(function() {
        unenumerable = new Unenumerable();
    });

    it('should not allow a negative value for property1', function() {
        expect(function() {
            unenumerable.property1 = -123;
        }).toThrow(Error('property1 must be a positive integer'));
    });

    it('should require a string value for property2', function() {
        expect(function() {
            unenumerable.property2 = {};
        }).toThrow(Error('property2 must be a string'));
    });

    it('should not be enumerable using Object.keys()', function() {
        let count = 0;
        Object.keys(unenumerable).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(0);
    });

    it('should not be enumerable using for...of', function() {
        let count = 0;
        for (const key of Object.keys(unenumerable)) {
            if (unenumerable.hasOwnProperty(key)) {
                count += 1;
            }
        }
        expect(count).toEqual(0);
    });

    it('should not be enumerable using for...in', function() {
        let count = 0;
        for (const prop in unenumerable) {
            if (unenumerable.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        expect(count).toEqual(0);
    });

    it('should not be enumerable using Object.entities()', function() {
        let count = 0;
        Object.entries(unenumerable).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(0);
    });

});
