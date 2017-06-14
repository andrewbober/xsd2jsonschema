/**
 * Abstract class representing a visitor.  Vistors are utilized by {@link DepthFirstTraversal} to process each node within an XML 
 * Schema file.  This base implmention simply calls the processor member's process() method to facilitate conversion
 * from XMLSchema to JSON Schema.
 * 
 * This class should be subclassesed and a concrete implementation of {@link Visitor#visit|Visitor.visit()} provided.
 */
class Visitor {
	/**
	 * Constructs an instance of Processor.
	 * @constructor
	 */
	Visitor() {
	}

	/**
	 * This method is called for each node in the XML Schema file being processed.  It involks {@link BaseConverter#process|BaseConverter.process()} 
	 * to effect the conversion of the current element in {@link XsdFile|xsd}.
	 * 
	 * @param {Node} node - The current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - The JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being converted.
	 * @param {XsdFile} xsd - The XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - False if an error occurs to cancel traversal of {@link XsdFile|xsd}.  Otherwise, the return value of {@link BaseConverter#process|BaseConverter.process()}
	 */
	visit(node, jsonSchema, xsd) {
        throw new Error("Please implement this method.  Visitor.visit()");
	}
}

module.exports = Visitor;