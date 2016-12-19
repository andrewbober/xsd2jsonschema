/**
 *  Converts XML Schema built-in simple types to JSON Schema types.
 * 
 *  Please see: W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes
 *  http://www.w3.org/TR/xmlschema11-2/
 * 
 *  Section 3 Built-in Datatypes and Their Definitions: A nice diagram showing the built-in 
 *  type hhierarchy s available at: http://www.w3.org/TR/xmlschema11-2/#built-in-datatypes
 * 
 * 	XML Schema Part 0: Primer Second Edition has a reference table summerizing the 
 *  built-in types: http://www.w3.org/TR/xmlschema-0/#simpleTypesTable
 */

// "use strict";

var jsonSchemaTypes = require("./jsonSchemaTypes");
var jsonSchemaFormats = require("./jsonSchemaFormats");
var JsonSchemaFile = require("./jsonSchemaFile");


class RestrictionConverterClass {

	// 3.3 Primitive Datatypes: http://www.w3.org/TR/xmlschema11-2/#built-in-primitive-datatypes
	// *****************************************************************************************

	// 3.3.1 string: http://www.w3.org/TR/xmlschema11-2/#string
	string(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		return true;
	}

	// 3.3.2 boolean: http://www.w3.org/TR/xmlschema11-2/#boolean
	boolean(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.BOOLEAN;
		return true;
	}

	// 3.3.3 decimal: http://www.w3.org/TR/xmlschema11-2/#decimal
	decimal(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.NUMBER;
		return true;
	}

	// 3.3.4 float: http://www.w3.org/TR/xmlschema11-2/#float
	float(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.NUMBER;
		return true;
	}

	// 3.3.5 double: http://www.w3.org/TR/xmlschema11-2/#double
	double(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.NUMBER;
		return true;
	}

	// 3.3.6 duration: http://www.w3.org/TR/xmlschema11-2/#duration
	duration(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern= "^[-]?P(?!$)(?:\\d+Y)?(?:\\d+M)?(?:\\d+D)?(?:T(?!$)(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$";
		// jsonSchema.description = "Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=1219";
		return true;
	}

	// 3.3.7 dateTime: http://www.w3.org/TR/xmlschema11-2/#dateTime
	dateTime(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.format = jsonSchemaFormats.DATE_TIME;
		return true;
	}

	// 3.3.8 time: http://www.w3.org/TR/xmlschema11-2/#time
	time(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^(24:00(:00(\\.[0]+)?)?|(([0-1][0-9]|2[0-3])(:)[0-5][0-9])((:)[0-5][0-9](\\.[\\d]+)?)?)((\\+|-)(14:00|(0[0-9]|1[0-3])(:)[0-5][0-9])|Z)$";
		// jsonSchema.description = "This is a regular expression to check for a properly formatted time according to the international date and time notation ISO 8601.  Time portion taken from the source sited.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=2219";
		return true;
	}

	// 3.3.9 date: http://www.w3.org/TR/xmlschema11-2/#date
	date(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^(?:(?=[02468][048]00|[13579][26]00|[0-9][0-9]0[48]|[0-9][0-9][2468][048]|[0-9][0-9][13579][26])\\d{4}(?:(-|)(?:(?:00[1-9]|0[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-6])|(?:01|03|05|07|08|10|12)(?:\\1(?:0[1-9]|[12][0-9]|3[01]))?|(?:04|06|09|11)(?:\\1(?:0[1-9]|[12][0-9]|30))?|02(?:\\1(?:0[1-9]|[12][0-9]))?|W(?:0[1-9]|[1-4][0-9]|5[0-3])(?:\\1[1-7])?))?)$|^(?:(?![02468][048]00|[13579][26]00|[0-9][0-9]0[48]|[0-9][0-9][2468][048]|[0-9][0-9][13579][26])\\d{4}(?:(-|)(?:(?:00[1-9]|0[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-5])|(?:01|03|05|07|08|10|12)(?:\\2(?:0[1-9]|[12][0-9]|3[01]))?|(?:04|06|09|11)(?:\\2(?:0[1-9]|[12][0-9]|30))?|(?:02)(?:\\2(?:0[1-9]|1[0-9]|2[0-8]))?|W(?:0[1-9]|[1-4][0-9]|5[0-3])(?:\\2[1-7])?))?)$";
		// jsonSchema.description = "Validate a date according to the ISO 8601 standard (no time part) considering long-short months to allow 31st day of month and leap years to allow 29th February.  Source: http://regexlib.com/REDetails.aspx?regexp_id=3344";
		return true;
	}

