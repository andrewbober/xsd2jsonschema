'use strict';


const debug = require('debug')('xsd2jsonschema:JsonSchemaRef');
const JsonSchemaFile = require('./jsonSchemaFile');
const JsonSchemaSerializerDraft04 = require('./jsonSchemaSerializerDraft04');


const references_NAME = Symbol();
const resovled_NAME = Symbol();
const forwardReference_NAME = Symbol();

const properties = [
    'references', 
    'resolved',
    'forwardReference'
];

class JsonSchemaRef extends JsonSchemaFile {
    constructor(options) {
        if (options == undefined) {
            throw new Error('Parameter "options" is required');
        }
        if (options.ref == undefined && options.$ref == undefined) {
            throw new Error('Either options.ref or options.$ref must be supplied');
        }
        if (options.forwardReference == undefined) {
            throw new Error('Parameter options.forwardReference is required');
        }
        options.properties = properties;
        super(options)
        this.references = [];
        this.resolved = false;
        this.forwardReference = options.forwardReference;
    }

    // Getters/Setters
    get references() {
        return this[references_NAME];
    }
    set references(newReferences) {
        this[references_NAME] = newReferences;
    }

    get resolved() {
        return this[resovled_NAME];
    }
    set resolved(newResolved) {
        this[resovled_NAME] = newResolved;
    }

    get forwardReference() {
        return this[forwardReference_NAME];
    }
    set forwardReference(newForwardReference) {
        this[forwardReference_NAME] = newForwardReference;
    }

    get$RefToSchema(parent) {
        let refStr;
        if(parent == undefined) {
            throw new Error('Parameter "parent" is required');
        }
        if (this.ref == undefined) {
            refStr = this.$ref
        } else if (Object.is(parent.getTopLevelJsonSchema(), this.getTopLevelJsonSchema())) {
            refStr = '#' + this.ref.fragment();
        } else {
            refStr = this.ref.toString();
        }
        const ref = new JsonSchemaRef({
            $ref: refStr,
            parent: parent,
            forwardReference: this.forwardReference
        });
        this.references.push(ref);
        return ref;
    }

    resolveRef(type) {
        this.references.forEach(function (ref, index, array) {
            ref.resolveRef(type);
        })
        if (type.ref == undefined) {
            this.$ref = type.$ref.toString();
        } else {
            this.$ref = type.ref.toString();
        }
        this.resolved = true;
    }

	isForwardRef() {
		return true;
	}

	/**
	 * Returns a POJO of this jsonSchema.  Items are added in the order we wouild like them to appear in the resulting JsonSchema.
	 * 
	 * @returns {Object} - POJO of this jsonSchema.
	 */
	getJsonSchema(serializer) {
		if (serializer == undefined) {
            // Any of the serializers are fine for a JsonSchemaRef.
			serializer = new JsonSchemaSerializerDraft04();
		}
		return super.getJsonSchema(serializer);
	}

	toString() {
		return JSON.stringify(this.getJsonSchema(), null, '\t');
	}
}

module.exports = JsonSchemaRef;