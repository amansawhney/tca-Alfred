webix.protoUI({
    name: "webix_pivot_config",

    $init: function(config) {
        this.$view.className += " webix_popup webix_pivot";
        webix.extend(config,this.defaults);
        webix.extend(config, this._get_ui(config));
        this.$ready.push(this._after_init);
    },
    defaults:{
        padding:8,
        height: 500,
        width: 700,
        cancelButtonWidth: 100,
        applyButtonWidth: 100,
        fieldsColumnWidth: 180,
        head: false,
        modal:true,
        move: true
    },
    _get_ui: function(config) {
        return {
            head:{
                /*type: "space",
                 margin: 5,
                 padding: 5,
                 borderless: true,*/
                view:"toolbar",
                //height: 45,
                cols: [
                    { id: "config_title", view: "label", label: webix.i18n.pivot.windowTitle||""},
                    { view: "button", id: "cancel",  label: webix.i18n.pivot.cancel, width: config.cancelButtonWidth },
                    { view: "button", id: "apply", type: "form",  label: webix.i18n.pivot.apply, width:config.applyButtonWidth }

                ]
            },
            body: {
                type: "wide",
                //  margin: 5,
                rows:[

                    {
                        //type: "wide",

                        cols: [
                            // {width:1},
                            {
                                width: config.fieldsColumnWidth,

                                rows: [
                                    { id: "fieldsHeader", data:{value: "fields"}, css: "webix_pivot_header_fields", template: this._popup_templates.popupHeaders, height: 45 },
                                    { id: "fields", view: "list", scroll: true, type: {height: "auto"}, css: "", drag: true, template: "<span class='webix_pivot_list_marker'></span>#text#",
                                        on:{
                                            onBeforeDropOut: webix.bind(this._check_values_drag,this)
                                        }
                                    }
                                ]
                            },

                            {
                                type: "space",
                                rows:[
                                    {
                                        type: "wide",
                                        rows: [
                                            {
                                                css:"webix_pivot_transparent", borderless: true, template: "<div class='webix_pivot_fields_msg'>"+webix.i18n.pivot.windowMessage||""+"</div>", height: 25
                                            },
                                            {
                                                type: "wide",
                                                cols:[


                                                    {

                                                        rows:[

                                                            { id: "filtersHeader", data:{value: "filters", icon:"filter"}, template: this._popup_templates.popupIconHeaders , css: "webix_pivot_popup_title", height: 40 },
                                                            { id: "filters", view: "list", scroll: false, drag: true, css: "webix_pivot_values",
                                                                template: function (obj) {
                                                                    obj.type = obj.type || "select";
                                                                    return "<a class='webix_pivot_link'>" + obj.text+ " <span class='webix_link_selection'>" + obj.type + "</span></a> ";
                                                                },
                                                                type: {
                                                                    height: 35
                                                                },
                                                                onClick: { "webix_pivot_link": webix.bind(this._filter_selector, this) },
                                                                on:{
                                                                    onBeforeDrop: webix.bind(this._copy_filter_field,this),
                                                                    onBeforeDropOut: webix.bind(this._check_filter_drag,this)
                                                                }
                                                            }

                                                        ]},
                                                    {
                                                        rows:[
                                                            { id: "columnsHeader", data:{value: "columns", icon:"columns"}, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40  },
                                                            { id: "columns", view: "list", scroll: false, drag: true, type: {height: 35}, template: "#text#" }
                                                        ]
                                                    }
                                                ]},
                                            {
                                                type: "wide",
                                                cols:[
                                                    {
                                                        rows:[
                                                            { id: "rowsHeader", data:{value: "rows", icon:"list"}, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40  },
                                                            { id: "rows", view: "list", scroll: false, drag: true, template: "#text#", type: {height: 35}}
                                                        ]
                                                    },
                                                    {
                                                        rows:[
                                                            { id: "valuesHeader", data:{value: "values", icon: false, iconContent: "<b>&Sigma;</b>"}, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40  },
                                                            { id: "values", view: "list", scroll: true, drag: true, css: "webix_pivot_values", type: { height: "auto" },
                                                                template: webix.bind(this._function_template, this),
                                                                onClick: {
                                                                    "webix_pivot_link": webix.bind(this._function_selector, this),
                                                                    "webix_pivot_plus": webix.bind(this._function_add, this),
                                                                    "webix_pivot_minus": webix.bind(this._function_remove, this)
                                                                },
                                                                on:{
                                                                    onBeforeDrop: webix.bind(this._copy_values_field,this),
                                                                    onBeforeDropOut: webix.bind(this._check_values_drag,this)
                                                                }
                                                            }
                                                        ]
                                                    }



                                                ]}
                                        ]

                                    }
                                ]


                            }
                        ]
                    }
                ]

            }
        };
    },
    _popup_templates: {
        popupHeaders: function(obj){
            return webix.i18n.pivot[obj.value];
        },
        popupIconHeaders: function(obj){
            if(obj.icon)
                return "<span class='webix_pivot_header_icon webix_icon fa-"+obj.icon+"'></span>"+webix.i18n.pivot[obj.value];
            else
                return "<span class='webix_pivot_header_icon'>"+obj.iconContent+"</span>"+webix.i18n.pivot[obj.value];
        }
    },
    _check_values_drag: function(ctx){
        var from = ctx.from,
            to = ctx.to;
        if(to != from){
            var id = ctx.source[0];

            if(from == this.$$("values")&& to != this.$$("filters")){
                if(this.$$("fields").getItem(id))
                    this.$$("fields").remove(id);
            }
            else if(to != this.$$("values")){
                var found = false;
                if(from == this.$$("filters")){
                    var name = from.getItem(id).name;
                    this.$$("values").data.each(function(item){
                        if(item.name == name){
                            id = found = item.id;
                        }
                    });
                }

                if(found || from == this.$$("fields") && to != this.$$("filters")){
                    if(this.$$("values").getItem(id))
                        this.$$("values").remove(id);
                }
            }
        }
    },
    _copy_values_field: function(ctx){
        if( ctx.to && ctx.from != ctx.to ){
            var id = ctx.source;
            var item = ctx.from.getItem(id);
            if(ctx.from == this.$$("fields")){
                if(ctx.to.getItem(id)){
                    this._function_add({},id);
                }
                else{
                    ctx.to.add(webix.copy(item),ctx.index);
                }
                return false;
            }
            else{
                if(!this.$$("fields").getItem(id))
                    this.$$("fields").add(webix.copy(item));
            }

        }
        return true;
    },
    _copy_filter_field: function(ctx){
        if(ctx.from != ctx.to){
            var item = webix.copy(ctx.from.getItem(ctx.start));
            var name = item.name;
            delete item.id;
            var found = false;
            this.$$("filters").data.each(function(field){
                if(field.name == name){
                    found = true;
                }
            });
            if(!found)
                ctx.to.add(item);
            return false;
        }
        return false;
    },
    _check_filter_drag: function(ctx){
        if(ctx.from && ctx.to && ctx.from != ctx.to){
            var lists = ["fields", "rows", "columns"];
            var name = ctx.from.getItem(ctx.start).name;
            for( var i=0; i< lists.length; i++ ){
                var sameItem = null;
                this.$$(lists[i]).data.each(function(item){
                    if(item.name == name){
                        sameItem = item;
                    }
                });
                if(sameItem)
                    this.$$(lists[i]).remove(sameItem.id);
            }
            this._check_values_drag(ctx);
        }
        return true;
    },
    _after_init: function() {
        this.attachEvent("onItemClick", function(id){
            var innerId = this.innerId(id);
            if (innerId == "cancel" || innerId == "apply"){
                //transform button clicks to events
                var structure = this.getStructure();

                if(webix.$$(this.config.pivot).callEvent("onBefore"+innerId, [structure])){
                    this.callEvent("on"+innerId, [structure]);
                    this.hide();
                }

            }
        });
    },
    _function_template: function (obj) {
        obj.operation = obj.operation || ["sum"];
        if (!webix.isArray(obj.operation))
            obj.operation = [obj.operation];

        var ops = [];
        var locale = webix.$$(this.config.pivot)._apply_locale;
        for (var i = 0; i < obj.operation.length; i++) {
            var op = "<span class='webix_pivot_link' webix_operation='" + i + "'>";
            op += "<span>" + obj.text + "</span>";
            op += "<span class='webix_link_selection'>" + locale(obj.operation[i]) + "</span>";
            op += "<span class='webix_pivot_minus webix_icon fa-times'></span>";
            op += "</span>";
            ops.push(op);
        }

        return ops.join(" ");
    },

    _function_selector: function(e,id) {
        var func_selector = {
            view: "webix_pivot_popup", autofit:true,
            width: 150,
            data: this.config.operations||[]
        };
        var p = webix.ui(func_selector);
        p.show(e);
        p.attachEvent("onHide", webix.bind(function() {
            var index = webix.html.locate(e, "webix_operation");
            var sel = p.getSelected();
            if (sel !== null) {
                this.$$("values").getItem(id).operation[index] = sel.name;
                this.$$("values").updateItem(id);
            }

            p.close();
        }, this));
    },

    _function_add: function(e,id) {
        var item = this.$$("values").getItem(id);
        item.operation.push("sum");
        this.$$("values").updateItem(id);

        webix.delay(function(){
            var index = item.operation.length-1;
            var els = this.$$("values").getItemNode(id).childNodes;
            var el = null;
            for (var i = 0; i < els.length; i++) {
                el = els[i];
                if (!el.getAttribute) continue;
                var op = el.getAttribute("webix_operation");
                if (!webix.isUndefined(op) && op == index) break;
            }
            if (el!==null)
                this._function_selector(el, id);
        }, this);
    },
    _function_remove: function(e, id) {
        var index = webix.html.locate(e, "webix_operation");
        var item = this.$$("values").getItem(id);
        if (item.operation.length > 1) {
            item.operation.splice(index, 1);
            this.$$("values").updateItem(id);
        } else {
            this.$$("values").remove(id);
            //this.$$("values").move(id, null, this.$$("fields"));
        }
        return false;
    },

    _filter_selector: function(e,id) {
        var locale = webix.$$(this.config.pivot)._apply_locale;
        var selector = {
            view: "webix_pivot_popup", autofit:true,
            height: 150, width: 150,
            data: [
                {name:"datepicker", title: locale("date")},
                {name:"multiselect", title: locale("multiselect")},
                {name:"select", title: locale("select")},
                {name:"text", title: locale("text")}
            ]

        };
        var p = webix.ui(selector);
        p.show(e);
        p.attachEvent("onHide", webix.bind(function() {
            var sel = p.getSelected();
            if (sel !== null) {
                var item = this.$$('filters').getItem(id);
                item.type = sel.name;
                this.$$('filters').updateItem(id);
            }

            p.close();
        }, this));
    },

    data_setter: function(value) {
        this.$$("fields").clearAll();
        this.$$("fields").parse(value.fields);
        this.$$("fields").filter(function(item){
            return item.name != "id";
        });

        this.$$("filters").clearAll();
        this.$$("filters").parse(value.filters);

        this.$$("columns").clearAll();
        this.$$("columns").parse(value.columns);

        this.$$("rows").clearAll();
        this.$$("rows").parse(value.rows);

        this.$$("values").clearAll();
        this.$$("values").parse(value.values);
    },
    setStructure: function(config){
        this.define("structure", config);
        this.render();
    },
    getStructure: function() {
        var structure = { rows:[], columns:[],values:[],filters:[] };

        var rows = this.$$("rows");
        rows.data.each(function(obj){
            structure.rows.push(obj.name); });

        var columns = this.$$("columns");
        columns.data.each(function(obj){
            structure.columns.push(obj.name); });


        var values = this.$$("values");
        values.data.each(function(obj){
            structure.values.push(obj); });

        var filters = this.$$("filters");
        filters.data.each(function(obj){
            structure.filters.push(obj); });

        return structure;
    }
}, webix.ui.window, webix.IdSpace);