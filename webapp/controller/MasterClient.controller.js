sap.ui.define([
	"tosa8/my_gym/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
	"use strict";
	var oController;
	var oLastClient;
	return Controller.extend("tosa8.my_gym.controller.MasterClient", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tosa8.my_gym.view.MasterClient
		 */
		onInit: function () {

			oLastClient = 0;
			oController = this;
			var oRouter = this.getRouter();
			oRouter.getRoute("client").attachMatched(this._onRouteMatched, this);
			// Hint: we don't want to do it this way
			/*
			oRouter.attachRouteMatched(function (oEvent){
				var sRouteName, oArgs, oView;
				sRouteName = oEvent.getParameter("name");
				if (sRouteName === "employee"){
					this._onRouteMatched(oEvent);
				}
			}, this);
			*/

		},

		_onRouteMatched: function (oEvent) {
			var oClient, oView;
			oClient = oEvent.getParameter("arguments");
			oController._readById(oClient.IdClte);
			oView = this.getView();
			oView.bindElement({
				path: "/clients(" + oClient.IdClte + ")",
				events: {
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},

		_readById: function (oId) {
			var oModel = oController.getView().getModel();

			var sPath = oModel.createKey("/ClientesSet", {
				IdClte: oId
			});

			oModel.read(sPath, {
				success: function (result) {
					oLastClient = result;
					this.getClientSports(sPath);
					this.loadClient(result);

				}.bind(this),
				error: function (error) {
					MessageToast.show("Error");
					oLastClient = 0;
					//If not user, then display not found
					oController.getRouter().getTargets().display("notFound");

				}
			});

		},

		_onBindingChange: function (oArg) {

			// No data for the binding
			if (oLastClient === 0) {
				oController.getRouter().getTargets().display("notFound");
			}
		},

		onNavClose: function (oEvent) {
			oLastClient = 0;
			oController.onNavBack();
		},

		/* Editing */
		handleEditPress: function (oEvent) {

			//Enabling Editing
			oController._enableEdits(true);
			oController._toggleButtonsAndView(true);

		},

		handleCancelPress: function () {
			//Restore the data
			oController.loadClient(oLastClient);
			oController._toggleButtonsAndView(false);
			oController._enableEdits(false);
		},

		handleSavePress: function () {

			var client = oLastClient;
			oController._getNewClientData(client);

			oLastClient = client;

			oController.onEditClient(client);

			oController._toggleButtonsAndView(false);
			oController._enableEdits(false);

		},
		
		onDeleteClient : function(oEvent){
				MessageBox.confirm("Esta seguro de eliminar Cliente?", {
				title: "Eliminar Cliente",
				styleClass: "", // default
				actions: [MessageBox.Action.OK,
					sap.m.MessageBox.Action.CANCEL
				], // default
				emphasizedAction: MessageBox.Action.OK, // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit,
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						oController._validateDelete();
					}
				}
			});
		},
		
		_validateDelete: function(){
			var oModelSports = oController.byId("csportsTable").getModel("oneClientSports");
			var oSports = oModelSports.getData();
			if(oSports.length > 0){
				MessageBox.error("El cliente posee \"Deportes subscriptos\".\nPrimero elimine todos los deportes.");
			}else{
				oController._deleteClient();
			}
		},

		_deleteClient : function(){
			
				var oModel = oController.getView().getModel();
				var oId = oController.byId("clientID").getDOMValue();
			
				var sPath = oModel.createKey("/ClientesSet", {
				IdClte: oId
			});
			
		
			oModel.remove(sPath, {
				success: function (resultado) {
					MessageToast.show("Cliente Eliminado");
					this.getView().setBusy(false);
					oController.onNavBack();
				}.bind(this),
				error: function (error) {
					MessageToast.show("Algo salio mal!");
					oController.getView().setBusy(false);
				}
			});
		},
		
		handleDelete: function (oEvent) {
			
			var oList = oEvent.getSource(),
				oArray = oList.getModel("oneClientSports").getData(), //Array with all listed sports
				oIndex = oList._oItemNavigation.iFocusedIndex, // Index of item selected
				oSport= oArray[oIndex]; // Sport fetched 
			
			MessageBox.confirm("Esta seguro de eliminar deporte?", {
				title: "Eliminar Deporte",
				styleClass: "", // default
				actions: [MessageBox.Action.OK,
					sap.m.MessageBox.Action.CANCEL
				], // default
				emphasizedAction: MessageBox.Action.OK, // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit,
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						oController._deleteSport(oSport);
					}
				}
			});

		},
		
		_deleteSport: function(oSport){
			var oModelDefault = this.getView().getModel();
			
		
			var sPath = oModelDefault.createKey("/DeportesSet", {
				IdClte: oSport.IdClte,
				IdDep: oSport.IdDep
			});
			
			
			
			var clientPath = oModelDefault.createKey("/ClientesSet", {
				IdClte: oSport.IdClte
			});
			
			oController.getView().setBusy(true);
			
			oModelDefault.remove(sPath, {
				success: function (resultado) {
					MessageToast.show("Deporte eliminado");
					this.getView().setBusy(false);
					oController.getClientSports(clientPath);
				}.bind(this),
				error: function (error) {
					MessageToast.show("Algo salio mal!");
					oController.getView().setBusy(false);
				}
			});
			
			
		},

		_enableEdits: function (active) {
			//Enabling all
			oController.byId("clientName").setEditable(active);
			oController.byId("clientName").setEditable(active);
			oController.byId("clientLastName").setEditable(active);
			oController.byId("clientCP").setEditable(active);
			oController.byId("clientTel").setEditable(active);
			oController.byId("clientStreet").setEditable(active);
		},

		_toggleButtonsAndView: function (bEdit) {

			// Show the appropriate action buttons
			oController.byId("edit").setVisible(!bEdit);
			oController.byId("save").setVisible(bEdit);
			oController.byId("cancel").setVisible(bEdit);

			if (!bEdit) {
				oController.byId("csportsTable").setMode("None");
			} else {
				oController.byId("csportsTable").setMode("Delete");
			}
		},

		onEditClient: function (oClient) {

			var oModelDefault = this.getView().getModel();

			//Create Key
			var sPath = oModelDefault.createKey("/ClientesSet", {
				IdClte: oClient.IdClte
			});

			var oEntity = {
				IdClte: oClient.IdClte,
				Nombre: oClient.Nombre,
				Apellido: oClient.Apellido,
				Post: oClient.Post,
				Telf: oClient.Telf,
				Calle: oClient.Calle
			};

			oController.getView().setBusy(true);

			oModelDefault.update(sPath, oEntity, {
				success: function (resultado) {
					oController.getView().setBusy(false);
					MessageToast.show("Cliente Actualizado");
				}.bind(this),
				error: function (error) {
					MessageToast.show("Error");
					oController.getView().setBusy(false);
				}
			});
		},

		/*Adding NavProp*/
		onAddSport: function (oEvent) {
			var oClient;
			oClient = oController.byId("clientID").getDOMValue();
			this.getRouter().navTo("newSport", {
				IdClte: oClient
			});
		},

		/*Loading data*/
		onPressClient: function (oEvent) {

			//Busco la referencia del registro seleccionado
			var keyClte = oEvent.getSource().getBindingContext().getProperty("IdClte");

			//oController.getView().setBusy(true);
			oController._readById(keyClte);
			/*var sPath = oModelDefault.createKey("/ClientesSet", {
									IdClte: keyClte
								});
			
								oModelDefault.read(sPath, {
									success: function (result) {
										this.getClientSports(sPath);
										this.loadClient(result);
									}.bind(this),
									error: function (error) {
										MessageToast.show("Error");
									}
								}
								);*/

		},

		loadClient: function (result) {
			oController.byId("clientID").setValue(result.IdClte);
			oController.byId("clientName").setValue(result.Nombre);
			oController.byId("clientLastName").setValue(result.Apellido);
			oController.byId("clientCP").setValue(result.Post);
			oController.byId("clientTel").setValue(result.Telf);
			oController.byId("clientStreet").setValue(result.Calle);
		},

		_getNewClientData: function (newClient) {
			newClient.Nombre = oController.byId("clientName").getDOMValue();
			newClient.Apellido = oController.byId("clientLastName").getDOMValue();
			newClient.Post = oController.byId("clientCP").getDOMValue();
			newClient.Telf = oController.byId("clientTel").getDOMValue();
			newClient.Calle = oController.byId("clientStreet").getDOMValue();
		},

		getClientSports: function (Path) {
			var oModel = this.getView().getModel();

			oModel.read(Path + "/nDeportes", {
				success: function (result) {
					this.loadClientSport(result);
				}.bind(this),
				error: function (error) {
					MessageToast.show("Error");
				}
			});
		},

		loadClientSport: function (resultArray) {
			var modelJSON = new sap.ui.model.json.JSONModel(resultArray.results);
			this.byId("csportsTable").setModel(modelJSON, "oneClientSports");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tosa8.my_gym.view.MasterClient
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tosa8.my_gym.view.MasterClient
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tosa8.my_gym.view.MasterClient
		 */
		onExit: function () {
			oLastClient = 0;
		}

	});

});