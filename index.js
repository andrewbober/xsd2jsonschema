const XsdAttributes = require('./src/xmlschema/xsdAttributes');
const XsdAttributeValues = require('./src/xmlschema/xsdAttributeValues');
const XsdElements = require('./src/xmlschema/xsdElements');
const XsdNodeTypes = require('./src/xmlschema/xsdNodeTypes');
const XsdFile = require('./src/xmlschema/xsdFileXmlDom');

const JsonSchemaTypes = require('./src/jsonschema/jsonSchemaTypes');
const JsonSchemaFormats = require('./src/jsonschema/jsonSchemaFormats');
const JsonSchemaFile = require('./src/jsonschema/jsonSchemaFile');
const JsonSchemaFileDraft04 = require('./src/jsonschema/jsonSchemaFileDraft04');
const JsonSchemaFileDraft06 = require('./src/jsonschema/jsonSchemaFileDraft06');
const JsonSchemaFileDraft07 = require('./src/jsonschema/jsonSchemaFileDraft07');
const JsonSchemaRef = require('./src/jsonschema/jsonSchemaRef');

const DefaultConversionVisitor = require('./src/visitors/defaultConversionVisitor');
const BaseConversionVisitor = require('./src/visitors/baseConversionVisitor');
const XmlUsageVisitor = require('./src/visitors/xmlUsageVisitor');
const XmlUsageVisitorSum = require('./src/visitors/xmlUsageVisitorSum');

const Xsd2JsonSchema = require('./src/xsd2JsonSchema');
const Processor = require('./src/processor');
const ConverterDraft04 = require('./src/converterDraft04');
const ConverterDraft06 = require('./src/converterDraft06');
const ConverterDraft07 = require('./src/converterDraft07');
const BaseSpecialCaseIdentifier = require('./src/baseSpecialCaseIdentifier');
const BuiltInTypeConverter = require('./src/builtInTypeConverter');
const NamespaceManager = require('./src/namespaceManager');
const PropertyDefinable = require('./src/propertyDefinable');
const DepthFirstTraversal = require('./src/depthFirstTraversal');
const Constants = require('./src/constants');
const ParsingState = require('./src/parsingState').ParsingState;
const State = require('./src/parsingState').State;
const ForwardReference = require('./src/forwardReference');


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
module.exports.JsonSchemaFileDraft04 = JsonSchemaFileDraft04;
module.exports.JsonSchemaFileDraft06 = JsonSchemaFileDraft06;
module.exports.JsonSchemaFileDraft07 = JsonSchemaFileDraft07;
module.exports.JsonSchemaRef = JsonSchemaRef;

// Visitors
module.exports.DefaultConversionVisitor = DefaultConversionVisitor;
module.exports.BaseConversionVisitor = BaseConversionVisitor;
module.exports.XmlUsageVisitor = XmlUsageVisitor;
module.exports.XmlUsageVisitorSum = XmlUsageVisitorSum;

// Core modules
module.exports.Xsd2JsonSchema = Xsd2JsonSchema;
module.exports.Processor = Processor;
module.exports.ConverterDraft04 = ConverterDraft04;
module.exports.ConverterDraft06 = ConverterDraft06;
module.exports.ConverterDraft07 = ConverterDraft07;
module.exports.BaseSpecialCaseIdentifier = BaseSpecialCaseIdentifier;
module.exports.BuiltInTypeConverter = BuiltInTypeConverter;
module.exports.NamespaceManager = NamespaceManager;
module.exports.PropertyDefinable = PropertyDefinable;
module.exports.DepthFirstTraversal = DepthFirstTraversal;
module.exports.Constants = Constants;
module.exports.ParsingState = ParsingState;
module.exports.State = State;
module.exports.ForwardReference = ForwardReference;
