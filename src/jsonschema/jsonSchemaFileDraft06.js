'use strict';

const debug = require('debug')('xsd2jsonschema:JsonSchemaFileDraft06');
const path = require('path');
const URI = require('urijs');
const JsonSchemaFileDraft04 = require('./jsonSchemaFileDraft04');

/**
 * JSON Schema file operations.  This is based on the JSON Schema meta-schema located at http://json-schema.org/draft-04/schema#.  
 * 
 * 
 * Please see http://json-schema.org for more details.
 */

class JsonSchemaFileDraft06 extends JsonSchemaFileDraft04 {
    constructor(options) {
		if (options != undefined) {
			options.$schema = options.$schema != undefined ? options.$schema : 'http://json-schema.org/draft-06/schema#';
			options.schemaId = options.schemaId != undefined ? options.schemaId : '$id';
		}
		super(options);
    }

	/**
	 * Creates a child JsonSchemaFile using the given options. The parent is set automatically.
	 * 
	 * @param {Object} options - And object used to override default options.
	 * @param {string} options.baseFilename - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.baseId - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.targetNamespace - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.title - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param {string} options.$ref - The directory from which xml schema's should be loaded.  The default value is the current directory.
	 * @param (JsonSchemaFile) options.parent - this parameter is set to the current JsonSchemaFile.
	 * 
	 * @returns {JsonSchemaFileDraft06} - Returns a new JsonSchemaFileDraft06 that has the current JsonSchemaFile as its parent.
	 */
    newJsonSchemaFile(options) {
        if (options != undefined) {
			if (options.parent == undefined) {
				options.parent = this;
			}
            return new JsonSchemaFileDraft06(options);
        } else {
            return new JsonSchemaFileDraft06({ parent: this });
        }
    }

	/**
	 * Returns true if the all members of the JsonSchemaFile are empty as defined by isEmpty().
	 * 
	 * @returns {Boolean} - Returns true if the all members of the JsonSchemaFile are empty.
	 */
	isBlankDead() {
		if (!this.isEmpty(this.$id)) {
			return false;
		}
		return super.isBlank();
	}

    /**
     * Returns a POJO of this jsonSchema.  Items are added in the order we wouild like them to appear in the resulting JsonSchema.
     * 
     * @returns {Object} - POJO of this jsonSchema.
     */
    getJsonSchemaDEAD(jsonSchema) {
		if (jsonSchema == undefined) {
			jsonSchema = {};
		}
        if (!this.isEmpty(this.$id)) {
            jsonSchema.$id = this.$id;
        }
        return super.getJsonSchema(jsonSchema);
    }
}

module.exports = JsonSchemaFileDraft06;