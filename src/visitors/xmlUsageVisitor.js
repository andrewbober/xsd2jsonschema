/**
 *  TBD
 */

"use strict";

function XmlUsageVisitor() {
    var uris = {};

	function addSchema(uri) {
		if (uris[uri] === undefined) {
			uris[uri] = { tagCounts: {} }
		}
	}

	function addTag(uri, xmlTag) {
        if (uris[uri].tagCounts[xmlTag] === undefined) {
			uris[uri].tagCounts[xmlTag] = 1;
        } else {
			uris[uri].tagCounts[xmlTag] += 1;
        }
	}

    this.visit = function (node, jsonSchema, xsd) {
		var uri = xsd.getUri();
		addSchema(uri);
		addTag(uri, node.name());
        return true;
    };

	this.onBegin = function (jsonSchema, xsd) {
		if (uris[xsd.getUri()] === undefined) {
			return true;
		} else {
			return false;
		}
	};

	this.onEnd = function (jsonSchema, xsd) {
	};

	// Default implementaion should be in a base class
	this.enterState = function enterState(node, jsonSchema, xsd) {
	};

	// Default implementaion should be in a base class
	this.exitState = function exitState() {
	};

	this.log = function () {
		Object.keys(uris).sort().forEach(function (uri, index, array) {
			console.log(uri);
			console.log("-----------------");
			Object.keys(uris[uri].tagCounts).sort().forEach(function (xmlTag, index, array) {
				console.log(xmlTag + " = " + uris[uri].tagCounts[xmlTag]);
			})
			console.log();
        });
    }

}

module.exports = XmlUsageVisitor;
