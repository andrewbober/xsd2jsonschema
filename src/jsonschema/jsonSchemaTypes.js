'use strict';

/**
 * Defines constants for the JSON Schema primitive types.  For more information please see
 * {@link http://json-schema.org/latest/json-schema-core.html#rfc.section.4.2}
 * 
 * @module JsonSchemaTypes
 */

module.exports = {
	/**
	 * Indicates a JSON Schema array type.
	 */
	ARRAY: 'array',
	/**
	 * Indicates a JSON Schema boolean type.
	 */
	BOOLEAN: 'boolean',
	/**
	 * Indicates a JSON Schema integer type.
	 */
	INTEGER: 'integer',
	/**
	 * Indicates a JSON Schema number type.
	 */
	NUMBER: 'number',
	/**
	 * Indicates a JSON Schema null type.
	 */
	NULL: 'null',
	/**
	 * Indicates a JSON Schema object type.
	 */
	OBJECT: 'object',
	/**
	 * Indicates a JSON Schema string type.
	 */
	STRING: 'string'
}