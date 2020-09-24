sap.ui.define([
	"tosa8/my_gym/controller/BaseController",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";
	var oController;
	return Controller.extend("tosa8.my_gym.controller.SportsList", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tosa8.my_gym.view.SportsList
		 */
		onInit: function () {
			oController = this;
		
			
		},
		
		_findSports: function(){
			
			var oModel = oController.getView().getModel();
			oModel.read("/DeportesSet", {
				success: function (resultado) {
					MessageToast.show("Deportes encontrados");
					oController._loadSports(resultado.results);
				},
				error: function (error) {
					MessageToast.show("Algo salio mal!");
				}
			});
			
		},
		
		_loadSports: function(oData){

			var modeloJSON = new sap.ui.model.json.JSONModel(oData);
			oController.byId("sportsSet").setModel( modeloJSON, "SPORTS" );
		},
		
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tosa8.my_gym.view.SportsList
		 */
		//	onBeforeRendering: function() {
	
			//},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tosa8.my_gym.view.SportsList
		 */
			onAfterRendering: function() {
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tosa8.my_gym.view.SportsList
		 */
		//	onExit: function() {
		//
		//	}

	});

});