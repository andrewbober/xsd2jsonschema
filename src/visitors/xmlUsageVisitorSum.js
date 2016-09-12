/**
 *  TBD
 */

"use strict";

function XmlUsageVisitorSum() {
    var uris = {};
	var tagCounts = {};

	function addSchema(uri) {
		if (uris[uri] === undefined) {
			uris[uri] = { tagCounts: {} }
		}
	}

	function addTag(xmlTag) {
        if (tagCounts[xmlTag] === undefined) {
			tagCounts[xmlTag] = 1;
        } else {
			tagCounts[xmlTag] += 1;
        }
	}

    this.visit = function (node, jsonSchema, xsd) {
		var uri = xsd.getUri();
		addSchema(uri);
		addTag(node.name());
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
		console.log("----------------------------");
		console.log("Overall XML Schema Tag Usage");
		console.log("----------------------------");
		console.log(Object.keys(uris));
		console.log("----------------------------");
		Object.keys(tagCounts).sort().forEach(function (xmlTag, index, array) {
			console.log(xmlTag + " = " + tagCounts[xmlTag]);
		})
		console.log();
    }
}

module.exports = XmlUsageVisitorSum;
