"use strict";

var libxmljs = require("libxmljs");
var fs = require("fs");
var path = require("path");
var xsdAttributes = require("./xsdAttributes");


var baseFilename_NAME = Symbol();
var xmlSchemaNamespace_NAME = Symbol();
var uri_NAME = Symbol();
var xmlDoc_NAME = Symbol();
var schemaElement_NAME = Symbol();
var includeUris_NAME = Symbol();
var namespace_NAME = Symbol();
var schemaNamespace_NAME = Symbol();
var namespaces_NAME = Symbol();
var targetNamespace_NAME = Symbol();

/**
 * XML Schema file operations
 * TBD (libxmljs)
 */
class XsdFile {
	constructor(uriParm) {
		this.baseFilename = path.basename(uriParm);
		this.xmlSchemaNamespace = 'http://www.w3.org/2001/XMLSchema';
		this.uri = uriParm;
		var data = fs.readFileSync(this.uri);
		this.xmlDoc = libxmljs.parseXml(data, { noblanks: true });
		this.schemaElement = this.xmlDoc.root();
		//this.includeUris = undefined;
		//this.namespace = undefined;
		//this.schemaNamespace = undefined;
		//this.namespaces = undefined;
		//this.targetNamespace = undefined;
		this.loadNamespaces();
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

	get includeUris(){
		return this[includeUris_NAME];
	}
	set includeUris(newIncludeUris) {
		this[includeUris_NAME] = newIncludeUris;
	}

	get namespace () {
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
			this.targetNamespace = this.schemaElement.attr('targetNamespace').value();
		}
		return this[targetNamespace_NAME];
	}
	set targetNamespace(newTargetNamespace) {
		this[targetNamespace_NAME] = newTargetNamespace;
	}

	loadNamespaces() {
		this.namespaces = this.schemaElement.namespaces();
		this.namespaces.forEach(function (ns, index, array) {
			if (ns.href() === this.xmlSchemaNamespace) {
				this.schemaNamespace = ns;
			}
			if (ns.prefix() === null) {
				this.namespace = ns;
			}
		}, this);
	}

	hasIncludes() {
		return this.getIncludes().length > 0;
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

	dumpAttrs_old() {
		console.log(this.uri);
		var attrs = this.schemaElement.attrs();
		attrs.forEach(function (attr, index, array) {
			console.log(attr.name() + "=" + attr.value());
		});
		console.log("---attrs-----------------");
	}

	dumpAttrs(node) {
		var attrs = node.attrs();
		console.log("XML-TAG-Attributes:");
		attrs.forEach(function (attr, index, array) {
			console.log("\t" + index + ") " + attr.name() + "=" + attr.value());
		});
	}

	getAttrValue(node, attrName) {
		var attr = this.getAttr(node, attrName);
		var retval;
		if (attr != undefined) {
			retval = attr.value();
		}
		return retval;
	}

	getAttr(node, attrName) {
		var retval;
		node.attrs().forEach(function (attr, index, array) {
			if (attr.name() === attrName) {
				retval = attr;
			}
		});
		return retval;
	}

	hasAttribute(node, attrName) {
		var attr = this.getAttr(node, attrName);
		if (attr === undefined) {
			return false;
		} else {
			return true;
		}
	}

	getValueAttr(node) {
		return this.getAttrValue(node, xsdAttributes.value);
	}

	dumpNode(node) {
		console.log("__________________________________________");
		console.log("XML-Type= " + node.type());
		console.log("XML-TAG-Name= " + node.name());
		console.log("XML-TAG-NameSpace= " + node.namespace().prefix() + "=" + node.namespace().href());
		var text = node.text();
		if (text != undefined && text.length != 0) {
			console.log("XML-Text= [" + text + "]");
		}
		this.dumpAttrs(node);
		console.log("_______________________");
	}

	getNodeName(node) {
		return node.name();
	}

	isNamed(node) {
		return this.hasAttribute(node, xsdAttributes.name);
	}

	isReference(node) {
		return this.hasAttribute(node, xsdAttributes.ref);
	}

	getIncludes() {
		if (this.includeUris === undefined) {
			var xpath = '//' + this.schemaNamespace.prefix() + ':include';
			var ns_uri = {};
			ns_uri[this.schemaNamespace.prefix()] = this.schemaNamespace.href();
			var includeNodes = this.xmlDoc.find(xpath, ns_uri);
			this.includeUris = [];
			includeNodes.forEach(function (includeNode, index, array) {
				this.includeUris.push(includeNode.attr('schemaLocation').value());
			}, this);
		}
		return this.includeUris;
	}

	// 12/13/2016 - I think this is wrong.  It is used from choice() to determine "isMulti", which doesn't appear
	// to have any value.  I may have been worried about multiple choices within a parent.
	// Based on the name of the method I would expect it to retern the number of children of the node passed in.
	countChildren(node, tagName) {
		var xpath = node.namespace().prefix() + ":" + tagName;
		var ns = {};
		ns[node.namespace().prefix()] = node.namespace().href();
		var elements = node.parent().find(xpath, ns);
		console.log("Found [" + elements.length + "] '" + tagName + "' elements within '" + node.parent().parent().attr("name") + "'");
		return elements.length;
	}

	buildAttributeMap(node) {
		var map = {};
		var attrs = node.attrs();
		attrs.forEach(function (attr, index, array) {
			map[attr.name()] = attr.value();
		});
		return map;
	}

	getChildNodes(node) {
		return node.childNodes();
	}
}

module.exports = XsdFile;

