sap.ui.define([
	"tosa8/my_gym/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("tosa8.my_gym.controller.Home", {
		
	onDisplayNotFound : function (oEvent) {
			//display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "TargetHome"
			});
		},
		onNavToClients : function (oEvent){
			this.getRouter().navTo("clientsList");
		},
		
		onNavToSports : function(oEvent){
			this.getRouter().navTo("sportsList");
		},
		
		onNavToNewSport : function(oEvent){
			this.getRouter().navTo("newSport");
		},
		
		onNavToNewClient : function(){
			this.getRouter().navTo("addClient");
		}
	});
});