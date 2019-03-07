'use strict';

const debug = require('debug')('xsd2jsonschema:CloneSpec');

const clone = require('clone');
const JsonSchemaFile = require('xsd2jsonschema').JsonSchemaFile;

it('should clone the jsonSchema', function() {
    const child = new JsonSchemaFile();
    const parent = new JsonSchemaFile({title: 'parentOfChild'});
    child.parent = parent;
    const clone = child.clone();
    //const clone = child.cloneNew();
    
    expect(child).toEqual(clone);
    expect(child.parent).toEqual(clone.parent);
    expect(child.parent).not.toBe(clone.parent);
    expect(clone.parent)
});


it('should clone the jsonSchema', function() {
    const parent = new JsonSchemaFile({title: 'parentOfChild'});
    const child = parent.newJsonSchemaFile();
    //child.parent = parent;
    const clone = child.clone();
    //const clone = child.cloneNew();
    
    expect(child).toEqual(clone);
    expect(child.parent).toEqual(clone.parent);
    expect(child.parent).not.toBe(clone.parent);

    expect(child.targetSchema).toBe(child);
    expect(clone.targetSchema).toBe(clone);
});