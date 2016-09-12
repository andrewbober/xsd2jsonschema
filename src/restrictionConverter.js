/**
 *  Converts XML Schema built-in simple types to JSON Schema.
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

var jsonTypes = require('./jsonTypes');
var JsonSchemaFile = require("./jsonSchemaFile");

function RestrictionConverter() {

	// 3.3 Primitive Datatypes: http://www.w3.org/TR/xmlschema11-2/#built-in-primitive-datatypes
	// *****************************************************************************************

	// 3.3.1 string: http://www.w3.org/TR/xmlschema11-2/#string
	this.string = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		return true;
	};

	// 3.3.2 boolean: http://www.w3.org/TR/xmlschema11-2/#boolean
	this.boolean = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.BOOLEAN);
		return true;
	};

	// 3.3.3 decimal: http://www.w3.org/TR/xmlschema11-2/#decimal
	this.decimal = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.NUMBER);
		return true;
	};

	// 3.3.4 float: http://www.w3.org/TR/xmlschema11-2/#float
	this.float = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.NUMBER);
		return true;
	};

	// 3.3.5 double: http://www.w3.org/TR/xmlschema11-2/#double
	this.double = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.NUMBER);
		return true;
	};

	// 3.3.6 duration: http://www.w3.org/TR/xmlschema11-2/#duration
	this.duration = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^[-]?P(?!$)(?:\\d+Y)?(?:\\d+M)?(?:\\d+D)?(?:T(?!$)(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$");
		// jsonSchema.setDescription("Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regxlib.com/REDetails.aspx?regexp_id=1219");
		return true;
	};

	// 3.3.7 dateTime: http://www.w3.org/TR/xmlschema11-2/#dateTime
	this.dateTime = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setFormat("date-time")
		return true;
	};

	// 3.3.8 time: http://www.w3.org/TR/xmlschema11-2/#time
	this.time = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^(24:00(:00(\\.[0]+)?)?|(([0-1][0-9]|2[0-3])(:)[0-5][0-9])((:)[0-5][0-9](\\.[\\d]+)?)?)((\\+|-)(14:00|(0[0-9]|1[0-3])(:)[0-5][0-9])|Z)$");
		// jsonSchema.setDescription("This is a regular expression to check for a properly formatted time according to the international date and time notation ISO 8601.  Time portion taken from the source sited.  Source: http://www.regxlib.com/REDetails.aspx?regexp_id=2219");
		return true;
	};

	// 3.3.9 date: http://www.w3.org/TR/xmlschema11-2/#date
	this.date = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^(?:(?=[02468][048]00|[13579][26]00|[0-9][0-9]0[48]|[0-9][0-9][2468][048]|[0-9][0-9][13579][26])\\d{4}(?:(-|)(?:(?:00[1-9]|0[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-6])|(?:01|03|05|07|08|10|12)(?:\\1(?:0[1-9]|[12][0-9]|3[01]))?|(?:04|06|09|11)(?:\\1(?:0[1-9]|[12][0-9]|30))?|02(?:\\1(?:0[1-9]|[12][0-9]))?|W(?:0[1-9]|[1-4][0-9]|5[0-3])(?:\\1[1-7])?))?)$|^(?:(?![02468][048]00|[13579][26]00|[0-9][0-9]0[48]|[0-9][0-9][2468][048]|[0-9][0-9][13579][26])\\d{4}(?:(-|)(?:(?:00[1-9]|0[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|36[0-5])|(?:01|03|05|07|08|10|12)(?:\\2(?:0[1-9]|[12][0-9]|3[01]))?|(?:04|06|09|11)(?:\\2(?:0[1-9]|[12][0-9]|30))?|(?:02)(?:\\2(?:0[1-9]|1[0-9]|2[0-8]))?|W(?:0[1-9]|[1-4][0-9]|5[0-3])(?:\\2[1-7])?))?)$");
		// jsonSchema.setDescription("Validate a date according to the ISO 8601 standard (no time part) considering long-short months to allow 31st day of month and leap years to allow 29th February.  Source: http://regexlib.com/REDetails.aspx?regexp_id=3344");
		return true;
	};

	// 3.3.10 gYearMonth: http://www.w3.org/TR/xmlschema11-2/#gYearMonth
	this.gYearMonth = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^(-?[0-9]+-[0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$");
		// jsonSchema.setDescription("Source: saxon.sourceforge.net. See net.sf.saxon.value.GYearMonthValue.java");
		return true;
	};

	// 3.3.11 gYear: http://www.w3.org/TR/xmlschema11-2/#gYear
	this.gYear = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^(-?[0-9]+)(Z|[+-][0-9][0-9]:[0-9][0-9])?$");
		// jsonSchema.setDescription("Source: saxon.sourceforge.net. See net.sf.saxon.value.GYearValue.java");
		return true;
	};

	// 3.3.12 gMonthDay: http://www.w3.org/TR/xmlschema11-2/#gMonthDay
	this.gMonthDay = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^--([0-9][0-9]-[0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$");
		// jsonSchema.setDescription("Source: saxon.sourceforge.net. See net.sf.saxon.value.GMonthDayValue.java");
		return true;
	};

	// 3.3.13 gDay: http://www.w3.org/TR/xmlschema11-2/#gDay
	this.gDay = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^---([0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$");
		// jsonSchema.setDescription("Source: saxon.sourceforge.net. See net.sf.saxon.value.GDateValue.java");
		return true;
	};

	// 3.3.14 gMonth: http://www.w3.org/TR/xmlschema11-2/#gMonth
	this.gMonth = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^--([0-9][0-9])(Z|[+-][0-9][0-9]:[0-9][0-9])?$");
		// jsonSchema.setDescription("Source: saxon.sourceforge.net. See net.sf.saxon.value.GMonthValue.java");
		return true;
	};

	// 3.3.15 hexBinary: http://www.w3.org/TR/xmlschema11-2/#hexBinary
	this.hexBinary = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^([0-9a-fA-F])*$");
		// jsonSchema.setDescription("Hex string of any length; source: http://www.regxlib.com/REDetails.aspx?regexp_id=886 also see http://www.datypic.com/sc/xsd/t-xsd_hexBinary.html");
		return true;
	};

	// 3.3.16 base64Binary: http://www.w3.org/TR/xmlschema11-2/#base64Binary
	this.base64Binary = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");
		// jsonSchema.setDescription("Base64-encoded binary string; source: http://stackoverflow.com/questions/475074/regex-to-parse-or-validate-base64-data also see http://www.schemacentral.com/sc/xsd/t-xsd_base64Binary.html");
		return true;
	};

	// 3.3.17 anyURI: http://www.w3.org/TR/xmlschema11-2/#anyURI
	this.anyURI = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setFormat("uri");
		return true;
	};

	// 3.3.18 QName: http://www.w3.org/TR/xmlschema11-2/#QName
	this.QName = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the QName format.");
		return true;
	};

	// 3.3.19 NOTATION: http://www.w3.org/TR/xmlschema11-2/#NOTATION
	this.NOTATION = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the NOTATION format.");
		return true;
	};

	// 3.4 Other Built-in Datatypes: http://www.w3.org/TR/xmlschema11-2/#ordinary-built-ins
	// ************************************************************************************

	// 3.4.1 normalizedString: http://www.w3.org/TR/xmlschema11-2/#normalizedString
	this.normalizedString = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the normalizedString format.");
		return true;
	};

	// 3.4.2 token: http://www.w3.org/TR/xmlschema11-2/#token
	this.token = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the token format.");
		return true;
	};

	// 3.4.3 language: http://www.w3.org/TR/xmlschema11-2/#language
	this.language = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setPattern("[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*");
		// jsonSchema.setDescription("Source: saxon.sourceforge.net. See net.sf.saxon.type.StringConverter.java#StringToLanguage");
		return true;
	};

	// 3.4.4 NMTOKEN: http://www.w3.org/TR/xmlschema11-2/#NMTOKEN
	this.NMTOKEN = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the NMTOKEN format.");
		return true;
	};

	// 3.4.5 NMTOKENS: http://www.w3.org/TR/xmlschema11-2/#NMTOKENS
	this.NMTOKENS = function (node, jsonSchema, xsd) {
		var items = new JsonSchemaFile({});

		items.setType(jsonTypes.STRING)
		//items.setDescription("TODO: This should have a regex applied to validate the NMTOKEN format.");
		jsonSchema.setItems(items);
		jsonSchema.setType(jsonTypes.ARRAY);
		return true;
	};
	
	// 3.4.6 Name: http://www.w3.org/TR/xmlschema11-2/#Name
	this.Name = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the Name format.");
		return true;
	};

	// 3.4.7 NCName: http://www.w3.org/TR/xmlschema11-2/#NCName
	this.NCName = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the NCName format.");
		return true;
	};

	// 3.4.8 ID: http://www.w3.org/TR/xmlschema11-2/#ID
	this.ID = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the ID format.");
		return true;
	};

	// 3.4.9 IDREF: http://www.w3.org/TR/xmlschema11-2/#IDREF
	this.IDREF = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the IDREF format.");
		return true;
	};

	// 3.4.10 IDREFS: http://www.w3.org/TR/xmlschema11-2/#IDREFS
	this.IDREFS = function (node, jsonSchema, xsd) {
		var items = new JsonSchemaFile({});

		items.setType(jsonTypes.STRING)
		//items.setDescription("TODO: This should have a regex applied to validate the IDREFS format.");
		jsonSchema.setItems(items);
		jsonSchema.setType(jsonTypes.ARRAY);
		return true;
	};

	// 3.4.11 ENTITY: http://www.w3.org/TR/xmlschema11-2/#ENTITY
	this.ENTITY = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setDescription("TODO: This should have a regex applied to validate the ENTITY format.");
		return true;
	};

	// 3.4.12 ENTITIES: http://www.w3.org/TR/xmlschema11-2/#ENTITIES
	this.ENTITIES = function (node, jsonSchema, xsd) {
		var items = new JsonSchemaFile({});

		items.setType(jsonTypes.STRING)
		//items.setDescription("TODO: This should have a regex applied to validate the ENTITIES format.");
		jsonSchema.setItems(items);
		jsonSchema.setType(jsonTypes.ARRAY);
		return true;
	};

	// 3.4.13 integer: http://www.w3.org/TR/xmlschema11-2/#integer
	this.integer = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		return true;
	};

	// 3.4.14 nonPositiveInteger: http://www.w3.org/TR/xmlschema11-2/#nonPositiveInteger
	this.nonPositiveInteger = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMaximum(0);
		return true;
	};

	// 3.4.15 negativeInteger: http://www.w3.org/TR/xmlschema11-2/#negativeInteger
	this.negativeInteger = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMaximum(0);
		jsonSchema.setExclusiveMinimum(true);
		return true;
	};

	// 3.4.16 long: http://www.w3.org/TR/xmlschema11-2/#long
	this.long = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(-9223372036854775808);
		jsonSchema.setMaximum(9223372036854775807);
		return true;
	};

	// 3.4.17 int: http://www.w3.org/TR/xmlschema11-2/#int
	this.int = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(-2147483648);
		jsonSchema.setMaximum(2147483647);
		return true;
	};

	// 3.4.18 short: http://www.w3.org/TR/xmlschema11-2/#short
	this.short = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(-32768);
		jsonSchema.setMaximum(32767);
		return true;
	};

	// 3.4.19 byte: http://www.w3.org/TR/xmlschema11-2/#byte
	this.byte = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(-128);
		jsonSchema.setMaximum(127);
		return true;
	};

	// 3.4.20 nonNegativeInteger: http://www.w3.org/TR/xmlschema11-2/#nonNegativeInteger
	this.nonNegativeInteger = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(0);
		return true;
	};

	// 3.4.21 unsignedLong: http://www.w3.org/TR/xmlschema11-2/#unsignedLong
	this.unsignedLong = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(0);
		jsonSchema.setMaximum(18446744073709551615);
		return true;
	};

	// 3.4.22 unsignedInt: http://www.w3.org/TR/xmlschema11-2/#unsignedInt
	this.unsignedInt = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(0);
		jsonSchema.setMaximum(4294967295);
		return true;
	};

	// 3.4.23 unsignedShort: http://www.w3.org/TR/xmlschema11-2/#unsignedShort
	this.unsignedShort = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(0);
		jsonSchema.setMaximum(65535);
		return true;
	};

	// 3.4.24 unsignedByte: http://www.w3.org/TR/xmlschema11-2/#unsignedByte
	this.unsignedByte = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(0);
		jsonSchema.setMaximum(255);
		return true;
	};

	// 3.4.25 positiveInteger: http://www.w3.org/TR/xmlschema11-2/#positiveInteger
	this.positiveInteger = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.INTEGER);
		jsonSchema.setMinium(0);
		jsonSchema.setExclusiveMinimum(true);
		return true;
	};

	// 3.4.26 yearMonthDuration: http://www.w3.org/TR/xmlschema11-2/#yearMonthDuration
	this.yearMonthDuration = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		// jsonSchema.setPattern("^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$");
		// jsonSchema.setDescription("TODO: (modify) The pattern above: Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regxlib.com/REDetails.aspx?regexp_id=1219");
		return true;
	};

	// 3.4.27 dayTimeDuration: http://www.w3.org/TR/xmlschema11-2/#dayTimeDuration
	this.dateTimeDuration = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		//jsonSchema.setPattern("^[-]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?!$)(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$");
		// jsonSchema.setDescription("TODO: (modify) The pattern above: Matches the XSD schema duration built in type as defined by http://www.w3.org/TR/xmlschema-2/#duration.  Source: http://www.regxlib.com/REDetails.aspx?regexp_id=1219");
		return true;
	};

	// 3.4.28 dateTimeStamp: http://www.w3.org/TR/xmlschema11-2/#dateTimeStamp
	this.dateTimeStamp = function (node, jsonSchema, xsd) {
		jsonSchema.setType(jsonTypes.STRING);
		jsonSchema.setFormat("date-time")
		return true;
	};
}

module.exports = RestrictionConverter;
