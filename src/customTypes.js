/**
 *  XML Namespaces of custom types that have been converted to JSON Schema
 */

"use strict";

var JsonSchemaFile = require("./jsonSchemaFile");
var utils = require("./utils");

var namespaces = { globalAttributes:{ customTypes:{} } };

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

	getCustomType: function (typeName, baseJsonSchema) {
		if (typeName === undefined) {
			throw new Error( "\"typeName\" parameter required");
		}
		if (baseJsonSchema === undefined) {
			throw new Error("\"baseJsonSchema\" parameter required");
		}
		var namespace = baseJsonSchema.getSubschemaStr();
		if (namespaces[namespace].customTypes[typeName] === undefined) {
			//console.log("Unable to find custom type: " + type);
			var parms={};
			parms.ref = baseJsonSchema.getResolvedFilename() + "#" + baseJsonSchema.getSubschemaStr() + "/" + typeName;
			namespaces[namespace].customTypes[typeName] = new JsonSchemaFile(parms);
		}
		return namespaces[namespace].customTypes[typeName];
	},

	getGlobalAtrribute: function (name, baseJsonSchema) {
		if (name === undefined) {
			throw new Error( "\"name\" parameter required");
		}
		if (baseJsonSchema === undefined) {
			throw new Error("\"baseJsonSchema\" parameter required");
		}
		var globalAttributesNamespace = namespaces.globalAttributes;
		if (globalAttributesNamespace.customTypes[name] === undefined) {
			var parms={};
			parms.ref = baseJsonSchema.getResolvedFilename() + "#" + baseJsonSchema.getSubschemaStr() + "/" + name;
			globalAttributesNamespace.customTypes[name] = new JsonSchemaFile(parms);
		}
		return globalAttributesNamespace.customTypes[name];
	}
}
