/**
 *  Utility methods.
 */

"use strict";

var url = require("url");

module.exports = {

	getSafeNamespace: function (xmlNamespace) {
		var retval = "";
		if (xmlNamespace != undefined) {
			var urlParser = url.parse(xmlNamespace);
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
	objectToString: function(obj) {
		var str = "";
		Object.keys(obj).forEach(function (key, index, array) {
			str += key + "=\'" + obj[key] + "' ";
		});
		return str.trim();
	}
}