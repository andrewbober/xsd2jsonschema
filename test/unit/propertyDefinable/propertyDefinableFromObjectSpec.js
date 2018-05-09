'use strict';

const PropertyDefinable = require('xsd2jsonschema').PropertyDefinable;

describe('PropertyDefinalbe using definePropertiesFromObject() Test -', function() {
    const property1_NAME = Symbol();
    const property2_NAME = Symbol();

    class Enumerable extends PropertyDefinable {
        constructor() {
            super();
            super.definePropertiesFromObject({
                property1: {
                    enumerable: true,
                    get: function() {
                        return this[property1_NAME];
                    },
                    set: function(newProperty1) {
                        if (typeof newProperty1 !== 'number' || newProperty1 < 0) {
                            throw new Error('property1 must be a positive integer');
                        }
                        this[property1_NAME] = newProperty1;
                    }
                },
                property2: {
                    enumerable: true,
                    get: function() {
                        return this[property2_NAME];
                    },
                    set: function(newProperty2) {
                        if (typeof newProperty2 !== 'string') {
                            throw new Error('property2 must be a string');
                        }
                        this[property1_NAME] = newProperty2;
                    }
                }
            });
            this.property1 = 123;
            this.property2 = 'abc';
        }
    }

    class EnumerableConstructor extends PropertyDefinable {
        constructor() {
            super({
                property1: {
                    enumerable: true,
                    get: function() {
                        return this[property1_NAME];
                    },
                    set: function(newProperty1) {
                        if (typeof newProperty1 !== 'number' || newProperty1 < 0) {
                            throw new Error('property1 must be a positive integer');
                        }
                        this[property1_NAME] = newProperty1;
                    }
                },
                property2: {
                    enumerable: true,
                    get: function() {
                        return this[property2_NAME];
                    },
                    set: function(newProperty2) {
                        if (typeof newProperty2 !== 'string') {
                            throw new Error('property2 must be a string');
                        }
                        this[property1_NAME] = newProperty2;
                    }
                }
            });
            this.property1 = 123;
            this.property2 = 'abc';
        }
    }

    var enumerable;
    var enumerableConstructor;

    beforeEach(function() {
        enumerable = new Enumerable();
        enumerableConstructor = new EnumerableConstructor();
    });

/*  
 * Enumerable
 */
    it('should not allow a negative value for property1', function() {
        expect(function() {
            enumerable.property1 = -123;
        }).toThrow(Error('property1 must be a positive integer'));
    });

    it('should require a string value for property2', function() {
        expect(function() {
            enumerable.property2 = {};
        }).toThrow(Error('property2 must be a string'));
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

/*  
 * EnumerableConstructor
 */
    it('should not allow a negative value for property1', function() {
        expect(function() {
            enumerableConstructor.property1 = -123;
        }).toThrow(Error('property1 must be a positive integer'));
    });

    it('should require a string value for property2', function() {
        expect(function() {
            enumerableConstructor.property2 = {};
        }).toThrow(Error('property2 must be a string'));
    });

    it('should be enumerable using Object.keys()', function() {
        let count = 0;
        Object.keys(enumerableConstructor).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(2);
    });

    it('should be enumerable using for...of', function() {
        let count = 0;
        for (const key of Object.keys(enumerableConstructor)) {
            if (enumerableConstructor.hasOwnProperty(key)) {
                count += 1;
            }
        }
        expect(count).toEqual(2);
    });

    it('should be enumerable using for...in', function() {
        let count = 0;
        for (const prop in enumerableConstructor) {
            if (enumerableConstructor.hasOwnProperty(prop)) {
                count += 1;
            }
        }
        expect(count).toEqual(2);
    });

    it('should be enumerable using Object.entities()', function() {
        let count = 0;
        Object.entries(enumerableConstructor).forEach(() => {
            count += 1;
        });
        expect(count).toEqual(2);
    });
});
