/**
 *  Utility methods.
 */

'use strict';

const url = require('url');
const validator = require('validator');

/**
 * A collection of utility functions
 * 
 * @module Utils
 */

module.exports = {

	/**
	 * @param {String} str - a string containing a potential URL.
	 * @returns {String} - a resconstruction of the URL without the scheme, colon, or any parameters.
	 */
	compactURL: function (str) {
		var retval = '';
		if (str != undefined) {
			var urlParser = url.parse(str);
			var hostname = urlParser.hostname;
			var pathStr = urlParser.pathname;
			var namespaces = pathStr.split('/');
			if (namespaces.length > 1) {
				namespaces.shift();
			}
			if(hostname != undefined) {
				namespaces.unshift(hostname);
			}
			for (let i = 0; i < namespaces.length; i++) {
				retval += '/' + namespaces[i];
			}
		}
		return retval;
	},

	/**
	 * @param {String} xmlNamespace - a string containing a potential URL.
	 * @returns {String} - if the paraemter does not contain a URL then the parameter is returned unchanged.
	 * If the parameter is determined to contain a URL then the return value is the return value of sending
	 * the parameter through {@link module:Utils.compactURL}.
	 */
	getSafeNamespace: function (xmlNamespace) {
		var retval = xmlNamespace;
		if (validator.isURL(xmlNamespace)) {
			retval = this.compactURL(xmlNamespace);
		}
		return retval;
	},

	/**
	 * Provies basic object.toString() functionality for logging purposes.
	 * 
	 * @param {Object} obj - an object.
	 * @returns {String} - a string of name/value pairs of any properties the object has.
	 */	
	objectToString: function (obj) {
		var str = '';
		Object.keys(obj).forEach(function (key, index, array) {
			str += key + '=\'' + obj[key] + '\' ';
		});
		return str.trim();
	}
}