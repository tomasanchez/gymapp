sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("tosa8.my_gym.controller.BaseController", {
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/ );
			}
		},

		/*Input Validation*/
		onValueChange: function (oEvent) {
			var oInput = oEvent.getSource();
			this._validateInput(oInput);

		},
	
		_validateInput: function (oInput) {
			var sValueState = "None";
			var bValidationError = false;
			var oString = oInput.getDOMValue();

			if (oString.length === 0) {
				bValidationError = true;
				sValueState = "Error";
			}
			oInput.setValueState(sValueState);

			return bValidationError;
		},

		_createClient: function () {
			var oEntity = {
				IdClte: 0,
				Nombre: 0,
				Apellido: 0,
				Post: 0,
				Telf: 0,
				Calle: 0
			};

			return oEntity;
		},

		_createSport: function () {
			var oEntity = {
				IdDep: 0,
				IdClte: 0,
				Horarios: 0,
				Costo: 0,
				Profe: 0
			};

			return oEntity;
		}

	});
});