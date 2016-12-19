/**
 *  XML Schema file operations
 */

"use strict";

function DepthFirstTraversal() {

	var walk = function (visitor, node, jsonSchema, xsd) {
		// walk the tree
		if (node !== null) {
			visitor.enterState(node, jsonSchema, xsd);
			var okayToContinue = visitor.visit(node, jsonSchema, xsd);
			if (okayToContinue) {
				var children = xsd.getChildNodes(node);
				if (children !== null && children.length > 0) {
					children.forEach(function (child, index, array) {
						walk(visitor, child, jsonSchema, xsd);
					});
				}
			}
			visitor.exitState();
		}

	};

	this.traverse = function (visitor, jsonSchema, xsd) {
		if (visitor.onBegin(jsonSchema, xsd)) {
			walk(visitor, xsd.schemaElement, jsonSchema, xsd);
		}
		visitor.onEnd(jsonSchema, xsd);
	};

}

module.exports = DepthFirstTraversal;