	// 3.3.10 gYearMonth: http://www.w3.org/TR/xmlschema11-2/#gYearMonth
	gYearMonth(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^(-?[0-9]+-[0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$";
		// jsonSchema.description = "Source: saxon.sourceforge.net. See net.sf.saxon.value.GYearMonthValue.java";
		return true;
	}

	// 3.3.11 gYear: http://www.w3.org/TR/xmlschema11-2/#gYear
	gYear(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^(-?[0-9]+)(Z|[+-][0-9][0-9]:[0-9][0-9])?$";
		// jsonSchema.description = "Source: saxon.sourceforge.net. See net.sf.saxon.value.GYearValue.java";
		return true;
	}

	// 3.3.12 gMonthDay: http://www.w3.org/TR/xmlschema11-2/#gMonthDay
	gMonthDay(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^--([0-9][0-9]-[0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$";
		// jsonSchema.description = "Source: saxon.sourceforge.net. See net.sf.saxon.value.GMonthDayValue.java";
		return true;
	}

	// 3.3.13 gDay: http://www.w3.org/TR/xmlschema11-2/#gDay
	gDay(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^---([0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$";
		// jsonSchema.description = "Source: saxon.sourceforge.net. See net.sf.saxon.value.GDateValue.java";
		return true;
	}

	// 3.3.14 gMonth: http://www.w3.org/TR/xmlschema11-2/#gMonth
	gMonth(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^--([0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$";
		// jsonSchema.description = "Source: saxon.sourceforge.net. See net.sf.saxon.value.GMonthValue.java";
		return true;
	}

	// 3.3.15 hexBinary: http://www.w3.org/TR/xmlschema11-2/#hexBinary
	hexBinary(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^([0-9a-fA-F])*$";
		// jsonSchema.description = "Hex string of any length; source: http://www.regexlib.com/REDetails.aspx?regexp_id=886 also see http://www.datypic.com/sc/xsd/t-xsd_hexBinary.html";
		return true;
	}

	// 3.3.16 base64Binary: http://www.w3.org/TR/xmlschema11-2/#base64Binary
	base64Binary(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$";
		// jsonSchema.description = "Base64-encoded binary string; source: http://stackoverflow.com/questions/475074/regex-to-parse-or-validate-base64-data also see http://www.schemacentral.com/sc/xsd/t-xsd_base64Binary.html";
		return true;
	}

	// 3.3.17 anyURI: http://www.w3.org/TR/xmlschema11-2/#anyURI
	anyURI(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.format = jsonSchemaFormats.URI;
		return true;
	}

	// 3.3.18 QName: http://www.w3.org/TR/xmlschema11-2/#QName
	QName(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the QName format.";
		return true;
	}

	// 3.3.19 NOTATION: http://www.w3.org/TR/xmlschema11-2/#NOTATION
	NOTATION(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the NOTATION format.";
		return true;
	}

	// 3.4 Other Built-in Datatypes: http://www.w3.org/TR/xmlschema11-2/#ordinary-built-ins
	// ************************************************************************************

	// 3.4.1 normalizedString: http://www.w3.org/TR/xmlschema11-2/#normalizedString
	normalizedString(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the normalizedString format.";
		return true;
	}

	// 3.4.2 token: http://www.w3.org/TR/xmlschema11-2/#token
	token(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the token format.";
		return true;
	}

	// 3.4.3 language: http://www.w3.org/TR/xmlschema11-2/#language
	language(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.pattern = "[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*";
		// jsonSchema.description = "Source: saxon.sourceforge.net. See net.sf.saxon.type.StringConverter.java#StringToLanguage";
		return true;
	}

	// 3.4.4 NMTOKEN: http://www.w3.org/TR/xmlschema11-2/#NMTOKEN
	NMTOKEN(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the NMTOKEN format.";
		return true;
	}

	// 3.4.5 NMTOKENS: http://www.w3.org/TR/xmlschema11-2/#NMTOKENS
	NMTOKENS(node, jsonSchema, xsd) {
		var items = new JsonSchemaFile({});

		items.type = jsonSchemaTypes.STRING
		//items.description = "TODO: This should have a regex applied to validate the NMTOKEN format.";
		jsonSchema.items = items;
		jsonSchema.type = jsonSchemaTypes.ARRAY;
		return true;
	}
	
	// 3.4.6 Name: http://www.w3.org/TR/xmlschema11-2/#Name
	Name(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the Name format.";
		return true;
	}

	// 3.4.7 NCName: http://www.w3.org/TR/xmlschema11-2/#NCName
	NCName(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the NCName format.";
		return true;
	}

	// 3.4.8 ID: http://www.w3.org/TR/xmlschema11-2/#ID
	ID(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the ID format.";
		return true;
	}

	// 3.4.9 IDREF: http://www.w3.org/TR/xmlschema11-2/#IDREF
	IDREF(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the IDREF format.";
		return true;
	}

	// 3.4.10 IDREFS: http://www.w3.org/TR/xmlschema11-2/#IDREFS
	IDREFS(node, jsonSchema, xsd) {
		var items = new JsonSchemaFile({});

		items.type = jsonSchemaTypes.STRING
		//items.description = "TODO: This should have a regex applied to validate the IDREFS format.";
		jsonSchema.items = items;
		jsonSchema.type = jsonSchemaTypes.ARRAY;
		return true;
	}

	// 3.4.11 ENTITY: http://www.w3.org/TR/xmlschema11-2/#ENTITY
	ENTITY(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.description = "TODO: This should have a regex applied to validate the ENTITY format.";
		return true;
	}

	// 3.4.12 ENTITIES: http://www.w3.org/TR/xmlschema11-2/#ENTITIES
	ENTITIES(node, jsonSchema, xsd) {
		var items = new JsonSchemaFile({});

		items.type = jsonSchemaTypes.STRING
		//items.description = "TODO: This should have a regex applied to validate the ENTITIES format.";
		jsonSchema.items = items;
		jsonSchema.type = jsonSchemaTypes.ARRAY;
		return true;
	}

	// 3.4.13 integer: http://www.w3.org/TR/xmlschema11-2/#integer
	integer(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		return true;
	}

	// 3.4.14 nonPositiveInteger: http://www.w3.org/TR/xmlschema11-2/#nonPositiveInteger
	nonPositiveInteger(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.maximum = 0;
		return true;
	}

	// 3.4.15 negativeInteger: http://www.w3.org/TR/xmlschema11-2/#negativeInteger
	negativeInteger(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.maximum = 0;
		jsonSchema.exclusiveMinimum = true;
		return true;
	}

	// 3.4.16 long: http://www.w3.org/TR/xmlschema11-2/#long
	long(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = -9223372036854775808;
		jsonSchema.maximum =9223372036854775807;
		return true;
	}

	// 3.4.17 int: http://www.w3.org/TR/xmlschema11-2/#int
	int(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = -2147483648;
		jsonSchema.maximum = 2147483647;
		return true;
	}

	// 3.4.18 short: http://www.w3.org/TR/xmlschema11-2/#short
	short(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = -32768;
		jsonSchema.maximum = 32767;
		return true;
	}

	// 3.4.19 byte: http://www.w3.org/TR/xmlschema11-2/#byte
	byte(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = -128;
		jsonSchema.maximum = 127;
		return true;
	}

	// 3.4.20 nonNegativeInteger: http://www.w3.org/TR/xmlschema11-2/#nonNegativeInteger
	nonNegativeInteger(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = 0;
		return true;
	}

	// 3.4.21 unsignedLong: http://www.w3.org/TR/xmlschema11-2/#unsignedLong
	unsignedLong(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 18446744073709551615;
		return true;
	}

	// 3.4.22 unsignedInt: http://www.w3.org/TR/xmlschema11-2/#unsignedInt
	unsignedInt(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 4294967295;
		return true;
	}

	// 3.4.23 unsignedShort: http://www.w3.org/TR/xmlschema11-2/#unsignedShort
	unsignedShort(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 65535;
		return true;
	}

	// 3.4.24 unsignedByte: http://www.w3.org/TR/xmlschema11-2/#unsignedByte
	unsignedByte(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 255;
		return true;
	}

	// 3.4.25 positiveInteger: http://www.w3.org/TR/xmlschema11-2/#positiveInteger
	positiveInteger(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.INTEGER;
		jsonSchema.minium = 0;
		jsonSchema.maximum = 4294967295;
		jsonSchema.exclusiveMinimum = true;
		return true;
	}

	// 3.4.26 yearMonthDuration: http://www.w3.org/TR/xmlschema11-2/#yearMonthDuration
	yearMonthDuration(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		// jsonSchema.pattern = "^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$";
		// jsonSchema.description = "TODO: (modify) The pattern above: Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=1219";
		return true;
	}

	// 3.4.27 dayTimeDuration: http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration
	dateTimeDuration(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		//jsonSchema.pattern = "^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$";
		// jsonSchema.description = "TODO: (modify) The pattern above: Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regexlib.com/REDetails.aspx?regexp_id=1219";
		return true;
	}

	// 3.4.28 dateTimeStamp: http://www.w3.org/TR/xmlschema11-2/#dateTimeStamp
	dateTimeStamp(node, jsonSchema, xsd) {
		jsonSchema.type = jsonSchemaTypes.STRING;
		jsonSchema.format = jsonSchemaFormats.DATE_TIME;
		return true;
	}
}

module.exports = RestrictionConverterClass;
