'use strict';

const debug = require('debug')('xsd2jsonschema:XsdFile');

const DOMParser = require('xmldom').DOMParser;
const xpathProcessor = require('xpath');
const URI = require('urijs');
const XsdAttributes = require('./xsdAttributes');
const XsdElements = require('./xsdElements');
const XsdAttributeValues = require('./xsdAttributeValues');
const XsdNodeTypes = require('./xsdNodeTypes');
const Constants = require('../constants');

const uri_NAME = Symbol();
const xmlDoc_NAME = Symbol();
const includeUris_NAME = Symbol();
const importUris_NAME = Symbol();
const namespaces_NAME = Symbol();
const imports_NAME = Symbol();

/**
 * XML Schema file operations
 * https://www.w3.org/2001/xml.xsd
 * TBD (xmldom)
 */
class XsdFile {
  constructor(options) {
    if (options == undefined || typeof options !== 'object') {
      throw new Error('Parameter "options" is required');
    }
    if (options.uri == undefined) {
      throw new Error('"options.uri" is required');
    }
    if (options.xml == undefined) {
      throw new Error('"options.xml" is required');
    }
    // Instantiate the URL just in case a string was passed in.
    this.uri = new URI(options.uri);
    this.xmlDoc = new DOMParser().parseFromString(options.xml, 'text/xml');
    this.namespaces = {};
    this.imports = {};
    this.initilizeNamespaces();
    this.initializeIncludes();
    this.initializeImports();
  }

  // Getters/Setters

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

  get importUris() {
    return this[importUris_NAME];
  }
  set importUris(newIncludeUris) {
    this[importUris_NAME] = newIncludeUris;
  }

  get namespaces() {
    return this[namespaces_NAME];
  }
  set namespaces(newNamespaces) {
    this[namespaces_NAME] = newNamespaces;
  }

  get imports() {
    return this[imports_NAME];
  }
  set imports(newImports) {
    this[imports_NAME] = newImports;
  }

  // read-only properties

  get filename() {
    return this.uri.filename();
  }
  set filename(unused) {
    throw new Error('Unsupported operation');
  }

  get directory() {
    return this.uri.directory();
  }
  set directory(unused) {
    throw new Error('Unsupported operation');
  }

  get schemaElement() {
    return this.xmlDoc.documentElement;
  }
  set schemaElement(unused) {
    throw new Error('Unsupported operation');
  }

  get targetNamespace() {
    return this.xmlDoc.documentElement.getAttribute(
      XsdAttributes.TARGET_NAMESPACE
    );
  }
  set targetNamespace(unused) {
    throw new Error('Unsupported operation');
  }

