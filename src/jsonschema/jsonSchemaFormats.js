
'use strict';

/**
 * Defines constants for the JSON Schema semantic validation defined formats.  For more information please see:
 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7|Semantic validation with 'format'}
 *
 * @module JsonSchemaFormats
 */

module.exports = {
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.1|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.1|IETF}
	 */
	DATE_TIME: 'date-time',
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.2|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.2|IETF}
	 */
	EMAIL : 'email',
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.3|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.3|IETF}
	 */
	HOSTNAME: 'hostname',
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.4|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.4|IETF}
	 */
	IPV4: 'ipv4',
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.5|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.5|IETF}
	 */
	IPV6: 'ipv6',
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.6|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.6|IETF}
	 */
	URI: 'uri',
	/**
	 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.3.7|main site}|
	 * {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00#section-7.3.7|IETF}
	 */
	URIREF: 'uriref'
}