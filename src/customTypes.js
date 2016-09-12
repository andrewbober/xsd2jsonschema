/**
 *  JSON Schema primitive types
 */

"use strict";

var JsonSchemaFile = require("./jsonSchemaFile");
var utils = require("./utils");

var namespaces = {};

module.exports = {
	addNamespace: function (_namespace) {
		var namespace = utils.getSafeNamespace(_namespace);
		if (!namespaces.hasOwnProperty(namespace)) {
			namespaces[namespace] = { customTypes: {} };
		}
	},
	getNamespace: function (namespace) {
		return namespaces[namespace];
	},

	getNamespaces: function () {
		return namespaces;
	},
	getCustomType: function (type, baseJsonSchema) {
		if (type === undefined) {
			throw new Error( "\"type\" parameter required");
		}
		if (baseJsonSchema === undefined) {
			throw new Error("\"baseJsonSchema\" parameter required");
		}
		var namespace = baseJsonSchema.getSubschemaStr();
		if (namespaces[namespace].customTypes[type] === undefined) {
			//console.log("Unable to find custom type: " + type);
			var parms={};
			parms.ref = baseJsonSchema.getResolvedFilename() + "#" + baseJsonSchema.getSubschemaStr() + "/" + type;
			namespaces[namespace].customTypes[type] = new JsonSchemaFile(parms);
		}
		return namespaces[namespace].customTypes[type];
	}
}