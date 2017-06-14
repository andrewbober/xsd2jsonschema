var RestrictionConverter = require("Xsd2JsonSchema").RestrictionConverter;
var JsonSchemaFile = require("Xsd2JsonSchema").JsonSchemaFile;
var jsonSchemaTypes = require("Xsd2JsonSchema").JsonSchemaTypes;
var jsonSchemaFormats = require("Xsd2JsonSchema").JsonSchemaFormats;

describe("Restriction", function() {
    var rc = new RestrictionConverter();
    var node;
    var jsonSchema;
    var xsd;

  beforeEach(function() {
    node = null
    jsonSchema = new JsonSchemaFile({});
    xsd = null;
  });

  afterEach(function() {
    node = null
    jsonSchema = null;
    xsd = null;
  });


// string
    it("should convert string tags to JSON Schema string type", function() {
        rc.string(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
    });

// boolean
    it("should convert boolean tags to JSON Schema with two potential types (Integer|Boolean) represented with anyOf", function() {
        rc.boolean(node, jsonSchema, xsd);
        expect(jsonSchema.type).toBeUndefined();
        expect(jsonSchema.oneOf.length).toBe(2);
        expect(jsonSchema.oneOf[0].type).toBe(jsonSchemaTypes.BOOLEAN);
        expect(jsonSchema.oneOf[1].type).toBe(jsonSchemaTypes.INTEGER);
    });

// decimal
    it("should convert decimal tags to JSON Schema number type", function() {
        rc.decimal(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.NUMBER);
    });
    
// float
    it("should convert float tags to JSON Schema number type", function() {
        rc.float(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.NUMBER);
    });
    
// double
    it("should convert double tags to JSON Schema number type", function() {
        rc.double(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.NUMBER);
    });
    
// duration
    it("should convert duration tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.duration(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });
    
// dateTime
    it("should convert dateTime tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.dateTime(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // expect(jsonSchema.format).toEqual(jsonSchemaFormats.DATE_TIME);
        expect(jsonSchema.pattern).not.toBeNull();
    });
    
// time
    it("should convert time tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.time(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });
    
// date
    it("should convert date tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.date(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });
    
// gYearMonth
    it("should convert gYearMonth tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.gYearMonth(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });
    
// gYear
    it("should convert gYear tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.gYear(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });

// gMonthDay
    it("should convert gMonthDay tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.gMonthDay(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });

// gDay
    it("should convert gDay tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.gDay(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });

// gMonth
    it("should convert gMonth tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.gMonth(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });
// hexBinary
    it("should convert hexBinary tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.hexBinary(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });
// base64Binary
    it("should convert base64Binary tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.base64Binary(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });

// anyURI
    it("should convert anyURI tags to JSON Schema string type with a JSON Schema format", function() {
        rc.anyURI(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });

// QName
    it("should convert QName tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.QName(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// NOTATION
    it("should convert NOTATION tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.NOTATION(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// normalizedString
    it("should convert normalizedString tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.normalizedString(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// token
    it("should convert normaliztokenedString tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.token(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// language
    it("should convert language tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.language(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.pattern).not.toBeNull();
    });

// NMTOKEN
    it("should convert NMTOKEN tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.NMTOKEN(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// NMTOKENS
    it("should convert NMTOKENS tags to JSON Schema array of NMTOKEN", function() {
        rc.NMTOKENS(node, jsonSchema, xsd);
        expect(jsonSchema.items).not.toBeNull();
        expect(jsonSchema.items.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.items.pattern).not.toBeNull();
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.ARRAY);
    });

// Name
    it("should convert Name tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.Name(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// NCName
    it("should convert NCName tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.NCName(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// ID
    it("should convert ID tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.ID(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// IDREF
    it("should convert IDREF tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.IDREF(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// IDREFS
    it("should convert IDREFS tags to JSON Schema array of IDREF", function() {
        rc.IDREFS(node, jsonSchema, xsd);
        expect(jsonSchema.items).not.toBeNull();
        expect(jsonSchema.items.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.items.pattern).not.toBeNull();
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.ARRAY);
    });

// ENTITY
    it("should convert ENTITY tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.ENTITY(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// ENTITIES
    it("should convert ENTITY tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.ENTITIES(node, jsonSchema, xsd);
        expect(jsonSchema.items).not.toBeNull();
        expect(jsonSchema.items.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.items.pattern).not.toBeNull();
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.ARRAY);
    });

// integer
    it("should convert integer tags to JSON Schema integer type", function() {
        rc.integer(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
    });

// nonPositiveInteger
    it("should convert nonPositiveInteger tags to JSON Schema integer type", function() {
        rc.nonPositiveInteger(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.maximum).toEqual(0);
    });

// negativeInteger
    it("should convert negativeInteger tags to JSON Schema integer type", function() {
        rc.negativeInteger(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.maximum).toEqual(0);
        expect(jsonSchema.exclusiveMinimum).toBe(true);
    });

// long
    it("should convert long tags to JSON Schema integer type", function() {
        rc.long(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(-9223372036854775808);
        expect(jsonSchema.maximum).toEqual(9223372036854775807);
    });

// int
    it("should convert int tags to JSON Schema integer type", function() {
        rc.int(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(-2147483648);
        expect(jsonSchema.maximum).toEqual(2147483647);
    });

// short
    it("should convert short tags to JSON Schema integer type", function() {
        rc.short(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(-32768);
        expect(jsonSchema.maximum).toEqual(32767);
    });

// byte
    it("should convert byte tags to JSON Schema integer type", function() {
        rc.byte(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(-128);
        expect(jsonSchema.maximum).toEqual(127);
    });

// nonNegativeInteger
    it("should convert nonNegativeInteger tags to JSON Schema integer type", function() {
        rc.nonNegativeInteger(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(0);
    });

// unsignedLong
    it("should convert unsignedLong tags to JSON Schema integer type", function() {
        rc.unsignedLong(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(0);
        expect(jsonSchema.maximum).toEqual(18446744073709551615);
    });

// unsignedInt
    it("should convert unsignedInt tags to JSON Schema integer type", function() {
        rc.unsignedInt(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(0);
        expect(jsonSchema.maximum).toEqual(4294967295);
    });

// unsignedShort
    it("should convert unsignedShort tags to JSON Schema integer type", function() {
        rc.unsignedShort(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(0);
        expect(jsonSchema.maximum).toEqual(65535);
    });

// unsignedByte
    it("should convert unsignedByte tags to JSON Schema integer type", function() {
        rc.unsignedByte(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(0);
        expect(jsonSchema.maximum).toEqual(255);
    });

// positiveInteger
    it("should convert positiveInteger tags to JSON Schema integer type", function() {
        rc.positiveInteger(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.INTEGER);
        expect(jsonSchema.minium).toEqual(0);
        expect(jsonSchema.maximum).toEqual(4294967295);
        expect(jsonSchema.exclusiveMinimum).toBe(true);
    });

// yearMonthDuration
    it("should convert yearMonthDuration tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.yearMonthDuration(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        // expect(jsonSchema.pattern).not.toBeNull();
    });

// dateTimeDuration
    it("should convert dateTimeDuration tags to JSON Schema string type with a JSON Schema pattern", function() {
        rc.dateTimeDuration(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        // TODO: once a pattern is utilized in the converter
        expect(jsonSchema.pattern).not.toBeNull();
    });

// dateTimeStamp
    it("should convert dateTimeStamp tags to JSON Schema string type with a JJSON Schema pattern", function() {
        rc.dateTimeStamp(node, jsonSchema, xsd);
        expect(jsonSchema.type).toEqual(jsonSchemaTypes.STRING);
        expect(jsonSchema.format).toEqual(jsonSchemaFormats.DATE_TIME);
    });
    
/*
    it("should identify the following as bad URI values", function(){
        var regex = new RegExp("^(([a-zA-Z][0-9a-zA-Z+\-\.]*:)?\/{0,2}[0-9a-zA-Z;/?:@&=+$\.\-_!~*'()%]+)?(#[0-9a-zA-Z;/?:@&=+$\.\-_!~*'()%]+)?$");
        expect("http://datypic.com#frag1#frag2".match(regex)).not.toBeTruthy();
        expect("#".match(regex)).toBeTruthy();
        expect("##".match(regex)).not.toBeTruthy();
        expect("any_string:anystring".match(regex)).not.toBeTruthy();
        console.log("any_string:anystring = " + "any_string:anystring".match(regex));
        expect("any@string:http".match(regex)).not.toBeTruthy();
        expect("a#a#a".match(regex)).not.toBeTruthy();
    });
*/

})
