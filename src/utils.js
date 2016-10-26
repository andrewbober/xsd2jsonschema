/**
 *  Utility methods.
 */

"use strict";

var url = require("url");

module.exports = {

	isURL: function (str) {
		var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
		return pattern.test(str);
	},

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

	getSafeNamespace: function (xmlNamespace) {
		var retval = xmlNamespace;
		if (this.isURL(xmlNamespace)) {
			retval = this.compactURL(xmlNamespace);
		}
		return retval;
	},
	objectToString: function (obj) {
		var str = "";
		Object.keys(obj).forEach(function (key, index, array) {
			str += key + "=\'" + obj[key] + "' ";
		});
		return str.trim();
	}
}