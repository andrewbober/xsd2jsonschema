/**
 *  Utility methods.
 */

"use strict";

var url = require("url");

/**
 * A collection of utility functions
 * 
 * @module Utils
 */

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = {

	/**
	 * Use this method to determine if a string contains a URL.
	 * <pre>
  	 * const pattern = new RegExp('^(https?:\/\/)?'+ // protocol
	 *     '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
	 *     '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
	 *     '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
	 *     '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
	 *     '(\#[-a-z\d_]*)?$','i'); // fragment locater
	 * </pre>
	 * Source: {@link http://stackoverflow.com/questions/34113818/how-to-detect-url-format-using-javascript}
	 * 
	 * @param {String} str - a string containing a potential URL.
	 * @returns {Boolean} - True if a regular expression can be used to identify a URL within the str parameter.
	 */
	isURL: function (str) {
		const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
		return pattern.test(str);
	},

	/**
	 * Use this method to determine if a string contains a URL.
	 * <pre>
     *		const regex = escapeRegExp("#([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\xE000-\xF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?#iS");
	 * </pre>
	 * Source: {@link https://mathiasbynens.be/demo/url-regex}
	 * 
	 * @param {String} str - a string containing a potential URL.
	 * @returns {Boolean} - True if a regular expression can be used to identify a URL within the str parameter.
	 */
	isURL2: function (str) {
		const regex = escapeRegExp("#([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\xE000-\xF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\x00A0-\xD7FF\xF900-\xFDCF\xFDF0-\xFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?#iS");
		const pattern = new RegExp(regex, 'i');
		return pattern.test(str);
	},

	/**
	 * @param {String} str - a string containing a potential URL.
	 * @returns {String} - a resconstruction of the URL without the protocol, colon, or any parameters.
	 */
	compactURL: function (str) {
		var retval = "";
		if (str != undefined) {
			var urlParser = url.parse(str);
			var hostname = urlParser.hostname;
			var pathStr = urlParser.pathname;
			var namespaces = pathStr.split("/");
			if (namespaces.length > 1) {
				namespaces.shift();
			}
			namespaces.unshift(hostname);
			for (let i = 0; i < namespaces.length; i++) {
				retval += "/" + namespaces[i];
			}
		}
		return retval;
	},

	/**
	 * @param {String} xmlNamespace - a string containing a potential URL.
	 * @returns {String} - if the paraemter does not contain a URL then the parameter is returned unchanged.
	 * If the parameter is determined to contain a URL then the return value is the return value of sending
	 * the parameter through {@link module:Utils.isURL}.
	 */
	getSafeNamespace: function (xmlNamespace) {
		var retval = xmlNamespace;
		if (this.isURL(xmlNamespace)) {
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
		var str = "";
		Object.keys(obj).forEach(function (key, index, array) {
			str += key + "=\'" + obj[key] + "' ";
		});
		return str.trim();
	}
}