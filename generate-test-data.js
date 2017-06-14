'use strict'

const xml2js = require('xml2js');
const fs = require('fs-extra');

const xmlTestDataDir = 'TestFiles';
const jsonTestDataDir = xmlTestDataDir + 'Json';

fs.removeSync(jsonTestDataDir);
convertDir(xmlTestDataDir, jsonTestDataDir);
console.log('test data generation done');

function convertDir(xmldir, jsondir) {
    try {
        fs.mkdirSync(jsondir);
    } catch (err) {
        // ignore
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

function convertFile(xmlfile, xmldir, jsondir) {
    var parser = new xml2js.Parser({
        trim: true
    });
    var jsonfile = xmlfile + '.json';
    var xml = readfile(xmldir + '/' + xmlfile);
    parser.parseString(xml, function(err, result) {
        writefile(jsondir + '/' + jsonfile, JSON.stringify(result, null, 2));
    });
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
