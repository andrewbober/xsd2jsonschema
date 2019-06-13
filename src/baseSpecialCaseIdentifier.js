'use strict';

const debug = require('debug')('xsd2jsonschema:BaseSpecialCaseIdentifier');

const XsdFile = require('./xmlschema/xsdFileXmlDom');
const XsdAttributes = require('./xmlschema/xsdAttributes');
const XsdAttributeValues = require('./xmlschema/xsdAttributeValues');
const XsdNodeTypes = require('./xmlschema/xsdNodeTypes');
const XsdElements = require('./xmlschema/xsdElements');
const JsonSchemaFile = require('./jsonschema/jsonSchemaFile');

const specialCases_NAME = Symbol();

/**
 * Class representing a collection of logic to identify special cases in XML Schema that cannot be immediately
 * converted to JSON Schmea without inspecting the contents of the tag or the tag's siblings.  Examples:
 *
 * 1. A choice where the goal is really anyOf.  For example:
 * 			<xs:choice>
 *				<xs:sequence>
 *					<xs:element name='DemandingPartyInfo' type='DemandingPartyInfoType'/>
 *					<xs:element name='ResponsiblePartyInfo' type='DemandingPartyInfoType' minOccurs='0'/>
 *					<xs:element name='ArbitrationDecisionInfo' type='DemandingPartyInfoType' minOccurs='0'/>
 *  			</xs:sequence>
 *				<xs:sequence>
 *					<xs:element name='ResponsiblePartyInfo' type='DemandingPartyInfoType'/>
 *					<xs:element name='ArbitrationDecisionInfo' type='DemandingPartyInfoType' minOccurs='0'/>
 *				</xs:sequence>
 *				<xs:element name='ArbitrationDecisionInfo' type='DemandingPartyInfoType'/>
 *			</xs:choice>
 * 
 * 2. Sibling choice tag.  For example:
 *		<xs:complexType name='SiblingChoince'>
 *			<xs:sequence>
 *				<xs:choice>
 *					<xs:element name='OptionB' type='xs:string'/>
 *					<xs:element name='OptionA' type='xs:string' minOccurs='0'/>
 *				</xs:choice>
 *				<xs:choice>
 *					<xs:element name='Option3' type='xs:string' />
 *					<xs:element name='Option2' type='xs:string' minOccurs='0' />
 *					<xs:element name='Option1' type='xs:string' minOccurs='0' />
 *				</xs:choice>
 *			</xs:sequence>
 *		</xs:complexType>
 *
 * 3. Optional sequence and/or choice tags.  For example:
 *			<xs:choice minOccurs="0">
 *				<xs:element name="Option2" type="xs:string" minOccurs="0"/>
 *				<xs:element name="Option1" type="xs:string" minOccurs="0"/>
 *			</xs:choice>
 *
 */

class BaseSpecialCaseIdentifier {
    constructor() {
        this.specialCases = [];
    }

    // Getters/Setters

    get specialCases() {
        return this[specialCases_NAME];
    }
    set specialCases(newSpecialCase) {
        this[specialCases_NAME] = newSpecialCase;
    }

    addSpecialCase(specialCase, jsonschema, node) {
        this.specialCases.push({
            specialCase: specialCase,
            jsonSchema: jsonschema,
            node: node
        });
    }

    isOptional(node, xsd, minOccursAttr) {
        var minOccurs;
        if (minOccursAttr == undefined) {
            minOccurs = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
        } else {
            minOccurs = minOccursAttr;
        }
        return minOccurs !== undefined && minOccurs == 0;
    }

    isSiblingChoice(node, xsd) {
        var retval = XsdFile.countChildren(node.parentNode, XsdElements.CHOICE) > 1;
        return retval;
    }

    countNonTextNodes(nodelist) {
        var count = 0;

        for (let i = 0; i < nodelist.length; i++) {
            if (nodelist.item(i).nodeType != XsdNodeTypes.TEXT_NODE) {
                debug(`NodeType=${XsdNodeTypes.getTypeName(nodelist.item(i).nodeType)} NodeName = ${nodelist.item(i).localName}`);
                count++;
            }
        }
        return count;
    }

    locateNewNameType(nameTypes, childrenOfOneOfTheChoiceOptions) {
        for (let nt = 0; nt < nameTypes.length; nt++) {
            for (let c = 0; c < childrenOfOneOfTheChoiceOptions.length; c++) {
                const node = childrenOfOneOfTheChoiceOptions[c];
                const name = XsdFile.getAttrValue(node, XsdAttributes.NAME);
                const type = XsdFile.getAttrValue(node, XsdAttributes.TYPE);
                const minOccurs = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
                if (nameTypes[nt].name != name && minOccurs == undefined) {
                    return {
                        name: name,
                        type: type
                    };
                }
            }
        }
        return undefined;
    }

