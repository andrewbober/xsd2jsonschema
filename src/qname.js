/**
 * New node file
 */

"use strict";

var qualName_NAME = Symbol();

class Qname {
	
	constructor(qname) {
		var i = qname.indexOf(':');
		this.qualName = i < 0 ? [ '', qname ] : qname.split(':');
	}

	get qualName() {
		return this[qualName_NAME];
	}

	set qualName(newQualName) {
		this[qualName_NAME] = newQualName;
	}


	getPrefix() {
		return this.qualName[0];
	}

	getLocal() {
		return this.qualName[1];
	}
}

module.exports = Qname;
