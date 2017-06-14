"use strict";

const DOMParser = require('xmldom').DOMParser;
const fs = require("fs");
const path = require("path");
const xsdAttributes = require("./xsdAttributes");
const XsdNodeTypes = require('./xsdNodeTypes');


const baseFilename_NAME = Symbol();
const xmlSchemaNamespace_NAME = Symbol();
const uri_NAME = Symbol();
const xmlDoc_NAME = Symbol();
const schemaElement_NAME = Symbol();
const includeUris_NAME = Symbol();
const namespace_NAME = Symbol();
const schemaNamespace_NAME = Symbol();
const namespaces_NAME = Symbol();
const targetNamespace_NAME = Symbol();

/**
 * XML Schema file operations
 * TBD (xmldom)
 */
class XsdFile {
    constructor(uriParm) {
        this.baseFilename = path.basename(uriParm);
        this.xmlSchemaNamespace = 'http://www.w3.org/2001/XMLSchema';
        this.uri = uriParm;
        var data = fs.readFileSync(this.uri);
        this.xmlDoc = new DOMParser().parseFromString(data.toString(), "text/xml");
        this.schemaElement = this.xmlDoc.documentElement;
        //this.includeUris = undefined;
        this.namespace = this.schemaElement.getAttribute(xsdAttributes.TARGET_NAMESPACE);
        //this.schemaNamespace = undefined;
        //this.namespaces = undefined;
        //this.targetNamespace = undefined;
        // this.dumpAttrs();
    }
    get baseFilename() {
        return this[baseFilename_NAME];
    }
    set baseFilename(newBaseFilename) {
        this[baseFilename_NAME] = newBaseFilename
    }

    get xmlSchemaNamespace() {
        return this[xmlSchemaNamespace_NAME];
    }
    set xmlSchemaNamespace(newXmlSchemaNamespace) {
        this[xmlSchemaNamespace_NAME] = newXmlSchemaNamespace;
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

    get schemaElement() {
        return this[schemaElement_NAME];
    }
    set schemaElement(newSchemaElement) {
        this[schemaElement_NAME] = newSchemaElement;
    }

    get includeUris() {
        return this[includeUris_NAME];
    }
    set includeUris(newIncludeUris) {
        this[includeUris_NAME] = newIncludeUris;
    }

    get namespace() {
        return this[namespace_NAME];
    }
    set namespace(newNamespace) {
        this[namespace_NAME] = newNamespace;
    }

    get schemaNamespace() {
        return this[schemaNamespace_NAME];
    }
    set schemaNamespace(newSchemaNamespace) {
        this[schemaNamespace_NAME] = newSchemaNamespace;
    }

    get namespaces() {
        return this[namespaces_NAME];
    }
    set namespaces(newNamespaces) {
        this[namespaces_NAME] = newNamespaces;
    }

    get targetNamespace() {
        if (this[targetNamespace_NAME] === undefined) {
            this.targetNamespace = this.schemaElement.getAttribute(xsdAttributes.TARGET_NAMESPACE);
        }
        return this[targetNamespace_NAME];
    }
    set targetNamespace(newTargetNamespace) {
        this[targetNamespace_NAME] = newTargetNamespace;
    }

    hasIncludes() {
        return this.getIncludes().length > 0;
    }

    getIncludes() {
        if (this.includeUris === undefined) {
            var includeNodes = this.schemaElement.getElementsByTagName(this.schemaElement.prefix + ":include");
            this.includeUris = [];
            for (let i = 0; i < includeNodes.length; i++) {
                const includeNode = includeNodes.item(i);
                this.includeUris.push(includeNode.getAttribute(xsdAttributes.SCHEMA_LOCATION));
            }
        }
        return this.includeUris;
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
     * 10) getIncludes
     * 11) countChildren
     * 12) buildAttributeMap
     * 13) getChildNodes
     */
    /* *********************************************************************************** */

    static dumpAttrs(node) {
        var attrs = node.attributes;
        console.log("XML-TAG-Attributes:");
        if (attrs != undefined) {
            Object.keys(attrs).forEach(function (attr, index, array) {
                if (attrs[attr].nodeType === XsdNodeTypes.ATTRIBUTE_NODE) {  // 2
                    console.log("\t" + index + ") " + attrs[attr].localName + "=" + attrs[attr].value);
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
        return this.getAttrValue(node, xsdAttributes.VALUE);
    }

    static dumpNode(node) {
        console.log("__________________________________________");
        console.log("XML-Type= " + node.nodeType);
        console.log("XML-TAG-Name= " + node.nodeName);
        console.log("XML-TAG-NameSpace= " + node.namespaceURI + "=" + node.namespaceURI);
        var text = node.nodeValue;
        if (text != undefined && text.length != 0) {
            console.log("XML-Text= [" + text + "]");
        }
        this.dumpAttrs(node);
        console.log("_______________________");
    }

    static getNodeName(node) {
        var name;
        switch (node.nodeType) {
            case XsdNodeTypes.TEXT_NODE: // 3
                name = "text";
                break;
            case XsdNodeTypes.COMMENT_NODE: // 8
                name = "comment";
                break;
            default:
                name = node.localName
        }
        return name;
    }

    static isNamed(node) {
        return this.hasAttribute(node, xsdAttributes.NAME);
    }

    static isReference(node) {
        return this.hasAttribute(node, xsdAttributes.REF);
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

}

module.exports = XsdFile;
