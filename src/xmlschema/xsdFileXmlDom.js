'use strict';

const debug = require('debug')('xsd2jsonSchema:XsdFile');

const DOMParser = require('xmldom').DOMParser;
const fs = require('fs');
//const path = require('path');
const xpathProcessor = require('xpath');
const URI = require('urijs');
const XsdAttributes = require('./xsdAttributes');
const XsdElements = require('./xsdElements');
const XsdAttributeValues = require('./xsdAttributeValues');
const XsdNodeTypes = require('./xsdNodeTypes');


const baseFilename_NAME = Symbol();
const uri_NAME = Symbol();
const xmlDoc_NAME = Symbol();
const includeUris_NAME = Symbol();
const namespaces_NAME = Symbol();

/**
 * XML Schema file operations
 * TBD (xmldom)
 */
class XsdFile {
    constructor(options) {
        if (options == undefined) {
            throw new Error("Parameter 'options' is required")
        }
        if (options.uri == undefined) {
            throw new Error("'options.uri' is required");
        }
        this.uri = new URI(options.uri);
        this.baseFilename = this.uri.filename();
        if (options.xml == undefined) {
            options.xml = fs.readFileSync(this.uri.toString()).toString();
        }
        this.xmlDoc = new DOMParser().parseFromString(options.xml, 'text/xml');
        this.namespaces = {};
        this.initilizeNamespaces();
        this.initializeIncludes();
    }

	// Getters/Setters

    get baseFilename() {
        return this[baseFilename_NAME];
    }
    set baseFilename(newBaseFilename) {
        this[baseFilename_NAME] = newBaseFilename
    }

    get uri() {
        return this[uri_NAME];
    }
    set uri(newUri) {
        this[uri_NAME] = newUri;
    }

    get xmlDoc() {
        return this[xmlDoc_NAME];
    }
    set xmlDoc(newDoc) {
        this[xmlDoc_NAME] = newDoc;
    }

    get includeUris() {
        return this[includeUris_NAME];
    }
    set includeUris(newIncludeUris) {
        this[includeUris_NAME] = newIncludeUris;
    }

    get namespaces() {
        return this[namespaces_NAME];
    }
    set namespaces(newNamespaces) {
        this[namespaces_NAME] = newNamespaces;
    }

    // read-only properties
    get schemaElement() {
        return this.xmlDoc.documentElement;
    }

    get targetNamespace(){
        return this.xmlDoc.documentElement.getAttribute(XsdAttributes.TARGET_NAMESPACE);
    }

// 1	Map the XML Schmea Namespase to a prefix such as xsd or xs, and make the target namespace the default namespace.
// 2	Map a prefix to the target namespace, and make the  XML Schema Namespase the default namespace.
// 3	Map prefixes to all the namespaces.
    initilizeNamespaces() {
		const attrs = XsdFile.getAttributes(this.schemaElement);
		Object.keys(attrs).forEach(function (key, index, array) {
            const attr = attrs[key];
            if (attr.nodeType === XsdNodeTypes.ATTRIBUTE_NODE) {
                const attrValue = attr.value;
				switch (attr.localName) {
					case XsdAttributes.TARGET_NAMESPACE:
						this.namespaces[XsdAttributes.TARGET_NAMESPACE] = attrValue;
                        break;
                    case XsdAttributeValues.XMLNS:
                        this.namespaces[''] = attrValue;
                        break;
					default :
						if(attr.prefix === 'xmlns') {
                            const namespace = attr.localName;
                            this.namespaces[namespace] = attrValue;
						}
						break;
				}
            }
        }, this);
    }

    resolveNamespace(namespace) {
        return this.namespaces[namespace];
    }

    hasIncludes() {
        return this.includeUris.length > 0;
    }

    initializeIncludes() {
        if (this.includeUris === undefined) {
            var includeNodes = this.schemaElement.getElementsByTagName(this.schemaElement.prefix + ':include');
            this.includeUris = [];
            for (let i = 0; i < includeNodes.length; i++) {
                const includeNode = includeNodes.item(i);
                this.includeUris.push(includeNode.getAttribute(XsdAttributes.SCHEMA_LOCATION));
            }
        }
        return this.includeUris;
    }

    select(xpath, ns, namespace) {
        var nodes;
        try {
            const select = xpathProcessor.useNamespaces(this.namespaces);
            nodes = select(xpath, this.xmlDoc);
        } catch (error) {
            debug(error);
            throw error;
        }
        return nodes
    }

