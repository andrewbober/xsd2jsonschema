var Xsd2JsonSchema = require('./src/xsd2JsonSchema');
var XsdFileXmlDom = require("./src/xsdFileXmlDom");
var JsonSchemaFile = require("./src/jsonSchemaFile");
var BaseConverter = require("./src/baseConverter");
var RestrictionConverter = require("./src/restrictionConverter");
var XsdAttributes = require("./src/xsdAttributes");
var JsonElements = require("./src/xsdElements");
var JsonSchemaTypes = require("./src/jsonSchemaTypes");
var JsonSchemaFormats = require("./src/jsonSchemaFormats");

var DefaultConversionVisitor = require('./src/visitors/defaultConversionVisitor');
var BaseConvertionVisitor = require("./src/visitors/baseConversionVisitor");
var XmlUsageVisitor = require('./src/visitors/xmlUsageVisitor');
var XmlUsageVisitorSum = require('./src/visitors/xmlUsageVisitorSum');

module.exports.Xsd2JsonSchema = Xsd2JsonSchema;
module.exports.XsdFileXmlDom = XsdFileXmlDom;
module.exports.JsonSchemaFile = JsonSchemaFile;
module.exports.BaseConverter = BaseConverter;
module.exports.RestrictionConverter = RestrictionConverter;
module.exports.XsdAttributes = XsdAttributes;
module.exports.JsonElements = JsonElements;
module.exports.JsonSchemaTypes = JsonSchemaTypes;
module.exports.JsonSchemaFormats = JsonSchemaFormats;

module.exports.DefaultConversionVisitor = DefaultConversionVisitor;
module.exports.BaseConvertionVisitor = BaseConvertionVisitor;
module.exports.XmlUsageVisitor = XmlUsageVisitor;
module.exports.XmlUsageVisitorSum = XmlUsageVisitorSum;
