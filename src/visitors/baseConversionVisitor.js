/**
 *  TBD
 */

"use strict";

var parsingState = require("./../parsingState");



var converter_NAME = Symbol();

class BaseConversionVisitor {
	constructor(converter) {
		this.converter = converter;
	}

	get converter() {
		return this[converter_NAME];
	}

	set converter(newConverter) {
		this[converter_NAME] = newConverter;
	}

	visit(node, jsonSchema, xsd) {
		try {
			return this.converter.convert(node, jsonSchema, xsd);
		} catch (err) {
			console.log(err.stack);
			parsingState.dumpStates(xsd.baseFilename);
			xsd.dumpNode(node);
			return false; //throw err;
		}
	}

	enterState(node, jsonSchema, xsd) {
		var state = {
			name: xsd.getNodeName(node),
			workingJsonSchema: undefined
		}
		parsingState.enterState(state);
	}

	exitState() {
		var state = parsingState.exitState();
		if (state.workingJsonSchema !== undefined) {
			this.converter.workingJsonSchema = state.workingJsonSchema;
		}
	}

	onBegin(jsonSchema, xsd) {
		/*
				console.log("\n\n****************************************************************************************************");
				console.log("Converting " + xsd.getBaseFilename());
				console.log("****************************************************************************************************\n");
		*/
		return true;
	}

	onEnd(jsonSchema, xsd) {
	}

}

module.exports = BaseConversionVisitor;