  addNamespace(key, value) {
    this.namespaces[key] = value;
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
          default:
            if (attr.prefix === 'xmlns') {
              const namespace = attr.localName;
              this.namespaces[namespace] = attrValue;
            }
            break;
        }
      }
    }, this);
    // Ensure values are set for targetNamespace, the default namespace, and the XML Schema Namespace
    if (
      this.namespaces[XsdAttributes.TARGET_NAMESPACE] == undefined &&
      this.namespaces[''] == undefined
    ) {
      this.namespaces[XsdAttributes.TARGET_NAMESPACE] = Constants.NO_NAMESPACE;
      this.namespaces[''] = Constants.NO_NAMESPACE;
    } else if (
      this.namespaces[XsdAttributes.TARGET_NAMESPACE] == undefined &&
      this.namespaces[''] != undefined
    ) {
      this.namespaces[XsdAttributes.TARGET_NAMESPACE] = this.namespaces[''];
    } else if (
      this.namespaces[XsdAttributes.TARGET_NAMESPACE] != undefined &&
      this.namespaces[''] == undefined
    ) {
      this.namespaces[''] = this.namespaces[XsdAttributes.TARGET_NAMESPACE];
    }
    // If the XML Schema Namespace is missing setup a couple of defaults so we can try to convert the schema.  (not a good sign)
    if (this.isMissingXmlSchemaNamespace()) {
      this.namespaces[Constants.XML_SCHEMA_DEFAULT_NAMESPACE_NAME_XS] =
        Constants.XML_SCHEMA_NAMESPACE;
      this.namespaces[Constants.XML_SCHEMA_DEFAULT_NAMESPACE_NAME_XSD] =
        Constants.XML_SCHEMA_NAMESPACE;
    }
  }

  isMissingXmlSchemaNamespace() {
    const keys = Object.keys(this.namespaces);
    for (const key of keys) {
      if (this.namespaces[key] == Constants.XML_SCHEMA_NAMESPACE) {
        return false;
      }
    }
    return true;
  }

  resolveNamespace(namespaceName) {
    return this.namespaces[namespaceName];
  }

  hasIncludes() {
    return this.includeUris.length > 0;
  }

  hasImports() {
    return this.importUris.length > 0;
  }

  initializeIncludes() {
    if (this.includeUris === undefined) {
      var includeNodes = this.schemaElement.getElementsByTagName(
        this.schemaElement.prefix + ':include'
      );
      this.includeUris = [];
      for (let i = 0; i < includeNodes.length; i++) {
        const includeNode = includeNodes.item(i);
        this.includeUris.push(
          includeNode.getAttribute(XsdAttributes.SCHEMA_LOCATION)
        );
      }
    }
    return this.includeUris;
  }

  initializeImports() {
    if (this.importUris === undefined) {
      var importNodes = this.schemaElement.getElementsByTagName(
        this.schemaElement.prefix + ':import'
      );
      this.importUris = [];
      for (let i = 0; i < importNodes.length; i++) {
        const importNode = importNodes.item(i);
        this.importUris.push(
          importNode.getAttribute(XsdAttributes.SCHEMA_LOCATION)
        );
      }
    }
    return this.importUris;
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
    return nodes;
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
    const str = `baseFilename=${this.filename}
uri=${this.uri}
includeUris=${this.includeUris}
namespaces=${JSON.stringify(this.namespaces, null, '\t')}
xmlDoc=${this.xmlDoc}`;
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

  static nodeQuickDumpStr(node) {
    var retval = XsdFile.getNodeName(node) + ' [';
    var attrs = node.attributes;
    if (attrs != undefined) {
      Object.keys(attrs).forEach(function (attr, index, array) {
        if (attrs[attr].nodeType === XsdNodeTypes.ATTRIBUTE_NODE) {
          retval += attrs[attr].localName + '=' + attrs[attr].value + ' ';
        }
      }, this);
    }
    return retval.trim() + ']';
  }

  static dumpAttrs(node) {
    var attrs = node.attributes;
    debug('XML-TAG-Attributes:');
    if (attrs != undefined) {
      Object.keys(attrs).forEach(function (attr, index, array) {
        if (attrs[attr].nodeType === XsdNodeTypes.ATTRIBUTE_NODE) {
          debug(
            '\t' +
              index +
              ') ' +
              attrs[attr].localName +
              '=' +
              attrs[attr].value
          );
        }
      }, this);
    }
  }

  static convertToNumber(value) {
    var retval = Number(value);
    if (isNaN(retval)) {
      return 0;
    }
    return retval;
  }

  static getAttrValueAsNumber(node, attrName) {
    var value;
    if (this.hasAttribute(node, attrName)) {
      value = node.getAttribute(attrName);
    }
    return this.convertToNumber(value);
  }

  static getAttrValue(node, attrName) {
    var retval;
    if (this.hasAttribute(node, attrName)) {
      retval = node.getAttribute(attrName);
    }
    return retval;
  }

  static getAttrValueByPrefix(node, attrPrefix) {
    var retval;
    var attrs = node.attributes;
    var attLength = attrs.length;
    for (var i = attLength - 1; i >= 0; i--) {
      if (attrs[i].prefix && attrs[i].prefix === attrPrefix) {
        retval = attrs[i];
      }
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

  static getNameAttrValue(node) {
    return this.getAttrValue(node, XsdAttributes.NAME);
  }

  static getValueAttr(node) {
    return this.getAttrValue(node, XsdAttributes.VALUE);
  }

  static getValueAttrAsNumber(node) {
    if (node == XsdAttributeValues.UNBOUNDED) {
      return undefined;
    }
    return this.getAttrValueAsNumber(node, XsdAttributes.VALUE);
  }

  static getTypeNode(node) {
    let typeNode = node;
    while (typeNode.parentNode.localName != XsdElements.SCHEMA) {
      typeNode = typeNode.parentNode;
    }
    return typeNode;
  }

  static dumpNode(node) {
    debug('XML-Type= ' + XsdNodeTypes.getTypeName(node.nodeType));
    debug('XML-TAG-Name= ' + node.nodeName);
    debug('XML-TAG-NameSpace= ' + node.namespaceURI + '=' + node.namespaceURI);
    var text = node.textContent;
    if (text != undefined) {
      const trimmed = text.trim();
      debug(
        'XML-Text= [' +
          (trimmed.length > 0 ? trimmed : 'it was all whitespace') +
          ']'
      );
    }
    this.dumpAttrs(node);
    debug('__________________________________________');
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
        name = node.localName;
    }
    return name;
  }

  static isNamed(node) {
    return this.hasAttribute(node, XsdAttributes.NAME);
  }

  static isReference(node) {
    return this.hasAttribute(node, XsdAttributes.REF);
  }

  static isEmpty(node) {
    return this.getChildNodes(node).length == 0;
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

  static getFirstParentWithNameAttribute(node) {
    if (!this.hasAttribute(node.parentNode, XsdAttributes.NAME)) {
      return this.getFirstParentWithNameAttribute(node.parentNode);
    }
    return node.parentNode;
  }

  static getNameOfFirstParentWithNameAttribute(node) {
    const firstParentWithName = this.getFirstParentWithNameAttribute(node);
    return this.getAttrValue(firstParentWithName, XsdAttributes.NAME);
  }
}

module.exports = XsdFile;
