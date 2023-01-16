'use strict';
const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;

function readSchema(file){
    return fs.readFileSync(file,"utf8")
}

function convert(file){
    try{
	console.log('Converting:'+file)
	var schema = readSchema(file)
	var xs2js = new Xsd2JsonSchema();    
	var config = ({
            schemas: {[file]: schema}
	})
	var convertedSchemas = xs2js.processAllSchemas(config);
    }catch(e){
	console.error(e)
    }
}


function run_tests(){
    convert('test/bug/positive_integer.xsd')
    //convert('tests/boolean.xsd','target/boolean.yaml')
    //convert('tests/sequence.xsd','target/sequence.yaml')
    //convert('tests/error1.xsd','target/error1.yaml')
}

run_tests()
