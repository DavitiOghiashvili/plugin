sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (Component, Button, MessageToast, Fragment) {

	return Component.extend("plugin.Component", {

		metadata: {
			manifest: "json",
		},

		init: function () {
			let rendererPromise = this._getRendererAsync();
			let oResourceBundle = this.getModel("i18n").getResourceBundle();

			rendererPromise.then(function (oRenderer) {
				// Add Toast Button
				let oToastButton = new Button({
					text: oResourceBundle.getText("toastButtonText", "Show Toast"),
					press: function () {
						MessageToast.show("Hello from the plugin!");
					}
				});

				// Add Fragment Button
				let oFragmentButton = new Button({
					text: oResourceBundle.getText("fragmentButtonText", "Show Dialog"),
					press: this._openFragmentDialog.bind(this)
				});

				// Extend shell header with buttons
				oRenderer.addHeaderEndItem("sapUshellShellHeadItem", {
					id: "toastButton",
					control: oToastButton
				}, true, false);

				oRenderer.addHeaderEndItem("sapUshellShellHeadItem", {
					id: "fragmentButton",
					control: oFragmentButton
				}, true, false);
			}.bind(this));
		},

		_openFragmentDialog: function () {
			if (!this._oDialog) {
				Fragment.load({
					name: "plugin.view.fragments.Dialog",
					controller: this
				}).then(function (oDialog) {
					this._oDialog = oDialog;
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.open();
			}
		},

		onCloseDialog: function () {
			this._oDialog.close();
		},

       /**
       * @private
       * @return {Promise<sap.ushell.renderers.fiori2.Renderer>}
       */
		_getRendererAsync() {
			return new Promise((fnResolve, fnReject) => {
				const vShell = sap.ushell?.Container

				if (!vShell) {
					fnReject(
						'Illegal state: shell container not available; this component must be executed in a unified shell runtime context.'
					)
				}

				const vRenderer = vShell.getRenderer()

				if (vRenderer) {
					return fnResolve(vRenderer)
				}

				vShell.attachRendererCreatedEvent((oEvent) => {
					const vCreatedRenderer = oEvent.getParameter('renderer')

					if (vCreatedRenderer) {
						fnResolve(vCreatedRenderer)
					}

					fnReject(
						"Illegal state: shell renderer not available after receiving 'rendererLoaded' event."
					)
				})
			})
		},
	});
});