'use strict';

const debug = require('debug')('xsd2jsonschema:BaseConverter')

const Qname = require('./qname');
const jsonSchemaTypes = require('./jsonschema/jsonSchemaTypes');
const NamespaceManager = require('./namespaceManager');
const JsonSchemaFile = require('./jsonschema/jsonSchemaFile');
const BuiltInTypeConverter = require('./builtInTypeConverter');
const Processor = require('./processor');
const XsdElements = require('./xmlschema/xsdElements');
const XsdAttributes = require('./xmlschema/xsdAttributes');
const XsdAttributeValues = require('./xmlschema/xsdAttributeValues');
const XsdNodeType = require('./xmlschema/xsdNodeTypes');
const utils = require('./utils');
const XsdFile = require('./xmlschema/xsdFileXmlDom');
const BaseSpecialCaseIdentifier = require('./baseSpecialCaseIdentifier');
const SpecialCases = require('./specialCases');


const builtInTypeConverter_NAME = Symbol();
const NamespaceManager_NAME = Symbol();

/**
 * Class representing a collection of XML Handler methods for converting XML Schema elements to JSON Schema.  XML 
 * handler methods are methods used to convert an element of the corresponding name an equiviant JSON Schema 
 * representation.  Handlers all check the current state (i.e. thier parent node) to determine how to convert the 
 * node at hand.  See the {@link BaseConverter#choice|choice} handler for a complex example.
 * 
 * Subclasses can override any handler method to customize the conversion as needed.
 * 
 * @see {@link ParsingState}
 */

 class BaseConverter extends Processor {
	/**
	 * Constructs an instance of BaseConverter.
	 * @constructor
	 */
	constructor() {
		super();
		this.builtInTypeConverter = new BuiltInTypeConverter();
		this.specialCaseIdentifier = new BaseSpecialCaseIdentifier();
		this.namespaceManager = new NamespaceManager();
		// The working schema is initilized as needed through XML Handlers
	}

	// Getters/Setters

	get NamespaceManager() {
		return this[NamespaceManager_NAME];
	}
	set NamespaceManager(newNamespaceManager) {
		this[NamespaceManager_NAME] = newNamespaceManager;
	}

	get builtInTypeConverter() {
		return this[builtInTypeConverter_NAME];
	}
	set builtInTypeConverter(newBuiltInTypeConverter) {
		this[builtInTypeConverter_NAME] = newBuiltInTypeConverter;
	}

	dumpJsonSchema(jsonSchema) {
		Object.keys(jsonSchema).forEach(function (prop, index, array) {
			debug(prop + '=' + jsonSchema[prop]);
		});
	}

	/**
	 * Creates a namespaces for the given namespace name.  This method is called from the schema XML Handler.
	 * 
     * @see {@link NamespaceManager#createNamespace|NamespaceManager.createNamespace()}
	 */
	initializeNamespaces(xsd) {
		Object.keys(xsd.namespaces).forEach(function (namespace, index, array) {
			this.namespaceManager.addNamespace(xsd.namespaces[namespace]);
		}, this);
	}

	/**
	 * This method is called for each node in the XML Schema file being processed.  It first processes an ID attribute if present and 
	 * then calls the appropriate XML Handler method.
	 * @param {Node} node - the current element in xsd being converted.
	 * @param {JsonSchemaFile} jsonSchema - the JSON Schema representing the current XML Schema file {@link XsdFile|xsd} being converted.
	 * @param {XsdFile} xsd - the XML schema file currently being converted.
	 * 
	 * @returns {Boolean} - handler methods can return false to cancel traversal of {@link XsdFile|xsd}.  An XML Schema handler method
	 *  has a common footprint and a name that corresponds to one of the XML Schema element names found in {@link module:XsdElements}.
	 *  For example, the <choice> handler method is <pre><code>choice(node, jsonSchema, xsd)</code></pre>
	 */
	process(node, jsonSchema, xsd) {
		var id = XsdFile.getAttrValue(node, XsdAttributes.ID);
		if (id !== undefined) {
			var qualifiedTypeName = new Qname(id);
			this.workingJsonSchema.addAttributeProperty(qualifiedTypeName.getLocal(), this.createAttributeSchema(node, jsonSchema, xsd, qualifiedTypeName));
		}
		const keepProcessing = this[XsdFile.getNodeName(node)](node, jsonSchema, xsd);
		super.process(node, jsonSchema, xsd);
		return keepProcessing
	}

	all(node, jsonSchema, xsd) {
		// TODO: id, minOccurs, maxOccurs
		// (TBD)
	}

	alternative(node, jsonSchema, xsd) {
		// TODO: id, test, type, xpathDefaultNamespace
		// (TBD)
		return true;
	}

	annotation(node, jsonSchema, xsd) {
		// TODO: id
		// Ignore this grouping and continue processing children
		return true;
	}

	any(node, jsonSchema, xsd) {
		// TODO: id, minOccurs, maxOccurs, namespace, processContents, notNamespace, not QName
		// (TBD)
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.CHOICE:
				throw new Error('any() needs to be implemented within choice!');
			case XsdElements.SEQUENCE:
				throw new Error('any() needs to be implemented within sequence!');
			case XsdElements.ALL:
				throw new Error('any() needs to be implemented within all!');
			case XsdElements.OPEN_CONTENT:
				throw new Error('any() needs to be implemented within openContent!');
			case XsdElements.DEFAULT_OPEN_CONTENT:
				throw new Error('any() needs to be implemented within defaultOpenContent');
			default:
				throw new Error('any() called from within unexpected parsing state!');
		}
		return true;
	}

	anyAttribute(node, jsonSchema, xsd) {
		// TODO: id, namespace, processContents, notNamespace, not QName
		// (TBD)
		return true;
	}

	appinfo(node, jsonSchema, xsd) {
		// TODO: source
		// (TBD)
		this.workingJsonSchema.description = node.toString();
		return false;
	}

	assert(node, jsonSchema, xsd) {
		// TODO: id, test, xpathDefaultNamespace
		// (TBD)
		return true;
	}

	assertion(node, jsonSchema, xsd) {
		// TODO: id, test, xpathDefaultNamespace
		// (TBD)
		return true;
	}

	/* 
	 * A factory method to create JSON Schemas of one of the XML Schema built-in types.
	 *
	 */
	createAttributeSchema(node, jsonSchema, xsd, qualifiedTypeName) {
		var attributeJsonSchema = new JsonSchemaFile({});
		this.builtInTypeConverter[qualifiedTypeName.getLocal()](node, attributeJsonSchema)
		return attributeJsonSchema;
	}

	handleAttributeGlobal(node, jsonSchema, xsd) {
		var name = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		var typeName = XsdFile.getAttrValue(node, XsdAttributes.TYPE);
		// TODO: id, default, fixed, inheritable (TBD)
		var attributeJsonSchema;

		this.parsingState.pushSchema(this.workingJsonSchema);
		if (typeName !== undefined) {
			var qualifiedTypeName = new Qname(typeName);
			attributeJsonSchema = this.namespaceManager.getGlobalAttribute(name, jsonSchema);
			jsonSchema.getGlobalAttributesSchema().addSubSchema(name, attributeJsonSchema);
			return this.builtInTypeConverter[qualifiedTypeName.getLocal()](node, attributeJsonSchema);
		} else {
			// Setup the working schema and allow processing to continue for any contained simpleType or annotation nodes.
			attributeJsonSchema = this.namespaceManager.getGlobalAttribute(name, jsonSchema);
			jsonSchema.getGlobalAttributesSchema().addSubSchema(name, attributeJsonSchema);
			this.workingJsonSchema = attributeJsonSchema;
		}
		return true;
	}

	handleAttributeLocal(node, jsonSchema, xsd) {
		var name = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		var type = XsdFile.getAttrValue(node, XsdAttributes.TYPE);
		var use = XsdFile.getAttrValue(node, XsdAttributes.USE);
		// TODO: id, form, default, fixed, targetNamespace, inheritable (TBD)

		this.parsingState.pushSchema(this.workingJsonSchema);
		if (type !== undefined) {
			var qualifiedTypeName = new Qname(type);
			this.workingJsonSchema.addAttributeProperty(name, this.createAttributeSchema(node, jsonSchema, xsd, qualifiedTypeName), use);
		} else {
			// Setup the working schema and allow processing to continue for any contained simpleType or annotation nodes.
			var attributeJsonSchema = new JsonSchemaFile({});
			this.workingJsonSchema.addAttributeProperty(name, attributeJsonSchema, use);
			this.workingJsonSchema = attributeJsonSchema;
		}
		return true;
	}

	handleAttributeReference(node, jsonSchema, xsd) {
		const ref = XsdFile.getAttrValue(node, XsdAttributes.REF);
		const use = XsdFile.getAttrValue(node, XsdAttributes.USE);
		// TODO: id, default, fixed, inheritable (TBD)

		if (ref !== undefined) {
			var attrSchema = this.namespaceManager.getGlobalAttribute(ref, jsonSchema);
			this.workingJsonSchema.addAttributeProperty(ref, attrSchema.get$RefToSchema(), use);
		}

		return true;
	}

	attribute(node, jsonSchema, xsd) {
		// (TBD)
		//dumpNode(node);	
		if (XsdFile.isReference(node)) {
			return this.handleAttributeReference(node, jsonSchema, xsd);
		} else if (this.parsingState.isTopLevelEntity()) {
			return this.handleAttributeGlobal(node, jsonSchema, xsd);
		} else {
			return this.handleAttributeLocal(node, jsonSchema, xsd);
		}
	}

	handleAttributeGroupDefinition(node, jsonSchema, xsd) {
		// TODO id, name 
		// (TBD)
	}

	handleAttributeGroupReference(node, jsonSchema, xsd) {
		// TODO id, ref (TBD)
	}

	attributeGroup(node, jsonSchema, xsd) {
		// (TBD)
		return true;
	}

	handleChoiceArray(node, jsonSchema, xsd) {
		var minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		var maxOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MAX_OCCURS);
		// TODO: id
		// (TBD Don't forget to support singles)
		throw new Error('choice array needs to be implemented!!');
		return true;
	}

	allChildrenAreOptional(node) {
		var retval = true;
		const children = Array.from(node.childNodes);
		children.forEach(function (childNode) {
			if (childNode.nodeType != XsdNodeType.TEXT_NODE) {
				const minOccursAttr = XsdFile.getAttrValue(childNode, XsdAttributes.MIN_OCCURS);
				if (minOccursAttr != 0) {
					retval = false;
				}
			}
		})
		return retval;
	}

	choice(node, jsonSchema, xsd) {
		// TODO: id
		const minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		const maxOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MAX_OCCURS);
		const isAnyOfChoice = this.specialCaseIdentifier.isAnyOfChoice(node, xsd);
		if (isAnyOfChoice === true) {
			this.specialCaseIdentifier.addSpecialCase(SpecialCases.ANY_OF_CHOICE, this.workingJsonSchema, node);
			// This could be optional too.  Need a test! 
		}
		const isArray = (maxOccursAttr !== undefined && (maxOccursAttr > 1 || maxOccursAttr === XsdAttributeValues.UNBOUNDED));
		if (isArray) {
			return this.handleChoiceArray(node, jsonSchema, xsd);
		}
		const isOptional = this.specialCaseIdentifier.isOptionalChoice(node, xsd, minOccursAttr);
		const allChildrenAreOptional = this.allChildrenAreOptional(node);
		const isSiblingChoice = this.specialCaseIdentifier.isSiblingChoice(node, xsd);
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.CHOICE:
				throw new Error('choice() needs to be implemented within choice');
			case XsdElements.COMPLEX_TYPE:
				// Allow to fall through and continue processing.  The schema is estabished with the complexType.
				//throw new Error('choice() needs to be implemented within complexType');
				break;
			case XsdElements.EXTENSION:
				throw new Error('choice() needs to be implemented within extension');
			case XsdElements.GROUP:
				// Allow to fall through and continue processing.  The schema is estabished with the group.
				//throw new Error('choice() needs to be implemented within group');
				break;
			case XsdElements.RESTRICTION:
				throw new Error('choice() needs to be implemented within restriction');
			case XsdElements.SEQUENCE:
				if (isSiblingChoice) {
					var allOfSchema = new JsonSchemaFile({});
					this.workingJsonSchema.allOf.push(allOfSchema);
					this.parsingState.pushSchema(this.workingJsonSchema);
					this.workingJsonSchema = allOfSchema;
					if(isAnyOfChoice === true) {
						// Ducktype it on there for now.  This is checked in baseSpecialCaseIdentifier.fixAnyOfChoice.
						// It is needed because all sibling choices may not be anyOfChoices.
						allOfSchema.isAnyOfChoice = true;
					}
				}
				if (!allChildrenAreOptional && isOptional) {
					var optionalChoiceSchema = new JsonSchemaFile({});
					this.workingJsonSchema.anyOf.push(optionalChoiceSchema);
					// Add an the optional part (empty schema)
					var emptySchema = new JsonSchemaFile({});
					emptySchema.description = "This truthy schema is what makes an optional <choice> optional.  This needs a better solution because it allows anything."
					this.workingJsonSchema.anyOf.push(emptySchema);
					if (!isSiblingChoice) {
						this.parsingState.pushSchema(this.workingJsonSchema)
					}
					this.workingJsonSchema = optionalChoiceSchema;
						// The optional part will be added as a special case
					this.specialCaseIdentifier.addSpecialCase(SpecialCases.OPTIONAL_CHOICE, this.workingJsonSchema, node);
				} else {
					// This is an needless grouping just allow to fall through and continue processing
					// Allow to fall through and continue processing.  
					// The schema should be estabished by the parent of the sequence.
					//  (Keep an eye on this one)
					//throw new Error('choice() needs to be implemented within sequence');
				}
				break;
			default:
				throw new Error('choice() called from within unexpected parsing state!');
		}
		return true;
	}

	comment(node, jsonSchema, xsd) {
		// do nothing - This is an XML comment (e.g. <!-- text -->) 
		return true;
	}

	complexContent(node, jsonSchema, xsd) {
		// TODO: id, mixed 
		// Ignore this grouping and continue processing children
		return true;
	}

	handleNamedComplexType(node, jsonSchema, xsd) {
		var nameAttr = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		// TODO: id, mixed, abstract, block, final, defaultAttributesApply

		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.SCHEMA:
				this.workingJsonSchema = this.namespaceManager.getType(nameAttr, jsonSchema, xsd);
				jsonSchema.addSubSchema(nameAttr, this.workingJsonSchema);
				this.workingJsonSchema.type = jsonSchemaTypes.OBJECT;
				break;
			case XsdElements.REDEFINE:
				throw new Error('complexType() needs to be impemented within redefine');
			case XsdElements.OVERRIDE:
				throw new Error('complexType() needs to be impemented within override');
			default:
				throw new Error('complexType() called from within unexpected parsing state! state=' + state.name);
		}
		return true;
	}

	handleAnonymousComplexType(node, jsonSchema, xsd) {
		// TODO: id, mixed, defaultAttributesApply
		// Ignore this grouping and continue processing children
		return true;
	}

	complexType(node, jsonSchema, xsd) {
		if (XsdFile.isNamed(node)) {
			return this.handleNamedComplexType(node, jsonSchema, xsd);
		} else {
			return this.handleAnonymousComplexType(node, jsonSchema, xsd);
		}
	}

	defaultOpenContent(node, jsonSchema, xsd) {
		// TODO: schema
		// (TBD)
		return true;
	}

	documentation(node, jsonSchema, xsd) {
		// TODO: source, xml:lang
		// Ignore this grouping and continue processing children.  The actual text will come through the text() method.
		return true;
	}

	handleElementGlobal(node, jsonSchema, xsd) {
		var nameAttr = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		var typeAttr = XsdFile.getAttrValue(node, XsdAttributes.TYPE);
		// TODO: id, defaut, fixed, nillable, abstract, substitutionGroup, block, final

		if (typeAttr !== undefined) {
			var typeName = typeAttr;
			var customType = this.namespaceManager.getType(typeName, jsonSchema, xsd);
			var refType = customType.clone();
			refType.id = jsonSchema.id;
			this.namespaceManager.addTypeReference(nameAttr, refType, jsonSchema, xsd);
			this.workingJsonSchema = customType.get$RefToSchema();
			jsonSchema.addSubSchema(nameAttr, this.workingJsonSchema);
			//workingJsonSchema.type = jsonSchemaTypes.OBJECT;
		} else {
			this.workingJsonSchema = this.namespaceManager.getType(nameAttr, jsonSchema, xsd);
			jsonSchema.addSubSchema(nameAttr, this.workingJsonSchema);
			this.workingJsonSchema.type = jsonSchemaTypes.OBJECT;
		}
		if (this.parsingState.inChoice()) {
			throw new Error('choice needs to be implemented in handleElementGlobal()!');
		}
		return true;
	}

	addProperty(targetSchema, propertyName, customType, minOccursAttr) {
		if (minOccursAttr === undefined || minOccursAttr === 'required' || minOccursAttr > 0) {
			targetSchema.addRequired(propertyName);
		}
		targetSchema.setProperty(propertyName, customType);
	}

	addChoiceProperty(targetSchema, propertyName, customType, minOccursAttr) {
		var choiceSchema = new JsonSchemaFile({});
		//choiceSchema.additionalProperties = false;
		this.addProperty(choiceSchema, propertyName, customType, minOccursAttr);
		targetSchema.oneOf.push(choiceSchema);
	}

	addPropertyAsArray(targetSchema, propertyName, customType, minOccursAttr, maxOccursAttr) {
		var arraySchema = new JsonSchemaFile({});
		arraySchema.type = jsonSchemaTypes.ARRAY;
		var min = minOccursAttr === undefined ? undefined : minOccursAttr;
		var max = maxOccursAttr === undefined ? undefined : maxOccursAttr;
		arraySchema.minItems = min;
		arraySchema.maxItems = max === XsdAttributeValues.UNBOUNDED ? undefined : max;
		arraySchema.items = customType.get$RefToSchema();
		var oneOfSchema = new JsonSchemaFile({});
		oneOfSchema.oneOf.push(customType.get$RefToSchema());
		oneOfSchema.oneOf.push(arraySchema);
		this.addProperty(targetSchema, propertyName, oneOfSchema, minOccursAttr);
	}

	addChoicePropertyAsArray(targetSchema, propertyName, customType, minOccursAttr, maxOccursAttr) {
		var choiceSchema = new JsonSchemaFile({});
		//choiceSchema.additionalProperties = false;
		this.addPropertyAsArray(choiceSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
		targetSchema.oneOf.push(choiceSchema);
	}

	handleElementLocal(node, jsonSchema, xsd) {
		var nameAttr = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		var typeAttr = XsdFile.getAttrValue(node, XsdAttributes.TYPE);
		var minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		var maxOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MAX_OCCURS);
		// TODO: id, form, defaut, fixed, nillable, block, targetNamespace

		var lookupName;
		if (typeAttr !== undefined) {
			lookupName = typeAttr;
		}
		var propertyName = nameAttr;  // name attribute is required for local element
		var customType;
		if (lookupName !== undefined) {
			customType = this.namespaceManager.getType(lookupName, jsonSchema, xsd).get$RefToSchema();
		} else {
			customType = this.namespaceManager.getType(propertyName, jsonSchema, xsd);
		}
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr > 1 || maxOccursAttr === XsdAttributeValues.UNBOUNDED));
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.CHOICE:
				if (this.specialCaseIdentifier.isOptionalChoice(node.parentNode, xsd) || this.allChildrenAreOptional(node.parentNode)) {
					if (isArray) {
						this.addPropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
					} else {
						this.addProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
					}
				} else {
					if (isArray) {
						this.addChoicePropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
					} else {
						this.addChoiceProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
					}
				}
				break;
			case XsdElements.SEQUENCE:
			case XsdElements.ALL:
				if (isArray) {
					this.addPropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					this.addProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			default:
				throw new Error('element() [local] called from within unexpected parsing state!');
		}
		return true;
	}

	handleElementReference(node, jsonSchema, xsd) {
		var minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		var maxOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MAX_OCCURS);
		var refAttr = XsdFile.getAttrValue(node, XsdAttributes.REF);
		// TODO: id

		// An element within a model group (such as 'group') may be a reference.  References have neither
		// a name nor a type attribute - just a ref attribute.  This is awkward when the reference elmenent
		// is a property of an object in JSON.  With no other options to name the property ref is used.
		var propertyName = refAttr;  // ref attribute is required for an element reference
		var customType = this.namespaceManager.getType(propertyName, jsonSchema, xsd).get$RefToSchema();
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr > 1 || maxOccursAttr === XsdAttributeValues.UNBOUNDED));
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.CHOICE:
				if (this.specialCaseIdentifier.isOptionalChoice(node.parentNode, xsd) || this.allChildrenAreOptional(node.parentNode)) {
					if (isArray) {
						this.addPropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
					} else {
						this.addProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
					}
				} else {
					if (isArray) {
						this.addChoicePropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
					} else {
						this.addChoiceProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
					}
				}
				break;
			case XsdElements.SEQUENCE:
			case XsdElements.ALL:
				if (isArray) {
					this.addPropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					this.addProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			default:
				throw new Error('element() [reference] called from within unexpected parsing state!');
		}
		return true;
	}

	element(node, jsonSchema, xsd) {
		var refAttr = XsdFile.getAttrValue(node, XsdAttributes.REF);

		if (refAttr !== undefined) {
			return this.handleElementReference(node, jsonSchema, xsd);
		} else if (this.parsingState.isTopLevelEntity()) {
			return this.handleElementGlobal(node, jsonSchema, xsd);
		} else {
			return this.handleElementLocal(node, jsonSchema, xsd);
		}
	}

	enumeration(node, jsonSchema, xsd) {
		var val = XsdFile.getValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.addEnum(val)
		return true;
	}

	explicitTimezone(node, jsonSchema, xsd) {
		// TODO: id, fixed, value
		// (TBD)
		return true;
	}

	extension(node, jsonSchema, xsd) {
		var baseAttr = XsdFile.getAttrValue(node, XsdAttributes.BASE);
		// TODO: id
		var baseType = new Qname(baseAttr);
		var baseTypeName = baseType.getLocal();
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.COMPLEX_CONTENT:
				this.workingJsonSchema = this.workingJsonSchema.extend(this.namespaceManager.getType(baseTypeName, jsonSchema, xsd)) //, jsonSchemaTypes.OBJECT);
				break;
			case XsdElements.SIMPLE_TYPE:
				throw new Error('extension() needs to be impemented within simpleType!');
			default:
				throw new Error('extension() called from within unexpected parsing state!');
		}
		return true;
	}

	field(node, jsonSchema, xsd) {
		// TODO: id, xpath, xpathDefaultNamespace
		// (TBD)
		return true;
	}

	fractionDigits(node, jsonSchema, xsd) {
		// TODO: id, value, fixed
		// do nothing - there is no coresponding functionality in JSON Schema
		return true;
	}

	handleGroupDefinition(node, jsonSchema, xsd) {
		var nameAttr = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		// TODO: id

		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.SCHEMA:
				this.workingJsonSchema = this.namespaceManager.getType(nameAttr, jsonSchema, xsd);
				jsonSchema.addSubSchema(nameAttr, this.workingJsonSchema);
				this.workingJsonSchema.type = jsonSchemaTypes.OBJECT;
				break;
			case XsdElements.REDEFINE:
				throw new Error('group() [definition] needs to be impemented within restriction!');
			case XsdElements.OVERRIDE:
				throw new Error('group() [definition] needs to be impemented within choice!');
			default:
				throw new Error('group() [definition] called from within unexpected parsing state!');
		}
		return true;
	}

	handleGroupReferenceOld(node, jsonSchema, xsd) {
		var minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		var refName = XsdFile.getAttrValue(node, XsdAttributes.REF);
		// TODO: id, maxOccurs

		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.EXTENSION:
				throw new Error('group() [reference] needs to be impemented within extension!');
			case XsdElements.RESTRICTION:
				throw new Error('group() [reference] needs to be impemented within restriction!');
			case XsdElements.CHOICE:
				throw new Error('group() [reference] needs to be impemented within choice!');
			case XsdElements.COMPLEX_TYPE:
			case XsdElements.SEQUENCE:
			case XsdElements.ALL:
				if (minOccursAttr === undefined || minOccursAttr > 0) {
					this.workingJsonSchema.addRequired(refName);
				}
				var customType = this.namespaceManager.getType(refName, jsonSchema, xsd);
				this.workingJsonSchema.setProperty(refName, customType.get$RefToSchema());
				break;
			default:
				throw new Error('group() [reference] called from within unexpected parsing state!');
		}
		return true;
	}

	handleGroupReference(node, jsonSchema, xsd) {
		var minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		var maxOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MAX_OCCURS);
		var refAttr = XsdFile.getAttrValue(node, XsdAttributes.REF);
		// TODO: id

		var propertyName = refAttr;  // ref attribute is required for group reference
		var customType = this.namespaceManager.getType(propertyName, jsonSchema, xsd).get$RefToSchema();
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr > 1 || maxOccursAttr === XsdAttributeValues.UNBOUNDED));
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.EXTENSION:
				throw new Error('group() [reference] needs to be impemented within extension!');
			case XsdElements.RESTRICTION:
				throw new Error('group() [reference] needs to be impemented within restriction!');
			case XsdElements.CHOICE:
				if (isArray) {
					this.addChoicePropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					this.addChoiceProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			case XsdElements.COMPLEX_TYPE:
			case XsdElements.SEQUENCE:
			case XsdElements.ALL:
				if (isArray) {
					this.addPropertyAsArray(this.workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					this.addProperty(this.workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			default:
				throw new Error('group() [reference] called from within unexpected parsing state!');
		}
		return true;
	}

	group(node, jsonSchema, xsd) {
		if (XsdFile.isReference(node)) {
			return this.handleGroupReference(node, jsonSchema, xsd);
		} else {
			return this.handleGroupDefinition(node, jsonSchema, xsd);
		}
	}

	import(node, jsonSchema, xsd) {
		// TODO: id, namespace, schemaLocation
		// do nothing
		return true;
	}

	include(node, jsonSchema, xsd) {
		// TODO: id, schemaLocation
		// do nothing
		return true;
	}

	handleKeyConstraint() {
		// TODO: id, name
		// (TBD)
		return true;
	}

	handleKeyReferenceToKeyConstraint() {
		// TODO: id, ref
		// (TBD)
		return true;
	}

	key(node, jsonSchema, xsd) {
		// (TBD)
		return true;
	}

	handleKeyReference(node, jsonSchema, xsd) {
		// TODO: id, name, refer
		// (TBD)
		return true;
	}

	handleKeyReferenceToKeyReference(node, jsonSchema, xsd) {
		// TODO: id, ref
		// (TBD)
		return true;
	}

	keyref(node, jsonSchema, xsd) {
		// (TBD)
		return true;
	}

	length(node, jsonSchema, xsd) {
		// TODO: id, fixed
		var len = XsdFile.getNumberValueAttr(node);

		this.workingJsonSchema.maxLength = len;
		this.workingJsonSchema.minLength = len;
		return true;
	}

	list(node, jsonSchema, xsd) {
		// TODO: id, itemType
		// (TBD)
		return true;
	}

	maxExclusive(node, jsonSchema, xsd) {
		var val = XsdFile.getNumberValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.maximum = val;
		this.workingJsonSchema.exlusiveMaximum = true;
		return true;
	}

	maxInclusive(node, jsonSchema, xsd) {
		var val = XsdFile.getNumberValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.maximum = val; // inclusive is the JSON Schema default
		return true;
	}

	maxLength(node, jsonSchema, xsd) {
		var len = XsdFile.getNumberValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.maxLength = len;
		return true;
	}

	minExclusive(node, jsonSchema, xsd) {
		var val = XsdFile.getNumberValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.minimum = val;
		this.workingJsonSchema.exclusiveMinimum = true;
		return true;
	}

	minInclusive(node, jsonSchema, xsd) {
		var val = XsdFile.getNumberValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.minimum = val; // inclusive is the JSON Schema default
		return true;
	}

	minLength(node, jsonSchema, xsd) {
		var len = XsdFile.getNumberValueAttr(node);
		// TODO: id, fixed

		this.workingJsonSchema.minLength = len;
		return true;
	}

	notation(node, jsonSchema, xsd) {
		// TODO: id, name, public, system
		// (TBD)
		return true;
	}

	openContent(node, jsonSchema, xsd) {
		// TODO: id, mode
		// (TBD)
		return true;
	}

	override(node, jsonSchema, xsd) {
		// TODO: id, schemaLocation
		// (TBD)
		return true;
	}

	pattern(node, jsonSchema, xsd) {
		var pattern = XsdFile.getValueAttr(node);
		// TODO: id

		this.workingJsonSchema.pattern = pattern;
		return true;
	}

	redefine(node, jsonSchema, xsd) {
		// TODO: id, schemaLocation
		// (TBD)
		return true;
	}

	restriction(node, jsonSchema, xsd) {
		var baseAttr = XsdFile.getAttrValue(node, XsdAttributes.BASE);
		var baseType = new Qname(baseAttr);
		var baseTypeName = baseType.getLocal();
		// TODO: id, (base inheritance via allOf)

		if (this.builtInTypeConverter[baseTypeName] === undefined) {
			this.parsingState.pushSchema(this.workingJsonSchema);
			this.workingJsonSchema = this.workingJsonSchema.extend(this.namespaceManager.getType(baseTypeName, jsonSchema, xsd));
			return true;
		} else {
			return this.builtInTypeConverter[baseTypeName](node, this.workingJsonSchema);
		}
	}

	schema(node, jsonSchema, xsd) {
		// TODO: id, version, targetNamespace, attributeFormDefualt, elementFormDefualt, blockDefault, finalDefault, xml:lang, defaultAttributes, xpathDefaultNamespace

		jsonSchema.description = 'Schema tag attributes: ' + utils.objectToString(XsdFile.buildAttributeMap(node));
		this.initializeNamespaces(xsd);
		return true;
	}

	selector(node, jsonSchema, xsd) {
		// TODO: key, keyref, unique
		// (TBD)
		return true;
	}

	sequence(node, jsonSchema, xsd) {
		var minOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
		var maxOccursAttr = XsdFile.getAttrValue(node, XsdAttributes.MAX_OCCURS);
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr > 1 || maxOccursAttr === XsdAttributeValues.UNBOUNDED));
		if (isArray) {
			throw new Error('sequence arrays need to be implemented!');
		}
		var isOptional = (minOccursAttr !== undefined && minOccursAttr == 0);
		if (isOptional === true) {
			const type = XsdFile.getTypeNode(node);
			const typeName = type.getAttribute('name');
			debug('Optional Sequence Found : ' + xsd.baseFilename + ':' + typeName);
			if (typeName == '') {
				this.parsingState.dumpStates(xsd.baseFilename);
				XsdFile.dumpNode(node);
			}
		}
		var state = this.parsingState.getCurrentState();
		switch (state.name) {
			case XsdElements.CHOICE:
				var choiceSchema = new JsonSchemaFile({});
				//choiceSchema.additionalProperties = false;
				this.workingJsonSchema.oneOf.push(choiceSchema);
				this.parsingState.pushSchema(this.workingJsonSchema);
				this.workingJsonSchema = choiceSchema;
				break;
			case XsdElements.COMPLEX_TYPE:
				break;
			case XsdElements.EXTENSION:
				break;
			case XsdElements.GROUP:
				break;
			case XsdElements.RESTRICTION:
				break;
			case XsdElements.SEQUENCE:
				if (isOptional) {
					var optionalSequenceSchema = new JsonSchemaFile({});
					this.workingJsonSchema.anyOf.push(optionalSequenceSchema);
					// Add an the optional part (empty schema)
					var emptySchema = new JsonSchemaFile({});
					this.workingJsonSchema.anyOf.push(emptySchema);
					this.parsingState.pushSchema(this.workingJsonSchema);
					this.workingJsonSchema = optionalSequenceSchema;
				} else {
					throw new Error('Required nested sequences need to be implemented!');
				}
				break;
			default:
				throw new Error('sequence() called from within unexpected parsing state! state = [' + state.name + ']');
		}
		return true;
	}

	simpleContent(node, jsonSchema, xsd) {
		// TODO: id
		// Ignore this grouping and continue processing children
		return true;
	}

	handleSimpleTypeNamedGlobal(node, jsonSchema, xsd) {
		var nameAttr = XsdFile.getAttrValue(node, XsdAttributes.NAME);
		// TODO: id, final

		this.workingJsonSchema = this.namespaceManager.getType(nameAttr, jsonSchema, xsd);
		jsonSchema.addSubSchema(nameAttr, this.workingJsonSchema);
		return true;
	}

	handleSimpleTypeAnonymousLocal(node, jsonSchema, xsd) {
		// TODO: id
		// Ignore this grouping and continue processing children
		return true;
	}

	simpleType(node, jsonSchema, xsd) {
		var continueParsing
		if (XsdFile.isNamed(node)) {
			continueParsing = this.handleSimpleTypeNamedGlobal(node, jsonSchema, xsd);
		} else {
			continueParsing = this.handleSimpleTypeAnonymousLocal(node, jsonSchema, xsd);
		}
		if (this.parsingState.inAttribute()) {
			// need to pop
		}
		return continueParsing;
	}

	text(node, jsonSchema, xsd) {
		if (this.parsingState.inDocumentation()) {
			return true;
			// TODO: This should be a configurable option
			// workingJsonSchema.description = node.text();
		} else if (this.parsingState.inAppInfo()) {
			this.workingJsonSchema.concatDescription(node.parent().name() + '=' + node.text() + ' ');
		}
		return true;
	}

	totalDigits(node, jsonSchema, xsd) {
		// TODO: id, value, fixed
		// do nothing - there is no coresponding functionality in JSON Schema
		return true;
	}

	union(node, jsonSchema, xsd) {
		// TODO: id, memberTypes
		// (TBD)
		return true;
	}

	handleUniqueConstraint(node, jsonSchema, xsd) {
		// TODO: id, name
		// (TBD)
		return true;
	}

	handleUniqueReferenceToUniqueConstraint(node, jsonSchema, xsd) {
		// TODO: id, ref
		// (TBD)
		return true;
	}

	unique(node, jsonSchema, xsd) {
		// (TBD)
		return true;
	}

	whitespace(node, jsonSchema, xsd) {
		// TODO: id, value, fixed
		// (TBD)
		return true;
	}

	processSpecialCases() {
		this.specialCaseIdentifier.specialCases.forEach(function (sc, index, array) {
			this.specialCaseIdentifier[sc.specialCase](sc.jsonSchema, sc.node);
		}, this);
	}
}

module.exports = BaseConverter;