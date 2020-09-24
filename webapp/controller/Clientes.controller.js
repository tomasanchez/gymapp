sap.ui.define([
	"tosa8/my_gym/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("tosa8.my_gym.controller.Clientes", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tosa8.my_gym.view.Clientes
		 */
		onInit: function () {

		},
		
		onListItemPressed : function(oEvent){
			var oItem, oCtx, oId;
			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();
			oId = oCtx.getProperty("IdClte");
			this.getRouter().navTo("client",{
				IdClte : oId
			});
		},
		
		onAddClient : function(oEvent){
			this.getRouter().navTo("addClient");
		}


		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tosa8.my_gym.view.Clientes
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tosa8.my_gym.view.Clientes
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tosa8.my_gym.view.Clientes
		 */
		//	onExit: function() {
		//
		//	}

	});

});