    verifyPriorChoices(nameTypes, childrenOfOneOfTheChoiceOptions) {
        for (let nt = 0; nt < nameTypes.length; nt++) {
            let optionalPriorNameTypeFound = false;
            for (let c = 0; c < childrenOfOneOfTheChoiceOptions.length; c++) {
                const node = childrenOfOneOfTheChoiceOptions[c];
                const name = XsdFile.getAttrValue(node, XsdAttributes.NAME);
                const type = XsdFile.getAttrValue(node, XsdAttributes.TYPE);
                const minOccurs = XsdFile.getAttrValue(node, XsdAttributes.MIN_OCCURS);
                if (nameTypes[nt].name === name && nameTypes[nt].type === type && minOccurs === XsdAttributeValues.ZERO) {
                    optionalPriorNameTypeFound = true;
                }
            }
            if (!optionalPriorNameTypeFound) {
                return false;
            }
        }
        return true;
    }

    checkNode(nameTypes, nextChoiceOption, expectedChildCount) {
        var retval;
        const children = this.nodeListToArray(nextChoiceOption.childNodes);
        const actualChildCount = children.length;
        if (actualChildCount == expectedChildCount && this.verifyPriorChoices(nameTypes, children)) {
            retval = this.locateNewNameType(nameTypes, children);
        }
        return retval;
    }

    isOptionallyIncremental(nameTypes, sortedChoiceChildren, index) {
        if (index == sortedChoiceChildren.length) {
            return true;
        }
        const node = sortedChoiceChildren[index];
        const checkNameType = this.checkNode(nameTypes, node, index + 1);
        if (checkNameType != undefined) {
            nameTypes.push(checkNameType);
            return this.isOptionallyIncremental(nameTypes, sortedChoiceChildren, index + 1);
        } else {
            return false;
        }
    }

    nodeListToArray(nodelist) {
        var array = [];
        for (let i = 0; i < nodelist.length; i++) {
            if (nodelist.item(i).nodeType != XsdNodeTypes.TEXT_NODE) {
                array.push(nodelist.item(i));
            }
        }
        return array;
    }

    isAnyOfChoice(node, xsd) {
        var retval = false;
        if (node.hasChildNodes() && node.childNodes.length > 1) {
            var sortedChildren = this.nodeListToArray(node.childNodes).sort((a, b) => {
                const aHasNodes = a.hasChildNodes();
                const bHasNodes = b.hasChildNodes();
                var aNodeCount = 0;
                var bNodeCount = 0;
                if (aHasNodes) {
                    aNodeCount = a.childNodes.length;
                }
                if (bHasNodes) {
                    bNodeCount = b.childNodes.length;
                }
                if (aNodeCount < bNodeCount) {
                    return -1;
                } else if (aNodeCount > bNodeCount) {
                    return 1;
                } else {
                    return 0;
                }
            });
            const firstChild = sortedChildren[0];
            if (XsdFile.hasAttribute(firstChild, XsdAttributes.NAME) && XsdFile.hasAttribute(firstChild, XsdAttributes.TYPE)) {
                var nameTypes = [{}];
                nameTypes[0].name = XsdFile.getAttrValue(firstChild, XsdAttributes.NAME);
                nameTypes[0].type = XsdFile.getAttrValue(firstChild, XsdAttributes.TYPE);
                retval = this.isOptionallyIncremental(nameTypes, sortedChildren, 1);
            }
        }
        return retval;
    }

    generateAnyOfChoice(jsonSchema) {
        if (jsonSchema.oneOf.length == 0) {
            return;
        }
        debug('BEFORE Generating anyOfChoice\n' + jsonSchema);

        var anyOf = jsonSchema.oneOf[0];
        anyOf.required.length = 0;
        Object.keys(anyOf.properties).forEach(function(prop, index, array) {
            debug(prop + '=' + anyOf.properties[prop]);
            const newAnyOf = jsonSchema.newJsonSchemaFile();
            newAnyOf.setProperty(prop, anyOf.properties[prop]);
            newAnyOf.addRequired(prop);
            jsonSchema.anyOf.push(newAnyOf);
        });
        jsonSchema.oneOf = [];

        debug('AFTER Generating anyOfChoice\n' + jsonSchema);
    }

