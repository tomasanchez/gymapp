/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"tosa8/my_gym/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});