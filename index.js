const XsdAttributes = require('./src/xmlschema/xsdAttributes');
const XsdElements = require('./src/xmlschema/xsdElements');
const XsdFile = require('./src/xmlschema/xsdFileXmlDom');

const JsonSchemaTypes = require('./src/jsonschema/jsonSchemaTypes');
const JsonSchemaFormats = require('./src/jsonschema/jsonSchemaFormats');
const JsonSchemaFile = require('./src/jsonschema/jsonSchemaFile');

const DefaultConversionVisitor = require('./src/visitors/defaultConversionVisitor');
const BaseConvertionVisitor = require('./src/visitors/baseConversionVisitor');
const XmlUsageVisitor = require('./src/visitors/xmlUsageVisitor');
const XmlUsageVisitorSum = require('./src/visitors/xmlUsageVisitorSum');

const Xsd2JsonSchema = require('./src/xsd2JsonSchema');
const Processor = require('./src/processor');
const BaseConverter = require('./src/baseConverter');
const BaseSpecialCaseIdentifier = require('./src/baseSpecialCaseIdentifier');
const BuiltInTypeConverter = require('./src/builtInTypeConverter');
const NamespaceManager = require('./src/namespaceManager');


// XML Schema modules
module.exports.XsdAttributes = XsdAttributes;
module.exports.XsdElements = XsdElements;
module.exports.XsdFile = XsdFile;

// JSON Schema modules
module.exports.JsonSchemaTypes = JsonSchemaTypes;
module.exports.JsonSchemaFormats = JsonSchemaFormats;
module.exports.JsonSchemaFile = JsonSchemaFile;

// Visitors
module.exports.DefaultConversionVisitor = DefaultConversionVisitor;
module.exports.BaseConvertionVisitor = BaseConvertionVisitor;
module.exports.XmlUsageVisitor = XmlUsageVisitor;
module.exports.XmlUsageVisitorSum = XmlUsageVisitorSum;

// Core modules
module.exports.Xsd2JsonSchema = Xsd2JsonSchema;
module.exports.Processor = Processor;
module.exports.BaseConverter = BaseConverter;
module.exports.BaseSpecialCaseIdentifier = BaseSpecialCaseIdentifier;
module.exports.BuiltInTypeConverter = BuiltInTypeConverter;
module.exports.NamespaceManager = NamespaceManager
