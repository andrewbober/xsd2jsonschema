'use strict';

/**
 * Defines constants for identifying special cases in XML Schema that cannot be directly translated into JSON Schema.
 * 
 * @module SpecialCases
 */

module.exports = {
    ANY_OF_CHOICE : 'fixAnyOfChoice',
    SIBLING_CHOICE : 'fixSiblingChoice',
    OPTIONAL_CHOICE : 'fixOptionalChoice',
    OPTIONAL_SEQUENCE : 'fixOptionalSequence'
}