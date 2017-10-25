"use strict";

webix.protoUI({
    name: "webix_pivot_popup",
    _selected: null,
    $init: function $init(config) {
        webix.extend(config, this._get_ui(config));
        this.$ready.push(this._after_init);
    },
    _get_ui: function _get_ui(config) {
        return {
            body: {
                id: "list", view: "list", borderless: true, autoheight: true, template: "#title#", data: config.data
            }
        };
    },
    _after_init: function _after_init() {
        this.attachEvent("onItemClick", function (id) {
            this._selected = this.$eventSource.getItem(id);
            this.hide();
        });
    },
    getSelected: function getSelected() {
        return this._selected;
    }
}, webix.ui.popup, webix.IdSpace);