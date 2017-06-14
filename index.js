var Xsd2JsonSchema = require('./src/xsd2JsonSchema');
var XsdFile = require("./src/xmlschema/xsdFileXmlDom");
var JsonSchemaFile = require("./src/jsonschema/jsonSchemaFile");
var BaseConverter = require("./src/baseSpecialCaseIdentifier");
var BaseSpecialCaseIdentifier = require("./src/baseSpecialCaseIdentifier");
var RestrictionConverter = require("./src/restrictionConverter");
var XsdAttributes = require("./src/xmlschema/xsdAttributes");
var JsonElements = require("./src/xmlschema/xsdElements");
var JsonSchemaTypes = require("./src/jsonschema/jsonSchemaTypes");
var JsonSchemaFormats = require("./src/jsonschema/jsonSchemaFormats");

var DefaultConversionVisitor = require('./src/visitors/defaultConversionVisitor');
var BaseConvertionVisitor = require("./src/visitors/baseConversionVisitor");
var XmlUsageVisitor = require('./src/visitors/xmlUsageVisitor');
var XmlUsageVisitorSum = require('./src/visitors/xmlUsageVisitorSum');


// XML Schema modules
module.exports.XsdAttributes = XsdAttributes;
module.exports.XsdFile = XsdFile;

// JSON Schema modules
module.exports.JsonElements = JsonElements;
module.exports.JsonSchemaTypes = JsonSchemaTypes;
module.exports.JsonSchemaFormats = JsonSchemaFormats;

// Visitors
module.exports.DefaultConversionVisitor = DefaultConversionVisitor;
module.exports.BaseConvertionVisitor = BaseConvertionVisitor;
module.exports.XmlUsageVisitor = XmlUsageVisitor;
module.exports.XmlUsageVisitorSum = XmlUsageVisitorSum;

// Core modules
module.exports.Xsd2JsonSchema = Xsd2JsonSchema;
module.exports.JsonSchemaFile = JsonSchemaFile;
module.exports.BaseConverter = BaseConverter;
module.exports.BaseSpecialCaseIdentifier = BaseSpecialCaseIdentifier;
module.exports.RestrictionConverter = RestrictionConverter;

