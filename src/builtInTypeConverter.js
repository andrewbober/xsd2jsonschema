'use strict';

const debug = require('debug')('xsd2jsonschema:BuiltInTypeConverter');

const CONSTANTS = require('./constants');
const JSON_SCHEMA_TYPES = require('./jsonschema/jsonSchemaTypes');
const JSON_SCHEMA_FORMATS = require('./jsonschema/jsonSchemaFormats');
const JsonSchemaFile = require('./jsonschema/jsonSchemaFile');


const Options_NAME = Symbol();

/**
 * Class representing a collection of XML Handler methods for converting XML Schema built-in types to JSON Schema.
 * Handler methods convert XML Schema built-in simple types to JSON Schema types.  Each hander minimally sets the 
 * JSON Schema *type* attribute to the appropriate JSON Schema built-in type.  Many handlers will further restrict
 * the *type* using a JSON Schmea {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.7|format},
 * a regular expression, or a numeric restriction such as JSON Schema
 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4\minimum} or
 * {@link http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4\maximum}.
 * 
 * Please see: 
 * {@link http://www.w3.org/TR/xmlschema11-2/ |W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes} for 
 * more information.  Section 3 {@link http://www.w3.org/TR/xmlschema11-2/#built-in-datatypes |XML Schema built-in 
 * Datatypes and Their Definitions} has a nice diagram showing the built-in type hierarchy.  Also, 
 * {@link http://www.w3.org/TR/xmlschema-0/ |XML Schema Part 0: Primer Second Edition} has a 
 * {@link http://www.w3.org/TR/xmlschema-0/#simpleTypesTable |reference table} summarizing the XML Schema built-in types.
 */

 class BuiltInTypeConverter {
	constructor(params) {
		if(params != undefined && params.uri != undefined) {
			this.options = {
				uri: params.uri
			}
		} else {
			this.options = {
				uri: CONSTANTS.RFC_3986
			}
		}
	}

	// Getters/Setters

	get options() {
		return this[Options_NAME];
	}
	set options(newOptions) {
		this[Options_NAME] = newOptions;
	}

	// 3.3 Primitive Datatypes: http://www.w3.org/TR/xmlschema11-2/#built-in-primitive-datatypes
	// *****************************************************************************************

	// 3.3.1 string: http://www.w3.org/TR/xmlschema11-2/#string
	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#string |XML Schema String} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema String}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	string(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		return true;
	}

	/*
		// 3.3.2 boolean: http://www.w3.org/TR/xmlschema11-2/#boolean
		/ **
		 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#boolean |XML Schema Boolean} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema Boolean}.
		 * 
		 * @param {Node} node - The current element in xsd being converted.
		 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
		 * @param {XsdFile} xsd - The XML schema file currently being converted.
		 * 
		 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
		 * /
		boolean(node, jsonSchema, xsd) {
			jsonSchema.type = JSON_SCHEMA_TYPES.BOOLEAN;
			return true;
		}
	*/

	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#boolean |XML Schema Boolean} to either a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema Boolean} or {@link http://www.w3.org/TR/xmlschema11-2/#integer JSON Schema Integer} with values limited to 0 or 1.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	boolean(node, jsonSchema, xsd) {
		var booleanSchema = new JsonSchemaFile();
		booleanSchema.type = JSON_SCHEMA_TYPES.BOOLEAN;

		var integerSchema = new JsonSchemaFile();
		integerSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		integerSchema.maximum = 1;
		integerSchema.minimum = 0;

		jsonSchema.oneOf.push(booleanSchema);
		jsonSchema.oneOf.push(integerSchema);
		return true;
	}

	// 3.3.3 decimal: http://www.w3.org/TR/xmlschema11-2/#decimal
	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#decimal |XML Schema Decimal} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema Number}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	decimal(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.NUMBER;
		return true;
	}

	// 3.3.4 float: http://www.w3.org/TR/xmlschema11-2/#float
	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#float |XML Schema Float} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema Number}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	float(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.NUMBER;
		return true;
	}

	// 3.3.5 double: http://www.w3.org/TR/xmlschema11-2/#double
	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#double |XML Schema Double} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema Number}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	double(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.NUMBER;
		return true;
	}

	// 3.3.6 duration: http://www.w3.org/TR/xmlschema11-2/#duration
	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#duration |XML Schema Duration} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema String} 
	 * and utilizes regex to validate the string against the XML Schema duration specification.
	 * 
	 * <pre>
	 * 		jsonSchema.pattern = '^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$';
	 * </pre>
	 * Source: {@link http://www.regexlib.com/REDetails.aspx?regexp_id=1219};
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	duration(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^[-]?P(?!$)(?:\\d+Y)?(?:\\d+M)?(?:\\d+D)?(?:T(?!$)(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$';
		// jsonSchema.description = 'Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=1219';

		//jsonSchema.pattern = '-?P((( [0-9]+Y([0-9]+M)?([0-9]+D)?|([0-9]+M)([0-9]+D)?|([0-9]+D))(T(([0-9]+H)([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\\.[0-9]+)?S)?|([0-9]+(\\.[0-9]+)?S)))?)|(T(([0-9]+H)([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\\.[0-9]+)?S)?|([0-9]+(\\.[0-9]+)?S))))';
		// jsonSchema.description = 'Source:  http://www.w3.org/TR/xmlschema-2/#duration';
		return true;
	}

	// 3.3.7 dateTime: http://www.w3.org/TR/xmlschema11-2/#dateTime
	/**
	 * XML handler method to convert a {@link http://www.w3.org/TR/xmlschema11-2/#dateTime |XML Schema dateTime} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema String} 
	 * and utilizes regex to validate the string against the XML Schema dateTime specification.  Note XML Schema dateTime values are based on ISO 8601 whereas JSON Schema date-time values are based on RFC 3339.
	 * Because of this the regular expression below is used to validate dateTime values converted from XML Schema.
	 * 
	 * <pre>
	 * 		jsonSchema.pattern = ^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$
	 * </pre>
	 * Source: {@link http://www.regexlib.com/REDetails.aspx?regexp_id=1219};
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	dateTime(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?|(24:00:00(\\.0+)?))(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?';
		// jsonSchema.description = 'Source:  http://www.w3.org/TR/xmlschema11-2/#dateTime'
		return true;
	}

	// 3.3.8 time: http://www.w3.org/TR/xmlschema11-2/#time
	time(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?|(24:00:00(\\.0+)?))(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?';
		// jsonSchema.description = 'Source:  http://www.w3.org/TR/xmlschema11-2/#time'
		return true;
	}

	// 3.3.9 date: http://www.w3.org/TR/xmlschema11-2/#date
	date(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?';
		// jsonSchema.description = 'Source:  http://www.w3.org/TR/xmlschema11-2/#date'
		return true;
	}

	// 3.3.10 gYearMonth: http://www.w3.org/TR/xmlschema11-2/#gYearMonth
	gYearMonth(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^(-?[0-9]+-[0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$';
		// jsonSchema.description = 'Source: saxon.sourceforge.net. See net.sf.saxon.value.GYearMonthValue.java';
		return true;
	}

	// 3.3.11 gYear: http://www.w3.org/TR/xmlschema11-2/#gYear
	gYear(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^(-?[0-9]+)(Z|[+-][0-9][0-9]:[0-9][0-9])?$';
		// jsonSchema.description = 'Source: saxon.sourceforge.net. See net.sf.saxon.value.GYearValue.java';
		return true;
	}

	// 3.3.12 gMonthDay: http://www.w3.org/TR/xmlschema11-2/#gMonthDay
	gMonthDay(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^--([0-9][0-9]-[0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$';
		// jsonSchema.description = 'Source: saxon.sourceforge.net. See net.sf.saxon.value.GMonthDayValue.java';
		return true;
	}

	// 3.3.13 gDay: http://www.w3.org/TR/xmlschema11-2/#gDay
	gDay(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^---([0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$';
		// jsonSchema.description = 'Source: saxon.sourceforge.net. See net.sf.saxon.value.GDateValue.java';
		return true;
	}

	// 3.3.14 gMonth: http://www.w3.org/TR/xmlschema11-2/#gMonth
	gMonth(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^--([0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$';
		// jsonSchema.description = 'Source: saxon.sourceforge.net. See net.sf.saxon.value.GMonthValue.java';
		return true;
	}

	// 3.3.15 hexBinary: http://www.w3.org/TR/xmlschema11-2/#hexBinary
	hexBinary(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^([0-9a-fA-F])*$';
		// jsonSchema.description = 'Hex string of any length; source: http://www.regexlib.com/REDetails.aspx?regexp_id=886 also see http://www.datypic.com/sc/xsd/t-xsd_hexBinary.html';
		return true;
	}

	// 3.3.16 base64Binary: http://www.w3.org/TR/xmlschema11-2/#base64Binary
	base64Binary(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$';
		// jsonSchema.description = 'Base64-encoded binary string; source: http://stackoverflow.com/questions/475074/regex-to-parse-or-validate-base64-data also see http://www.schemacentral.com/sc/xsd/t-xsd_base64Binary.html';
		return true;
	}

	// 3.3.17 anyURI: http://www.w3.org/TR/xmlschema11-2/#anyURI
	/**
	 * XML handler method to convert a {@link  http://www.w3.org/TR/xmlschema11-2/#anyURI |XML Schema dateTime} to a {@link https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2 |JSON Schema String} 
	 * and utilizes regex to validate the string against the XML Schema anyURI specification.  Note XML Schema URI values are based on {@link  https://tools.ietf.org/html/rfc2396|RFC2396} whereas JSON Schema URI values are based on {@link  https://tools.ietf.org/html/rfc3986|RFC3986}.
	 * Because of this the regular expression below is used to validate dateTime values converted from XML Schema.
	 * 
	 * <pre>
	 * 		jsonSchema.pattern = ^(([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?\/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?(#[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?$
	 * </pre>
	 * Source: {@link http://lists.xml.org/archives/xml-dev/200108/msg00891.html | Regular expression for URI matching} (28);
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	anyURI_RFC2396(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '^(([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?\\/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*\'()%]+)?(#[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*\'()%]+)?$'
		return true;
	}
	/**
	 * TODO Make this an option for the above implementation
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	anyURI_RFC3986(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.format = JSON_SCHEMA_FORMATS.URI;
		return true;
	}

	/**
	 * TODO Make this an option for the above implementation
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current type from the XML schema file {@link XsdFile|xsd}.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - True.  Subclasses can return false to cancel traversal of {@link XsdFile|xsd}
	 */
	anyURI(node, jsonSchema, xsd) {
		if(this.options.uri === CONSTANTS.RFC_3986) {
			return this.anyURI_RFC3986(node, jsonSchema, xsd);
		} 
		if (this.options.uri === CONSTANTS.RFC_2396) {
			return this.anyURI_RFC2396(node, jsonSchema, xsd);
		}
		debug('Unknown value for options.uri [' + this.options.uri + ']');
		return false;
	}

	// 3.3.18 QName: http://www.w3.org/TR/xmlschema11-2/#QName
	QName(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the QName format.';
		return true;
	}

	// 3.3.19 NOTATION: http://www.w3.org/TR/xmlschema11-2/#NOTATION
	NOTATION(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the NOTATION format.';
		return true;
	}

	// 3.4 Other Built-in Datatypes: http://www.w3.org/TR/xmlschema11-2/#ordinary-built-ins
	// ************************************************************************************

	// 3.4.1 normalizedString: http://www.w3.org/TR/xmlschema11-2/#normalizedString
	normalizedString(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the normalizedString format.';
		return true;
	}

	// 3.4.2 token: http://www.w3.org/TR/xmlschema11-2/#token
	token(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the token format.';
		return true;
	}

	// 3.4.3 language: http://www.w3.org/TR/xmlschema11-2/#language
	language(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.pattern = '[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*';
		// jsonSchema.description = 'Source: saxon.sourceforge.net. See net.sf.saxon.type.StringConverter.java#StringToLanguage';
		return true;
	}

	// 3.4.4 NMTOKEN: http://www.w3.org/TR/xmlschema11-2/#NMTOKEN
	NMTOKEN(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the NMTOKEN format.';
		return true;
	}

	// 3.4.5 NMTOKENS: http://www.w3.org/TR/xmlschema11-2/#NMTOKENS
	NMTOKENS(node, jsonSchema, xsd) {
		var items = new JsonSchemaFile();

		items.type = JSON_SCHEMA_TYPES.STRING
		//items.description = 'TODO: This should have a regex applied to validate the NMTOKEN format.';
		jsonSchema.items = items;
		jsonSchema.type = JSON_SCHEMA_TYPES.ARRAY;
		return true;
	}

	// 3.4.6 Name: http://www.w3.org/TR/xmlschema11-2/#Name
	Name(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the Name format.';
		return true;
	}

	// 3.4.7 NCName: http://www.w3.org/TR/xmlschema11-2/#NCName
	NCName(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the NCName format.';
		return true;
	}

	// 3.4.8 ID: http://www.w3.org/TR/xmlschema11-2/#ID
	ID(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the ID format.';
		return true;
	}

	// 3.4.9 IDREF: http://www.w3.org/TR/xmlschema11-2/#IDREF
	IDREF(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the IDREF format.';
		return true;
	}

	// 3.4.10 IDREFS: http://www.w3.org/TR/xmlschema11-2/#IDREFS
	IDREFS(node, jsonSchema, xsd) {
		var items = new JsonSchemaFile();

		items.type = JSON_SCHEMA_TYPES.STRING
		//items.description = 'TODO: This should have a regex applied to validate the IDREFS format.';
		jsonSchema.items = items;
		jsonSchema.type = JSON_SCHEMA_TYPES.ARRAY;
		return true;
	}

	// 3.4.11 ENTITY: http://www.w3.org/TR/xmlschema11-2/#ENTITY
	ENTITY(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.description = 'TODO: This should have a regex applied to validate the ENTITY format.';
		return true;
	}

	// 3.4.12 ENTITIES: http://www.w3.org/TR/xmlschema11-2/#ENTITIES
	ENTITIES(node, jsonSchema, xsd) {
		var items = new JsonSchemaFile();

		items.type = JSON_SCHEMA_TYPES.STRING
		//items.description = 'TODO: This should have a regex applied to validate the ENTITIES format.';
		jsonSchema.items = items;
		jsonSchema.type = JSON_SCHEMA_TYPES.ARRAY;
		return true;
	}

	// 3.4.13 integer: http://www.w3.org/TR/xmlschema11-2/#integer
	integer(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		return true;
	}

	// 3.4.14 nonPositiveInteger: http://www.w3.org/TR/xmlschema11-2/#nonPositiveInteger
	nonPositiveInteger(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.maximum = 0;
		return true;
	}

	// 3.4.15 negativeInteger: http://www.w3.org/TR/xmlschema11-2/#negativeInteger
	negativeInteger(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.maximum = 0;
		jsonSchema.exclusiveMinimum = true;
		return true;
	}

	// 3.4.16 long: http://www.w3.org/TR/xmlschema11-2/#long
	long(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = -9223372036854775808;
		jsonSchema.maximum = 9223372036854775807;
		return true;
	}

	// 3.4.17 int: http://www.w3.org/TR/xmlschema11-2/#int
	int(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = -2147483648;
		jsonSchema.maximum = 2147483647;
		return true;
	}

	// 3.4.18 short: http://www.w3.org/TR/xmlschema11-2/#short
	short(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = -32768;
		jsonSchema.maximum = 32767;
		return true;
	}

	// 3.4.19 byte: http://www.w3.org/TR/xmlschema11-2/#byte
	byte(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = -128;
		jsonSchema.maximum = 127;
		return true;
	}

	// 3.4.20 nonNegativeInteger: http://www.w3.org/TR/xmlschema11-2/#nonNegativeInteger
	nonNegativeInteger(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = 0;
		return true;
	}

	// 3.4.21 unsignedLong: http://www.w3.org/TR/xmlschema11-2/#unsignedLong
	unsignedLong(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 18446744073709551615;
		return true;
	}

	// 3.4.22 unsignedInt: http://www.w3.org/TR/xmlschema11-2/#unsignedInt
	unsignedInt(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 4294967295;
		return true;
	}

	// 3.4.23 unsignedShort: http://www.w3.org/TR/xmlschema11-2/#unsignedShort
	unsignedShort(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 65535;
		return true;
	}

	// 3.4.24 unsignedByte: http://www.w3.org/TR/xmlschema11-2/#unsignedByte
	unsignedByte(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 255;
		return true;
	}

	// 3.4.25 positiveInteger: http://www.w3.org/TR/xmlschema11-2/#positiveInteger
	positiveInteger(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 4294967295;
		jsonSchema.exclusiveMinimum = true;
		return true;
	}

	// 3.4.26 yearMonthDuration: http://www.w3.org/TR/xmlschema11-2/#yearMonthDuration
	yearMonthDuration(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		// jsonSchema.pattern = '^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$';
		// jsonSchema.description = 'TODO: (modify) The pattern above: Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=1219';
		return true;
	}

	// 3.4.27 dayTimeDuration: http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration
	dateTimeDuration(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		//jsonSchema.pattern = '^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$';
		// jsonSchema.description = 'TODO: (modify) The pattern above: Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=1219';
		return true;
	}

	// 3.4.28 dateTimeStamp: http://www.w3.org/TR/xmlschema11-2/#dateTimeStamp
	dateTimeStamp(node, jsonSchema, xsd) {
		jsonSchema.type = JSON_SCHEMA_TYPES.STRING;
		jsonSchema.format = JSON_SCHEMA_FORMATS.DATE_TIME;
		return true;
	}
}

module.exports = BuiltInTypeConverter;