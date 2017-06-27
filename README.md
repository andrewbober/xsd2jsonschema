
# Xsd2JsonSchema 

[![Codeship Status for andrewbober/xsd2jsonschema](https://app.codeship.com/projects/ee9a49e0-46b3-0133-28c9-569fce9c4062/status?branch=master)](https://app.codeship.com/projects/104942)
[![Coverage Status](https://coveralls.io/repos/github/andrewbober/xsd2jsonschema/badge.svg?branch=master)](https://coveralls.io/github/andrewbober/xsd2jsonschema?branch=master)
[![GitHub version](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema.png)](https://badge.fury.io/gh/andrewbober%2Fxsd2jsonschema)
[![npm version](https://badge.fury.io/js/xsd2jsonschema.svg)](https://badge.fury.io/js/xsd2jsonschema)

## Features:
1. A pure Javascript library for converting XML Schema to JSON Schema.  Xsd2JsonSchema was designed to be readily customizable.  The classes in Xsd2JsonSchema can be readily subclassed to change the conversion logic and create the conversion your project requires.
2. Multiple namespaces - XML Schemas can utilize any number of namespaces; and Xsd2JsonSchema leverages JSON Schema's sub-schema idiom to implement this feature.
3. \<Include\> tag - Many XML Schemas are broken up into multiple files to promote reuse.  Others are combined from disperate sources using different namespaces.
4. \<Import\> tag - Future feature!
5. Preserves the original file organization in the resulting schema conversion: If the author of an XML Schema organized it into three files, the resulting JSON Schema conversion should follow the same file organization and grouping of types.
6. Supports XML attributes.

## JSON Schema Support
Currently JSON Schema draft v4 is supported.  (http://json-schema.org/draft-04/schema#)

## XML Schema 1.0 Support Summary
All entities are supported.

## XML Schema 1.1 Support Summary
TBD

## XML Schema Support Details

[Xsd2JsonSchmea XML Schema Support Status](https://drive.google.com/open?id=1AMeTHNNvwuI06mjkAQi7mt8KmU7qUSFI7x-o_kF1Ko8)

## Documentation 

TBD

## Where to file issues 
[https://github.com/andrewbober/xsd2jsonschema/issues](https://github.com/andrewbober/xsd2jsonschema/issues)

## Developing
Please see the [Wiki](https://github.com/andrewbober/xsd2jsonschema/wiki/Developing) for an overview of the code and outstanding development needs.  

## Node & Npm version requirements
* Node - Version 6.11.0 LTS or higher
* Npm - Version 3.10.0 or higher

## Tools
* Created with [Visual Studio Code](https://github.com/Microsoft/vscode), [site](http://code.visualstudio.com)
* Continuous Integration by [Codeship](https://codeship.com)
* Test coverage history & statistics by [Coveralls.io](http://coveralls.io)

## References
1. [Definitive XML Schema, 2nd Edition](https://www.amazon.com/Definitive-XML-Schema-Priscilla-Walmsley/dp/0132886723), [site](https://www.pearsonhighered.com/program/Walmsley-Definitive-XML-Schema-2nd-Edition/PGM282380.html)
2. [XML Schema](https://www.w3.org/XML/Schema)
3. [JSON Schema](http://www.json-schema.org)
4. [XML Schema Test Suite](https://www.w3.org/XML/2004/xml-schema-test-suite) - The official World Wide Web Consortium (WC3) XML Schema Test Suite

## License
Copyright (C) 2017 Andrew Bober <andy.bober@gmail.com>
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.