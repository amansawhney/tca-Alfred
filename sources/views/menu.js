webix.protoUI({
    name:"webix_pivot_popup",
    _selected: null,
    $init: function(config) {
        webix.extend(config, this._get_ui(config));
        this.$ready.push(this._after_init);
    },
    _get_ui: function(config) {
        return {
            body: {
                id:"list", view:"list", borderless: true, autoheight: true, template:"#title#", data: config.data
            }
        };
    },
    _after_init: function() {
        this.attachEvent("onItemClick", function(id){
            this._selected = this.$eventSource.getItem(id);
            this.hide();
        });
    },
    getSelected: function() {
        return this._selected;
    }
}, webix.ui.popup, webix.IdSpace);