    fixAnyOfChoice(jsonSchema, node) {
        if (jsonSchema.allOf.length != 0) {
            // A sibling choice will have the siblings in the allOf array.
            jsonSchema.allOf.forEach(function(choiceSchema, index, array) {
                if (choiceSchema.isAnyOfChoice === true) {
                    this.generateAnyOfChoice(choiceSchema);
                }
            }, this);
        } else {
            this.generateAnyOfChoice(jsonSchema);
        }
    }

    // The "Everything else is valid" SOLUTION
    // 1) Push an empty schema onto anyOf.  Always passes validation, as if the empty schema {}
    fixOptionalChoiceTruthy(jsonSchema, node) {
        debug('Fixing optional ' + XsdFile.nodeQuickDumpStr(node) + ' using a Truthy schema.');
        debug('Optional choice: ' + jsonSchema.toString());

        // Add an the optional part (empty schema)
    	var emptySchema = jsonSchema.newJsonSchemaFile();
		emptySchema.description = "This truthy schema is what makes an optional <choice> optional."
		jsonSchema.parent.anyOf.push(emptySchema);
		debug('Parent: ' + jsonSchema.parent.toString());
    }

    // The "Not" SOLUTION - elimiated because allows ANYTHING not listed in the dependent properties.
    // 1) push oneOf onto anyOf and create new empty oneOf array
    // 2) create new 'optional' schema and also push it onto anyOf
    // 3) populate optional schema allOf with a 'not' for each member of the original oneOf
    fixOptionalChoiceNot(jsonSchema, node) {
        debug('Fixing optional choice ' + XsdFile.nodeQuickDumpStr(node) + ' using the Not solution.');
        debug('Optional choice: ' + jsonSchema.toString());
        const originalOneOf = jsonSchema.newJsonSchemaFile();
        originalOneOf.oneOf = jsonSchema.oneOf.slice(0);
        originalOneOf.description = 'originalOneOf';
        jsonSchema.anyOf.push(originalOneOf);
        const theOptionalPart = jsonSchema.newJsonSchemaFile();
        theOptionalPart.description = 'theOptionalPart';
        jsonSchema.oneOf.forEach(function(option, index, array) {
//            const theOptionalPart = jsonSchema.newJsonSchemaFile();
            const notSchema = theOptionalPart.newJsonSchemaFile();
            notSchema.not = option;
            debug('Pushing not schema');
            theOptionalPart.allOf.push(notSchema);
        });
        jsonSchema.anyOf.push(theOptionalPart);
        jsonSchema.oneOf = [];
        jsonSchema.description = 'This is the NOT solution';
        debug('Parent: ' + jsonSchema.parent.toString());
    }

    // The "Property Dependency" SOLUTION
    // 1) push oneOf onto anyOf and create new empty oneOf array
    // 2) create new 'optional' schema and also push it onto anyOf
    // 3) populate optional schema allOf with a 'not' for each member of the original oneOf
    fixOptionalChoicePropertyDependency(jsonSchema, node) {
        debug('Fixing optional choice ' + XsdFile.nodeQuickDumpStr(node) + ' using the Property Dependency solution.');
        debug('Optional choice: ' + jsonSchema.toString());
        const originalOneOf = jsonSchema.newJsonSchemaFile();
        originalOneOf.oneOf = Array.from(jsonSchema.oneOf);
        jsonSchema.anyOf.push(originalOneOf);
        const theOptionalPart = jsonSchema.newJsonSchemaFile();
        jsonSchema.oneOf.forEach(function(option, index, array) {
            const dependencySchema = theOptionalPart.newJsonSchemaFile();
            dependencySchema.not = option;
            theOptionalPart.addPropertyDependency(option.name, option); // This needs to be checked/finished
            //theOptionalPart.allOf.push(notSchema);
        });
        jsonSchema.anyOf.push(theOptionalPart);
        jsonSchema.oneOf = [];
        debug('Parent: ' + jsonSchema.parent.toString());
    }

    fixOptionalChoice(jsonSchema, node) {
        // switch (options)
        this.fixOptionalChoiceTruthy(jsonSchema, node)
        //this.fixOptionalChoiceNot(jsonSchema, node)
        return;
    }

    fixOptionalSequence(jsonSchema, node) {
        debug("NOT IMPLEMENTED")
        return;
    }

    processSpecialCases() {
        while (this.specialCases.length > 0) {
            const sc = this.specialCases.pop()
            this[sc.specialCase](sc.jsonSchema, sc.node);
        }
    }
}

module.exports = BaseSpecialCaseIdentifier;
