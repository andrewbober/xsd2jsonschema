/**
 *  Basic Xsd2JsonSchema usage sample.
 */

"use strict";

const fs = require('fs');
const URI = require('urijs');

const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;

const xsdSchemas = {
	'BaseTypes.xsd': `"<schema xmlns=\"http://www.w3.org/2001/XMLSchema\" targetNamespace=\"http://www.example.com/interfaces/parking/operatorServices/v1/data\" xmlns:tns=\"http://www.example.com/interfaces/parking/operatorServices/v1\" elementFormDefault=\"qualified\">
    <element name=\"SetCountingCategoryMode\">
        <complexType>
            <sequence>
                <element name=\"facilityId\" type=\"long\"></element>
                <element name=\"carParkNumber\" type=\"int\"></element>
                <element name=\"countingCategoryType\" type=\"tns:countingCategoryType\"></element>
                <element name=\"trafficSignalMode\" type=\"tns:trafficSignalMode\"></element>
            </sequence>
        </complexType>
    </element>
    <element name=\"SetCountingCategoryModeOut\">
        <complexType>
            <sequence>
                <element name=\"SetCountingCategoryModeResponse\" type=\"tns:SetCountingCategoryModeResponse\"></element>
            </sequence>
        </complexType>
    </element>
    <element name=\"SetCountingCategoryLevel\">
        <complexType>
            <sequence>
                <element name=\"facilityId\" type=\"long\"></element>
                <element name=\"carParkNumber\" type=\"int\"></element>
                <element name=\"countingCategoryType\" type=\"tns:countingCategoryType\"></element>
                <element name=\"currentLevel\" type=\"int\"></element>
            </sequence>
        </complexType>
    </element>
    <element name=\"SetCountingCategoryLevelOut\">
        <complexType>
            <sequence>
                <element name=\"SetCountingCategoryLevelResponse\" type=\"tns:SetCountingCategoryLevelResponse\"></element>
            </sequence>
        </complexType>
    </element>
    <element name=\"SetExternalCountingMode\">
        <complexType>
            <sequence>
                <element name=\"facilityId\" type=\"long\"></element>
            </sequence>
        </complexType>
    </element>
    <element name=\"SetExternalCountingModeOut\">
        <complexType>
            <sequence>
                <element name=\"SetExternalCountingModeResponse\" type=\"tns:SetExternalCountingModeResponse\"></element>
            </sequence>
        </complexType>
    </element>
    <complexType name=\"SetCountingCategoryModeResponse\">
        <sequence></sequence>
    </complexType>
    <complexType name=\"SetCountingCategoryLevelResponse\">
        <sequence></sequence>
    </complexType>
    <complexType name=\"SetExternalCountingModeResponse\">
        <sequence></sequence>
    </complexType>
    <simpleType name=\"trafficSignalMode\">
        <restriction base=\"string\">
            <enumeration value=\"AUTOMATIC\"></enumeration>
            <enumeration value=\"MANUAL_GREEN_FREE\"></enumeration>
            <enumeration value=\"MANUAL_RED_FULL\"></enumeration>
        </restriction>
    </simpleType>
    <simpleType name=\"countingCategoryType\">
        <restriction base=\"string\">
            <enumeration value=\"DEFAULT_COUNTING_CATEGORY_00\"></enumeration>
            <enumeration value=\"SHORT_TERM_PARKER_01\"></enumeration>
            <enumeration value=\"CONTRACT_PARKER_02\"></enumeration>
            <enumeration value=\"TOTAL_03\"></enumeration>
            <enumeration value=\"USER_DEFINED_04\"></enumeration>
            <enumeration value=\"USER_DEFINED_05\"></enumeration>
            <enumeration value=\"USER_DEFINED_06\"></enumeration>
            <enumeration value=\"USER_DEFINED_07\"></enumeration>
            <enumeration value=\"USER_DEFINED_08\"></enumeration>
            <enumeration value=\"USER_DEFINED_09\"></enumeration>
            <enumeration value=\"USER_DEFINED_10\"></enumeration>
            <enumeration value=\"USER_DEFINED_11\"></enumeration>
            <enumeration value=\"USER_DEFINED_12\"></enumeration>
            <enumeration value=\"USER_DEFINED_13\"></enumeration>
            <enumeration value=\"USER_DEFINED_14\"></enumeration>
            <enumeration value=\"USER_DEFINED_15\"></enumeration>
            <enumeration value=\"USER_DEFINED_16\"></enumeration>
            <enumeration value=\"USER_DEFINED_17\"></enumeration>
            <enumeration value=\"USER_DEFINED_18\"></enumeration>
            <enumeration value=\"USER_DEFINED_19\"></enumeration>
            <enumeration value=\"USER_DEFINED_20\"></enumeration>
            <enumeration value=\"USER_DEFINED_21\"></enumeration>
            <enumeration value=\"USER_DEFINED_22\"></enumeration>
            <enumeration value=\"USER_DEFINED_23\"></enumeration>
            <enumeration value=\"USER_DEFINED_24\"></enumeration>
            <enumeration value=\"USER_DEFINED_25\"></enumeration>
            <enumeration value=\"USER_DEFINED_26\"></enumeration>
            <enumeration value=\"USER_DEFINED_27\"></enumeration>
            <enumeration value=\"USER_DEFINED_28\"></enumeration>
            <enumeration value=\"USER_DEFINED_29\"></enumeration>
            <enumeration value=\"USER_DEFINED_30\"></enumeration>
            <enumeration value=\"USER_DEFINED_31\"></enumeration>
            <enumeration value=\"USER_DEFINED_32\"></enumeration>
            <enumeration value=\"USER_DEFINED_33\"></enumeration>
            <enumeration value=\"USER_DEFINED_34\"></enumeration>
            <enumeration value=\"USER_DEFINED_35\"></enumeration>
            <enumeration value=\"USER_DEFINED_36\"></enumeration>
            <enumeration value=\"USER_DEFINED_37\"></enumeration>
            <enumeration value=\"USER_DEFINED_38\"></enumeration>
            <enumeration value=\"USER_DEFINED_39\"></enumeration>
            <enumeration value=\"USER_DEFINED_40\"></enumeration>
            <enumeration value=\"USER_DEFINED_41\"></enumeration>
            <enumeration value=\"USER_DEFINED_42\"></enumeration>
            <enumeration value=\"USER_DEFINED_43\"></enumeration>
            <enumeration value=\"USER_DEFINED_44\"></enumeration>
            <enumeration value=\"USER_DEFINED_45\"></enumeration>
            <enumeration value=\"USER_DEFINED_46\"></enumeration>
            <enumeration value=\"USER_DEFINED_47\"></enumeration>
            <enumeration value=\"USER_DEFINED_48\"></enumeration>
            <enumeration value=\"USER_DEFINED_49\"></enumeration>
            <enumeration value=\"USER_DEFINED_50\"></enumeration>
            <enumeration value=\"USER_DEFINED_51\"></enumeration>
            <enumeration value=\"USER_DEFINED_52\"></enumeration>
            <enumeration value=\"USER_DEFINED_53\"></enumeration>
        </restriction>
    </simpleType>
</schema>"
`
}

function writeJsonSchemas(jsonSchemas, outputDir, spacing) {
	if (jsonSchemas == undefined) {
		throw new Error('The parameter jsonSchema is required');
	}
	if (spacing == undefined) {
		spacing = '\t';
	}
	Object.keys(jsonSchemas).forEach((uri) => {
		let jsonSchema = jsonSchemas[uri];
		let fullFilename = new URI(outputDir).segment(jsonSchema.filename);
		let fileContent = JSON.stringify(jsonSchema.getJsonSchema(), null, spacing);
		console.log(`Saving ${fullFilename}`);
		fs.writeFileSync(fullFilename.toString(), fileContent);
	})
}

const xs2js = new Xsd2JsonSchema();
let jsonSchemas = xs2js.processAllSchemas({
	schemas: xsdSchemas
});

writeJsonSchemas(jsonSchemas, 'examples/generated_jsonschema', '  ');