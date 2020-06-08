
'use strict';

/**
 * Defines constants for the JSON Schema semantic validation defined formats.  For more information please see:
 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7|Semantic validation with 'format'}
 *
 * @module JsonSchemaFormats
 */

module.exports = {
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.1|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.1|IETF}
	 */
	DATE_TIME: 'date-time',
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.2|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.2|IETF}
	 */
	EMAIL : 'email',
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.3|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.3|IETF}
	 */
	HOSTNAME: 'hostname',
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.4|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.4|IETF}
	 */
	IPV4: 'ipv4',
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.5|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.5|IETF}
	 */
	IPV6: 'ipv6',
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.6|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.6|IETF}
	 */
	URI: 'uri',
	/**
	 * {@link http://json-schema.org/draft-04/json-schema-validation.html#rfc.section.7.3.7|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.7|IETF}
	 */
	URIREF: 'uriref',

	// draft-06 {@link https://json-schema.org/draft-06/json-schema-release-notes.html|Release Notes}
	/**
	 *  Allows relative URI references per RFC 3986; see the section in the draft-06 release notes about "uri" as a format
	 */
	URI_REFERENCE: 'uri-reference',
	/**
	 *  Indicates an RFC 6570 conforming URI Template value, as is used in JSON Hyper-Schema for "href"
	 */
	URI_TEMPLATE: 'uri-template',
	/**
	 *  Indicates a JSON Pointer value such as /foo/bar; do not use this for JSON Pointer URI fragments such as #/foo/bar: the proper format for those is "uri-reference"
	 */
	JSON_POINTER: 'json-pointer',
	/**
	 *  Array of examples with no validation effect; the value of "default" is usable as an example without repeating it under this keyword
	 */
	EXAMPLES: 'examples'
}
