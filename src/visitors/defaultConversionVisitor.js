'use strict';

var ConverterDraft04 = require('./../converterDraft04');
var BaseConvertionVisitor = require('./baseConversionVisitor');

/**
 * Class representing minimial use of the {@link BaseConversionVisitor#visit|BaseConversionVisitor} class to convert XML Schema
 * to JSON Schema.  {@link BaseConversionVisitor|BaseConversionVisitor} is subclassed and no additional logic is added.
 * The constructor allocates an instance of {@link ConverterDraft04} which is passed to super constructor.
 * 
 * @see {@link XmlUsageVisitor} 
 * @see	{@link XmlUsageVisitorSum}
 */

class DefaultConversionVisitor extends BaseConvertionVisitor {
	/**
	 * Constructs an instance of DefaultConversionVisitor.  Allocates a {@link ConverterDraft04} and passes it to the super constructor.
	 * @constructor
	 */
	constructor() {
		super(new ConverterDraft04());
	}
}

module.exports = DefaultConversionVisitor;