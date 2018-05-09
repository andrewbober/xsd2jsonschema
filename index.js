const XsdAttributes = require('./src/xmlschema/xsdAttributes');
const XsdAttributeValues = require('./src/xmlschema/xsdAttributeValues');
const XsdElements = require('./src/xmlschema/xsdElements');
const XsdNodeTypes = require('./src/xmlschema/xsdNodeTypes');
const XsdFile = require('./src/xmlschema/xsdFileXmlDom');

const JsonSchemaTypes = require('./src/jsonschema/jsonSchemaTypes');
const JsonSchemaFormats = require('./src/jsonschema/jsonSchemaFormats');
const JsonSchemaFile = require('./src/jsonschema/jsonSchemaFile');

const DefaultConversionVisitor = require('./src/visitors/defaultConversionVisitor');
const BaseConversionVisitor = require('./src/visitors/baseConversionVisitor');
const XmlUsageVisitor = require('./src/visitors/xmlUsageVisitor');
const XmlUsageVisitorSum = require('./src/visitors/xmlUsageVisitorSum');

const Xsd2JsonSchema = require('./src/xsd2JsonSchema');
const Processor = require('./src/processor');
const BaseConverter = require('./src/baseConverter');
const BaseSpecialCaseIdentifier = require('./src/baseSpecialCaseIdentifier');
const BuiltInTypeConverter = require('./src/builtInTypeConverter');
const NamespaceManager = require('./src/namespaceManager');
const PropertyDefinable = require('./src/propertyDefinable');
const DepthFirstTraversal = require('./src/depthFirstTraversal');
const Constants = require('./src/constants');
const ParsingState = require('./src/parsingState');


// XML Schema modules
module.exports.XsdAttributes = XsdAttributes;
module.exports.XsdAttributeValues = XsdAttributeValues;
module.exports.XsdElements = XsdElements;
module.exports.XsdNodeTypes = XsdNodeTypes;
module.exports.XsdFile = XsdFile;

// JSON Schema modules
module.exports.JsonSchemaTypes = JsonSchemaTypes;
module.exports.JsonSchemaFormats = JsonSchemaFormats;
module.exports.JsonSchemaFile = JsonSchemaFile;

// Visitors
module.exports.DefaultConversionVisitor = DefaultConversionVisitor;
module.exports.BaseConversionVisitor = BaseConversionVisitor;
module.exports.XmlUsageVisitor = XmlUsageVisitor;
module.exports.XmlUsageVisitorSum = XmlUsageVisitorSum;

// Core modules
module.exports.Xsd2JsonSchema = Xsd2JsonSchema;
module.exports.Processor = Processor;
module.exports.BaseConverter = BaseConverter;
module.exports.BaseSpecialCaseIdentifier = BaseSpecialCaseIdentifier;
module.exports.BuiltInTypeConverter = BuiltInTypeConverter;
module.exports.NamespaceManager = NamespaceManager;
module.exports.PropertyDefinable = PropertyDefinable;
module.exports.DepthFirstTraversal = DepthFirstTraversal;
module.exports.Constants = Constants;
module.exports.ParsingState = ParsingState;
