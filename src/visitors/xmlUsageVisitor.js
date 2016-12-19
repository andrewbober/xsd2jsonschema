/**
 *  TBD
 */

"use strict";

var BaseConvertionVisitor = require("./baseConversionVisitor");

var uris_NAME = Symbol();

class XmlUsageVisitor extends BaseConvertionVisitor {
	constructor() {
		super(undefined);
		this.uris = {};
	}

	get uris() {
		return this[uris_NAME];
	}

	set uris(newUris) {
		this[uris_NAME] = newUris;
	}

	addSchema(uri) {
		if (this.uris[uri] === undefined) {
			this.uris[uri] = { tagCounts: {} }
		}
	}

	addTag(uri, xmlTag) {
		if (this.uris[uri].tagCounts[xmlTag] === undefined) {
			this.uris[uri].tagCounts[xmlTag] = 1;
		} else {
			this.uris[uri].tagCounts[xmlTag] += 1;
		}
	}

	visit(node, jsonSchema, xsd) {
		var uri = xsd.uri;
		this.addSchema(uri);
		this.addTag(uri, node.name());
		return true;
	}

	onBegin(jsonSchema, xsd) {
		if (this.uris[xsd.uri] === undefined) {
			return true;
		} else {
			return false;
		}
	}

	dump() {
		Object.keys(this.uris).sort().forEach(function (uri, index, array) {
			console.log(uri);
			console.log("-----------------");
			Object.keys(this.uris[uri].tagCounts).sort().forEach(function (xmlTag, index, array) {
				console.log(xmlTag + " = " + this.uris[uri].tagCounts[xmlTag]);
			}, this)
			console.log();
		}, this);
	}

}

module.exports = XmlUsageVisitor;
