
'use strict'

const os = require('os');
const fs = require('fs-extra');
const path = require("path");
const xml2js = require('xml2js');
const Ajv = require('ajv');
const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
const XsdTestSuiteProcessor = require('./xsdTestSuiteProcessor');

const baseTestDataDir = 'TestFiles';
const bmsVersionDir = '5.5.0';
const xmlTestDataDir = path.join('./', baseTestDataDir, bmsVersionDir);
const jsonTestDataDir = path.join('./', baseTestDataDir + 'Json', bmsVersionDir);
const classicSchemasOutputDir = path.join('./', 'BMSJsonSchema', bmsVersionDir, 'BMSClassicCodeSchemas');
const codeExtSchemasOutputDir = path.join('./', 'BMSJsonSchema', bmsVersionDir, 'BMSCodeExtSchemas');
const ajv = new Ajv({
    allErrors: true,
    verbose: false,
    format: 'full'
});
var schemaIdLookup = {};

const action = process.argv[2];

try {
    switch (action) {
        case 'convert-classic':
            convertClassic()
            break;
        case 'convert-code-ext':
            convertCodeExt();
            break;
        case 'generate-test-data':
            generateTestData();
            break;
        case 'validate-classic':
            validateClassic();
            break;
        case 'validate-code-ext':
            validateCodeExt();
            break;
        case 'generate-word-list':
            generateWordList();
            break;
        default:
            convertClassic()
            convertCodeExt();
            generateTestData();
            validateClassic();
            //validateCodeExt();
            generateWordList();
    }
    console.log('bms-tools completed successfully!')
} catch (err) {
    console.log('Error running bms-tools: ', err);
}

function convertClassic() {
    fs.removeSync(classicSchemasOutputDir);
    const classicConverter = new Xsd2JsonSchema({
        mask: /(_CodeExt|_ClassicCode)?_2017R1_V5.5.0/,
        outputDir: classicSchemasOutputDir,
        baseId: 'http://www.cieca.com/schema/',
        xsdBaseDir: './BMS/5.5.0/BMSClassicCodeSchemas/',
        converter: new BmsConverter()
    });
    classicConverter.processAllSchemas({
        xsdFilenames: [
            'BMSRoot_ClassicCode_2017R1_V5.5.0.xsd'
        ]
    });
    fs.ensureDirSync(classicSchemasOutputDir);
    classicConverter.writeFiles();
    classicConverter.dump();
}

function convertCodeExt() {
    fs.removeSync(codeExtSchemasOutputDir);
    const codeExtConverter = new Xsd2JsonSchema({
        mask: /(_CodeExt|_ClassicCode)?_2017R1_V5.5.0/,
        outputDir: codeExtSchemasOutputDir,
        baseId: 'http://www.cieca.com/schema/',
        xsdBaseDir: './BMS/5.5.0/BMSCodeExtSchemas/',
        converter: new BmsConverter()
    });
    codeExtConverter.processAllSchemas({
        xsdFilenames: [
            'BMSRoot_CodeExt_2017R1_V5.5.0.xsd'
        ]
    });
    fs.ensureDirSync(codeExtSchemasOutputDir);
    codeExtConverter.writeFiles();
    codeExtConverter.dump();
}

function generateTestData() {
    fs.removeSync(jsonTestDataDir);
    convertDir(xmlTestDataDir, jsonTestDataDir);
    console.log('test data generation done');
}

function validateClassic() {
    var schemas = [];
    fs.readdirSync(classicSchemasOutputDir).forEach(function (filename, index, array) {
        const jsonSchema = loadFile(path.join(classicSchemasOutputDir,filename));
        Object.keys(jsonSchema.properties).forEach(function (property, index, array) {
            schemaIdLookup[property] = jsonSchema.id;
        })
        schemas.push(jsonSchema);
    });
    ajv.removeSchema();
    ajv.addSchema(schemas);
    validateDir(jsonTestDataDir);
    console.log('Validation complete BMSClassicCodeSchemas');
}

function validateCodeExt() {
    var schemas = [];
    fs.readdirSync(codeExtSchemasOutputDir).forEach(function (filename, index, array) {
        const jsonSchema = loadFile(path.join(codeExtSchemasOutputDir,filename));
        Object.keys(jsonSchema.properties).forEach(function (property, index, array) {
            schemaIdLookup[property] = jsonSchema.id;
        })
        schemas.push(jsonSchema);
    });
    ajv.removeSchema();
    ajv.addSchema(schemas);
    validateDir(jsonTestDataDir);
    console.log('Validation complete BMSCodeExtSchemas');
}

