'use strict';

/**
 *  PropertyDefinable is a utility base class providing methods to create properties that are enumerable and configurable.
 */

class PropertyDefinable {

	/**
	 * @param {Object} [options] - Used to configure a set of properties at once.
	 * 
	 * 		* options.propertyNames - An array of property names to be created.
	 * 		* options.enumerable - A boolean used to determine if created properties are enumerable.  Only used in conjunction with options.propertyNames.
	 * 		* options.properties - Key value pairs where the key is the propertyName to be created and the value is the descriptor as defined by 
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | Object.defineProperty()}
	 */
	constructor(options) {
		if (options == undefined) {
			return;
		}
		if (options.propertyNames != undefined) {
			this.definePropertiesFromArray(options.propertyNames, options.enumerable);
		}
		if (options.properties != undefined) {
			this.definePropertiesFromObject(options.properties)
		}
	}

	/**
	 * Creates a set of accessor properties with the provided names and enumerable property.
	 * 
	 * @param {Array} propertyNames - An array of strings represending the properties to be created.
	 * @param {Boolean} [enumerable] - True if all the properties created from the provided propertyNames should be enumerable.  False otherwise.
	 * 
	 * @returns {void}
	 */
	definePropertiesFromArray(propertyNames, enumerable) {
		propertyNames.forEach(function (propertyName) {
			this.defineAccessorProperty(propertyName, Symbol(propertyName), {
				enumerable: enumerable == undefined ? true : enumerable
			});
		}, this);
	}

	/**
	 * 
	 * @param {Object} properties - Key value pairs where the key is the propertyName to be created and the value is the descriptor as defined by 
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | Object.defineProperty()}
	 * 
	 * @returns {void}
	 */
	definePropertiesFromObject(properties) {
		Object.keys(properties).forEach(function (propertyName) {
			Reflect.defineProperty(this, propertyName, properties[propertyName]);
		}, this);
	}

	/**
     * Adds a basic property with the given name and symbol.  The property will have a getter & setter and be both enumerable and configurable
	 * unless overridden by the descriptor parameter.
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
     * @param {Object} [descriptor] - Can be used to customize the property.as defined by 
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | Object.defineProperty()}
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
     */
	defineAccessorProperty(propertyName, symbol, descriptor) {
		var attributes = {
			enumerable: true,
			configurable: true,
			get: function () {
				return this[symbol];
			},
			set: function (newVal) {
				this[symbol] = newVal;
			}
		};
		Object.assign(attributes, descriptor);
		return Reflect.defineProperty(this, propertyName, attributes);
	}

	/**
     * Adds a basic property with the given name and symbol.    Properties will have a getters & setters and be enumerable.
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
     */
	defineProperty(propertyName, symbol) {
		if (symbol == undefined) {
			symbol = Symbol();
		}
		return this.defineAccessorProperty(propertyName, symbol, {
			get: function () {
				return this[symbol];
			},
			set: function (newVal) {
				this[symbol] = newVal;
			}
		});
	}

	/**
     * Adds a numeric property with the given name  The enumerable property will have a standard getter and
	 * a setter that validates new values to ensure only numeric values are allowed. 
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
	 */
	defineNumericProperty(propertyName, symbol) {
		if (symbol == undefined) {
			symbol = Symbol();
		}
		return this.defineAccessorProperty(propertyName, symbol, {
			set: function(newProperty) {
				if (typeof newProperty !== 'number' && newProperty != undefined) {
					throw new Error(`${newProperty} must be a number`);
				}
				this[symbol] = newProperty;
			}
		});
	}

	/**
     * Adds a String property with the given name.  The enumerable property will have a standard getter and
	 * a setter that validates new values to ensure only String values are allowed.
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
	 */
	defineStringProperty(propertyName, symbol) {
		if (symbol == undefined) {
			symbol = Symbol();
		}
		return this.defineAccessorProperty(propertyName, symbol, {
			set: function(newProperty) {
				if (typeof newProperty !== 'string' && newProperty != undefined) {
					throw new Error(`${newProperty} must be a string`);
				}
				this[symbol] = newProperty;
			}
		});
	}

	/**
     * Adds a boolean property with the given name.  The enumerable property will have a standard getter and
	 * a setter that validates new values to ensure only boolean values are allowed.
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
	 */
	defineBooleanProperty(propertyName, symbol) {
		if (symbol == undefined) {
			symbol = Symbol();
		}
		return this.defineAccessorProperty(propertyName, symbol, {
			set: function(newProperty) {
				if (typeof newProperty !== 'boolean' && newProperty != undefined) {
					throw new Error(`${newProperty} must be a boolean`);
				}
				this[symbol] = newProperty;
			}
		});
	}

	/**
     * Adds an Object property with the given name.  The enumerable property will have a standard getter and
	 * a setter that validates new values to ensure only Object values are allowed.
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
	 */
	defineObjectProperty(propertyName, symbol) {
		if (symbol == undefined) {
			symbol = Symbol();
		}
		return this.defineAccessorProperty(propertyName, symbol, {
			set: function(newProperty) {
				if (newProperty != undefined) {
					if (typeof newProperty !== 'object' || Array.isArray(newProperty)) {
						throw new Error(`${newProperty} must be an object`);
					}
				}
				this[symbol] = newProperty;
			}
		});
	}

	/**
     * Adds an Object property with the given name.  The enumerable property will have a standard getter and
	 * a setter that validates new values to ensure only Object values are allowed.
	 * 
     * @param {String} propertyName - Name of the property
     * @param {Symbol} symbol - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol | Symbol} to use to retrieve this this property
	 * 
	 * @returns {Boolean} - Indicating whether or not the property was successfully defined.
	 */
	defineArrayProperty(propertyName, symbol) {
		if (symbol == undefined) {
			symbol = Symbol();
		}
		return this.defineAccessorProperty(propertyName, symbol, {
			set: function(newProperty) {
				if (newProperty != undefined) {
					if (typeof newProperty !== 'object' && !Array.isArray(newProperty)) {
						throw new Error(`${newProperty} must be an array object`);
					}
				}
				this[symbol] = newProperty;
			}
		});
	}
}

module.exports = PropertyDefinable;
