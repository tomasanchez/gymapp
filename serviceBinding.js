function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZOS_CA_TOSA8_ACADEMIA_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}