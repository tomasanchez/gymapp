sap.ui.define([
	"tosa8/my_gym/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/SimpleType",
	"sap/ui/model/ValidateException",
	"sap/ui/core/Core",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, SimpleType, ValidateException, Core, MessageBox, MessageToast) {
	"use strict";
	var oController;

	return Controller.extend("tosa8.my_gym.controller.NewSport", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tosa8.my_gym.view.NewSport
		 */
		onInit: function () {
			oController = this;
			oController.myName = 0;
			oController.byId("clientID").setValue("0");

			/*Routing*/
			var oRouter = this.getRouter();
			oRouter.getRoute("newSport").attachMatched(this._onRouteMatched, this);

			var oView = this.getView(),
				oMM = Core.getMessageManager();

			// attach handlers for validation errors
			oMM.registerObject(oView.byId("clientID"), true);
			oMM.registerObject(oView.byId("sTeacher"), true);
			oMM.registerObject(oView.byId("sCost"), true);
		},

		_onRouteMatched: function (oEvent) {
			var oClient, oView;
			oClient = oEvent.getParameter("arguments");
			oController.byId("clientID").setValue(oClient.IdClte);
			oView = this.getView();
			
			if(oClient.IdClte !== 0){
					oController.byId("clientID").setEditable(false);
			}
			/*oView.bindElement({
							path : "/clients(" + oClient.IdClte + ")",
							events : {
								dataRequested: function (oEvent) {
									oView.setBusy(true);
								},
								dataReceived: function (oEvent) {
									oView.setBusy(false);
								}
							}
						});*/
		},

		/* Validating Inputs*/

		onCreateSport: function (oEvent) {

			// collect input controls
			var
				aInputs = [
					oController.getView().byId("clientID"),
					oController.getView().byId("sTeacher"),
					oController.getView().byId("sCost")
				],

				bValidationError = false;

			// Check that inputs are not empty.
			// Validation does not happen during data binding as this is only triggered by user actions.
			aInputs.forEach(function (oInput) {
				bValidationError = oController._validateInput(oInput) || bValidationError;
			}, oController);

			var oNewSport = oController._createSport();

			if (!bValidationError) {
					oController.getView().setBusy(true);
				oController._fetchDOMValues(oNewSport);
				oController._sportCreate(oNewSport);
			} else {
				MessageBox.alert("Oops! An error has occurred, verify fields.");
			}

			//var oSport = oController._fetchDOMValues();
		},

		_fetchDOMValues: function (oNewSport) {
			oNewSport.IdClte = oController.byId("clientID").getDOMValue();
			oNewSport.IdDep = oController.byId("sID").getSelectedKey();
			oNewSport.Profe = oController.byId("sTeacher").getDOMValue();
			oNewSport.Costo = oController.byId("sCost").getDOMValue();
			oNewSport.Horarios = oController.byId("sTime").getSelectedKey();
		},

		_sportCreate: function (oSport) {
			
		
			var oModel = oController.getView().getModel();

			oModel.create("/DeportesSet", oSport, {
				success: function (resultado) {
					MessageToast.show("Succes: New subscription");
					this.getView().setBusy(false);

				}.bind(this),
				error: function (error) {
					MessageToast.show("Error: Client is already subscripted");
					this.getView().setBusy(false);
				}
			});
			
			oController.onNavBack();

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tosa8.my_gym.view.NewSport
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tosa8.my_gym.view.NewSport
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tosa8.my_gym.view.NewSport
		 */
		//	onExit: function() {
		//
		//	}

	});

});