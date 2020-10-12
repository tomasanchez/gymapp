sap.ui.define([
	"tosa8/my_gym/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";
	var oController;
	return Controller.extend("tosa8.my_gym.controller.NewClient", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tosa8.my_gym.view.NewClient
		 */
		onInit: function () {
			oController = this;
		},

		onCreateClient: function (oEvent) {

			var oModel = oController.getView().getModel();

			var aInputs = [
					oController.getView().byId("clientID"),
					oController.getView().byId("clientName"),
					oController.getView().byId("clientLastName"),
					oController.getView().byId("clientCP"),
					oController.getView().byId("clientTel"),
					oController.getView().byId("clientStreet")
				],
				bValidationError = false;

			var oEntity = oController._createClient();

			aInputs.forEach(function (oInput) {
				bValidationError = oController._validateInput(oInput) || bValidationError;
			}, oController);

			if (!bValidationError) {
				oController.getView().setBusy(true);
				oController._getNewClientData(oEntity);

				oModel.create("/ClientesSet", oEntity, {
					success: function (resultado) {
						MessageToast.show("Success: New Client Created");
						this.getView().setBusy(false);

					}.bind(this),
					error: function (error) {
						MessageToast.show("Error: ID is already registered");
						oController.getView().setBusy(false);
					}
				});

				oController._cleanDOMValues();
			} else {
				MessageBox.alert("Oops! An error has occurred, verify fields.");
			}

		},

		onCancel: function () {
			oController._cleanDOMValues();
			oController.onNavBack();
		},

		_getNewClientData: function (newClient) {
			newClient.IdClte = oController.byId("clientID").getDOMValue();
			newClient.Nombre = oController.byId("clientName").getDOMValue();
			newClient.Apellido = oController.byId("clientLastName").getDOMValue();
			newClient.Post = oController.byId("clientCP").getDOMValue();
			newClient.Telf = oController.byId("clientTel").getDOMValue();
			newClient.Calle = oController.byId("clientStreet").getDOMValue();
		},

		_cleanDOMValues: function () {
	
		var aInputs = oController._getInputs();
		
		aInputs.forEach(function (oInput) {
				oInput.setValue(null);
				oInput.setValueState("None");
			});
		
		/*
			oController.byId("clientID").setValue(null);
			oController.byId("clientName").setValue(null);
			oController.byId("clientLastName").setValue(null);
			oController.byId("clientCP").setValue(null);
			oController.byId("clientTel").setValue(null);
			oController.byId("clientStreet").setValue("");*/
		},

		_getInputs: function () {
			return [
				oController.getView().byId("clientID"),
				oController.getView().byId("clientName"),
				oController.getView().byId("clientLastName"),
				oController.getView().byId("clientCP"),
				oController.getView().byId("clientTel"),
				oController.getView().byId("clientStreet")
			];
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tosa8.my_gym.view.NewClient
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tosa8.my_gym.view.NewClient
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tosa8.my_gym.view.NewClient
		 */
		//	onExit: function() {
		//
		//	}

	});

});