/**
 * Abstract class representing an XML processor. XML Processof XML Handler methods for converting XML Schema elements to JSON
 * Schema.  XML handler methods are methods used to convert an element of the corresponding name an equiviant JSON Schema 
 * representation.  An XML Handler method has a common footprint shown by the process() 
 * {@link Processor#process|Processor.process()} method and a name that corresponds to one of the XML Schema element names
 * found in {@link module:XsdElements}.  For example, the choice handler method:\
 * <pre><code>choice(node, jsonSchema, xsd)</code></pre>
 * 
 * This class should be subclassesed and a concrete implementation of {@link Processor#process|Processor.process()} provided to
 * do useful XML processing.
 */
class Processor {
	/**
	 * Constructs an instance of Processor.
	 * @constructor
	 */
	constructor() {
	}

	/**
	 * Creates a namespace for the given namespace.  This method is called once for ea ch XML Schema supplying the
	 * targetNamespace attribute.
	 * 
     * @see {@link CustomTypes#createNamespace|CustomTypes.createNamespace()}
	 */
	initializeNamespace(namespace) {
	}

	/**
	 * This method is called for each node in the XML Schema file being processed.  It first processes an ID attribute if present and 
	 * then calls the appropriate XML Handler method.  Subclasses should override this method.
     * 
	 * @param {Node} node - the current element in xsd being processed.
	 * @param {JsonSchemaFile} jsonSchema - the JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being processed.
	 * @param {XsdFile} xsd - the XML schema file currently being processed.
	 * 
	 * @returns {Boolean} - handler methods can return false to cancel traversal of {@link XsdFile|xsd}.  
     * 
     * @see {@link BaseConverter#process|BaseConverter.process()}
	 */
	process(node, jsonSchema, xsd) {
		//throw new Error("Please implement this method.  Processor.process()");
	}

	/**
	 * This method is called after processing is complete to perform processing that couldn't be handled by
	 * the XML Handler methods.  Subclasses should override this method.
     * 
     * @see {@link BaseConverter#processSpecialCases|BaseConverter.processSpecialCases()}
	 */
	processSpecialCases() {
		//throw new Error("Please implement this method.  Processor.processSpecialCases()");
	}
}

module.exports = Processor;
