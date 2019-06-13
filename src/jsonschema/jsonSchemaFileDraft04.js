'use strict';

const debug = require('debug')('xsd2jsonschema:JsonSchemaFileDraft04');
const path = require('path');
const URI = require('urijs');
const JsonSchemaFile = require('./JsonSchemaFile');

/**
 * JSON Schema file operations.  This is based on the JSON Schema meta-schema located at http://json-schema.org/draft-04/schema#.  
 * 
 * 
 * Please see http://json-schema.org for more details.
 */

class JsonSchemaFileDraft04 extends JsonSchemaFile {
	constructor(options) {
		if (options != undefined) {
			options.$schema = options.$schema != undefined ? options.$schema : 'http://json-schema.org/draft-04/schema#';
			options.schemaId = options.schemaId != undefined ? options.schemaId : 'id';
		}
		super(options);
	}

	/**
	 * Creates a child JsonSchemaFile using the given options. The parent is set automatically.
	 * 
	 * @param {Object} options - And object used to override default options.
	 * @param {string} options.baseFilename - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.id - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.targetNamespace - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.title - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.$ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {JsonSchemaFile} options.parent - this parameter is set to the current JsonSchemaFile.
	 * 
	 * @returns {JsonSchemaFileDraft04} - Returns a new JsonSchemaFileDraft04 that has the current JsonSchemaFile as its parent.
	 */
	newJsonSchemaFile(options) {
		if (options != undefined) {
			if (options.parent == undefined) {
				options.parent = this;
			}
			return new JsonSchemaFileDraft04(options);
		} else {
			return new JsonSchemaFileDraft04({ parent: this });
		}
	}

}

module.exports = JsonSchemaFileDraft04;