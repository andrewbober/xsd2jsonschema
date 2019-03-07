'use strict';

const debug = require('debug')('xsd2jsonschema:ForwardReference')

const URI = require('urijs');
const clone = require('clone');
const Constants = require('./constants');
const JsonSchemaRef = require('./jsonschema/jsonSchemaRef');

const parent_NAME = Symbol();
const namespaceManager_NAME = Symbol();

/**
*  TBD
*
* @module ForwardReference
*/


class ForwardReference {
    constructor(namespaceManager, namespace, fullTypeName, parent, baseJsonSchema, xsd) {
        if (namespaceManager === undefined) {
            throw new Error('\'namespaceManager\' parameter required');
        }
        if (namespace === undefined) {
            throw new Error('\'namespace\' parameter required');
        }
        if (fullTypeName === undefined) {
            throw new Error('\'fullTypeName\' parameter required');
        }
        if (parent === undefined) {
            throw new Error('\'parent\' parameter required');
        }
        if (baseJsonSchema === undefined) {
            throw new Error('\'baseJsonSchema\' parameter required');
        }
        if (xsd === undefined) {
            throw new Error('\'xsd\' parameter required');
        }
        this.namespaceManager = namespaceManager;
        this.namespace = namespace;
        this.fullTypeName = fullTypeName;
        this.parent = parent;
        this.baseJsonSchema = baseJsonSchema;
        this.xsd = xsd;
        this.ref = new JsonSchemaRef({
            $ref: Constants.FORWARD_REFERENCE + '#' + '/to/' + namespace + '/' + fullTypeName,
            parent: parent,
            forwardReference: this
        });
    }

    // ES6 getters/setters are not enumerable by default.  Leverage this by defining the getters/seters
    // to exclude these properties from the deep clone.
    get namespaceManager() {
        return this[namespaceManager_NAME];
    }
    set namespaceManager(newNamespaceManager) {
        this[namespaceManager_NAME] = newNamespaceManager;
    }

    get parent() {
        return this[parent_NAME];
    }
    set parent(newParent) {
        this[parent_NAME] = newParent;
    }

    clone(parent) {
        const c = clone(this, true);
        c.parent = parent;
        c.ref.parent = parent;
        c.namespaceManager = this.namespaceManager
    }
}

module.exports = ForwardReference;