    select1(xpath, ns, namespace) {
        var node;
        try {
            const select = xpathProcessor.useNamespaces(this.namespaces);
            node = select(xpath, this.xmlDoc, true);
        } catch (error) {
            debug(error);
            throw error;
        }
        return node;
    }

    toString() {
        const str = 
`baseFilename=${this.baseFilename}
uri=${this.uri}
includeUris=${this.includeUris}
namespaces=${JSON.stringify(this.namespaces, null, '\t')}
xmlDoc=${this.xmlDoc}`
        return str;
    }

    /**
     *  xml interface
     * 
     * 1) dumpAttrs
     * 2) getAttrValue
     * 3) hasAttr
     * 4) getAttrValue
     * 5) getValueAttr
     * 6) dumpNode
     * 7) getNodeName
     * 8) isNamed
     * 9) isReference
     * 10) countChildren
     * 11) buildAttributeMap
     * 12) getChildNodes
     * 13) getAttributes
     */
    /* *********************************************************************************** */

    static dumpAttrs(node) {
        var attrs = node.attributes;
        debug('XML-TAG-Attributes:');
        if (attrs != undefined) {
            Object.keys(attrs).forEach(function (attr, index, array) {
                if (attrs[attr].nodeType === XsdNodeTypes.ATTRIBUTE_NODE) {  // 2
                    debug('\t' + index + ') ' + attrs[attr].localName + '=' + attrs[attr].value);
                }
            }, this);
        }
    }

    static getAttrValue(node, attrName) {
        var retval;
        if (this.hasAttribute(node, attrName)) {
            retval = node.getAttribute(attrName);
        }
        return retval;
    }

    static hasAttribute(node, attrName) {
        if (node.hasAttribute !== undefined) {
            return node.hasAttribute(attrName);
        } else {
            return false;
        }
    }

    static getValueAttr(node) {
        return this.getAttrValue(node, XsdAttributes.VALUE);
    }

    static getNumberValueAttr(node) {
        var retval = Number(this.getAttrValue(node, XsdAttributes.VALUE));
        if (isNaN(retval)) {
            throw new Error('Unable create a Number from [' + this.getAttrValue(node, XsdAttributes.VALUE) + ']');
        }
        return retval;
    }

    static getTypeNode(node) {
        let typeNode = node;
        while (typeNode.parentNode.localName != XsdElements.SCHEMA) {
            typeNode = typeNode.parentNode;
        }
        return typeNode;
    }

    static dumpNode(node) {
        debug('__________________________________________');
        debug('XML-Type= ' + node.nodeType);
        debug('XML-TAG-Name= ' + node.nodeName);
        debug('XML-TAG-NameSpace= ' + node.namespaceURI + '=' + node.namespaceURI);
        var text = node.textContent;
        if (text != undefined && text.length != 0) {
            debug('XML-Text= [' + text + ']');
        }
        this.dumpAttrs(node);
        debug('_______________________');
    }

    static getNodeName(node) {
        var name;
        switch (node.nodeType) {
            case XsdNodeTypes.TEXT_NODE: // 3
                name = 'text';
                break;
            case XsdNodeTypes.COMMENT_NODE: // 8
                name = 'comment';
                break;
            default:
                name = node.localName
        }
        return name;
    }

    static isNamed(node) {
        return this.hasAttribute(node, XsdAttributes.NAME);
    }

    static isReference(node) {
        return this.hasAttribute(node, XsdAttributes.REF);
    }

    static countChildren(node, tagName) {
        // return node.childNodes.length;
        const nodeName = node.prefix + ':' + tagName;
        var len = node.getElementsByTagName(nodeName).length;
        return len;
    }

    static buildAttributeMap(node) {
        var map = {};
        var attrs = node.attributes;
        Object.keys(attrs).forEach(function (attr, index, array) {
            if (attrs[attr].nodeType === XsdNodeTypes.ATTRIBUTE_NODE) {
                map[attrs[attr].nodeName] = attrs[attr].value;
            }
        }, this);
        return map;
    }

    static getChildNodes(node) {
        var retval = [];
        var nodelist = node.childNodes;
        if (nodelist != undefined) {
            for (let i = 0; i < nodelist.length; i++) {
                retval.push(nodelist.item(i));
            }
        }
        return retval;
    }

    static getAttributes(node) {
        return node.attributes;
    }
}

module.exports = XsdFile;
