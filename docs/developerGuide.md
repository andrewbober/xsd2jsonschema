# **Developer Guide**

## Table of Contents

1. [Introduction](#Introduction)
2. [Scripts](#Scripts)
3. [Logging](#Logging)
3. [Unit Tests](#Conversion-Overview)
4. [Functional Tests](#XML-Schema-Support-Overview)

## **Introduction**
*Xsd2JsonSchema* is written in Javascript for NodeJs. 

## **Scripts**
**prepare** - The prepare script is run automatically BEFORE the package is packed and published, and on local npm install without any arguments. This is run AFTER prepublish, but BEFORE prepublishOnly.  See [npm-scripts](https://docs.npmjs.com/misc/scripts) for more information.

**test** - Run the Jasmine unittest suite using the confiuration file located at ${workspaceRoot}/test/jasmine.json.

```bash
npm test

# Set environment variable to enable logging all logging in the xsd2jsonschema.  You likely don't want to do this because it too much logging.
DEBUG=xsd2jsonschema:* npm test
```

**functionalTestJ** - Runs the functional test suite at ${workspaceRoot}/test/functional/functionalTestSpec.js using Jasmine.  See [Functional Tests](#XML-Schema-Support-Overview).

```bash
npm run functionalTestJ
```

**functionalTest** - Runs the functional test suite using a driver script located at ${workspaceRoot}/test/functional/allFunctionalTests.js.  See [Functional Tests](#XML-Schema-Support-Overview).

```bash
npm run functionalTest

# Set environment variable to enable logging in the FunctionalTests.
DEBUG=xsd2jsonschema:*FunctionalTest npm run functionalTest
```

**cover** - blah blah blah..

```bash
npm run cover
```

**update-coveralls** - blah blah blah.

```bash
npm run update-coveralls
```

**example-convert** - blah blah blah.

```bash
npm run example-convert
```

**example-validate** blah blah blah.

```bash
npm run example-validate
```

**example-xml-usage** - blah blah blah.

```bash
npm run example-xml-usage
```

**example-xml-usage-sum** - blah blah blah.

```bash
npm run example-xml-usage-sum
```

**jsdoc** - blah blah blah.

```bash
npm run jsdoc
```

## **Logging**
Logging is provided by the Debug library.  See [debug](https://www.npmjs.com/package/debug) for more information.

## **Unit Tests**
Unit tests are designed to test individual components.  Xsd2Jsonschema has a few larger components that are broken down into multiple tests. 
The Jasmine test libary is used for unit testing.

## Funcitonal Tests
Functional tests are designed to take an XML Schema, convert it to JSON Schema, and then using the converted JSON Schema to validate a set of JSON instances.

## Specification Tests
There are two specification tests: standardTestSuite & customTestSuite.  Both specification tests are intened to test how much of the XML Schema specification
is supported by Xsd2JsonSchema.  
*The standardTestSuite is based on the offical set of W3C tests submitted by Boeing, Microsoft, Nist, Sun Microsystems, IBM, Oracle
and others when the XML Schema specification was taking shape.  The official test suite consists of both XML Schemas and XML instances.  In some tests XML 
instances are validated against XML Schemas.  In other tests there is only an XML Schema that is tested.  The XML Schema's and instances in the official test 
are converted to JSON Schemas and JSON instances respecively.  The converted items are then used in the same manner their XML counterparts were used to test.  
Some tests include JSON instances that are validated against JSON Schemas.  In other tests there is only a JSON Schema that is tested.  The official test suite
does not test every feacher in the XML Schema specification.

*The customTestSuite *is* intended to test every feacher in the XML Schema specification.  This test is used to measure and quantify the XML Schema featchers 
supported Xsd2Jsonschema.  Every idiom within the XML Schema specifiction 1.0 and 1.1 is included in the test suite.  The end result is a detailed report 
showing what XML Schema feachers are supported.
