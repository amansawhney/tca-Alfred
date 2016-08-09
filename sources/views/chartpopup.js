webix.protoUI({
    name: "webix_pivot_chart_config",

    $init: function(config) {
        this.$view.className += " webix_pivot_chart_popup";
        webix.extend(config,this.defaults);
        webix.extend(config, this._getUI(config));
        this.$ready.push(this._afterInit);
    },
    defaults:{
        padding:8,
        height: 500,
        width: 650,
        head: false,
        modal:true,
        move: true,
        chartTypeLabelWidth: 80,
        chartTypeWidth: 250,
        cancelButtonWidth: 100,
        applyButtonWidth: 100,
        logScaleLabelWidth: 125,
        fieldsColumnWidth: 280
    },
    _getUI: function(config) {
        var chartTypes = [];
        var pivot = webix.$$(config.pivot);
        var types = pivot.chartMap;
        for(var type in types){
            chartTypes.push({id: type, value: pivot._applyLocale(type)});
        }
        return {
            head:{
                view:"toolbar",
                cols: [
                    { id: "config_title",  view: "label", label: webix.i18n.pivot.windowTitle },
                    { view: "button", id: "cancel",  label: pivot._applyLocale("cancel"), width: config.cancelButtonWidth },
                    { view: "button", id: "apply", type: "form", css:"webix_pivot_apply", label:pivot._applyLocale("apply"), width:config.applyButtonWidth }
                ]
            },
            body: {
                type: "space",
                rows:[
                    /*{
                     type: "space",
                     cols:[
                     {	css:"webix_pivot_transparent", borderless: true, template: "<div class='webix_pivot_fields_msg'>"+webix.i18n.pivot.windowMessage||""+"</div>", height: 25}
                     ]

                     },*/
                    {

                        type: "wide",
                        cols: [
                            {
                                width: config.fieldsColumnWidth,
                                rows: [
                                    { id: "fieldsHeader",  css: "webix_pivot_header_fields", template: "<div class='webix_pivot_fields_msg'>"+webix.i18n.pivot.windowMessage||""+"</div>", height: 40 },
                                    { id: "fields", view: "list", type: {height: "auto"}, drag: true, template: "<span class='webix_pivot_list_marker'></span>#text#",
                                        on:{
                                            onBeforeDrop: webix.bind(this._skipValueDrag,this),
                                            onBeforeDropOut: webix.bind(this._checkValueDrag,this),

                                            onBeforeDrag:  webix.bind(this._hidePopups,this)
                                        }
                                    }
                                ]
                            },
                            //	{ view: "resizer", width: 4},
                            {

                                type: "wide",
                                rows:[
                                    {
                                        rows:[
                                            { id: "filtersHeader", data:{value: "filters", icon:"filter" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 },
                                            { id: "filters", view: "list", scroll: true, gravity:2, drag: true, css: "webix_pivot_values",
                                                template: function (obj) {
                                                    obj.type = obj.type || "select";
                                                    return "<div class='webix_pivot_link'>" + obj.text+ "<div class='webix_link_selection filter'>" + pivot._applyLocale(obj.type) + "</div></div> ";
                                                },
                                                type: {
                                                    height: 35
                                                },
                                                onClick: { "webix_link_selection": webix.bind(this._filterSelector, this) },
                                                on: {
                                                    onBeforeDrag:  webix.bind(this._hidePopups,this)
                                                }

                                            }
                                        ]
                                    },
                                    {
                                        rows:[
                                            { id: "valuesHeader", data:{value: "values", icon:"bar-chart"},  template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40},
                                            { id: "values", view: "list", scroll: true, gravity:3, drag: true, css: "webix_pivot_values", type: { height: "auto" },
                                                template: webix.bind(this._function_template, this),
                                                onClick: {
                                                    "webix_link_title": webix.bind(this._function_selector, this),
                                                    "webix_link_selection": webix.bind(this._function_selector, this),
                                                    "webix_color_selection": webix.bind(this._function_color, this),
                                                    "webix_pivot_minus": webix.bind(this._function_remove, this)
                                                },
                                                on:{
                                                    onBeforeDrop: webix.bind(this._copyValueField,this),
                                                    onBeforeDropOut: webix.bind(this._checkValueDrag,this),
                                                    onBeforeDrag:  webix.bind(this._hidePopups,this)
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        rows:[
                                            { id: "groupHeader", data:{value: "groupBy", icon:"sitemap"},  template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40},
                                            { id: "groupBy", view: "list", yCount:1, scroll: false, drag: true, type: {height: 35},
                                                template: "<a class='webix_pivot_link'>#text#</a> ",
                                                on:{
                                                    onBeforeDrop: webix.bind(this._changeGroupby,this),
                                                    onBeforeDrag:  webix.bind(this._hidePopups,this)
                                                }
                                            }
                                        ]
                                    }




                                ]
                            }
                        ]
                    },{
                        /*paddingX: 10,
                         paddingY: 5,*/
                        borderless: true,
                        css: "webix_pivot_footer",
                        /*padding: 5,
                         type: "space",*/
                        cols:[
                            {
                                view: "checkbox", id:"logScale", value: (pivot.config.chart.scale&&pivot.config.chart.scale == "logarithmic"), label: webix.i18n.pivot.logScale,
                                labelWidth: config.logScaleLabelWidth, width: (config.logScaleLabelWidth + 20)
                            },
                            {},
                            {
                                view: "select", id:"chartType", value: pivot.config.chartType,  label: webix.i18n.pivot.chartType,  options: chartTypes,
                                labelWidth: config.chartTypeLabelWidth,  width: config.chartTypeWidth
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
            return "<span class='webix_pivot_header_icon webix_icon fa-"+obj.icon+"'></span>"+webix.i18n.pivot[obj.value];
        }
    },
    _hidePopups: function(){
        webix.callEvent("onClick",[]);
    },
    _skipValueDrag: function(ctx){
        if(ctx.from == this.$$("values")){
            var id = ctx.source[0];
            if(this.$$("values").getItem(id)){
                this.$$("values").remove(id);
            }
            return false;
        }
        return true;
    },
    _checkValueDrag: function(ctx){
        if(ctx.to != ctx.from){
            var id = ctx.source[0];
            if(ctx.from == this.$$("values") && ctx.to != this.$$("fields")){
                delete this.$$("values").getItem(id).operation;
                delete this.$$("values").getItem(id).color;
                if(this.$$("fields").getItem(id))
                    this.$$("fields").remove(id);
            }
            else if(ctx.from == this.$$("fields") && ctx.to != this.$$("values")){
                if(this.$$("values").getItem(id)){
                    this.$$("values").remove(id);
                }
            }
        }
    },
    _copyValueField: function(ctx){
        if( ctx.to && ctx.from != ctx.to ){
            var id = ctx.source;
            var item = ctx.from.getItem(id);

            if(ctx.from == this.$$("fields")){
                if(ctx.to.getItem(id)){
                    this._function_add({},id);
                    this._valueLength++;
                }
                else{
                    item  = webix.copy(item);

                    ctx.to.add(webix.copy(item),ctx.index);
                    this._valueLength++;
                }

                return false;
            }
            else if(!this.$$("fields").getItem(id)){
                this.$$("fields").add(webix.copy(item));
            }

            this._increaseColorIndex = true;
        }
        return true;
    },
    _changeGroupby: function(ctx){
        if(this.$$("groupBy").data.order.length){
            var id = this.$$("groupBy").getFirstId();
            var item = webix.copy(this.$$("groupBy").getItem(id));
            this.$$("groupBy").remove(id);
            this.$$("fields").add(item);
        }
        return true;
    },
    _afterInit: function() {
        this.attachEvent("onItemClick", function(id){
            if (this.$eventSource.name == "button"){
                //transform button clicks to events
                var structure = this.getStructure();

                if(this.innerId(id) == "apply" && (!structure.values.length || !structure.groupBy)){
                    webix.alert(webix.i18n.pivot.valuesNotDefined);
                }
                else{
                    this.callEvent("on"+this.innerId(id), [structure]);
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
        var pivot = webix.$$(this.config.pivot);
        var locale = pivot._applyLocale;

        for (var i = 0; i < obj.operation.length; i++) {
            if(!obj.color)
                obj.color = [pivot._getColor(this._valueLength)];
            if(!obj.color[i])
                obj.color.push(pivot._getColor(this._valueLength));
            var op = "<div class='webix_pivot_link' webix_operation='" + i + "'>";
            op += "<div class='webix_color_selection'><div style='background-color:"+locale(obj.color[i])+"'></div></div>";
            op += "<div class='webix_link_title'>" + obj.text + "</div>";
            op += "<div class='webix_link_selection'>" + locale(obj.operation[i]) + "</div>";

            op += "<div class='webix_pivot_minus webix_icon fa-times'></div>";
            op += "</div>";
            ops.push(op);
        }
        if(this._increaseColorIndex){
            this._increaseColorIndex= false;
            this._valueLength++;
        }
        return ops.join(" ");
    },

    _function_selector: function(e,id) {
        var func_selector = {
            view: "webix_pivot_popup", autofit:true,
            autoheight: true, width: 150,
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
    _function_color: function(e,id) {

        var colorboard = {
            view: "colorboard",
            //id: "colorboard",
            borderless: true

        };
        if(webix.$$(this.config.pivot).config.colorboard){
            webix.extend(colorboard,webix.$$(this.config.pivot).config.colorboard);
        }
        else{
            webix.extend(colorboard,{
                width:  150,
                height: 150,
                palette: webix.$$(this.config.pivot).config.palette
            });
        }

        var p = webix.ui({
            view:"popup",
            id: "colorsPopup",
            body:colorboard
        });
        p.show(e);
        p.getBody().attachEvent("onSelect",function(){
            p.hide();
        });
        p.attachEvent("onHide", webix.bind(function() {
            var index = webix.html.locate(e, "webix_operation");
            var value = p.getBody().getValue();
            if (value) {
                this.$$("values").getItem(id).color[index] = value;
                this.$$("values").updateItem(id);
            }
            p.close();
        }, this));
        return false;
    },
    _function_add: function(e,id) {
        var item = this.$$("values").getItem(id);
        item.operation.push("sum");
        var pivot = webix.$$(this.config.pivot);
        var palette = pivot.config.palette;
        item.color.push(pivot._getColor(this._valueLength));
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

    _filterSelector: function(e,id) {
        var locale = webix.$$(this.config.pivot)._applyLocale;
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

        this.$$("groupBy").clearAll();
        this.$$("groupBy").parse(value.groupBy);


        this.$$("values").clearAll();
        this.$$("values").parse(value.values);
    },
    getStructure: function() {
        var structure = { groupBy:"",values:[],filters:[] };

        var groupBy = this.$$("groupBy");
        if(groupBy.count())
            structure.groupBy = groupBy.getItem(groupBy.getFirstId()).name;


        var values = this.$$("values");
        var temp;
        values.data.each(webix.bind(function(obj){
            for(var j=0; j< obj.operation.length; j++){
                temp = webix.copy(obj);

                webix.extend(temp,{operation: obj.operation[j],color:  obj.color[j]||webix.$$(this.config.pivot).config.color},true);

                structure.values.push(temp);
            }
        },this));

        var filters = this.$$("filters");
        filters.data.each(function(obj){
            structure.filters.push(obj);
        });

        return structure;
    }
}, webix.ui.window, webix.IdSpace);