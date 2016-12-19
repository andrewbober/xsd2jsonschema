/**
 *  TBD
 */

"use strict";

var BaseConverter = require("./../baseConverter");
var BaseConvertionVisitor = require("./baseConversionVisitor");

class DefaultConversionVisitor extends BaseConvertionVisitor {
	constructor() {
		super(new BaseConverter());
	}
}

module.exports = DefaultConversionVisitor;