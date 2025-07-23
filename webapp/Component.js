sap.ui.define([
	"sap/ui/core/Component",
	"sap/ushell/ui/shell/ShellHeadItem",
	"sap/m/MessageToast"
], function (Component, ShellHeadItem, MessageToast) {
	"use strict";

	return Component.extend("plugin.Component", {
		metadata: {
			manifest: "json"
		},

		init() {
			this._oResourceBundle = this.getModel("i18n").getResourceBundle();

			this._getRendererAsync()
				.then(oRenderer => {
					const oToastButton = new ShellHeadItem({
						id: "toastButton",
						icon: "sap-icon://information",
						text: this._oResourceBundle.getText("toastButtonText"),
						press: this._onToastButtonPress.bind(this)
					});

					oRenderer.addHeaderEndItem("sapUshellShellHeadItem", {
						id: "toastButton",
						control: oToastButton
					}, true, false);
				})
				.catch(oError => {
					MessageToast.show(this._oResourceBundle.getText("Error"), {
						details: oError
					});
				});
		},

		_onToastButtonPress: function () {
			const oBundle = this._oResourceBundle;

			sap.ushell.Container.getServiceAsync("AppLifeCycle")
				.then(oAppLifeCycle => {
					const oCurrentApp = oAppLifeCycle.getCurrentApplication();
					const oComponentInstance = oCurrentApp.componentInstance;
					const sAppId = oComponentInstance?.getId();

					if (sAppId && sAppId !== '__renderer0---Shell-home-component') {
						MessageToast.show(oBundle.getText("openedApp") + `${sAppId}`);
					} else {
						MessageToast.show(oBundle.getText("Hello"));
					}
				})
				.catch(oError => {
					MessageToast.show(oBundle.getText("Error"), {
						details: oError.message
					});
				});
		},

		_getRendererAsync: function () {
			const oBundle = this._oResourceBundle;

			return new Promise((fnResolve, fnReject) => {
				const vShell = sap.ushell?.Container;

				if (!vShell) {
					fnReject(oBundle.getText("shellNotAvailable"));
					return;
				}

				const vRenderer = vShell.getRenderer();

				if (vRenderer) {
					fnResolve(vRenderer);
					return;
				}

				vShell.attachRendererCreatedEvent((oEvent) => {
					const vCreatedRenderer = oEvent.getParameter("renderer");
					if (vCreatedRenderer) {
						fnResolve(vCreatedRenderer);
					} else {
						fnReject(oBundle.getText("shellNotAvailable"));
					}
				});
			});
		}
	});
});
