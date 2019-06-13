/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

process.env['DEBUG'] = 'xsd2jsonschema:XmlUsageVisitorSum,xsd2jsonschema:XmlUsageVisitor';

const fs = require('fs');

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const XmlUsageVisitor = require('xsd2jsonschema').XmlUsageVisitor;
const XmlUsageVisitorSum = require('xsd2jsonschema').XmlUsageVisitorSum;

const xsdSchemas = {
    'BaseTypes.xsd' : loadFile('examples/schemas/BaseTypes.xsd'),
    'ExampleTypes.xsd' : loadFile('examples/schemas/ExampleTypes.xsd')
};
const xs2js = new Xsd2JsonSchema();

const xmlUsageVisitor = new XmlUsageVisitor();
xs2js.processAllSchemas({
	schemas: xsdSchemas,
	visitor: xmlUsageVisitor
});
xmlUsageVisitor.dump();

const xmlUsageSummaryVisitor = new XmlUsageVisitorSum();
xs2js.processAllSchemas({
    schemas: xsdSchemas,
	visitor: xmlUsageSummaryVisitor
});
xmlUsageSummaryVisitor.dump();

function loadFile(path) {
	const buf = fs.readFileSync(path);
	const xsd = buf.toString();
	return xsd;
}
