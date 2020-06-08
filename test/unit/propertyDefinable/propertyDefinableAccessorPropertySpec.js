'use strict';

const PropertyDefinable = require('xsd2jsonschema').PropertyDefinable;

describe('PropertyDefinable using defineAccessorProperty() Test -', function() {
    const positiveNumber1_NAME = Symbol();
    const string1_NAME = Symbol();
    const propertyCount = 6;

    class Enumerable extends PropertyDefinable {
        constructor() {
            super();
            // a postivie number property getter and setter
            super.defineAccessorProperty('positiveNumber1', positiveNumber1_NAME, {
                set: function(newPostitiveNumber) {
                    if (typeof newPostitiveNumber !== 'number' || newPostitiveNumber <= 0) {
                        throw new Error(`${newPostitiveNumber} must be a positive number`);
                    }
                    this[positiveNumber1_NAME] = newPostitiveNumber;
                }
            });

            // a string getter and setter
            super.defineAccessorProperty('string1', string1_NAME, {
                set: function(newString) {
                    if (typeof newString !== 'string') {
                        throw new Error(`${newString} must be a string`);
                    }
                    this[string1_NAME] = newString;
                }
            });

            // a numeric property getter and setter
            super.defineNumericProperty('number1');

            // a string getter and setter
            super.defineStringProperty('string2');
            
            // a booelan getter and setter
            super.defineBooleanProperty('boolean1');
            
            // an object getter and setter
            super.defineObjectProperty('object1');
        }
    }
    var enumerable;

    beforeEach(function() {
        enumerable = new Enumerable();
    });

    it('should allow a positive number for postiiveNumber1', function() {
        enumerable.positiveNumber1 = 123;
        expect(enumerable.positiveNumber1).toEqual(123);
    })

    it('should not allow a zero value for postiiveNumber1', function() {
        expect(function() {
            enumerable.positiveNumber1 = 0;
        }).toThrow(Error('0 must be a positive number'));
    })

    it('should require a postitive number value for positiveNumber1', function() {
        expect(function() {
            enumerable.positiveNumber1 = -123;
        }).toThrow(Error('-123 must be a positive number'));
    });

    it('should allow a numeric value for number1', function() {
        enumerable.number1 = 456;
        expect(enumerable.number1).toEqual(456);
    })

    it('should require a numeric value for number1', function() {
        expect(function() {
            enumerable.number1 = 'not-a-number';
        }).toThrow(Error('not-a-number must be a number'));
    });

    it('should allow a string value for string1', function() {
        enumerable.string1 = 'abc';
        expect(enumerable.string1).toEqual('abc');
    })

    it('should require a string value for string1', function() {
        expect(function() {
            enumerable.string1 = {};
        }).toThrow(Error('[object Object] must be a string'));
    });

    it('should allow a string value for string2', function() {
        enumerable.string2 = 'xyz';
    })

    it('should require a string value for string2', function() {
        expect(function() {
            enumerable.string2 = -1;
        }).toThrow(Error('-1 must be a string'));
    });

    it('should allow a boolean value for boolean1', function() {
        enumerable.boolean1 = true;
        expect(enumerable.boolean1).toBeTruthy();
        enumerable.boolean1 = false;
        expect(enumerable.boolean1).toBeFalsy();
    });

    it('should require a boolean value for boolean1', function() {
        expect(function() {
            enumerable.boolean1 = -1;
        }).toThrow(Error('-1 must be a boolean'));
    });

    it('should allow an object value for object1', function() {
        let obj = {};
        enumerable.object1 = obj;
        expect(enumerable.object1).toEqual(obj);
        expect(enumerable.object1).toBe(obj);
    })

    it('should require an object value of object1', function() {
        expect(function() {
            enumerable.object1 = -1;
        }).toThrow(Error('-1 must be an object'));
    })

    it('should be enumerable using Object.keys()', function() {
        let count = 0;
        Object.keys(enumerable).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(propertyCount);
    });

    it('should be enumerable using for...of', function() {
        let count = 0;
        for (const key of Object.keys(enumerable)) {
            if (enumerable.hasOwnProperty(key)) {
                count += 1;
            }
        }
        expect(count).toEqual(propertyCount);
    });

    it('should be enumerable using for...in', function() {
        let count = 0;
        for (const prop in enumerable) {
            if (enumerable.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        expect(count).toEqual(propertyCount);
    });

    it('should be enumerable using Object.entries()', function() {
        let count = 0;
        Object.entries(enumerable).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(propertyCount);
    });

    it('should redefine a boolean property to numeric', function() {
        enumerable.boolean1 = true;
        expect(enumerable.boolean1).toBeTruthy();
        expect(enumerable.defineNumericProperty('boolean1')).toBeTruthy();
        enumerable.boolean1 = 1;
        expect(enumerable.boolean1).toEqual(1);
        expect(function() {
            enumerable.boolean1 = true;
        }).toThrow(Error('true must be a number'));
    })
});
