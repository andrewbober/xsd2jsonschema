/**
 *  XML Schema file operations
 */

"use strict";

var libxmljs = require('libxmljs');
var fs = require('fs');
var path = require('path');

function XsdFile (uriParm) {
	var xmlSchemaNamespace = 'http://www.w3.org/2001/XMLSchema';
	var baseFilename = path.basename(uriParm);
	var uri = uriParm;
	var data = fs.readFileSync(uri);
	var xmlDoc = libxmljs.parseXml(data, { noblanks: true });
	var schemaElement = xmlDoc.root();
	var includeUris;
	var namespace;
	var schemaNamespace;
	var namespaces;
	var targetNamespace;

	var loadNamespaces = function() {
		namespaces = schemaElement.namespaces();
		namespaces.forEach(function(ns, index, array) {
			if (ns.href() === xmlSchemaNamespace) {
				schemaNamespace = ns;
			}
			if (ns.prefix() === null) {
				namespace = ns;
			}
		});
	};

	var dumpAttrs = function() {
		console.log(uri);
		var attrs = schemaElement.attrs();
		attrs.forEach(function(attr, index, array) {
			console.log(attr.name() + "=" + attr.value());
		});
		console.log("---attrs-----------------");
	};
	
	this.getXmlDocument = function () {
		return xmlDoc;
	};
	
	this.getSchemaElement = function() {
		return schemaElement;
	};

	this.getBaseFilename = function() {
		return baseFilename;
	}

	this.getUri = function () {
		return uri;
	};

	this.hasIncludes = function () {
		return this.getIncludes().length > 0;
	};

	this.getIncludes = function () {
		if (includeUris === undefined) {
			var xpath = '//' + schemaNamespace.prefix() + ':include';
			var ns_uri = {};
			ns_uri[schemaNamespace.prefix()] = schemaNamespace.href();
			var includeNodes = xmlDoc.find(xpath, ns_uri);
			includeUris = [];
			includeNodes.forEach(function(includeNode, index, array){
				includeUris.push(includeNode.attr('schemaLocation').value());
			});
		}
		return includeUris;
	};

	this.getNamespace = function () {
		return namespace;
	};

	this.getTargetNamespace = function () {
		if(targetNamespace === undefined) {
			targetNamespace=schemaElement.attr('targetNamespace').value();
		}
		return targetNamespace;
	};

	loadNamespaces();
//	dumpAttrs();

}

module.exports = XsdFile;
