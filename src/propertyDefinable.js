'use strict';

/**
 *  PropertyDefinable is a utility base class providing methods to create properties that are enumerable.
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
		if(options.propertyNames != undefined) {
			this.definePropertiesFromArray(options.propertyNames, options.enumerable);
		}
		if(options.properties != undefined) {
			this.definePropertiesFromObject(options.properties)
		}
}

	/**
	 * Creates a set of accessor properties with the provided names and enumerable property.
	 * 
	 * @param {Array} propertyNames - An array of strings represending the properties to be created.
	 * @param {Boolean} [enumerable] - True if all the properties created from the provided propertyNames should be enumerable.  False otherwise.
	 */
	definePropertiesFromArray(propertyNames, enumerable) {
		propertyNames.forEach(function(propertyName){
			this.defineAccessorProperty(propertyName, Symbol(propertyName), {
				enumerable: enumerable == undefined ? true : enumerable
			});
	}, this);
	}

	/**
	 * 
	 * @param {Object} properties - Key value pairs where the key is the propertyName to be created and the value is the descriptor as defined by 
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | Object.defineProperty()}
	 */
	definePropertiesFromObject(properties) {
		Object.keys(properties).forEach(function(propertyName) {
			Reflect.defineProperty(this, propertyName, properties[propertyName]);
		}, this);
	}

	/**
     * Adds a basic property with the given name and symbol.    Properties will have a getters & setters and be enumerable
	 * unless overridden by the descriptor parameter.
	 * 
     * @param {String} propertyName 
     * @param {Symbol} symbol 
     * @param {Object} [descriptor] - Can be used to customize the property.as defined by 
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | Object.defineProperty()}
     */
    defineAccessorProperty(propertyName, symbol, descriptor) {
        var attributes = {
            enumerable: true,
            get: function() {
                return this[symbol];
            },
            set: function(newVal) {
                this[symbol] = newVal;
            }
        };
        Object.assign(attributes, descriptor);
        return Reflect.defineProperty(this, propertyName, attributes);
    }

}

module.exports = PropertyDefinable;
