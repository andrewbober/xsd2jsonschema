const Xsd2JsonSchema = require('./src/xsd2JsonSchema');
const XsdFile = require("./src/xmlschema/xsdFileXmlDom");
const JsonSchemaFile = require("./src/jsonschema/jsonSchemaFile");
const Processor = require("./src/processor");
const BaseConverter = require("./src/baseSpecialCaseIdentifier");
const BaseSpecialCaseIdentifier = require("./src/baseSpecialCaseIdentifier");
const RestrictionConverter = require("./src/restrictionConverter");
const XsdAttributes = require("./src/xmlschema/xsdAttributes");
const JsonElements = require("./src/xmlschema/xsdElements");
const JsonSchemaTypes = require("./src/jsonschema/jsonSchemaTypes");
const JsonSchemaFormats = require("./src/jsonschema/jsonSchemaFormats");

const DefaultConversionVisitor = require('./src/visitors/defaultConversionVisitor');
const BaseConvertionVisitor = require("./src/visitors/baseConversionVisitor");
const XmlUsageVisitor = require('./src/visitors/xmlUsageVisitor');
const XmlUsageVisitorSum = require('./src/visitors/xmlUsageVisitorSum');


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
module.exports.Processor = Processor;
module.exports.BaseConverter = BaseConverter;
module.exports.BaseSpecialCaseIdentifier = BaseSpecialCaseIdentifier;
module.exports.RestrictionConverter = RestrictionConverter;

