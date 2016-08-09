import * as flt from "filters.js";
import "ext/filters.js";
import "views/tablepopup.js";

webix.protoUI({
	name:"pivot",
	version:"{{version}}",
	defaults: {
		fieldMap: {},
		yScaleWidth: 300,
		columnWidth: 150,
		filterLabelAlign: "right",
		filterWidth: 300,
		filterMinWidth: 150,
		filterLabelWidth: 100

	},
	$divider: "_'_",
	$init: function(config) {
		if (!config.structure)
			config.structure = {};
		webix.extend(config.structure, { rows:[], columns:[], values:[], filters:[] });

		this.$view.className +=" webix_pivot";
		webix.extend(config, this._get_ui(config));
		this.$ready.push(this.render);
		this.data.attachEvent("onStoreUpdated", webix.bind(function() {
			// call render if pivot is initialized
			if (this.$$("data")) this.render();
		}, this));
	},
	_get_ui: function(config) {
		var filters = { id:"filters", view:"toolbar", hidden:true, cols:[
			{  }
		]};

		var table = {
			view:"treetable",
			id:"data",
			select: "row",
			navigation:true,
			leftSplit:1,
			resizeColumn:true,
			on:{
				"onHeaderClick": function(id){
					var pivot = this.getTopParentView();
					if (this.getColumnIndex(id.column) === 0 && !pivot.config.readonly)
						pivot.configure();
				}
			},
			columns:[
				{ }
			]
		};

		if(config.datatable && typeof config.datatable == "object" ){
			delete config.datatable.id;
			webix.extend(table,config.datatable,true);
		}

		return { rows: [ filters, table ] };
	},
	configure: function() {
		if (!this._config_popup) {
			var config = { view:"webix_pivot_config", operations:[], pivot: this.config.id };
			webix.extend(config , this.config.popup||{});
			this._config_popup = webix.ui(config);
			this.callEvent("onPopup",[this._config_popup]);
			this._config_popup.attachEvent("onApply", webix.bind(function(structure) {
				this.define("structure", structure);
				this.render();
			}, this));
		}

		var functions = [];
		for (var i in this.operations) functions.push({name: i, title: this._apply_locale(i)});

		this._config_popup.define("operations", functions);
		var pos = webix.html.offset(this.$$("data").getNode());
		this._config_popup.setPosition(pos.x + 10, pos.y + 10);
		this._config_popup.define("data", this.getFields());
		this._config_popup.show();
	},

	render: function(without_filters) {
		var data = this._process_data(this.data.pull, this.data.order);

		if(this.config.footer)
			this._add_footer(data.header);

		if (!without_filters) {
			data.filters = this._process_filters();
		}

		this.callEvent("onBeforeRender",[data]);

		if (data.filters) {
			var filters = data.filters;
			if (filters.length > 0) {
				this.$$("filters").show();
				this.$$("filters").define("cols", filters);
				this._filter_events();
			} else {
				this.$$("filters").hide();
			}
		}
		if(this.config.totalColumn)
			this.$$("data").define("math", true);

		this.$$("data").config.columns = data.header;



		this.$$("data").refreshColumns();
		this.$$("data").clearAll();
		this.$$("data").parse(data.data);


	},
	_add_footer: function(columns){
		var config, grid, i, names;

		grid = this.$$("data");
		grid.define("footer",true);
		
		if(columns.length)
			columns[0].footer = this._apply_locale("total");

		for(i=1; i < columns.length;i++){
			config = null;

			if(this.config.footer == "sumOnly"){
				names = columns[i].id.split(this.$divider);
				if(names[names.length-2] != "sum")
					config = " ";
			}

			if(!config)
				config = {
					content: "pivotSumColumn",
					template:  webix.bind(function(data){
						var value = data.value;
						return (value&& value!="0"&&!this.format?parseFloat(value).toFixed(3):value);
					},columns[i])
				};

			columns[i].footer = config;

			if(typeof this.config.footer == "object"){
				webix.extend(columns[i].footer, this.config.footer, true);
			}
		}
	},
	$exportView:function(options){
		webix.extend(options, { filterHTML: true });
		return this.$$("data");
	},
	_apply_locale: function(value){
		return webix.i18n.pivot[value]||value;
	},
	_apply_map: function(value){
		return this.config.fieldMap[value]||value;
	},
	_process_filters: function() {
		var filters = this.config.structure.filters || [];
		var items = [];
		for (var i = 0; i < filters.length; i++) {
			var f = filters[i];
			var item = { value: f.value, label: this._apply_map(f.name), field: f.name, view: f.type,
				labelAlign: this.config.filterLabelAlign, labelWidth: this.config.filterLabelWidth, minWidth: this.config.filterMinWidth, maxWidth: this.config.filterWidth
			};
			if (f.type == "select" || f.type == "multiselect")
				item.options = this._distinct_values(f.name, f.type != "multiselect");
			items.push(item);
		}
		return items;
	},

	_distinct_values: function(field, empty) {
		var values = [];
		if(empty)
			values.push({value:"",id:""});
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
		var isNumeric = function(n){
			return  !isNaN(parseFloat(n));
		};
		values.sort(function(a,b) {
			var val1 = a.value;
			var val2 = b.value;
			if (!val2) return 1;
			if (!val1) return -1;
			if(!isNumeric(val1) || !isNumeric(val2) ){
				val1 = val1.toString().toLowerCase();
				val2=val2.toString().toLowerCase();
			}
			return val1>val2?1:(val1<val2?-1:0);
		});
		return values;
	},

	_filter_events: function() {
		var filters = this.$$("filters");
		filters.reconstruct();

		var children = filters.getChildViews();
		var pivot = this;
		for (var i = 0; i < children.length; i++) {
			var el = children[i];
			if (el.name == "select" || el.name == "multiselect" || el.name == "datepicker")
				el.attachEvent("onChange", function(newvalue) {
					pivot._set_filter_value(this.config.field, newvalue);
				});
			else
				el.attachEvent("onTimedKeyPress", function() {
					pivot._set_filter_value(this.config.field, this.getValue());
				});
		}
	},

	_set_filter_value: function(field, value) {
		var filters = this.config.structure.filters;
		for (var i = 0; i < filters.length; i++)
			if (filters[i].name == field) {
				filters[i].value = value;
				this.render(true);
				return true;
			}
		return false;
	},

	_process_data: function(data, order) {
		this._init_filters();

		var structure = this.config.structure;
		structure._header = [];
		structure._header_hash = {};

		for (let i = 0; i < structure.values.length; i++) {
			structure.values[i].operation = structure.values[i].operation || ["sum"];
			if (!webix.isArray(structure.values[i].operation))
				structure.values[i].operation = [structure.values[i].operation];
		}
		var columns = [];

		for(let i=0;i< structure.columns.length; i++){
			columns[i] = (typeof structure.columns[i] == "object"?(structure.columns[i].id||i):structure.columns[i]);
		}

		var fields = structure.rows.concat(columns);

		var items = this._group(data, order, fields);
		var header = {};
		if (structure.rows.length > 0)
			items = this._process_rows(items, structure.rows, structure, header);
		else {
			// there are no rows in structure, only columns and values
			this._process_columns(items, columns, structure, header);
			items = [];
		}
		header = this._process_header(header);
		return { header: header, data: items };
	},
	_groupItem: function( hash, item, fields ){
		if(fields.length){
			var value = item[fields[0]];
			if(webix.isUndefined(hash[value]))
				hash[value] = {};
			this._groupItem(hash[value], item, fields.slice(1));
		}
		else
			hash[item.id] = item;
	},
	_group: function( data, order, fields ){
		var id, item, i, j, value,
			hash = {};

		for (i = 0; i < order.length; i++) {
			id = order[i];
			item = data[id];
			if (item && this._filter_item(item)){
				this._groupItem( hash, item, fields );
			}
		}
		return hash;
	},
	_process_rows: function(data, rows, structure, header) {
		var items = [];
		if (rows.length > 1) {
			for (let i in data)
				data[i] = this._process_rows(data[i], rows.slice(1), structure, header);

			var values = structure._header;

			for (let i in data) {
				let item = { data: data[i] };
				for (var j = 0; j < item.data.length; j++) {
					for (var k = 0; k < values.length; k++) {
						var value = values[k];
						if (webix.isUndefined(item[value]))
							item[value] = [];
						item[value].push(item.data[j][value]);
					}
				}
				item = this._calculate_item(item, structure);
				item = this._minmax_in_row(item, structure);
				item.name = i;
				item.open = true;
				items.push(item);
			}
		} else {
			for (let i in data) {
				let item = this._process_columns(data[i], this.config.structure.columns, structure, header);
				item.name = i;
				item = this._calculate_item(item, structure);
				item = this._minmax_in_row(item, structure);
				items.push(item);
			}
		}
		return items;
	},

	_process_columns: function(data, columns, structure, header, item, name) {
		var vname;
		item = item || {};
		if (columns.length > 0) {
			name = name || "";
			for (let i in data) {
				if(!header[i])
					header[i] = {};
				data[i] = this._process_columns(data[i], columns.slice(1), structure, header[i], item, (name.length>0 ? (name + this.$divider) :"") + i);
			}
		} else {
			var values = this.config.structure.values;
			for (var id in data) {
				for (let i = 0; i < values.length; i++) {
					for (var j = 0; j < values[i].operation.length; j++) {
						if(name)
							vname = name + this.$divider + values[i].operation[j] + this.$divider + values[i].name;
						else // if no columns
							vname = values[i].operation[j] + this.$divider + values[i].name;
						if (!structure._header_hash[vname]) {
							structure._header.push(vname);
							structure._header_hash[vname] = true;
						}
						if (webix.isUndefined(item[vname])) {
							item[vname] = [];
							header[values[i].operation[j] + this.$divider + values[i].name] = {};

						}
						item[vname].push(data[id][values[i].name]);
					}
				}
			}
		}
		return item;
	},
	_sort_header: function(header){
		var columns = this.config.structure.columns;
		var sorted = false;

		var isSorting = false;
		for(let i = 0; i < columns.length && !isSorting; i++){
			if(typeof columns[i] == "object" && columns[i].sort)
				isSorting = true;
		}
		if(!isSorting)
			return false;

		header.sort(function(a,b){
			var order = null;
			var res;
			for(let i=0; i < columns.length && order===null; i++){
				var c = columns[i];
				if(typeof c == "object" && c.sort){

					var sortFunction = c.sort;
					if(typeof c.sort == "string")
						sortFunction = webix.DataStore.prototype.sorting.as[c.sort];
					res = sortFunction(a[i].text,b[i].text);

					if(res || i == (columns.length-1)){
						sorted = true;
						if(c.sortDir == "desc"){
							res = res*(-1);
						}
						order = res;
					}
				}
				else
					order = 0;
			}
			return order;
		});


		if(header[0]){
			var j = header[0].length-2;
			while(j>=0){
				var text = "";
				var index=0;
				for(let i=0; i < header.length;i++){
					if(text != header[i][j].text){
						index = i;
						text = header[i][j].text;
						header[i][j].colspan = 1;
					}
					else{
						delete header[i][j].colspan;
						header[index][j].colspan++;
					}
				}
				j--;
			}
		}

	},
	_process_header: function(header) {
		header = this._render_header(header);

		this._sort_header(header);
		var vConfig,
			valuesConfig = this.config.structure.values;

		for (var i = 0; i < header.length; i++) {
			var parts = [];
			for (let j = 0; j < header[i].length; j++)
				parts.push(header[i][j].name);

			// find value configuration
			vConfig = null;
			var tmp = parts[parts.length-1].split(this.$divider);
			for(let j =0; j < valuesConfig.length && !vConfig; j++){
				if(valuesConfig[j].operation)
					for(var p =0; p< valuesConfig[j].operation.length; p++){
						if(valuesConfig[j].name == tmp[1] && valuesConfig[j].operation[p] == tmp[0]){
							vConfig = valuesConfig[j];
						}
					}
			}

			header[i] = {id: parts.join(this.$divider), header: header[i], sort:"int", width: this.config.columnWidth};
			// add format
			if(vConfig && vConfig.format)
				header[i].format = vConfig.format;
		}

		this.callEvent("onHeaderInit", [header]);

		if(this.config.totalColumn && header.length){
			header = this._add_total_columns(header);
		}

		var text0 = "<div class='webix_pivot_config_msg'>"+webix.i18n.pivot.pivotMessage+"</div>";

		if(this.config.readonly){
			text0 = this.config.readonlyTitle||"";
			this.$$("data").$view.className += " webix_pivot_readonly";
		}
		header.splice(0, 0, {id:"name", exportAsTree:true, template:"{common.treetable()} #name#", header:{ text:  text0}, width: this.config.yScaleWidth});

		return header;
	},
	_add_total_columns: function(header){
		var arr, h, i, j,
			found = false,
			index= 0,
			totalCols = [];

		// if no columns in selected
		if(header[0].header.length < 2)
			return header;

		i = header.length-1;

		while(!found && i){
			if(header[i].header[0].name != header[i-1].header[0].name){
				found = true;
				index = i;
			}
			i--;
		}
		var c =0;
		for(i = index; i< header.length; i++){
			h = webix.copy(header[i]);
			arr =[];
			found = true;
			if(this.config.totalColumn == "sumOnly"){
				var parts = h.id.split(this.$divider);
				var operation = parts[parts.length-2];
				if(operation != "sum")
					found = false;

			}
			if(found){
				for(j = c+1; j< header.length+1; j += (header.length-index)){
					arr.push("[$r,:"+j+"]");
				}
				h.math = arr.join("+");

				if(!h.format)
					h.format = function(value){
						return (value&& value!="0"?parseFloat(value).toFixed(3):value);
					};

				if(typeof this.config.totalColumn == "object"){
					webix.extend(h, this.config.totalColumn, true);
				}

				h.id = h.id.replace(h.header[0].name,"$webixtotal");
				h.header[0].name = "total";
				h.header[0].text = this._apply_locale("total");
				totalCols.push(h);
			}

			c++;
		}
		totalCols = this._correct_colspan(totalCols);
		return header.concat(totalCols);
	},
	_correct_colspan: function(header){
		if(header[0]){
			var j = header[0].header.length-2;
			while(j>=0){
				var text = "";
				var index=0;
				for(var i=0; i < header.length;i++){
					if(text != header[i].header[j].text){
						index = i;
						text = header[i].header[j].text;
						header[i].header[j].colspan = 1;
					}
					else{
						delete header[i].header[j].colspan;
						header[index].header[j].colspan++;
					}
				}
				j--;
			}
		}
		return header;
	},
	_render_header: function(data) {

		var header = [];

		for (var i in data) {

			// is the last level?
			var empty = true;
			//noinspection JSUnusedLocalSymbols
			for (var k in data[i]) {
				empty = false;
				break;
			}

			if (!empty) {
				data[i] = this._render_header(data[i]);
				var first = false;
				for (var j = 0; j < data[i].length; j++) {
					var h = data[i][j];
					h.splice(0, 0, { name:i, text: i});
					if (!first) {
						h[0].colspan = data[i].length;
						first = true;
					}
					header.push(h);
				}
			} else {
				var tmp = i.split(this.$divider);

				if (tmp.length > 1){
					header.push([{ name:i, text: this._apply_map(tmp[1]) + " (" + this._apply_locale(tmp[0]) + ")" }]);
				}
				else
				// there are no values in structure, only rows and columns
					header.push([{ name:i, text: i}]);
			}
		}

		return header;
	},
	_get_key_leaves: function(data,key, result){
		for(var i=0; i < data.length;i++){
			if(data[i].data)
				this._get_key_leaves(data[i].data,key,result);
			else
				result.push(data[i][key]);
		}
	},
	_calculate_item: function(item, structure) {
		var i, key, leaves, op, tmp, values;

		for (i = 0; i < structure._header.length; i++) {
			key = structure._header[i];
			tmp = key.split(this.$divider);

			op = tmp[tmp.length-2];

			values = item[key];

			leaves = this._operationOptions[op] && this._operationOptions[op].leavesOnly;
			if(leaves && item.data){

				values = [];
				this._get_key_leaves(item.data,key,values);
			}
			if (values){
				var data = [];

				for(var j=0; j < values.length;j++){
					if(values[j] || values[j]=="0"){
						data.push(values[j]);
					}
				}
				if(data.length)
					item[key] = this.operations[op].call(this, data, key, item);
				else
					item[key] = '';
			}
			else
				item[key] = '';

			if(item[key])
				item[key] = Math.round(item[key]*100000)/100000;
		}
		return item;
	},
	_minmax_in_row: function(item, structure) {
		// nothing to do
		if (!this.config.min && !this.config.max) return item;

		var values = this.config.structure.values;
		if (!item.$cellCss) item.$cellCss = {};

		// calculating for each value
		for (var i = 0; i < values.length; i++) {
			var value = values[i];

			var max=[], max_value=-99999999;
			var min=[], min_value=99999999;

			for (let j = 0; j < structure._header.length; j++) {
				var key = structure._header[j];
				if (window.isNaN(item[key])) continue;
				// it's a another value
				if (key.indexOf(value.name, this.length - value.name.length) === -1) continue;

				if (this.config.max && item[key] > max_value) {
					max = [ key ];
					max_value = item[key];
				} else if (item[key] == max_value) {
					max.push(key);
				}
				if (this.config.min && item[key] < min_value) {
					min = [ key ];
					min_value = item[key];
				} else if (item[key] == min_value) {
					min.push(key);
				}
			}

			for (let j = 0; j < min.length; j++) {
				item.$cellCss[min[j]] = "webix_min";
			}
			for (let j = 0; j < max.length; j++) {
				item.$cellCss[max[j]] = "webix_max";
			}
		}
		return item;
	},
	_operationOptions:{},
	operations: {
		sum: function(args) {
			var sum = 0;
			for (var i = 0; i < args.length; i++) {
				var value = args[i];
				value = parseFloat(value, 10);
				if (!window.isNaN(value))
					sum += value;
			}
			return sum;
		},
		count: function(data, key, item) {
			var count = 0;
			if(!item.data)
				count = data.length;
			else{
				for(var i=0; i < item.data.length; i++)
					count += item.data[i][key]||0;
			}
			return count;
		},
		max: function(args) {
			if (args.length == 1) return args[0];
			return Math.max.apply(this, args);
		},
		min: function(args) {
			if (args.length == 1) return args[0];
			return Math.min.apply(this, args);
		}
	},
	addOperation: function(name, method, options){
		this.operations[name] = method;
		if(options)
			this._operationOptions[name] = options;
	},
	getFields: function() {
		var fields = [];
		var fields_hash = {};
		for (let i = 0; i < Math.min(this.data.count() || 5); i++) {
			var item = this.data.getItem(this.data.getIdByIndex(i));
			for (var field in item) {
				if (!fields_hash[field]) {
					fields.push(field);
					fields_hash[field] = webix.uid();
				}
			}
		}

		var str = this.config.structure;
		var result = { fields:[], rows:[], columns:[], values:[], filters:[] };

		for (let i = 0; i < (str.filters || []).length; i++) {
			let field = str.filters[i];
			if (!webix.isUndefined(fields_hash[field.name])) {
				var text = this._apply_map(field.name);
				result.filters.push({name: field.name, text: text, type:field.type, value:field.value, id: fields_hash[field]});
				//delete fields_hash[field.name]; // filter allows to drag a field multiple times
			}
		}
		for (let i = 0; i < str.rows.length; i++) {
			let field = str.rows[i];
			if (!webix.isUndefined(fields_hash[field])) {
				result.rows.push({name: field, text: this._apply_map(field), id: fields_hash[field]});
				delete fields_hash[field];
			}
		}

		for (let i = 0; i < str.columns.length; i++) {
			let field = (typeof str.columns[i] == "object"? (str.columns[i].id||i): str.columns[i]);
			if (!webix.isUndefined(fields_hash[field])) {
				result.columns.push({name: field, text: this._apply_map(field), id: fields_hash[field]});
				delete fields_hash[field];
			}
		}

		for (let i = 0; i < str.values.length; i++) {
			let field = str.values[i];
			if (!webix.isUndefined(fields_hash[field.name])) {
				let text = this._apply_map(field.name);
				result.values.push({name: field.name, text: text, operation:field.operation, id: fields_hash[field.name]});
				//delete fields_hash[field.name];   // values allows to drag a field multiple times
			}
		}


		for (let i = 0; i < fields.length; i++) {
			let field = fields[i];
			if (!webix.isUndefined(fields_hash[field]))
				result.fields.push({name:field, text: this._apply_map(field), id: fields_hash[field]});
		}
		return result;
	},
	_init_filters: function() {
		var filters = this.config.structure.filters || [];
		flt.init(filters);
	},
	_filter_item: function(item) {
		var filters = this.config.structure.filters || [];
		return flt.filterItem(filters, item);
	},
	setStructure: function(config){
		this.define("structure", config);
		this.render();
	},
	getStructure: function() {
		return this.config.structure;
	},
	getConfigWindow: function(){
		return this._config_popup;
	},
	profile_setter:function(value){
		var c = window.console;
		if (value){
			this.attachEvent("onBeforeLoad", function(){ c.time("data loading");  });
			this.data.attachEvent("onParse", function(){ c.timeEnd("data loading"); c.time("data parsing");  });
			this.data.attachEvent("onStoreLoad", function(){ c.timeEnd("data parsing"); c.time("data processing");  });
			this.$ready.push(function(){
				this.$$("data").attachEvent("onBeforeRender", function(){ if (this.count()) { c.timeEnd("data processing"); c.time("data rendering"); } });
				this.$$("data").attachEvent("onAfterRender", function(){ if (this.count()) webix.delay(function(){ c.timeEnd("data rendering"); });  });
			});
		}
	}
}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings);
