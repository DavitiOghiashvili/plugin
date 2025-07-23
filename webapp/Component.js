sap.ui.define([
	"sap/ui/core/Component",
	"sap/ushell/ui/shell/ShellHeadItem",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (Component, ShellHeadItem, MessageToast, Fragment) {
	"use strict";

	return Component.extend("plugin.Component", {
		_oDialog: null,
		metadata: {
			manifest: "json"
		},

		/**
		 * Initializes the component and adds buttons to the FLP shell header.
		 */
		init: function () {
			const oResourceBundle = this.getModel("i18n").getResourceBundle();

			this._getRendererAsync().then(oRenderer => {
				// Toast Button
				const oToastButton = new ShellHeadItem({
					id: "toastButton",
					icon: "sap-icon://alert",
					text: oResourceBundle.getText("toastButtonText"),
					press: () => MessageToast.show("Hello from the plugin! Please open the app to see the info")
				});

				// Open Fragment Button
				const oFragmentButton = new ShellHeadItem({
					id: "fragmentButton",
					icon: "sap-icon://popup-window",
					text: oResourceBundle.getText("fragmentButtonText"),
					press: () => this._openFragmentDialog()
				});

				// Add buttons to the shell header
				oRenderer.addHeaderEndItem("sapUshellShellHeadItem", { id: "toastButton", control: oToastButton }, true, false);
				oRenderer.addHeaderEndItem("sapUshellShellHeadItem", { id: "fragmentButton", control: oFragmentButton }, true, false);
			}).catch(oError => MessageToast.show("Error initializing plugin", oError));
		},

		/**
		 * Opens the dialog fragment, loading it if not already loaded.
		 */
		async _openFragmentDialog() {
			this._oDialog ??= await Fragment.load({
				name: "plugin.view.fragments.Dialog",
				controller: this
			});
			this._oDialog.open();
			return this._oDialog;
		},

		/**
		 * Closes the dialog.
		 */
		onCloseDialog: function () {
			if (this._oDialog) {
				this._oDialog.close();
			}
		},

		/**
		 * Retrieves the FLP renderer asynchronously.
		 * @private
		 * @returns {Promise<sap.ushell.renderers.fiori2.Renderer>}
		 */
		_getRendererAsync: function () {
			return new Promise((fnResolve, fnReject) => {
				const vShell = sap.ushell?.Container;

				if (!vShell) {
					fnReject("Illegal state: shell container not available.");
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
						fnReject("Illegal state: shell renderer not available.");
					}
				});
			});
		}
	});
});