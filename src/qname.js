/**
 * New node file
 */

"use strict";

function Qname (qname) {

	var i = qname.indexOf(':');
	var qualName = i < 0 ? [ '', qname ] : qname.split(':');

	this.prefix = function () {
		return qualName[0];
	};

	this.local = function () {
		return qualName[1];
	}
}

module.exports = Qname;
