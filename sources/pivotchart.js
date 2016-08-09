import * as flt from "filters.js";
import "views/chartpopup.js";

webix.protoUI({
	name:"pivot-chart",
	version:"{{version}}",
	defaults: {
		fieldMap: {},
		rows:[],
		filterLabelAlign: "right",
		filterWidth: 300,
		filterMinWidth: 180,
		editButtonWidth: 110,
		filterLabelWidth: 100,
		chartType: "bar",
		color: "#36abee",
		chart:{
		},
		singleLegendItem: 1,
		palette: [
			["#e33fc7","#a244ea","#476cee","#36abee","#58dccd","#a7ee70"],
			["#d3ee36","#eed236","#ee9336","#ee4339","#595959","#b85981" ],
			[ "#c670b8","#9984ce","#b9b9e2","#b0cdfa","#a0e4eb","#7faf1b" ],
			[ "#b4d9a4", "#f2f79a","#ffaa7d", "#d6806f", "#939393", "#d9b0d1"],
			["#780e3b","#684da9","#242464","#205793","#5199a4", "#065c27"],
			["#54b15a","#ecf125","#c65000","#990001","#363636", "#800f3e"]
		]
	},
	templates:{
		groupNameToStr: function(name,operation){
			return name+"_"+operation;
		},
		groupNameToObject: function(name){
			var arr = name.split("_");
			return {name:arr[0],operation:arr[1]};
		},
		seriesTitle: function(data,i){
			var name = this.config.fieldMap[data.name]||this._capitalize(data.name);
			var operation = (webix.isArray(data.operation)?data.operation[i]:data.operation);
			return name+" ( "+(webix.i18n.pivot[operation]||operation)+")";
		}
	},
	templates_setter: function(obj){
		if(typeof obj == "object")
			webix.extend(this.templates,obj);
	},
	chartMap: {
		bar: function(color){
			return {
				border:0,
				alpha:1,
				radius:0,
				color: color
			};
		},
		line: function(color){
			return {
				alpha:1,
				item:{
					borderColor: color,
					color: color
				},
				line:{
					color: color,
					width:2
				}
			};
		},
		radar: function(color){
			return {
				alpha:1,
				fill: false,
				disableItems: true,
				item:{
					borderColor: color,
					color: color
				},
				line:{
					color: color,
					width:2
				}
			};
		}
	},
	chartMap_setter: function(obj){
		if(typeof obj == "object")
			webix.extend(this.chartMap,obj,true);
	},
	$init: function(config) {
		if (!config.structure)
			config.structure = {};
		webix.extend(config.structure, { groupBy:"", values:[], filters:[] });

		this.$view.className +=" webix_pivot_chart";
		webix.extend(config, {editButtonWidth: this.defaults.editButtonWidth});
		webix.extend(config, this.getUI(config));

		this.$ready.push(webix.bind(function(){
			webix.delay(this.render,this); // delay needed for correct legend rendering
		},this));
		this.data.attachEvent("onStoreUpdated", webix.bind(function() {
			// call render if pivot is initialized
			if (this.$$("chart")) this.render(this,arguments);
		}, this));
	},
	getUI: function(config) {
		var cols = [];



		cols.push({ id: "filters", hidden:true, cols:[] });
		if(!config.readonly){
			cols.push(
				{},
				{
					id:"edit", view: "icon", type: "iconButton", align: "right", icon: "pencil-square-o", inputWidth: config.editButtonWidth,
					tooltip: this._applyLocale("settings"), click: webix.bind(this.configure,this)
				}
			);
		}
		var header = {
			paddingY: 10,
			paddingX: 5,
			margin: 10,
			maxHeight: 5,
			id: "toolbar",
			cols: cols
		};

		var chart = { id: "bodyLayout", type: "line", margin: 10, cols:[{id:"chart", view: "chart"}] };
		return { type: "clean", rows: [ header, chart ]};
	},
	configure: function() {
		if (!this.pivotPopup) {
			var config = { view:"webix_pivot_chart_config", operations:[], pivot: this.config.id };
			webix.extend(config , this.config.popup||{});

			this.pivotPopup = webix.ui(config);
			this.callEvent("onPopup",[this.pivotPopup]);
			this.pivotPopup.attachEvent("onApply", webix.bind(function(structure) {
				this.config.chartType = this.pivotPopup.$$("chartType")?this.pivotPopup.$$("chartType").getValue():"bar";
				this.config.chart.scale = (this.pivotPopup.$$("logScale").getValue()?"logarithmic":"linear");
				webix.extend(this.config.structure, structure, true);
				this.render();
			}, this));
		}

		var functions = [];
		for (var i in this.operations) functions.push({name: i, title: this._applyLocale(i)});
		this.pivotPopup._valueLength = this._valueLength;
		this.pivotPopup.define("operations", functions);
		var pos = webix.html.offset(this.$$("chart").getNode());
		this.pivotPopup.setPosition(pos.x + 10, pos.y + 10);
		this.pivotPopup.define("data", this.getFields());
		this.pivotPopup._valueFields =
		this.pivotPopup.show();
	},
	render: function(mode) {
		// render filters
		var filters = this._processFilters();
		if (filters.length) {

			this.$$("filters").show();
			this.$$("filters").define("cols", filters);
			this._setFilterEvents();
		} else {
			this.$$("filters").hide();
		}
		this._initFilters();

		this._setChartConfig();

		this._loadFilteredData();
	},
	_setChartConfig: function() {
		var config = this.config;
		var values = config.structure.values;

		for (var i = 0; i < values.length; i++) {
			values[i].operation = values[i].operation || ["sum"];
			if (!webix.isArray(values[i].operation))
				values[i].operation = [values[i].operation];
		}

		var chartType = this.config.chartType||"bar";
		var mapConfig = this.chartMap[chartType];

		var chart = {

			"type":  (mapConfig&&mapConfig("").type?mapConfig("").type:chartType),
			"xAxis": webix.extend({template: "#id#"},config.chart.xAxis||{},true),
			"yAxis": webix.extend({},config.chart.yAxis||{})
		};

		webix.extend(chart,config.chart);
		if(!chart.padding){
			chart.padding = { top: 17};
		}

		var result = this._getSeries();

		chart.series = result.series;

		chart.legend = false;
		if(config.singleLegendItem || this._valueLength>1){
			chart.legend = result.legend;
		}

		chart.scheme = {
			$group: this._pivot_group,
			$sort:{
				by: "id"
			}
		};
		this.$$("chart").removeAllSeries();
		for(var c in chart){
			this.$$("chart").define(c,chart[c]);
		}

	},
	_applyLocale: function(value){
		return webix.i18n.pivot[value]||value;
	},
	_capitalize: function(value){
		return value.charAt(0).toUpperCase() + value.slice(1);
	},
	_applyMap: function(value, capitalize){
		return this.config.fieldMap[value]||(capitalize?this._capitalize(value):value);
	},
	_processFilters: function() {
		var filters = this.config.structure.filters || [];

		var items = [];
		for (var i = 0; i < filters.length; i++) {
			var f = filters[i];
			var item = { value: f.value, label: this._applyMap(f.name, true), field: f.name, view: f.type , stringResult: true,
						labelAlign: this.config.filterLabelAlign, labelWidth: this.config.filterLabelWidth, minWidth: this.config.filterMinWidth, maxWidth: this.config.filterWidth};
			if (f.type == "select" || f.type == "multiselect"){
				item.options = this._distinctValues(f.name);
				if(f.type == "multiselect")
					item.options.shift();

			}

			items.push(item);
		}
		return items;
	},
	_distinctValues: function(field) {
		var values = [{value:"",id:""}];
		var data = this.data.pull;
		var hash = {};
		for (var obj in data) {
			var value = data[obj][field];
			if (!webix.isUndefined(value)){
				if (!hash[value]) {
					values.push({ value:value, id:value });
					hash[value] = true;
				}
			}
		}
		values.sort(function(a,b) {
			var val1 = a.value;
			var val2 = b.value;
			if (!val2) return 1;
			if (!val1) return -1;

			val1 = val1.toString().toLowerCase(); val2=val2.toString().toLowerCase();
			return val1>val2?1:(val1<val2?-1:0);
		});
		return values;
	},
	_loadFilteredData: function(){
		this._initFilters();
		this.data.silent(function(){
			this.data.filter(webix.bind(this._filterItem,this));
		},this);
		this.$$("chart").data.silent(function(){
			this.$$("chart").clearAll();
		},this);
		this.$$("chart").parse(this.data.getRange());


	},
	_setFilterEvents: function() {
		var filters = this.$$("filters");
		filters.reconstruct();
		var children = filters.getChildViews();
		var pivot = this;

		for (var i = 0; i < children.length; i++) {
			var el = children[i];
			if (el.name == "select" || el.name == "multiselect" || el.name == "datepicker")
				el.attachEvent("onChange", function(newvalue) {
					pivot._setFilterValue(this.config.field, newvalue);
				});
			else if (!webix.isUndefined(el.getValue)){
				el.attachEvent("onTimedKeyPress", function() {
					pivot._setFilterValue(this.config.field, this.getValue());
				});
			}

		}
	},

	_setFilterValue: function(field, value) {
		var filters = this.config.structure.filters;
		for (var i = 0; i < filters.length; i++)
			if (filters[i].name == field) {
				filters[i].value = value;
				this._loadFilteredData();
				return true;
			}
		return false;
	},

	groupNameToStr: function(obj){
		return obj.name+"_"+obj.operation;
	},
	groupNameToObject: function(name){
		var arr = name.split("_");
		return {name:arr[0],operation:arr[1]};
	},
	_getSeries: function(){
		var i, j, legend, map = {}, name, legendTitle, series = [],
			values = this.config.structure.values;

		// legend definition
		legend = {
			valign:"middle",
			align:"right",
			width:140,
			layout:"y"
		};
		webix.extend(legend,this.config.chart.legend||{},true);
		legend.values = [];
		if(!legend.marker)
			legend.marker = {};
		legend.marker.type = (this.config.chartType=="line"?"item":"s");




		this.series_names = [];
		this._valueLength = 0;

		for(i =0; i < values.length; i++){
			if(!webix.isArray(values[i].operation)){
				values[i].operation = [values[i].operation];
			}
			if(!webix.isArray(values[i].color)){

				values[i].color = [values[i].color||this._getColor(this._valueLength)];
			}
			for(j=0;j<values[i].operation.length;j++){

				name = this.templates.groupNameToStr(values[i].name,values[i].operation[j]);
				this.series_names.push(name);
				if(!values[i].color[j])
					values[i].color[j] = this._getColor(this._valueLength);
				var color = values[i].color[j];
				var sConfig = this.chartMap[this.config.chartType](color)||{};
				sConfig.value = "#"+name+"#";
				sConfig.tooltip = {
					template: webix.bind(function(obj){
						return obj[this].toFixed(3);
					},name)
				};

				series.push(sConfig);
				legendTitle = this.templates.seriesTitle.call(this,values[i],j);
				legend.values.push({
					text: legendTitle,
					color: color
				});
				map[name]= [values[i].name,values[i].operation[j]];
				this._valueLength++;
			}
		}
		this._pivot_group = {};
		if(values.length)
			this._pivot_group = webix.copy({
				by:  this.config.structure.groupBy,
				map: map
			});

		return {series: series,legend: legend};
	},
	_getColor:function(i){
		var palette = this.config.palette;
		var rowIndex = i/palette[0].length;
		rowIndex = (rowIndex> palette.length?0:parseInt(rowIndex,10));
		var columnIndex = i%palette[0].length;
		return palette[rowIndex][columnIndex];
	},
	_processLegend: function() {
		var i, legend, name,
			values=this.config.structure.values;

		legend = {
			valign:"middle",
			align:"right",
			width:140,
			layout:"y"
		};

		webix.extend(legend,this.config.chart.legend||{},true);

		legend.values = [];
		if(!legend.marker)
			legend.marker = {};
		legend.marker.type = (this.config.chartType=="line"?"item":"s");


		for(i =0; i < values.length; i++){
			name = this.templates.seriesTitle.call(this,values[i]);

			legend.values.push({
				text: name,
				color: values[i].color
			});
		}

		return legend;
	},
	operations: { sum: 1, count:1, max: 1, min: 1},
	addGroupMethod: function(name, method){
		this.operations[name] = 1;
		if(method)
			webix.GroupMethods[name] = method;
	},
	removeGroupMethod: function(name){
		delete this.operations[name];
	},
	groupMethods_setter: function(obj){
		for(var a in obj){
			if(obj.hasOwnProperty(a))
				this.addGroupMethod(a, obj[a]);
		}
	},
	// fields for edit popup
	getFields: function() {

		var i,
			fields = [],
			fields_hash = {};
		for (i = 0; i < Math.min(this.data.count() || 5); i++) {
			var item = this.data.getItem(this.data.getIdByIndex(i));
			for (var f in item) {
				if (!fields_hash[f]) {
					fields.push(f);
					fields_hash[f] = webix.uid();
				}
			}
		}

		var str = this.config.structure;
		var result = { fields:[], groupBy:[], values:[], filters:[] };


		var field = (typeof str.groupBy == "object"?str.groupBy[0]:str.groupBy);
		if (!webix.isUndefined(fields_hash[field])) {
			result.groupBy.push({name: field, text: this._applyMap(field), id: fields_hash[field]});
			delete fields_hash[field];
		}

		var valueNameHash = {};
		var text;
		for (i = 0; i < str.values.length; i++) {
			field = str.values[i];
			if (!webix.isUndefined(fields_hash[field.name])) {
				text = this._applyMap(field.name);
				if(webix.isUndefined(valueNameHash[field.name])){
					valueNameHash[field.name] = result.values.length;
					result.values.push({name: field.name, text: text, operation: field.operation, color: field.color||[this._getColor(i)], id: fields_hash[field.name]});
				}
				else{
					var value = result.values[valueNameHash[field.name]];
					value.operation =value.operation.concat(field.operation);
					value.color =value.color.concat(field.color||[this._getColor(i)]);
				}

				//delete fields_hash[field.name];   // values allows to drag a field multiple times
			}
		}

		for (i = 0; i < (str.filters || []).length; i++) {
			field = str.filters[i];
			if (!webix.isUndefined(fields_hash[field.name])) {
				text = this._applyMap(field.name);
				result.filters.push({name: field.name, text: text, type:field.type, value:field.value, id: fields_hash[field]});
				delete fields_hash[field.name];
			}
		}

		for (i = 0; i < fields.length; i++) {
			field = fields[i];
			if (!webix.isUndefined(fields_hash[field]))
				result.fields.push({name:field, text: this._applyMap(field), id: fields_hash[field]});
		}
		return result;
	},
	_initFilters: function() {
		var filters = this.config.structure.filters || [];
		flt.init(filters);
	},
	_filterItem: function(item) {
		var filters = this.config.structure.filters || [];
		return flt.filterItem(filters,item);
	},
	getStructure: function() {
		return this.config.structure;
	},
	getConfigWindow: function(){
		return this._config_popup;
	}
}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings);