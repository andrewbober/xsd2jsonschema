/**
 *  Converts XML Schema user-derived data types to JSON Schema
 */

"use strict";

var Qname = require("./qname");
var jsonTypes = require('./jsonTypes');
var customTypes = require('./customTypes');
var JsonSchemaFile = require("./jsonSchemaFile");
var RestrictionConverter = require("./restrictionConverter");
var parsingState = require("./parsingState");
var attrConst = require('./xsdAttributes');
var elConst = require('./xsdElements');
var utils = require("./utils");

function BaseConverter(_manager) {
	var schemaManager = _manager;
	var workingJsonSchema;
	var restrictionConverter = new RestrictionConverter();

	this.setWorkingJsonSchema = function (_workingJsonSchema) {
		workingJsonSchema = _workingJsonSchema;
	}

	function dumpJsonSchema(jsonSchema) {
		Object.keys(jsonSchema).forEach(function (prop, index, array) {
			console.log(prop + "=" + jsonSchema[prop]);
		});
	}

	function getAttr(node, attrName) {
		var retval;
		node.attrs().forEach(function (attr, index, array) {
			if (attr.name() === attrName) {
				retval = attr;
			}
		});
		return retval;
	}

	function hasAttribute(node, attrName) {
		var attr = getAttr(node, attrName);
		if (attr === undefined) {
			return false;
		} else {
			return true;
		}
	}

	function isNamed(node) {
		return hasAttribute(node, attrConst.name);
	}

	function isReference(node) {
		return hasAttribute(node, attrConst.ref);
	}

	function getValueAttr(node) {
		return getAttr(node, attrConst.value).value();
	}

	this.dumpNode = function (node) {
		console.log("__________________________________________");
		console.log("XML-Type= " + node.type());
		console.log("XML-TAG-Name= " + node.name());
		console.log("XML-TAG-NameSpace= " + node.namespace().prefix() + "=" + node.namespace().href());
		var text = node.text();
		if (text !== undefined && text.length != 0) {
			console.log("XML-Text= [" + text + "]");
		}
		var attrs = node.attrs();
		attrs.forEach(function (attr, index, array) {
			console.log(attr.name() + "=" + attr.value());
		});
		console.log("_________");
	};
	/*
	
	Need to figure out what to do with this CIECA specific stuff.
	
		this.BMSVersion = function (node, jsonSchema, xsd) {
			return true;
		};
	
		this.SchemaBuildNumber = function (node, jsonSchema, xsd) {
			return true;
		};
	*/
	this.all = function (node, jsonSchema, xsd) {
		// TODO: id, minOccurs, maxOccurs
		// (TBD)
	};

	this.alternative = function (node, jsonSchema, xsd) {
		// TODO: id, test, type, xpathDefaultNamespace
		// (TBD)
		return true;
	};

	this.annotation = function (node, jsonSchema, xsd) {
		// TODO: id
		// Ignore this grouping and continue processing children
		return true;
	};

	this.any = function (node, jsonSchema, xsd) {
		// TODO: id, minOccurs, maxOccurs, namespace, processContents, notNamespace, not QName
		// (TBD)
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.choice:
				throw new Error("any() needs to be implemented within choice!");
			case elConst.sequence:
				throw new Error("any() needs to be implemented within sequence!");
			case elConst.all:
				throw new Error("any() needs to be implemented within all!");
			case elConst.openContent:
				throw new Error("any() needs to be implemented within openContent!");
			case elConst.defaultOpenContent:
				throw new Error("any() needs to be implemented within defaultOpenContent");
			default:
				throw new Error("any() called from within unexpected parsing state!");
		}
		return true;
	};

	this.anyAttribute = function (node, jsonSchema, xsd) {
		// TODO: id, namespace, processContents, notNamespace, not QName
		// (TBD)
		return true;
	};

	this.appinfo = function (node, jsonSchema, xsd) {
		// TODO: source
		// (TBD)
		workingJsonSchema.setDescription(node.toString());
		return false;
	};

	this.assert = function (node, jsonSchema, xsd) {
		// TODO: id, test, xpathDefaultNamespace
		// (TBD)
		return true;
	};

	this.assertion = function (node, jsonSchema, xsd) {
		// TODO: id, test, xpathDefaultNamespace
		// (TBD)
		return true;
	};

	function handleAttributeGlobal(node, jsonSchema, xsd) {
		// TODO: id, name, type, default, fixed, inheritable (TBD)
	}

	function handleAttributeLocal(node, jsonSchema, xsd) {
		// TODO: id, name, type, form, use, default, fixed, targetNamespace, inheritable (TBD)
	}

	function handleAttributeReference(node, jsonSchema, xsd) {
		// TODO: id, ref, use, default, fixed, inheritable (TBD)
	}

	this.attribute = function (node, jsonSchema, xsd) {
		// (TBD)
		return true;
	};

	function handleAttributeGroupDefinition(node, jsonSchema, xsd) {
		// TODO id, name 
		// (TBD)
	}

	function handleAttributeGroupReference(node, jsonSchema, xsd) {
		// TODO id, ref (TBD)
	}

	this.attributeGroup = function (node, jsonSchema, xsd) {
		// (TBD)
		return true;
	}

	function handleChoiceArray(node, jsonSchema, xsd) {
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);
		// TODO: id
		// (TBD)
		throw new Error("choice array needs to be implemented!!");
		return true;
	}

	function countChildren(node, tagName) {
		var xpath = node.namespace().prefix() + ":" + tagName;
		var ns = {};
		ns[node.namespace().prefix()] = node.namespace().href();
		var elements = node.parent().find(xpath, ns);
		console.log("Found [" + elements.length + "] '" + tagName + "' elements within '" + node.parent().parent().attr("name") + "'");
		return elements.length;
	}

	this.choice = function (node, jsonSchema, xsd) {
		// TODO: id
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);

		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr.value() > 1 || maxOccursAttr.value() === "unbounded"));
		if (isArray) {
			return handleChoiceArray(node, jsonSchema, xsd);
		}
		var isOptional = (minOccursAttr !== undefined && minOccursAttr.value() == 0);
		var isMulti = countChildren(node, elConst.choice) > 1;
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.choice:
				throw new Error("choice() needs to be implemented within choice");
			case elConst.complexType:
				// Allow to fall through and continue processing.  The schema is estabished with the complexType.
				//throw new Error("choice() needs to be implemented within complexType");
				break;
			case elConst.extension:
				throw new Error("choice() needs to be implemented within extension");
			case elConst.group:
				// Allow to fall through and continue processing.  The schema is estabished with the group.
				//throw new Error("choice() needs to be implemented within group");
				break;
			case elConst.restriction:
				throw new Error("choice() needs to be implemented within restriction");
			case elConst.sequence:
				if (isOptional) {
					var anyOfSchema = new JsonSchemaFile({});
					workingJsonSchema.getAnyOf().push(anyOfSchema);
					schemaManager.pushSchema(workingJsonSchema);
					workingJsonSchema = anyOfSchema;
				} else if (isMulti) {
					var allOfSchema = new JsonSchemaFile({});
					workingJsonSchema.getAllOf().push(allOfSchema);
					schemaManager.pushSchema(workingJsonSchema);
					workingJsonSchema = allOfSchema;
				} else {
					// Allow to fall through and continue processing.  
					// The schema should be estabished by the parent of the sequence.
					//  (Keep an eye on this one)
					//throw new Error("choice() needs to be implemented within sequence");
				}
				break;
			default:
				throw new Error("choice() called from within unexpected parsing state!");
		}
		return true;
	};

	this.comment = function (node, jsonSchema, xsd) {
		// do nothing - This is an XML comment (e.g. <!-- text -->) 
		return true;
	};

	this.complexContent = function (node, jsonSchema, xsd) {
		// TODO: id, mixed 
		// Ignore this grouping and continue processing children
		return true;
	};

	function handleNamedComplexType(node, jsonSchema, xsd) {
		var nameAttr = getAttr(node, attrConst.name);
		// TODO: id, mixed, abstract, block, final, defaultAttributesApply

		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.schema:
				workingJsonSchema = customTypes.getCustomType(nameAttr.value(), jsonSchema);
				jsonSchema.addSubSchema(nameAttr.value(), workingJsonSchema);
				workingJsonSchema.setType(jsonTypes.OBJECT);
				break;
			case elConst.redefine:
				throw new Error("complexType() needs to be impemented within redefine");
			case elConst.override:
				throw new Error("complexType() needs to be impemented within override");
			default:
				throw new Error("complexType() called from within unexpected parsing state!");
		}
		return true;
	}

	function handleAnonymousComplexType(node, jsonSchema, xsd) {
		// TODO: id, mixed, defaultAttributesApply
		// Ignore this grouping and continue processing children
		return true;
	}

	this.complexType = function (node, jsonSchema, xsd) {
		if (isNamed(node)) {
			return handleNamedComplexType(node, jsonSchema, xsd);
		} else {
			return handleAnonymousComplexType(node, jsonSchema, xsd);
		}
	};

	this.defaultOpenContent = function (node, jsonSchema, xsd) {
		// TODO: schema
		// (TBD)
		return true;
	};

	this.documentation = function (node, jsonSchema, xsd) {
		// TODO: source, xml:lang
		// Ignore this grouping and continue processing children.  The actual text will come through the text() method.
		return true;
	};

	function handleElementGlobal(node, jsonSchema, xsd) {
		var nameAttr = getAttr(node, attrConst.name);
		var typeAttr = getAttr(node, attrConst.type);
		// TODO: id, defaut, fixed, nillable, abstract, substitutionGroup, block, final

		if (typeAttr !== undefined) {
			var typeName = typeAttr.value();
			var customTypeType = customTypes.getCustomType(typeName, jsonSchema);
			workingJsonSchema = customTypeType.get$RefToSchema();
			jsonSchema.addSubSchema(nameAttr.value(), workingJsonSchema);
			//workingJsonSchema.setType(jsonTypes.OBJECT);
		} else {
			workingJsonSchema = customTypes.getCustomType(nameAttr.value(), jsonSchema);
			jsonSchema.addSubSchema(nameAttr.value(), workingJsonSchema);
			workingJsonSchema.setType(jsonTypes.OBJECT);
		}
		if (parsingState.inChoice()) {
			throw new Error("choice needs to be implemented in handleElementGlobal()!");
		}
		return true;
	}

	function addProperty(targetSchema, propertyName, customType, minOccursAttr) {
		if (minOccursAttr === undefined || minOccursAttr.value() > 0) {
			targetSchema.addRequired(propertyName);
		}
		targetSchema.setProperty(propertyName, customType);
	}

	function addChoiceProperty(targetSchema, propertyName, customType, minOccursAttr) {
		var choiceSchema = new JsonSchemaFile({});
		//choiceSchema.setAdditionalProperties(false);
		addProperty(choiceSchema, propertyName, customType, minOccursAttr);
		targetSchema.getOneOf().push(choiceSchema);
	}

	function addPropertyAsArray(targetSchema, propertyName, customType, minOccursAttr, maxOccursAttr) {
		var arraySchema = new JsonSchemaFile({});
		arraySchema.setType(jsonTypes.ARRAY);
		var min = minOccursAttr === undefined ? undefined : minOccursAttr.value();
		var max = maxOccursAttr === undefined ? undefined : maxOccursAttr.value();
		arraySchema.setMinItems(min);
		arraySchema.setMaxItems(max === "unbounded" ? undefined : max);
		arraySchema.setItems(customType);
		addProperty(targetSchema, propertyName, arraySchema, minOccursAttr);
	}

	function addChoicePropertyAsArray(targetSchema, propertyName, customType, minOccursAttr, maxOccursAttr) {
		var choiceSchema = new JsonSchemaFile({});
		//choiceSchema.setAdditionalProperties(false);
		addPropertyAsArray(choiceSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
		targetSchema.getOneOf().push(choiceSchema);
	}

	function handleElementLocal(node, jsonSchema, xsd) {
		var nameAttr = getAttr(node, attrConst.name);
		var typeAttr = getAttr(node, attrConst.type);
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);
		// TODO: id, form, defaut, fixed, nillable, block, targetNamespace

		var lookupName;
		if (typeAttr !== undefined) {
			lookupName = typeAttr.value();
		}
		var propertyName = nameAttr.value();  // name attribute is required for local element
		var customType;
		if (lookupName !== undefined) {
			customType = customTypes.getCustomType(lookupName, jsonSchema).get$RefToSchema();
		} else {
			customType = customTypes.getCustomType(propertyName, jsonSchema);
		}
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr.value() > 1 || maxOccursAttr.value() === "unbounded"));
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.choice:
				if (isArray) {
					addChoicePropertyAsArray(workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					addChoiceProperty(workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			case elConst.sequence:
			case elConst.all:
				if (isArray) {
					addPropertyAsArray(workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					addProperty(workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			default:
				throw new Error("element() [local] called from within unexpected parsing state!");
		}
		return true;
	}

	function handleElementReference(node, jsonSchema, xsd) {
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);
		var refAttr = getAttr(node, attrConst.ref);
		// TODO: id

		// An element within a model group (such as "group") may be a reference.  References have neither
		// a name nor a type attribute - just a ref attribute.  This is awkward when the reference elmenent
		// is a property of an object in JSON.  With no other options to name the property ref is used.
		var propertyName = refAttr.value();  // ref attribute is required for an element reference
		var customType = customTypes.getCustomType(propertyName, jsonSchema).get$RefToSchema();
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr.value() > 1 || maxOccursAttr.value() === "unbounded"));
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.choice:
				if (isArray) {
					addChoicePropertyAsArray(workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					addChoiceProperty(workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			case elConst.sequence:
			case elConst.all:
				if (isArray) {
					addPropertyAsArray(workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					addProperty(workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			default:
				throw new Error("element() [reference] called from within unexpected parsing state!");
		}
		return true;
	}

	this.element = function (node, jsonSchema, xsd) {
		var refAttr = getAttr(node, attrConst.ref);

		if (refAttr !== undefined) {
			return handleElementReference(node, jsonSchema, xsd);
		} else if (parsingState.isTopLevelEntity()) {
			return handleElementGlobal(node, jsonSchema, xsd);
		} else {
			return handleElementLocal(node, jsonSchema, xsd);
		}
	};

	this.enumeration = function (node, jsonSchema, xsd) {
		var val = getValueAttr(node);
		// TODO: id, fixed

		workingJsonSchema.addEnum(val)
		return true;
	};

	this.explicitTimezone = function (node, jsonSchema, xsd) {
		// TODO: id, fixed, value
		// (TBD)
		return true;
	};

	this.extension = function (node, jsonSchema, xsd) {
		var baseAttr = getAttr(node, attrConst.base);
		// TODO: id
		var baseType = new Qname(baseAttr.value());
		var baseTypeName = baseType.local();
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.complexContent:
				workingJsonSchema = workingJsonSchema.extend(customTypes.getCustomType(baseTypeName, jsonSchema), jsonTypes.OBJECT);
				break;
			case elConst.simpleType:
				throw new Error("extension() needs to be impemented within simpleType!");
			default:
				throw new Error("extension() called from within unexpected parsing state!");
		}
		return true;
	};

	this.field = function (node, jsonSchema, xsd) {
		// TODO: id, xpath, xpathDefaultNamespace
		// (TBD)
		return true;
	};

	this.fractionDigits = function (node, jsonSchema, xsd) {
		// TODO: id, value, fixed
		// do nothing - there is no coresponding functionality in JSON Schema
		return true;
	};

	function handleGroupDefinition(node, jsonSchema, xsd) {
		var nameAttr = getAttr(node, attrConst.name);
		// TODO: id

		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.schema:
				workingJsonSchema = customTypes.getCustomType(nameAttr.value(), jsonSchema);
				jsonSchema.addSubSchema(nameAttr.value(), workingJsonSchema);
				workingJsonSchema.setType(jsonTypes.OBJECT);
				break;
			case elConst.redefine:
				throw new Error("group() [definition] needs to be impemented within restriction!");
			case elConst.override:
				throw new Error("group() [definition] needs to be impemented within choice!");
			default:
				throw new Error("group() [definition] called from within unexpected parsing state!");
		}
		return true;
	}

	function handleGroupReferenceOld(node, jsonSchema, xsd) {
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var refName = getAttr(node, attrConst.ref).value();
		// TODO: id, maxOccurs

		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.extension:
				throw new Error("group() [reference] needs to be impemented within extension!");
			case elConst.restriction:
				throw new Error("group() [reference] needs to be impemented within restriction!");
			case elConst.choice:
				throw new Error("group() [reference] needs to be impemented within choice!");
			case elConst.complexType:
			case elConst.sequence:
			case elConst.all:
				if (minOccursAttr === undefined || minOccursAttr.value() > 0) {
					workingJsonSchema.addRequired(refName);
				}
				var customType = customTypes.getCustomType(refName, jsonSchema);
				workingJsonSchema.setProperty(refName, customType.get$RefToSchema());
				break;
			default:
				throw new Error("group() [reference] called from within unexpected parsing state!");
		}
		return true;
	}

	function handleGroupReference(node, jsonSchema, xsd) {
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);
		var refAttr = getAttr(node, attrConst.ref);
		// TODO: id

		var propertyName = refAttr.value();  // ref attribute is required for group reference
		var customType = customTypes.getCustomType(propertyName, jsonSchema).get$RefToSchema();
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr.value() > 1 || maxOccursAttr.value() === "unbounded"));
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.extension:
				throw new Error("group() [reference] needs to be impemented within extension!");
			case elConst.restriction:
				throw new Error("group() [reference] needs to be impemented within restriction!");
			case elConst.choice:
				if (isArray) {
					addChoicePropertyAsArray(workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					addChoiceProperty(workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			case elConst.complexType:
			case elConst.sequence:
			case elConst.all:
				if (isArray) {
					addPropertyAsArray(workingJsonSchema, propertyName, customType, minOccursAttr, maxOccursAttr);
				} else {
					addProperty(workingJsonSchema, propertyName, customType, minOccursAttr);
				}
				break;
			default:
				throw new Error("group() [reference] called from within unexpected parsing state!");
		}
		return true;
	}

	this.group = function (node, jsonSchema, xsd) {
		if (isReference(node)) {
			return handleGroupReference(node, jsonSchema, xsd);
		} else {
			return handleGroupDefinition(node, jsonSchema, xsd);
		}
	};

	this.import = function (node, jsonSchema, xsd) {
		// TODO: id, namespace, schemaLocation
		// do nothing
		return true;
	};

	this.include = function (node, jsonSchema, xsd) {
		// TODO: id, schemaLocation
		// do nothing
		return true;
	};

	function handleKeyConstraint() {
		// TODO: id, name
		// (TBD)
		return true;
	}

	function handleKeyReferenceToKeyConstraint() {
		// TODO: id, ref
		// (TBD)
		return true;
	}

	this.key = function (node, jsonSchema, xsd) {
		// (TBD)
		return true;
	};

	function handleKeyReference(node, jsonSchema, xsd) {
		// TODO: id, name, refer
		// (TBD)
		return true;
	}

	function handleKeyReferenceToKeyReference(node, jsonSchema, xsd) {
		// TODO: id, ref
		// (TBD)
		return true;
	}

	this.keyref = function (node, jsonSchema, xsd) {
		// (TBD)
		return true;
	};

	this.length = function (node, jsonSchema, xsd) {
		// TODO: id, fixed
		var len = getValueAttr(node);

		workingJsonSchema.setMaxLength(len);
		workingJsonSchema.setMinLength(len);
		return true;
	};

	this.list = function (node, jsonSchema, xsd) {
		// TODO: id, itemType
		// (TBD)
		return true;
	};

	this.maxExclusive = function (node, jsonSchema, xsd) {
		var val = getValueAttr(node);
		// TODO: id, fixed
	
		workingJsonSchema.setMaximum(val);
		workingJsonSchema.setExlusiveMaximum(true);
		return true;
	};

	this.maxInclusive = function (node, jsonSchema, xsd) {
		var val = getValueAttr(node);
		// TODO: id, fixed
	
		workingJsonSchema.setMaximum(val); // inclusive is the JSON Schema default
		return true;
	};

	this.maxLength = function (node, jsonSchema, xsd) {
		var len = getValueAttr(node);
		// TODO: id, fixed
	
		workingJsonSchema.setMaxLength(len);
		return true;
	};

	this.minExclusive = function (node, jsonSchema, xsd) {
		var val = getValueAttr(node);
		// TODO: id, fixed
	
		workingJsonSchema.setMinimum(val);
		workingJsonSchema.setExclusiveMinimum(true);
		return true;
	};

	this.minInclusive = function (node, jsonSchema, xsd) {
		var val = getValueAttr(node);
		// TODO: id, fixed
	
		workingJsonSchema.setMinimum(val); // inclusive is the JSON Schema default
		return true;
	};

	this.minLength = function (node, jsonSchema, xsd) {
		var len = getValueAttr(node);
		// TODO: id, fixed
	
		workingJsonSchema.setMinLength(len);
		return true;
	};

	this.notation = function (node, jsonSchema, xsd) {
		// TODO: id, name, public, system
		// (TBD)
		return true;
	};

	this.openContent = function (node, jsonSchema, xsd) {
		// TODO: id, mode
		// (TBD)
		return true;
	};

	this.override = function (node, jsonSchema, xsd) {
		// TODO: id, schemaLocation
		// (TBD)
		return true;
	};

	this.pattern = function (node, jsonSchema, xsd) {
		var pattern = getValueAttr(node);
		// TODO: id
	
		workingJsonSchema.setPattern(pattern);
		return true;
	};

	this.redefine = function (node, jsonSchema, xsd) {
		// TODO: id, schemaLocation
		// (TBD)
		return true;
	};

	this.restriction = function (node, jsonSchema, xsd) {
		var baseAttr = getAttr(node, attrConst.base);
		var baseType = new Qname(baseAttr.value());
		var baseTypeName = baseType.local();
		// TODO: id, (base inheritance via allOf)

		if (restrictionConverter[baseTypeName] === undefined) {
			// customTypes.getCustomType(baseTypeName, jsonSchema).clone(workingJsonSchema);
			workingJsonSchema = workingJsonSchema.extend(customTypes.getCustomType(baseTypeName, jsonSchema));
			return true;
		} else {
			return restrictionConverter[baseTypeName](node, workingJsonSchema);
		}
	};

	function buildAttributeMap(node) {
		var map = {};
		var attrs = node.attrs();
		attrs.forEach(function (attr, index, array) {
			map[attr.name()] = attr.value();
		});
		return map;
	}

	this.schema = function (node, jsonSchema, xsd) {
		// TODO: id, version, targetNamespace, attributeFormDefualt, elementFormDefualt, blockDefault, finalDefault, xml:lang, defaultAttributes, xpathDefaultNamespace
		// (TBD)
		jsonSchema.setDescription("Schema tag attributes: " + utils.objectToString(buildAttributeMap(node)));
		return true;
	};

	this.selector = function (node, jsonSchema, xsd) {
		// TODO: key, keyref, unique
		// (TBD)
		return true;
	};

	this.sequenceOld = function (node, jsonSchema, xsd) {
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);
		// TODO: id
		
		if (minOccursAttr !== undefined && minOccursAttr.value() == 0) {
			throw new Error("optional sequences need to be implemented!");
		}
		if (maxOccursAttr !== undefined && minOccursAttr.value() != 0) {
			throw new Error("sequence arrays need to be implemented!");
		}
		if (parsingState.inChoice()) {
			throw new Error("sequence() needs to be implemented in choice!");
		}
		return true;
	};

	this.sequence = function (node, jsonSchema, xsd) {
		var minOccursAttr = getAttr(node, attrConst.minOccurs);
		var maxOccursAttr = getAttr(node, attrConst.maxOccurs);
		var isArray = (maxOccursAttr !== undefined && (maxOccursAttr.value() > 1 || maxOccursAttr.value() === "unbounded"));
		if (isArray) {
			throw new Error("sequence arrays need to be implemented!");
		}
		var isOptional = (minOccursAttr !== undefined && minOccursAttr.value() == 0);
		var state = parsingState.getCurrentState();
		switch (state.name) {
			case elConst.choice:
				var choiceSchema = new JsonSchemaFile({});
				choiceSchema.setAdditionalProperties(false);
				workingJsonSchema.getOneOf().push(choiceSchema);
				schemaManager.pushSchema(workingJsonSchema);
				workingJsonSchema = choiceSchema;
				break;
			case elConst.complexType:
				break;
			case elConst.extension:
				break;
			case elConst.group:
				break;
			case elConst.restriction:
				break;
			case elConst.sequence:
				if (isOptional) {
					var optionalSequenceSchema = new JsonSchemaFile({});
					workingJsonSchema.getAnyOf().push(optionalSequenceSchema);
					schemaManager.pushSchema(workingJsonSchema);
					workingJsonSchema = optionalSequenceSchema;
				} else {
					throw new Error("Required nested sequences need to be implemented!");
				}
				break;
			default:
				throw new Error("sequence() called from within unexpected parsing state!");
		}
		return true;
	}

	this.simpleContent = function (node, jsonSchema, xsd) {
		// TODO: id
		// Ignore this grouping and continue processing children
		return true;
	};

	function handleSimpleTypeNamedGlobal(node, jsonSchema, xsd) {
		var nameAttr = getAttr(node, attrConst.name);
		// TODO: id, final

		workingJsonSchema = customTypes.getCustomType(nameAttr.value(), jsonSchema);
		jsonSchema.addSubSchema(nameAttr.value(), workingJsonSchema);
		return true;
	}

	function handleSimpleTypeAnonymousLocal(node, jsonSchema, xsd) {
		// TODO: id
		// Ignore this grouping and continue processing children
		return true;
	}

	this.simpleType = function (node, jsonSchema, xsd) {
		if (isNamed(node)) {
			return handleSimpleTypeNamedGlobal(node, jsonSchema, xsd);
		} else {
			return handleSimpleTypeAnonymousLocal(node, jsonSchema, xsd);
		}
	};

	this.text = function (node, jsonSchema, xsd) {
		if (parsingState.inDocumentation()) {
			return true;
			// TODO: This should be a configurable option
			// workingJsonSchema.setDescription(node.text());
		} else if (parsingState.inAppInfo()) {
			workingJsonSchema.concatDescription(node.parent().name() + "=" + node.text() + " ");
		}
		return true;
	};

	this.totalDigits = function (node, jsonSchema, xsd) {
		// TODO: id, value, fixed
		// do nothing - there is no coresponding functionality in JSON Schema
		return true;
	};

	this.union = function (node, jsonSchema, xsd) {
		// TODO: id, memberTypes
		// (TBD)
		return true;
	};

	function handleUniqueConstraint(node, jsonSchema, xsd) {
		// TODO: id, name
		// (TBD)
		return true;
	}

	function handleUniqueReferenceToUniqueConstraint(node, jsonSchema, xsd) {
		// TODO: id, ref
		// (TBD)
		return true;
	}

	this.unique = function (node, jsonSchema, xsd) {
		// (TBD)
		return true;
	};

	this.whitespace = function (node, jsonSchema, xsd) {
		// TODO: id, value, fixed
		// (TBD)
		return true;
	};
}

module.exports = BaseConverter;