function splitWordList(wordList) {
    const wordSet = new Set();
    wordList.forEach(function (bigWord, array, index) {
        const splitWords = bigWord.replace(/([a-z])([A-Z])/g, '$1\n$2').split('\n');
        splitWords.forEach(function (littleWord, array, index) {
            wordSet.add(littleWord);
        })
    });
    // return an array sorted (case insensitive)
    return Array.from(wordSet).sort(function(a,b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
}

function writeWordList(wordList) {
    const fd = fs.openSync('word-list.txt', 'w');
    wordList.forEach(function (word, array, index) {
        fs.writeSync(fd, word);
        fs.writeSync(fd, os.EOL);
    });
    fs.closeSync(fd);
}

function generateWordList() {
    const bmsWordListVisitor = new BmsWordListVistor();
    const wordListGenerator = new Xsd2JsonSchema({
        mask: /(_CodeExt|_ClassicCode)?_2017R1_V5.5.0/,
        outputDir: '.',
        baseId: 'http://www.cieca.com/schema/',
        xsdBaseDir: './BMS/5.5.0/BMSCodeExtSchemas/',
        visitor : bmsWordListVisitor
    });
    wordListGenerator.processAllSchemas({
        xsdFilenames: [
            'BMSRoot_CodeExt_2017R1_V5.5.0.xsd'
        ]
    });
    writeWordList(splitWordList(Array.from(bmsWordListVisitor.names)));
}

function validateDir(jsondir) {
    fs.readdirSync(jsondir).forEach(function (file) {
        var statfile = jsondir + '/' + file;
        var stat = fs.statSync(statfile);
        if (stat.isDirectory()) {
            validateDir(statfile);
        } else {
            validateFile(file, jsondir);
        }
    });
}

function findMessage(data) {
    var retval;
    Object.keys(data).forEach(function (key, index, array) {
        if ((/(CIECA|.*Service)/).test(key)) {
            retval = findMessage(data[key]);
        } else if (key != '$') {
            retval = {
                'key': key,
                'data': data
            };
        }
    });
    return retval;
}

function validateFile(jsonfile, jsondir) {
    if (jsonfile === '.DS_Store') {
        return;
    }
    var data = loadFile(jsondir + '/' + jsonfile);
    var keys = Object.keys(data);
    if (keys.length > 1) {
        console.log('Found one!');
    }
    var datamap = findMessage(data);
    const validate = ajv.getSchema(schemaIdLookup[datamap.key]);
    const valid = validate(datamap.data);
    if (valid) {
        console.log(jsonfile + ' = VALID!');
    } else {
        console.log(jsonfile + ' = INVALID\n' + JSON.stringify(validate.errors, null, '\t') + '\n');
    }
}


function convertDir(xmldir, jsondir) {
    try {
        fs.ensureDirSync(jsondir);
    } catch (err) {
        console.error(err);
    }
    fs.readdirSync(xmldir).forEach(function (file) {
        var statfile = xmldir + '/' + file;
        var stat = fs.statSync(statfile);
        if (stat.isDirectory()) {
            convertDir(statfile, jsondir + '/' + file + 'Json');
        } else {
            convertFile(file, xmldir, jsondir);
        }
    });
}

function parseNumbers(value, name) {
    var retval = value;
    var isCharValue = (/(BMSVer|.*Code|Affiliation|VehicleRecoveryCondition|PartNum|EstimatorID|ModelYear|VehicleClass$|TotalSubType|GlassKitQuantity|PartnerKey|IDNum|DocumentID|InternalGroupID|InternalGroupItemID|DentsSize|ModelName|ApplicationVer|PolicyNum|ClaimNum|SurveyID|RentalReservationNum|RentalContractNum|InvoiceBatchRefNum|RentalInvoiceNum|ClaimNum|InvoiceNum|RoutingNumber|BankAccountNumber|RemittanceInfoNum|BankWireNumber|CSIAnswer|Room|Floor|DatabaseVer|VendorRefNum|LicensePlateNum|CommPhone|PartnerKey|SvcProviderName|OrderNum|PolicyVehicleNum|OtherMemoRef|PassThroughInfo|DatabaseVehicleNum|SubModelDes|OtherRefNum|BodyStyle|WeightDesc|WeightCapacityDesc|AxlesNumDesc|FileID|EngineDesc|AttachmentURI|FuelTanksNumDesc|VehicleClassToAssign|VehicleClassAssigned|VehicleClassProvided|TitleLink|SupplierRefNum)/).test(name);
    if (!isNaN(value) && !isCharValue) {
        retval = value % 1 === 0 ? parseInt(value, 10) : parseFloat(value);
    }
    return retval;
}

function parseBooleans(value, name) {
    var retval = value;
    if (/^(?:true|false)$/i.test(value)) {
        retval = value.toLowerCase() === 'true';
    }
    return retval;
}

function parseName(name) {
    // strip the xml namespace if present.
    return name.replace(/.*\:/, '');
}

function convertFile(xmlfile, xmldir, jsondir) {
    if (xmlfile === '.DS_Store') {
        return;
    }
    var parser = new xml2js.Parser({
        explicitArray: false,
        emptyTag: {},
        valueProcessors: [ parseNumbers, parseBooleans ],
        tagNameProcessors: [ parseName ]
    });
    var jsonfile = xmlfile + '.json';
    var xml = readfile(xmldir + '/' + xmlfile);
    parser.parseString(xml, function (err, result) {
        writefile(jsondir + '/' + jsonfile, JSON.stringify(result, null, 2));
    });
}

function loadFile(path) {
    const buf = readfile(path);
    const json = JSON.parse(buf);
    return json;
}

function readfile(filename) {
    var data
    try {
        data = fs.readFileSync(filename);
    } catch (error) {
        console.log(error)
    }
    return data;
}

function writefile(filename, data) {
    try {
        fs.writeFileSync(filename, data);
    } catch (error) {
        console.log(error)
    }
}
