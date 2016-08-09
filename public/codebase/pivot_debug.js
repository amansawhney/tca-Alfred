/*
@license
Webix Pivot v.3.4.0
This software is covered by Webix Commercial License.
Usage without proper license is prohibited.
(c) XB Software Ltd.
*/
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/codebase/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(3);
	
	__webpack_require__(5);
	
	__webpack_require__(6);
	
	__webpack_require__(7);
	
	__webpack_require__(11);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	"use strict";

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	webix.i18n.pivot = webix.extend(webix.i18n.pivot || {}, {
	    apply: "Apply",
	    bar: "Bar",
	    cancel: "Cancel",
	    chartType: "Chart type",
	    columns: "Columns",
	    count: "count",
	    date: "date",
	    fields: "Fields",
	    filters: "Filters",
	    groupBy: "Group By",
	    line: "Line",
	    logScale: "Logarithmic scale",
	    max: "max",
	    min: "min",
	    multiselect: "multi-select",
	    operationNotDefined: "Operation is not defined",
	    layoutIncorrect: "pivotLayout should be an Array instance",
	    pivotMessage: "[Click to configure]",
	    popupHeader: "Pivot Settings",
	    radar: "Radar",
	    radarArea: "Area Radar",
	    rows: "Rows",
	    select: "select",
	    settings: "Settings",
	    stackedBar: "Stacked Bar",
	    sum: "sum",
	    text: "text",
	    total: "Total",
	    values: "Values",
	    valuesNotDefined: "Values or Group field are not defined",
	    windowTitle: "Pivot Configuration",
	    windowMessage: "move fields into a required sector"
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _filters = __webpack_require__(8);
	
	var flt = _interopRequireWildcard(_filters);
	
	__webpack_require__(9);
	
	__webpack_require__(10);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	webix.protoUI({
		name: "pivot",
		version: "{{version}}",
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
		$init: function $init(config) {
			if (!config.structure) config.structure = {};
			webix.extend(config.structure, { rows: [], columns: [], values: [], filters: [] });
	
			this.$view.className += " webix_pivot";
			webix.extend(config, this._get_ui(config));
			this.$ready.push(this.render);
			this.data.attachEvent("onStoreUpdated", webix.bind(function () {
				// call render if pivot is initialized
				if (this.$$("data")) this.render();
			}, this));
		},
		_get_ui: function _get_ui(config) {
			var filters = { id: "filters", view: "toolbar", hidden: true, cols: [{}] };
	
			var table = {
				view: "treetable",
				id: "data",
				select: "row",
				navigation: true,
				leftSplit: 1,
				resizeColumn: true,
				on: {
					"onHeaderClick": function onHeaderClick(id) {
						var pivot = this.getTopParentView();
						if (this.getColumnIndex(id.column) === 0 && !pivot.config.readonly) pivot.configure();
					}
				},
				columns: [{}]
			};
	
			if (config.datatable && _typeof(config.datatable) == "object") {
				delete config.datatable.id;
				webix.extend(table, config.datatable, true);
			}
	
			return { rows: [filters, table] };
		},
		configure: function configure() {
			if (!this._config_popup) {
				var config = { view: "webix_pivot_config", operations: [], pivot: this.config.id };
				webix.extend(config, this.config.popup || {});
				this._config_popup = webix.ui(config);
				this.callEvent("onPopup", [this._config_popup]);
				this._config_popup.attachEvent("onApply", webix.bind(function (structure) {
					this.define("structure", structure);
					this.render();
				}, this));
			}
	
			var functions = [];
			for (var i in this.operations) {
				functions.push({ name: i, title: this._apply_locale(i) });
			}this._config_popup.define("operations", functions);
			var pos = webix.html.offset(this.$$("data").getNode());
			this._config_popup.setPosition(pos.x + 10, pos.y + 10);
			this._config_popup.define("data", this.getFields());
			this._config_popup.show();
		},
	
		render: function render(without_filters) {
			var data = this._process_data(this.data.pull, this.data.order);
	
			if (this.config.footer) this._add_footer(data.header);
	
			if (!without_filters) {
				data.filters = this._process_filters();
			}
	
			this.callEvent("onBeforeRender", [data]);
	
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
			if (this.config.totalColumn) this.$$("data").define("math", true);
	
			this.$$("data").config.columns = data.header;
	
			this.$$("data").refreshColumns();
			this.$$("data").clearAll();
			this.$$("data").parse(data.data);
		},
		_add_footer: function _add_footer(columns) {
			var config, grid, i, names;
	
			grid = this.$$("data");
			grid.define("footer", true);
	
			if (columns.length) columns[0].footer = this._apply_locale("total");
	
			for (i = 1; i < columns.length; i++) {
				config = null;
	
				if (this.config.footer == "sumOnly") {
					names = columns[i].id.split(this.$divider);
					if (names[names.length - 2] != "sum") config = " ";
				}
	
				if (!config) config = {
					content: "pivotSumColumn",
					template: webix.bind(function (data) {
						var value = data.value;
						return value && value != "0" && !this.format ? parseFloat(value).toFixed(3) : value;
					}, columns[i])
				};
	
				columns[i].footer = config;
	
				if (_typeof(this.config.footer) == "object") {
					webix.extend(columns[i].footer, this.config.footer, true);
				}
			}
		},
		$exportView: function $exportView(options) {
			webix.extend(options, { filterHTML: true });
			return this.$$("data");
		},
		_apply_locale: function _apply_locale(value) {
			return webix.i18n.pivot[value] || value;
		},
		_apply_map: function _apply_map(value) {
			return this.config.fieldMap[value] || value;
		},
		_process_filters: function _process_filters() {
			var filters = this.config.structure.filters || [];
			var items = [];
			for (var i = 0; i < filters.length; i++) {
				var f = filters[i];
				var item = { value: f.value, label: this._apply_map(f.name), field: f.name, view: f.type,
					labelAlign: this.config.filterLabelAlign, labelWidth: this.config.filterLabelWidth, minWidth: this.config.filterMinWidth, maxWidth: this.config.filterWidth
				};
				if (f.type == "select" || f.type == "multiselect") item.options = this._distinct_values(f.name, f.type != "multiselect");
				items.push(item);
			}
			return items;
		},
	
		_distinct_values: function _distinct_values(field, empty) {
			var values = [];
			if (empty) values.push({ value: "", id: "" });
			var data = this.data.pull;
			var hash = {};
			for (var obj in data) {
				var value = data[obj][field];
				if (!webix.isUndefined(value)) {
					if (!hash[value]) {
						values.push({ value: value, id: value });
						hash[value] = true;
					}
				}
			}
			var isNumeric = function isNumeric(n) {
				return !isNaN(parseFloat(n));
			};
			values.sort(function (a, b) {
				var val1 = a.value;
				var val2 = b.value;
				if (!val2) return 1;
				if (!val1) return -1;
				if (!isNumeric(val1) || !isNumeric(val2)) {
					val1 = val1.toString().toLowerCase();
					val2 = val2.toString().toLowerCase();
				}
				return val1 > val2 ? 1 : val1 < val2 ? -1 : 0;
			});
			return values;
		},
	
		_filter_events: function _filter_events() {
			var filters = this.$$("filters");
			filters.reconstruct();
	
			var children = filters.getChildViews();
			var pivot = this;
			for (var i = 0; i < children.length; i++) {
				var el = children[i];
				if (el.name == "select" || el.name == "multiselect" || el.name == "datepicker") el.attachEvent("onChange", function (newvalue) {
					pivot._set_filter_value(this.config.field, newvalue);
				});else el.attachEvent("onTimedKeyPress", function () {
					pivot._set_filter_value(this.config.field, this.getValue());
				});
			}
		},
	
		_set_filter_value: function _set_filter_value(field, value) {
			var filters = this.config.structure.filters;
			for (var i = 0; i < filters.length; i++) {
				if (filters[i].name == field) {
					filters[i].value = value;
					this.render(true);
					return true;
				}
			}return false;
		},
	
		_process_data: function _process_data(data, order) {
			this._init_filters();
	
			var structure = this.config.structure;
			structure._header = [];
			structure._header_hash = {};
	
			for (var i = 0; i < structure.values.length; i++) {
				structure.values[i].operation = structure.values[i].operation || ["sum"];
				if (!webix.isArray(structure.values[i].operation)) structure.values[i].operation = [structure.values[i].operation];
			}
			var columns = [];
	
			for (var _i = 0; _i < structure.columns.length; _i++) {
				columns[_i] = _typeof(structure.columns[_i]) == "object" ? structure.columns[_i].id || _i : structure.columns[_i];
			}
	
			var fields = structure.rows.concat(columns);
	
			var items = this._group(data, order, fields);
			var header = {};
			if (structure.rows.length > 0) items = this._process_rows(items, structure.rows, structure, header);else {
				// there are no rows in structure, only columns and values
				this._process_columns(items, columns, structure, header);
				items = [];
			}
			header = this._process_header(header);
			return { header: header, data: items };
		},
		_groupItem: function _groupItem(hash, item, fields) {
			if (fields.length) {
				var value = item[fields[0]];
				if (webix.isUndefined(hash[value])) hash[value] = {};
				this._groupItem(hash[value], item, fields.slice(1));
			} else hash[item.id] = item;
		},
		_group: function _group(data, order, fields) {
			var id,
			    item,
			    i,
			    j,
			    value,
			    hash = {};
	
			for (i = 0; i < order.length; i++) {
				id = order[i];
				item = data[id];
				if (item && this._filter_item(item)) {
					this._groupItem(hash, item, fields);
				}
			}
			return hash;
		},
		_process_rows: function _process_rows(data, rows, structure, header) {
			var items = [];
			if (rows.length > 1) {
				for (var i in data) {
					data[i] = this._process_rows(data[i], rows.slice(1), structure, header);
				}var values = structure._header;
	
				for (var _i2 in data) {
					var item = { data: data[_i2] };
					for (var j = 0; j < item.data.length; j++) {
						for (var k = 0; k < values.length; k++) {
							var value = values[k];
							if (webix.isUndefined(item[value])) item[value] = [];
							item[value].push(item.data[j][value]);
						}
					}
					item = this._calculate_item(item, structure);
					item = this._minmax_in_row(item, structure);
					item.name = _i2;
					item.open = true;
					items.push(item);
				}
			} else {
				for (var _i3 in data) {
					var _item = this._process_columns(data[_i3], this.config.structure.columns, structure, header);
					_item.name = _i3;
					_item = this._calculate_item(_item, structure);
					_item = this._minmax_in_row(_item, structure);
					items.push(_item);
				}
			}
			return items;
		},
	
		_process_columns: function _process_columns(data, columns, structure, header, item, name) {
			var vname;
			item = item || {};
			if (columns.length > 0) {
				name = name || "";
				for (var i in data) {
					if (!header[i]) header[i] = {};
					data[i] = this._process_columns(data[i], columns.slice(1), structure, header[i], item, (name.length > 0 ? name + this.$divider : "") + i);
				}
			} else {
				var values = this.config.structure.values;
				for (var id in data) {
					for (var _i4 = 0; _i4 < values.length; _i4++) {
						for (var j = 0; j < values[_i4].operation.length; j++) {
							if (name) vname = name + this.$divider + values[_i4].operation[j] + this.$divider + values[_i4].name;else // if no columns
								vname = values[_i4].operation[j] + this.$divider + values[_i4].name;
							if (!structure._header_hash[vname]) {
								structure._header.push(vname);
								structure._header_hash[vname] = true;
							}
							if (webix.isUndefined(item[vname])) {
								item[vname] = [];
								header[values[_i4].operation[j] + this.$divider + values[_i4].name] = {};
							}
							item[vname].push(data[id][values[_i4].name]);
						}
					}
				}
			}
			return item;
		},
		_sort_header: function _sort_header(header) {
			var columns = this.config.structure.columns;
			var sorted = false;
	
			var isSorting = false;
			for (var i = 0; i < columns.length && !isSorting; i++) {
				if (_typeof(columns[i]) == "object" && columns[i].sort) isSorting = true;
			}
			if (!isSorting) return false;
	
			header.sort(function (a, b) {
				var order = null;
				var res;
				for (var _i5 = 0; _i5 < columns.length && order === null; _i5++) {
					var c = columns[_i5];
					if ((typeof c === "undefined" ? "undefined" : _typeof(c)) == "object" && c.sort) {
	
						var sortFunction = c.sort;
						if (typeof c.sort == "string") sortFunction = webix.DataStore.prototype.sorting.as[c.sort];
						res = sortFunction(a[_i5].text, b[_i5].text);
	
						if (res || _i5 == columns.length - 1) {
							sorted = true;
							if (c.sortDir == "desc") {
								res = res * -1;
							}
							order = res;
						}
					} else order = 0;
				}
				return order;
			});
	
			if (header[0]) {
				var j = header[0].length - 2;
				while (j >= 0) {
					var text = "";
					var index = 0;
					for (var _i6 = 0; _i6 < header.length; _i6++) {
						if (text != header[_i6][j].text) {
							index = _i6;
							text = header[_i6][j].text;
							header[_i6][j].colspan = 1;
						} else {
							delete header[_i6][j].colspan;
							header[index][j].colspan++;
						}
					}
					j--;
				}
			}
		},
		_process_header: function _process_header(header) {
			header = this._render_header(header);
	
			this._sort_header(header);
			var vConfig,
			    valuesConfig = this.config.structure.values;
	
			for (var i = 0; i < header.length; i++) {
				var parts = [];
				for (var j = 0; j < header[i].length; j++) {
					parts.push(header[i][j].name);
				} // find value configuration
				vConfig = null;
				var tmp = parts[parts.length - 1].split(this.$divider);
				for (var _j = 0; _j < valuesConfig.length && !vConfig; _j++) {
					if (valuesConfig[_j].operation) for (var p = 0; p < valuesConfig[_j].operation.length; p++) {
						if (valuesConfig[_j].name == tmp[1] && valuesConfig[_j].operation[p] == tmp[0]) {
							vConfig = valuesConfig[_j];
						}
					}
				}
	
				header[i] = { id: parts.join(this.$divider), header: header[i], sort: "int", width: this.config.columnWidth };
				// add format
				if (vConfig && vConfig.format) header[i].format = vConfig.format;
			}
	
			this.callEvent("onHeaderInit", [header]);
	
			if (this.config.totalColumn && header.length) {
				header = this._add_total_columns(header);
			}
	
			var text0 = "<div class='webix_pivot_config_msg'>" + webix.i18n.pivot.pivotMessage + "</div>";
	
			if (this.config.readonly) {
				text0 = this.config.readonlyTitle || "";
				this.$$("data").$view.className += " webix_pivot_readonly";
			}
			header.splice(0, 0, { id: "name", exportAsTree: true, template: "{common.treetable()} #name#", header: { text: text0 }, width: this.config.yScaleWidth });
	
			return header;
		},
		_add_total_columns: function _add_total_columns(header) {
			var arr,
			    h,
			    i,
			    j,
			    found = false,
			    index = 0,
			    totalCols = [];
	
			// if no columns in selected
			if (header[0].header.length < 2) return header;
	
			i = header.length - 1;
	
			while (!found && i) {
				if (header[i].header[0].name != header[i - 1].header[0].name) {
					found = true;
					index = i;
				}
				i--;
			}
			var c = 0;
			for (i = index; i < header.length; i++) {
				h = webix.copy(header[i]);
				arr = [];
				found = true;
				if (this.config.totalColumn == "sumOnly") {
					var parts = h.id.split(this.$divider);
					var operation = parts[parts.length - 2];
					if (operation != "sum") found = false;
				}
				if (found) {
					for (j = c + 1; j < header.length + 1; j += header.length - index) {
						arr.push("[$r,:" + j + "]");
					}
					h.math = arr.join("+");
	
					if (!h.format) h.format = function (value) {
						return value && value != "0" ? parseFloat(value).toFixed(3) : value;
					};
	
					if (_typeof(this.config.totalColumn) == "object") {
						webix.extend(h, this.config.totalColumn, true);
					}
	
					h.id = h.id.replace(h.header[0].name, "$webixtotal");
					h.header[0].name = "total";
					h.header[0].text = this._apply_locale("total");
					totalCols.push(h);
				}
	
				c++;
			}
			totalCols = this._correct_colspan(totalCols);
			return header.concat(totalCols);
		},
		_correct_colspan: function _correct_colspan(header) {
			if (header[0]) {
				var j = header[0].header.length - 2;
				while (j >= 0) {
					var text = "";
					var index = 0;
					for (var i = 0; i < header.length; i++) {
						if (text != header[i].header[j].text) {
							index = i;
							text = header[i].header[j].text;
							header[i].header[j].colspan = 1;
						} else {
							delete header[i].header[j].colspan;
							header[index].header[j].colspan++;
						}
					}
					j--;
				}
			}
			return header;
		},
		_render_header: function _render_header(data) {
	
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
						h.splice(0, 0, { name: i, text: i });
						if (!first) {
							h[0].colspan = data[i].length;
							first = true;
						}
						header.push(h);
					}
				} else {
					var tmp = i.split(this.$divider);
	
					if (tmp.length > 1) {
						header.push([{ name: i, text: this._apply_map(tmp[1]) + " (" + this._apply_locale(tmp[0]) + ")" }]);
					} else
						// there are no values in structure, only rows and columns
						header.push([{ name: i, text: i }]);
				}
			}
	
			return header;
		},
		_get_key_leaves: function _get_key_leaves(data, key, result) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].data) this._get_key_leaves(data[i].data, key, result);else result.push(data[i][key]);
			}
		},
		_calculate_item: function _calculate_item(item, structure) {
			var i, key, leaves, op, tmp, values;
	
			for (i = 0; i < structure._header.length; i++) {
				key = structure._header[i];
				tmp = key.split(this.$divider);
	
				op = tmp[tmp.length - 2];
	
				values = item[key];
	
				leaves = this._operationOptions[op] && this._operationOptions[op].leavesOnly;
				if (leaves && item.data) {
	
					values = [];
					this._get_key_leaves(item.data, key, values);
				}
				if (values) {
					var data = [];
	
					for (var j = 0; j < values.length; j++) {
						if (values[j] || values[j] == "0") {
							data.push(values[j]);
						}
					}
					if (data.length) item[key] = this.operations[op].call(this, data, key, item);else item[key] = '';
				} else item[key] = '';
	
				if (item[key]) item[key] = Math.round(item[key] * 100000) / 100000;
			}
			return item;
		},
		_minmax_in_row: function _minmax_in_row(item, structure) {
			// nothing to do
			if (!this.config.min && !this.config.max) return item;
	
			var values = this.config.structure.values;
			if (!item.$cellCss) item.$cellCss = {};
	
			// calculating for each value
			for (var i = 0; i < values.length; i++) {
				var value = values[i];
	
				var max = [],
				    max_value = -99999999;
				var min = [],
				    min_value = 99999999;
	
				for (var j = 0; j < structure._header.length; j++) {
					var key = structure._header[j];
					if (window.isNaN(item[key])) continue;
					// it's a another value
					if (key.indexOf(value.name, this.length - value.name.length) === -1) continue;
	
					if (this.config.max && item[key] > max_value) {
						max = [key];
						max_value = item[key];
					} else if (item[key] == max_value) {
						max.push(key);
					}
					if (this.config.min && item[key] < min_value) {
						min = [key];
						min_value = item[key];
					} else if (item[key] == min_value) {
						min.push(key);
					}
				}
	
				for (var _j2 = 0; _j2 < min.length; _j2++) {
					item.$cellCss[min[_j2]] = "webix_min";
				}
				for (var _j3 = 0; _j3 < max.length; _j3++) {
					item.$cellCss[max[_j3]] = "webix_max";
				}
			}
			return item;
		},
		_operationOptions: {},
		operations: {
			sum: function sum(args) {
				var sum = 0;
				for (var i = 0; i < args.length; i++) {
					var value = args[i];
					value = parseFloat(value, 10);
					if (!window.isNaN(value)) sum += value;
				}
				return sum;
			},
			count: function count(data, key, item) {
				var count = 0;
				if (!item.data) count = data.length;else {
					for (var i = 0; i < item.data.length; i++) {
						count += item.data[i][key] || 0;
					}
				}
				return count;
			},
			max: function max(args) {
				if (args.length == 1) return args[0];
				return Math.max.apply(this, args);
			},
			min: function min(args) {
				if (args.length == 1) return args[0];
				return Math.min.apply(this, args);
			}
		},
		addOperation: function addOperation(name, method, options) {
			this.operations[name] = method;
			if (options) this._operationOptions[name] = options;
		},
		getFields: function getFields() {
			var fields = [];
			var fields_hash = {};
			for (var i = 0; i < Math.min(this.data.count() || 5); i++) {
				var item = this.data.getItem(this.data.getIdByIndex(i));
				for (var field in item) {
					if (!fields_hash[field]) {
						fields.push(field);
						fields_hash[field] = webix.uid();
					}
				}
			}
	
			var str = this.config.structure;
			var result = { fields: [], rows: [], columns: [], values: [], filters: [] };
	
			for (var _i7 = 0; _i7 < (str.filters || []).length; _i7++) {
				var _field = str.filters[_i7];
				if (!webix.isUndefined(fields_hash[_field.name])) {
					var text = this._apply_map(_field.name);
					result.filters.push({ name: _field.name, text: text, type: _field.type, value: _field.value, id: fields_hash[_field] });
					//delete fields_hash[field.name]; // filter allows to drag a field multiple times
				}
			}
			for (var _i8 = 0; _i8 < str.rows.length; _i8++) {
				var _field2 = str.rows[_i8];
				if (!webix.isUndefined(fields_hash[_field2])) {
					result.rows.push({ name: _field2, text: this._apply_map(_field2), id: fields_hash[_field2] });
					delete fields_hash[_field2];
				}
			}
	
			for (var _i9 = 0; _i9 < str.columns.length; _i9++) {
				var _field3 = _typeof(str.columns[_i9]) == "object" ? str.columns[_i9].id || _i9 : str.columns[_i9];
				if (!webix.isUndefined(fields_hash[_field3])) {
					result.columns.push({ name: _field3, text: this._apply_map(_field3), id: fields_hash[_field3] });
					delete fields_hash[_field3];
				}
			}
	
			for (var _i10 = 0; _i10 < str.values.length; _i10++) {
				var _field4 = str.values[_i10];
				if (!webix.isUndefined(fields_hash[_field4.name])) {
					var _text = this._apply_map(_field4.name);
					result.values.push({ name: _field4.name, text: _text, operation: _field4.operation, id: fields_hash[_field4.name] });
					//delete fields_hash[field.name];   // values allows to drag a field multiple times
				}
			}
	
			for (var _i11 = 0; _i11 < fields.length; _i11++) {
				var _field5 = fields[_i11];
				if (!webix.isUndefined(fields_hash[_field5])) result.fields.push({ name: _field5, text: this._apply_map(_field5), id: fields_hash[_field5] });
			}
			return result;
		},
		_init_filters: function _init_filters() {
			var filters = this.config.structure.filters || [];
			flt.init(filters);
		},
		_filter_item: function _filter_item(item) {
			var filters = this.config.structure.filters || [];
			return flt.filterItem(filters, item);
		},
		setStructure: function setStructure(config) {
			this.define("structure", config);
			this.render();
		},
		getStructure: function getStructure() {
			return this.config.structure;
		},
		getConfigWindow: function getConfigWindow() {
			return this._config_popup;
		},
		profile_setter: function profile_setter(value) {
			var c = window.console;
			if (value) {
				this.attachEvent("onBeforeLoad", function () {
					c.time("data loading");
				});
				this.data.attachEvent("onParse", function () {
					c.timeEnd("data loading");c.time("data parsing");
				});
				this.data.attachEvent("onStoreLoad", function () {
					c.timeEnd("data parsing");c.time("data processing");
				});
				this.$ready.push(function () {
					this.$$("data").attachEvent("onBeforeRender", function () {
						if (this.count()) {
							c.timeEnd("data processing");c.time("data rendering");
						}
					});
					this.$$("data").attachEvent("onAfterRender", function () {
						if (this.count()) webix.delay(function () {
							c.timeEnd("data rendering");
						});
					});
				});
			}
		}
	}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings);

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.init = init;
	exports.filterItem = filterItem;
	function numHelper(fvalue, value, func) {
	    if ((typeof fvalue === "undefined" ? "undefined" : _typeof(fvalue)) == "object") {
	        for (var i = 0; i < fvalue.length; i++) {
	            fvalue[i] = window.parseFloat(fvalue[i]);
	            if (window.isNaN(fvalue[i])) return true;
	        }
	    } else {
	        fvalue = window.parseFloat(fvalue);
	        // if filter value is not a number then ignore such filter
	        if (window.isNaN(fvalue)) return true;
	    }
	    // if row value is not a number then don't show this row
	    if (window.isNaN(value)) return false;
	    return func(fvalue, value);
	}
	
	var rules = exports.rules = {
	    contains: function contains(fvalue, value) {
	        return value.indexOf(fvalue.toString().toLowerCase()) >= 0;
	    },
	    equal: function equal(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return fvalue == value;
	        });
	    },
	    not_equal: function not_equal(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return fvalue != value;
	        });
	    },
	    less: function less(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return value < fvalue;
	        });
	    },
	    less_equal: function less_equal(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return value <= fvalue;
	        });
	    },
	    more: function more(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return value > fvalue;
	        });
	    },
	    more_equal: function more_equal(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return value >= fvalue;
	        });
	    },
	    multi: function multi(fvalues, value) {
	        var result = false;
	        fvalues = fvalues.split(",");
	        for (var i = 0; i < fvalues.length; i++) {
	            result = result || value.indexOf(fvalues[i].toString().toLowerCase()) >= 0;
	        }
	        return result;
	    },
	    range: function range(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return value < fvalue[1] && value >= fvalue[0];
	        });
	    },
	    range_inc: function range_inc(fvalue, value) {
	        return numHelper(fvalue, value, function (fvalue, value) {
	            return value <= fvalue[1] && value >= fvalue[0];
	        });
	    }
	};
	
	function init(filters) {
	    for (var i = 0; i < filters.length; i++) {
	        var f = filters[i];
	
	        var fvalue = f.value || "";
	        if (webix.isDate(fvalue)) {
	            fvalue = webix.i18n.parseFormatStr(fvalue);
	        } else if (typeof fvalue == "string") {
	            if (fvalue.trim) fvalue = fvalue.trim();
	        }
	
	        if (fvalue.substr(0, 1) == "=") {
	            f.func = rules.equal;
	            fvalue = fvalue.substr(1);
	        } else if (fvalue.substr(0, 2) == "<>") {
	            f.func = rules.not_equal;
	            fvalue = fvalue.substr(2);
	        } else if (fvalue.substr(0, 2) == ">=") {
	            f.func = rules.more_equal;
	            fvalue = fvalue.substr(2);
	        } else if (fvalue.substr(0, 1) == ">") {
	            f.func = rules.more;
	            fvalue = fvalue.substr(1);
	        } else if (fvalue.substr(0, 2) == "<=") {
	            f.func = rules.less_equal;
	            fvalue = fvalue.substr(2);
	        } else if (fvalue.substr(0, 1) == "<") {
	            f.func = rules.less;
	            fvalue = fvalue.substr(1);
	        } else if (fvalue.indexOf("...") > 0) {
	            f.func = rules.range;
	            fvalue = fvalue.split("...");
	        } else if (fvalue.indexOf("..") > 0) {
	            f.func = rules.range_inc;
	            fvalue = fvalue.split("..");
	        } else if (f.type == "multiselect") {
	            f.func = rules.multi;
	        } else if (f.type == "datepicker") {
	            f.func = function (fvalue, value) {
	                return fvalue == value;
	            };
	        } else f.func = rules.contains;
	
	        f.fvalue = fvalue;
	    }
	}
	
	function filterItem(filters, item) {
	    for (var i = 0; i < filters.length; i++) {
	        var f = filters[i];
	        if (f.fvalue) {
	            if (webix.isUndefined(item[f.name])) return false;
	
	            var value = item[f.name].toString().toLowerCase();
	            var result = f.func(f.fvalue, value);
	
	            if (!result) return false;
	        }
	    }
	    return true;
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	webix.ui.datafilter.pivotSumColumn = webix.extend({
	    refresh: function refresh(master, node, value) {
	        var result = 0;
	        master.mapCells(null, value.columnId, null, 1, function (value, id) {
	            if (!isNaN(value) && master.getItem(id).$level == 1) result += value * 1;
	            return value;
	        });
	
	        if (value.format) result = value.format(result);
	        if (value.template) result = value.template({ value: result });
	
	        node.firstChild.innerHTML = result;
	    }
	}, webix.ui.datafilter.summColumn);

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	    name: "webix_pivot_config",
	
	    $init: function $init(config) {
	        this.$view.className += " webix_popup webix_pivot";
	        webix.extend(config, this.defaults);
	        webix.extend(config, this._get_ui(config));
	        this.$ready.push(this._after_init);
	    },
	    defaults: {
	        padding: 8,
	        height: 500,
	        width: 700,
	        cancelButtonWidth: 100,
	        applyButtonWidth: 100,
	        fieldsColumnWidth: 180,
	        head: false,
	        modal: true,
	        move: true
	    },
	    _get_ui: function _get_ui(config) {
	        return {
	            head: {
	                /*type: "space",
	                 margin: 5,
	                 padding: 5,
	                 borderless: true,*/
	                view: "toolbar",
	                //height: 45,
	                cols: [{ id: "config_title", view: "label", label: webix.i18n.pivot.windowTitle || "" }, { view: "button", id: "cancel", label: webix.i18n.pivot.cancel, width: config.cancelButtonWidth }, { view: "button", id: "apply", type: "form", label: webix.i18n.pivot.apply, width: config.applyButtonWidth }]
	            },
	            body: {
	                type: "wide",
	                //  margin: 5,
	                rows: [{
	                    //type: "wide",
	
	                    cols: [
	                    // {width:1},
	                    {
	                        width: config.fieldsColumnWidth,
	
	                        rows: [{ id: "fieldsHeader", data: { value: "fields" }, css: "webix_pivot_header_fields", template: this._popup_templates.popupHeaders, height: 45 }, { id: "fields", view: "list", scroll: true, type: { height: "auto" }, css: "", drag: true, template: "<span class='webix_pivot_list_marker'></span>#text#",
	                            on: {
	                                onBeforeDropOut: webix.bind(this._check_values_drag, this)
	                            }
	                        }]
	                    }, {
	                        type: "space",
	                        rows: [{
	                            type: "wide",
	                            rows: [{
	                                css: "webix_pivot_transparent", borderless: true, template: "<div class='webix_pivot_fields_msg'>" + webix.i18n.pivot.windowMessage || "" + "</div>", height: 25
	                            }, {
	                                type: "wide",
	                                cols: [{
	
	                                    rows: [{ id: "filtersHeader", data: { value: "filters", icon: "filter" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "filters", view: "list", scroll: false, drag: true, css: "webix_pivot_values",
	                                        template: function template(obj) {
	                                            obj.type = obj.type || "select";
	                                            return "<a class='webix_pivot_link'>" + obj.text + " <span class='webix_link_selection'>" + obj.type + "</span></a> ";
	                                        },
	                                        type: {
	                                            height: 35
	                                        },
	                                        onClick: { "webix_pivot_link": webix.bind(this._filter_selector, this) },
	                                        on: {
	                                            onBeforeDrop: webix.bind(this._copy_filter_field, this),
	                                            onBeforeDropOut: webix.bind(this._check_filter_drag, this)
	                                        }
	                                    }] }, {
	                                    rows: [{ id: "columnsHeader", data: { value: "columns", icon: "columns" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "columns", view: "list", scroll: false, drag: true, type: { height: 35 }, template: "#text#" }]
	                                }] }, {
	                                type: "wide",
	                                cols: [{
	                                    rows: [{ id: "rowsHeader", data: { value: "rows", icon: "list" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "rows", view: "list", scroll: false, drag: true, template: "#text#", type: { height: 35 } }]
	                                }, {
	                                    rows: [{ id: "valuesHeader", data: { value: "values", icon: false, iconContent: "<b>&Sigma;</b>" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "values", view: "list", scroll: true, drag: true, css: "webix_pivot_values", type: { height: "auto" },
	                                        template: webix.bind(this._function_template, this),
	                                        onClick: {
	                                            "webix_pivot_link": webix.bind(this._function_selector, this),
	                                            "webix_pivot_plus": webix.bind(this._function_add, this),
	                                            "webix_pivot_minus": webix.bind(this._function_remove, this)
	                                        },
	                                        on: {
	                                            onBeforeDrop: webix.bind(this._copy_values_field, this),
	                                            onBeforeDropOut: webix.bind(this._check_values_drag, this)
	                                        }
	                                    }]
	                                }] }]
	
	                        }]
	
	                    }]
	                }]
	
	            }
	        };
	    },
	    _popup_templates: {
	        popupHeaders: function popupHeaders(obj) {
	            return webix.i18n.pivot[obj.value];
	        },
	        popupIconHeaders: function popupIconHeaders(obj) {
	            if (obj.icon) return "<span class='webix_pivot_header_icon webix_icon fa-" + obj.icon + "'></span>" + webix.i18n.pivot[obj.value];else return "<span class='webix_pivot_header_icon'>" + obj.iconContent + "</span>" + webix.i18n.pivot[obj.value];
	        }
	    },
	    _check_values_drag: function _check_values_drag(ctx) {
	        var from = ctx.from,
	            to = ctx.to;
	        if (to != from) {
	            var id = ctx.source[0];
	
	            if (from == this.$$("values") && to != this.$$("filters")) {
	                if (this.$$("fields").getItem(id)) this.$$("fields").remove(id);
	            } else if (to != this.$$("values")) {
	                var found = false;
	                if (from == this.$$("filters")) {
	                    var name = from.getItem(id).name;
	                    this.$$("values").data.each(function (item) {
	                        if (item.name == name) {
	                            id = found = item.id;
	                        }
	                    });
	                }
	
	                if (found || from == this.$$("fields") && to != this.$$("filters")) {
	                    if (this.$$("values").getItem(id)) this.$$("values").remove(id);
	                }
	            }
	        }
	    },
	    _copy_values_field: function _copy_values_field(ctx) {
	        if (ctx.to && ctx.from != ctx.to) {
	            var id = ctx.source;
	            var item = ctx.from.getItem(id);
	            if (ctx.from == this.$$("fields")) {
	                if (ctx.to.getItem(id)) {
	                    this._function_add({}, id);
	                } else {
	                    ctx.to.add(webix.copy(item), ctx.index);
	                }
	                return false;
	            } else {
	                if (!this.$$("fields").getItem(id)) this.$$("fields").add(webix.copy(item));
	            }
	        }
	        return true;
	    },
	    _copy_filter_field: function _copy_filter_field(ctx) {
	        if (ctx.from != ctx.to) {
	            var item = webix.copy(ctx.from.getItem(ctx.start));
	            var name = item.name;
	            delete item.id;
	            var found = false;
	            this.$$("filters").data.each(function (field) {
	                if (field.name == name) {
	                    found = true;
	                }
	            });
	            if (!found) ctx.to.add(item);
	            return false;
	        }
	        return false;
	    },
	    _check_filter_drag: function _check_filter_drag(ctx) {
	        if (ctx.from && ctx.to && ctx.from != ctx.to) {
	            var lists = ["fields", "rows", "columns"];
	            var name = ctx.from.getItem(ctx.start).name;
	            for (var i = 0; i < lists.length; i++) {
	                var sameItem = null;
	                this.$$(lists[i]).data.each(function (item) {
	                    if (item.name == name) {
	                        sameItem = item;
	                    }
	                });
	                if (sameItem) this.$$(lists[i]).remove(sameItem.id);
	            }
	            this._check_values_drag(ctx);
	        }
	        return true;
	    },
	    _after_init: function _after_init() {
	        this.attachEvent("onItemClick", function (id) {
	            var innerId = this.innerId(id);
	            if (innerId == "cancel" || innerId == "apply") {
	                //transform button clicks to events
	                var structure = this.getStructure();
	
	                if (webix.$$(this.config.pivot).callEvent("onBefore" + innerId, [structure])) {
	                    this.callEvent("on" + innerId, [structure]);
	                    this.hide();
	                }
	            }
	        });
	    },
	    _function_template: function _function_template(obj) {
	        obj.operation = obj.operation || ["sum"];
	        if (!webix.isArray(obj.operation)) obj.operation = [obj.operation];
	
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
	
	    _function_selector: function _function_selector(e, id) {
	        var func_selector = {
	            view: "webix_pivot_popup", autofit: true,
	            width: 150,
	            data: this.config.operations || []
	        };
	        var p = webix.ui(func_selector);
	        p.show(e);
	        p.attachEvent("onHide", webix.bind(function () {
	            var index = webix.html.locate(e, "webix_operation");
	            var sel = p.getSelected();
	            if (sel !== null) {
	                this.$$("values").getItem(id).operation[index] = sel.name;
	                this.$$("values").updateItem(id);
	            }
	
	            p.close();
	        }, this));
	    },
	
	    _function_add: function _function_add(e, id) {
	        var item = this.$$("values").getItem(id);
	        item.operation.push("sum");
	        this.$$("values").updateItem(id);
	
	        webix.delay(function () {
	            var index = item.operation.length - 1;
	            var els = this.$$("values").getItemNode(id).childNodes;
	            var el = null;
	            for (var i = 0; i < els.length; i++) {
	                el = els[i];
	                if (!el.getAttribute) continue;
	                var op = el.getAttribute("webix_operation");
	                if (!webix.isUndefined(op) && op == index) break;
	            }
	            if (el !== null) this._function_selector(el, id);
	        }, this);
	    },
	    _function_remove: function _function_remove(e, id) {
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
	
	    _filter_selector: function _filter_selector(e, id) {
	        var locale = webix.$$(this.config.pivot)._apply_locale;
	        var selector = {
	            view: "webix_pivot_popup", autofit: true,
	            height: 150, width: 150,
	            data: [{ name: "datepicker", title: locale("date") }, { name: "multiselect", title: locale("multiselect") }, { name: "select", title: locale("select") }, { name: "text", title: locale("text") }]
	
	        };
	        var p = webix.ui(selector);
	        p.show(e);
	        p.attachEvent("onHide", webix.bind(function () {
	            var sel = p.getSelected();
	            if (sel !== null) {
	                var item = this.$$('filters').getItem(id);
	                item.type = sel.name;
	                this.$$('filters').updateItem(id);
	            }
	
	            p.close();
	        }, this));
	    },
	
	    data_setter: function data_setter(value) {
	        this.$$("fields").clearAll();
	        this.$$("fields").parse(value.fields);
	        this.$$("fields").filter(function (item) {
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
	    setStructure: function setStructure(config) {
	        this.define("structure", config);
	        this.render();
	    },
	    getStructure: function getStructure() {
	        var structure = { rows: [], columns: [], values: [], filters: [] };
	
	        var rows = this.$$("rows");
	        rows.data.each(function (obj) {
	            structure.rows.push(obj.name);
	        });
	
	        var columns = this.$$("columns");
	        columns.data.each(function (obj) {
	            structure.columns.push(obj.name);
	        });
	
	        var values = this.$$("values");
	        values.data.each(function (obj) {
	            structure.values.push(obj);
	        });
	
	        var filters = this.$$("filters");
	        filters.data.each(function (obj) {
	            structure.filters.push(obj);
	        });
	
	        return structure;
	    }
	}, webix.ui.window, webix.IdSpace);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _filters = __webpack_require__(8);
	
	var flt = _interopRequireWildcard(_filters);
	
	__webpack_require__(12);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }
	
	webix.protoUI({
		name: "pivot-chart",
		version: "{{version}}",
		defaults: {
			fieldMap: {},
			rows: [],
			filterLabelAlign: "right",
			filterWidth: 300,
			filterMinWidth: 180,
			editButtonWidth: 110,
			filterLabelWidth: 100,
			chartType: "bar",
			color: "#36abee",
			chart: {},
			singleLegendItem: 1,
			palette: [["#e33fc7", "#a244ea", "#476cee", "#36abee", "#58dccd", "#a7ee70"], ["#d3ee36", "#eed236", "#ee9336", "#ee4339", "#595959", "#b85981"], ["#c670b8", "#9984ce", "#b9b9e2", "#b0cdfa", "#a0e4eb", "#7faf1b"], ["#b4d9a4", "#f2f79a", "#ffaa7d", "#d6806f", "#939393", "#d9b0d1"], ["#780e3b", "#684da9", "#242464", "#205793", "#5199a4", "#065c27"], ["#54b15a", "#ecf125", "#c65000", "#990001", "#363636", "#800f3e"]]
		},
		templates: {
			groupNameToStr: function groupNameToStr(name, operation) {
				return name + "_" + operation;
			},
			groupNameToObject: function groupNameToObject(name) {
				var arr = name.split("_");
				return { name: arr[0], operation: arr[1] };
			},
			seriesTitle: function seriesTitle(data, i) {
				var name = this.config.fieldMap[data.name] || this._capitalize(data.name);
				var operation = webix.isArray(data.operation) ? data.operation[i] : data.operation;
				return name + " ( " + (webix.i18n.pivot[operation] || operation) + ")";
			}
		},
		templates_setter: function templates_setter(obj) {
			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object") webix.extend(this.templates, obj);
		},
		chartMap: {
			bar: function bar(color) {
				return {
					border: 0,
					alpha: 1,
					radius: 0,
					color: color
				};
			},
			line: function line(color) {
				return {
					alpha: 1,
					item: {
						borderColor: color,
						color: color
					},
					line: {
						color: color,
						width: 2
					}
				};
			},
			radar: function radar(color) {
				return {
					alpha: 1,
					fill: false,
					disableItems: true,
					item: {
						borderColor: color,
						color: color
					},
					line: {
						color: color,
						width: 2
					}
				};
			}
		},
		chartMap_setter: function chartMap_setter(obj) {
			if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object") webix.extend(this.chartMap, obj, true);
		},
		$init: function $init(config) {
			if (!config.structure) config.structure = {};
			webix.extend(config.structure, { groupBy: "", values: [], filters: [] });
	
			this.$view.className += " webix_pivot_chart";
			webix.extend(config, { editButtonWidth: this.defaults.editButtonWidth });
			webix.extend(config, this.getUI(config));
	
			this.$ready.push(webix.bind(function () {
				webix.delay(this.render, this); // delay needed for correct legend rendering
			}, this));
			this.data.attachEvent("onStoreUpdated", webix.bind(function () {
				// call render if pivot is initialized
				if (this.$$("chart")) this.render(this, arguments);
			}, this));
		},
		getUI: function getUI(config) {
			var cols = [];
	
			cols.push({ id: "filters", hidden: true, cols: [] });
			if (!config.readonly) {
				cols.push({}, {
					id: "edit", view: "icon", type: "iconButton", align: "right", icon: "pencil-square-o", inputWidth: config.editButtonWidth,
					tooltip: this._applyLocale("settings"), click: webix.bind(this.configure, this)
				});
			}
			var header = {
				paddingY: 10,
				paddingX: 5,
				margin: 10,
				maxHeight: 5,
				id: "toolbar",
				cols: cols
			};
	
			var chart = { id: "bodyLayout", type: "line", margin: 10, cols: [{ id: "chart", view: "chart" }] };
			return { type: "clean", rows: [header, chart] };
		},
		configure: function configure() {
			if (!this.pivotPopup) {
				var config = { view: "webix_pivot_chart_config", operations: [], pivot: this.config.id };
				webix.extend(config, this.config.popup || {});
	
				this.pivotPopup = webix.ui(config);
				this.callEvent("onPopup", [this.pivotPopup]);
				this.pivotPopup.attachEvent("onApply", webix.bind(function (structure) {
					this.config.chartType = this.pivotPopup.$$("chartType") ? this.pivotPopup.$$("chartType").getValue() : "bar";
					this.config.chart.scale = this.pivotPopup.$$("logScale").getValue() ? "logarithmic" : "linear";
					webix.extend(this.config.structure, structure, true);
					this.render();
				}, this));
			}
	
			var functions = [];
			for (var i in this.operations) {
				functions.push({ name: i, title: this._applyLocale(i) });
			}this.pivotPopup._valueLength = this._valueLength;
			this.pivotPopup.define("operations", functions);
			var pos = webix.html.offset(this.$$("chart").getNode());
			this.pivotPopup.setPosition(pos.x + 10, pos.y + 10);
			this.pivotPopup.define("data", this.getFields());
			this.pivotPopup._valueFields = this.pivotPopup.show();
		},
		render: function render(mode) {
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
		_setChartConfig: function _setChartConfig() {
			var config = this.config;
			var values = config.structure.values;
	
			for (var i = 0; i < values.length; i++) {
				values[i].operation = values[i].operation || ["sum"];
				if (!webix.isArray(values[i].operation)) values[i].operation = [values[i].operation];
			}
	
			var chartType = this.config.chartType || "bar";
			var mapConfig = this.chartMap[chartType];
	
			var chart = {
	
				"type": mapConfig && mapConfig("").type ? mapConfig("").type : chartType,
				"xAxis": webix.extend({ template: "#id#" }, config.chart.xAxis || {}, true),
				"yAxis": webix.extend({}, config.chart.yAxis || {})
			};
	
			webix.extend(chart, config.chart);
			if (!chart.padding) {
				chart.padding = { top: 17 };
			}
	
			var result = this._getSeries();
	
			chart.series = result.series;
	
			chart.legend = false;
			if (config.singleLegendItem || this._valueLength > 1) {
				chart.legend = result.legend;
			}
	
			chart.scheme = {
				$group: this._pivot_group,
				$sort: {
					by: "id"
				}
			};
			this.$$("chart").removeAllSeries();
			for (var c in chart) {
				this.$$("chart").define(c, chart[c]);
			}
		},
		_applyLocale: function _applyLocale(value) {
			return webix.i18n.pivot[value] || value;
		},
		_capitalize: function _capitalize(value) {
			return value.charAt(0).toUpperCase() + value.slice(1);
		},
		_applyMap: function _applyMap(value, capitalize) {
			return this.config.fieldMap[value] || (capitalize ? this._capitalize(value) : value);
		},
		_processFilters: function _processFilters() {
			var filters = this.config.structure.filters || [];
	
			var items = [];
			for (var i = 0; i < filters.length; i++) {
				var f = filters[i];
				var item = { value: f.value, label: this._applyMap(f.name, true), field: f.name, view: f.type, stringResult: true,
					labelAlign: this.config.filterLabelAlign, labelWidth: this.config.filterLabelWidth, minWidth: this.config.filterMinWidth, maxWidth: this.config.filterWidth };
				if (f.type == "select" || f.type == "multiselect") {
					item.options = this._distinctValues(f.name);
					if (f.type == "multiselect") item.options.shift();
				}
	
				items.push(item);
			}
			return items;
		},
		_distinctValues: function _distinctValues(field) {
			var values = [{ value: "", id: "" }];
			var data = this.data.pull;
			var hash = {};
			for (var obj in data) {
				var value = data[obj][field];
				if (!webix.isUndefined(value)) {
					if (!hash[value]) {
						values.push({ value: value, id: value });
						hash[value] = true;
					}
				}
			}
			values.sort(function (a, b) {
				var val1 = a.value;
				var val2 = b.value;
				if (!val2) return 1;
				if (!val1) return -1;
	
				val1 = val1.toString().toLowerCase();val2 = val2.toString().toLowerCase();
				return val1 > val2 ? 1 : val1 < val2 ? -1 : 0;
			});
			return values;
		},
		_loadFilteredData: function _loadFilteredData() {
			this._initFilters();
			this.data.silent(function () {
				this.data.filter(webix.bind(this._filterItem, this));
			}, this);
			this.$$("chart").data.silent(function () {
				this.$$("chart").clearAll();
			}, this);
			this.$$("chart").parse(this.data.getRange());
		},
		_setFilterEvents: function _setFilterEvents() {
			var filters = this.$$("filters");
			filters.reconstruct();
			var children = filters.getChildViews();
			var pivot = this;
	
			for (var i = 0; i < children.length; i++) {
				var el = children[i];
				if (el.name == "select" || el.name == "multiselect" || el.name == "datepicker") el.attachEvent("onChange", function (newvalue) {
					pivot._setFilterValue(this.config.field, newvalue);
				});else if (!webix.isUndefined(el.getValue)) {
					el.attachEvent("onTimedKeyPress", function () {
						pivot._setFilterValue(this.config.field, this.getValue());
					});
				}
			}
		},
	
		_setFilterValue: function _setFilterValue(field, value) {
			var filters = this.config.structure.filters;
			for (var i = 0; i < filters.length; i++) {
				if (filters[i].name == field) {
					filters[i].value = value;
					this._loadFilteredData();
					return true;
				}
			}return false;
		},
	
		groupNameToStr: function groupNameToStr(obj) {
			return obj.name + "_" + obj.operation;
		},
		groupNameToObject: function groupNameToObject(name) {
			var arr = name.split("_");
			return { name: arr[0], operation: arr[1] };
		},
		_getSeries: function _getSeries() {
			var i,
			    j,
			    legend,
			    map = {},
			    name,
			    legendTitle,
			    series = [],
			    values = this.config.structure.values;
	
			// legend definition
			legend = {
				valign: "middle",
				align: "right",
				width: 140,
				layout: "y"
			};
			webix.extend(legend, this.config.chart.legend || {}, true);
			legend.values = [];
			if (!legend.marker) legend.marker = {};
			legend.marker.type = this.config.chartType == "line" ? "item" : "s";
	
			this.series_names = [];
			this._valueLength = 0;
	
			for (i = 0; i < values.length; i++) {
				if (!webix.isArray(values[i].operation)) {
					values[i].operation = [values[i].operation];
				}
				if (!webix.isArray(values[i].color)) {
	
					values[i].color = [values[i].color || this._getColor(this._valueLength)];
				}
				for (j = 0; j < values[i].operation.length; j++) {
	
					name = this.templates.groupNameToStr(values[i].name, values[i].operation[j]);
					this.series_names.push(name);
					if (!values[i].color[j]) values[i].color[j] = this._getColor(this._valueLength);
					var color = values[i].color[j];
					var sConfig = this.chartMap[this.config.chartType](color) || {};
					sConfig.value = "#" + name + "#";
					sConfig.tooltip = {
						template: webix.bind(function (obj) {
							return obj[this].toFixed(3);
						}, name)
					};
	
					series.push(sConfig);
					legendTitle = this.templates.seriesTitle.call(this, values[i], j);
					legend.values.push({
						text: legendTitle,
						color: color
					});
					map[name] = [values[i].name, values[i].operation[j]];
					this._valueLength++;
				}
			}
			this._pivot_group = {};
			if (values.length) this._pivot_group = webix.copy({
				by: this.config.structure.groupBy,
				map: map
			});
	
			return { series: series, legend: legend };
		},
		_getColor: function _getColor(i) {
			var palette = this.config.palette;
			var rowIndex = i / palette[0].length;
			rowIndex = rowIndex > palette.length ? 0 : parseInt(rowIndex, 10);
			var columnIndex = i % palette[0].length;
			return palette[rowIndex][columnIndex];
		},
		_processLegend: function _processLegend() {
			var i,
			    legend,
			    name,
			    values = this.config.structure.values;
	
			legend = {
				valign: "middle",
				align: "right",
				width: 140,
				layout: "y"
			};
	
			webix.extend(legend, this.config.chart.legend || {}, true);
	
			legend.values = [];
			if (!legend.marker) legend.marker = {};
			legend.marker.type = this.config.chartType == "line" ? "item" : "s";
	
			for (i = 0; i < values.length; i++) {
				name = this.templates.seriesTitle.call(this, values[i]);
	
				legend.values.push({
					text: name,
					color: values[i].color
				});
			}
	
			return legend;
		},
		operations: { sum: 1, count: 1, max: 1, min: 1 },
		addGroupMethod: function addGroupMethod(name, method) {
			this.operations[name] = 1;
			if (method) webix.GroupMethods[name] = method;
		},
		removeGroupMethod: function removeGroupMethod(name) {
			delete this.operations[name];
		},
		groupMethods_setter: function groupMethods_setter(obj) {
			for (var a in obj) {
				if (obj.hasOwnProperty(a)) this.addGroupMethod(a, obj[a]);
			}
		},
		// fields for edit popup
		getFields: function getFields() {
	
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
			var result = { fields: [], groupBy: [], values: [], filters: [] };
	
			var field = _typeof(str.groupBy) == "object" ? str.groupBy[0] : str.groupBy;
			if (!webix.isUndefined(fields_hash[field])) {
				result.groupBy.push({ name: field, text: this._applyMap(field), id: fields_hash[field] });
				delete fields_hash[field];
			}
	
			var valueNameHash = {};
			var text;
			for (i = 0; i < str.values.length; i++) {
				field = str.values[i];
				if (!webix.isUndefined(fields_hash[field.name])) {
					text = this._applyMap(field.name);
					if (webix.isUndefined(valueNameHash[field.name])) {
						valueNameHash[field.name] = result.values.length;
						result.values.push({ name: field.name, text: text, operation: field.operation, color: field.color || [this._getColor(i)], id: fields_hash[field.name] });
					} else {
						var value = result.values[valueNameHash[field.name]];
						value.operation = value.operation.concat(field.operation);
						value.color = value.color.concat(field.color || [this._getColor(i)]);
					}
	
					//delete fields_hash[field.name];   // values allows to drag a field multiple times
				}
			}
	
			for (i = 0; i < (str.filters || []).length; i++) {
				field = str.filters[i];
				if (!webix.isUndefined(fields_hash[field.name])) {
					text = this._applyMap(field.name);
					result.filters.push({ name: field.name, text: text, type: field.type, value: field.value, id: fields_hash[field] });
					delete fields_hash[field.name];
				}
			}
	
			for (i = 0; i < fields.length; i++) {
				field = fields[i];
				if (!webix.isUndefined(fields_hash[field])) result.fields.push({ name: field, text: this._applyMap(field), id: fields_hash[field] });
			}
			return result;
		},
		_initFilters: function _initFilters() {
			var filters = this.config.structure.filters || [];
			flt.init(filters);
		},
		_filterItem: function _filterItem(item) {
			var filters = this.config.structure.filters || [];
			return flt.filterItem(filters, item);
		},
		getStructure: function getStructure() {
			return this.config.structure;
		},
		getConfigWindow: function getConfigWindow() {
			return this._config_popup;
		}
	}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings);

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	
	webix.protoUI({
	    name: "webix_pivot_chart_config",
	
	    $init: function $init(config) {
	        this.$view.className += " webix_pivot_chart_popup";
	        webix.extend(config, this.defaults);
	        webix.extend(config, this._getUI(config));
	        this.$ready.push(this._afterInit);
	    },
	    defaults: {
	        padding: 8,
	        height: 500,
	        width: 650,
	        head: false,
	        modal: true,
	        move: true,
	        chartTypeLabelWidth: 80,
	        chartTypeWidth: 250,
	        cancelButtonWidth: 100,
	        applyButtonWidth: 100,
	        logScaleLabelWidth: 125,
	        fieldsColumnWidth: 280
	    },
	    _getUI: function _getUI(config) {
	        var chartTypes = [];
	        var pivot = webix.$$(config.pivot);
	        var types = pivot.chartMap;
	        for (var type in types) {
	            chartTypes.push({ id: type, value: pivot._applyLocale(type) });
	        }
	        return {
	            head: {
	                view: "toolbar",
	                cols: [{ id: "config_title", view: "label", label: webix.i18n.pivot.windowTitle }, { view: "button", id: "cancel", label: pivot._applyLocale("cancel"), width: config.cancelButtonWidth }, { view: "button", id: "apply", type: "form", css: "webix_pivot_apply", label: pivot._applyLocale("apply"), width: config.applyButtonWidth }]
	            },
	            body: {
	                type: "space",
	                rows: [
	                /*{
	                 type: "space",
	                 cols:[
	                 {	css:"webix_pivot_transparent", borderless: true, template: "<div class='webix_pivot_fields_msg'>"+webix.i18n.pivot.windowMessage||""+"</div>", height: 25}
	                 ]
	                  },*/
	                {
	
	                    type: "wide",
	                    cols: [{
	                        width: config.fieldsColumnWidth,
	                        rows: [{ id: "fieldsHeader", css: "webix_pivot_header_fields", template: "<div class='webix_pivot_fields_msg'>" + webix.i18n.pivot.windowMessage || "" + "</div>", height: 40 }, { id: "fields", view: "list", type: { height: "auto" }, drag: true, template: "<span class='webix_pivot_list_marker'></span>#text#",
	                            on: {
	                                onBeforeDrop: webix.bind(this._skipValueDrag, this),
	                                onBeforeDropOut: webix.bind(this._checkValueDrag, this),
	
	                                onBeforeDrag: webix.bind(this._hidePopups, this)
	                            }
	                        }]
	                    },
	                    //	{ view: "resizer", width: 4},
	                    {
	
	                        type: "wide",
	                        rows: [{
	                            rows: [{ id: "filtersHeader", data: { value: "filters", icon: "filter" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "filters", view: "list", scroll: true, gravity: 2, drag: true, css: "webix_pivot_values",
	                                template: function template(obj) {
	                                    obj.type = obj.type || "select";
	                                    return "<div class='webix_pivot_link'>" + obj.text + "<div class='webix_link_selection filter'>" + pivot._applyLocale(obj.type) + "</div></div> ";
	                                },
	                                type: {
	                                    height: 35
	                                },
	                                onClick: { "webix_link_selection": webix.bind(this._filterSelector, this) },
	                                on: {
	                                    onBeforeDrag: webix.bind(this._hidePopups, this)
	                                }
	
	                            }]
	                        }, {
	                            rows: [{ id: "valuesHeader", data: { value: "values", icon: "bar-chart" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "values", view: "list", scroll: true, gravity: 3, drag: true, css: "webix_pivot_values", type: { height: "auto" },
	                                template: webix.bind(this._function_template, this),
	                                onClick: {
	                                    "webix_link_title": webix.bind(this._function_selector, this),
	                                    "webix_link_selection": webix.bind(this._function_selector, this),
	                                    "webix_color_selection": webix.bind(this._function_color, this),
	                                    "webix_pivot_minus": webix.bind(this._function_remove, this)
	                                },
	                                on: {
	                                    onBeforeDrop: webix.bind(this._copyValueField, this),
	                                    onBeforeDropOut: webix.bind(this._checkValueDrag, this),
	                                    onBeforeDrag: webix.bind(this._hidePopups, this)
	                                }
	                            }]
	                        }, {
	                            rows: [{ id: "groupHeader", data: { value: "groupBy", icon: "sitemap" }, template: this._popup_templates.popupIconHeaders, css: "webix_pivot_popup_title", height: 40 }, { id: "groupBy", view: "list", yCount: 1, scroll: false, drag: true, type: { height: 35 },
	                                template: "<a class='webix_pivot_link'>#text#</a> ",
	                                on: {
	                                    onBeforeDrop: webix.bind(this._changeGroupby, this),
	                                    onBeforeDrag: webix.bind(this._hidePopups, this)
	                                }
	                            }]
	                        }]
	                    }]
	                }, {
	                    /*paddingX: 10,
	                     paddingY: 5,*/
	                    borderless: true,
	                    css: "webix_pivot_footer",
	                    /*padding: 5,
	                     type: "space",*/
	                    cols: [{
	                        view: "checkbox", id: "logScale", value: pivot.config.chart.scale && pivot.config.chart.scale == "logarithmic", label: webix.i18n.pivot.logScale,
	                        labelWidth: config.logScaleLabelWidth, width: config.logScaleLabelWidth + 20
	                    }, {}, {
	                        view: "select", id: "chartType", value: pivot.config.chartType, label: webix.i18n.pivot.chartType, options: chartTypes,
	                        labelWidth: config.chartTypeLabelWidth, width: config.chartTypeWidth
	                    }]
	                }]
	
	            }
	        };
	    },
	    _popup_templates: {
	        popupHeaders: function popupHeaders(obj) {
	            return webix.i18n.pivot[obj.value];
	        },
	        popupIconHeaders: function popupIconHeaders(obj) {
	            return "<span class='webix_pivot_header_icon webix_icon fa-" + obj.icon + "'></span>" + webix.i18n.pivot[obj.value];
	        }
	    },
	    _hidePopups: function _hidePopups() {
	        webix.callEvent("onClick", []);
	    },
	    _skipValueDrag: function _skipValueDrag(ctx) {
	        if (ctx.from == this.$$("values")) {
	            var id = ctx.source[0];
	            if (this.$$("values").getItem(id)) {
	                this.$$("values").remove(id);
	            }
	            return false;
	        }
	        return true;
	    },
	    _checkValueDrag: function _checkValueDrag(ctx) {
	        if (ctx.to != ctx.from) {
	            var id = ctx.source[0];
	            if (ctx.from == this.$$("values") && ctx.to != this.$$("fields")) {
	                delete this.$$("values").getItem(id).operation;
	                delete this.$$("values").getItem(id).color;
	                if (this.$$("fields").getItem(id)) this.$$("fields").remove(id);
	            } else if (ctx.from == this.$$("fields") && ctx.to != this.$$("values")) {
	                if (this.$$("values").getItem(id)) {
	                    this.$$("values").remove(id);
	                }
	            }
	        }
	    },
	    _copyValueField: function _copyValueField(ctx) {
	        if (ctx.to && ctx.from != ctx.to) {
	            var id = ctx.source;
	            var item = ctx.from.getItem(id);
	
	            if (ctx.from == this.$$("fields")) {
	                if (ctx.to.getItem(id)) {
	                    this._function_add({}, id);
	                    this._valueLength++;
	                } else {
	                    item = webix.copy(item);
	
	                    ctx.to.add(webix.copy(item), ctx.index);
	                    this._valueLength++;
	                }
	
	                return false;
	            } else if (!this.$$("fields").getItem(id)) {
	                this.$$("fields").add(webix.copy(item));
	            }
	
	            this._increaseColorIndex = true;
	        }
	        return true;
	    },
	    _changeGroupby: function _changeGroupby(ctx) {
	        if (this.$$("groupBy").data.order.length) {
	            var id = this.$$("groupBy").getFirstId();
	            var item = webix.copy(this.$$("groupBy").getItem(id));
	            this.$$("groupBy").remove(id);
	            this.$$("fields").add(item);
	        }
	        return true;
	    },
	    _afterInit: function _afterInit() {
	        this.attachEvent("onItemClick", function (id) {
	            if (this.$eventSource.name == "button") {
	                //transform button clicks to events
	                var structure = this.getStructure();
	
	                if (this.innerId(id) == "apply" && (!structure.values.length || !structure.groupBy)) {
	                    webix.alert(webix.i18n.pivot.valuesNotDefined);
	                } else {
	                    this.callEvent("on" + this.innerId(id), [structure]);
	                    this.hide();
	                }
	            }
	        });
	    },
	
	    _function_template: function _function_template(obj) {
	        obj.operation = obj.operation || ["sum"];
	        if (!webix.isArray(obj.operation)) obj.operation = [obj.operation];
	
	        var ops = [];
	        var pivot = webix.$$(this.config.pivot);
	        var locale = pivot._applyLocale;
	
	        for (var i = 0; i < obj.operation.length; i++) {
	            if (!obj.color) obj.color = [pivot._getColor(this._valueLength)];
	            if (!obj.color[i]) obj.color.push(pivot._getColor(this._valueLength));
	            var op = "<div class='webix_pivot_link' webix_operation='" + i + "'>";
	            op += "<div class='webix_color_selection'><div style='background-color:" + locale(obj.color[i]) + "'></div></div>";
	            op += "<div class='webix_link_title'>" + obj.text + "</div>";
	            op += "<div class='webix_link_selection'>" + locale(obj.operation[i]) + "</div>";
	
	            op += "<div class='webix_pivot_minus webix_icon fa-times'></div>";
	            op += "</div>";
	            ops.push(op);
	        }
	        if (this._increaseColorIndex) {
	            this._increaseColorIndex = false;
	            this._valueLength++;
	        }
	        return ops.join(" ");
	    },
	
	    _function_selector: function _function_selector(e, id) {
	        var func_selector = {
	            view: "webix_pivot_popup", autofit: true,
	            autoheight: true, width: 150,
	            data: this.config.operations || []
	        };
	        var p = webix.ui(func_selector);
	        p.show(e);
	        p.attachEvent("onHide", webix.bind(function () {
	            var index = webix.html.locate(e, "webix_operation");
	            var sel = p.getSelected();
	            if (sel !== null) {
	                this.$$("values").getItem(id).operation[index] = sel.name;
	                this.$$("values").updateItem(id);
	            }
	
	            p.close();
	        }, this));
	    },
	    _function_color: function _function_color(e, id) {
	
	        var colorboard = {
	            view: "colorboard",
	            //id: "colorboard",
	            borderless: true
	
	        };
	        if (webix.$$(this.config.pivot).config.colorboard) {
	            webix.extend(colorboard, webix.$$(this.config.pivot).config.colorboard);
	        } else {
	            webix.extend(colorboard, {
	                width: 150,
	                height: 150,
	                palette: webix.$$(this.config.pivot).config.palette
	            });
	        }
	
	        var p = webix.ui({
	            view: "popup",
	            id: "colorsPopup",
	            body: colorboard
	        });
	        p.show(e);
	        p.getBody().attachEvent("onSelect", function () {
	            p.hide();
	        });
	        p.attachEvent("onHide", webix.bind(function () {
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
	    _function_add: function _function_add(e, id) {
	        var item = this.$$("values").getItem(id);
	        item.operation.push("sum");
	        var pivot = webix.$$(this.config.pivot);
	        var palette = pivot.config.palette;
	        item.color.push(pivot._getColor(this._valueLength));
	        this.$$("values").updateItem(id);
	
	        webix.delay(function () {
	            var index = item.operation.length - 1;
	            var els = this.$$("values").getItemNode(id).childNodes;
	            var el = null;
	            for (var i = 0; i < els.length; i++) {
	                el = els[i];
	                if (!el.getAttribute) continue;
	                var op = el.getAttribute("webix_operation");
	                if (!webix.isUndefined(op) && op == index) break;
	            }
	            if (el !== null) this._function_selector(el, id);
	        }, this);
	    },
	    _function_remove: function _function_remove(e, id) {
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
	
	    _filterSelector: function _filterSelector(e, id) {
	        var locale = webix.$$(this.config.pivot)._applyLocale;
	        var selector = {
	            view: "webix_pivot_popup", autofit: true,
	            height: 150, width: 150,
	            data: [{ name: "datepicker", title: locale("date") }, { name: "multiselect", title: locale("multiselect") }, { name: "select", title: locale("select") }, { name: "text", title: locale("text") }]
	        };
	        var p = webix.ui(selector);
	        p.show(e);
	        p.attachEvent("onHide", webix.bind(function () {
	            var sel = p.getSelected();
	            if (sel !== null) {
	                var item = this.$$('filters').getItem(id);
	                item.type = sel.name;
	                this.$$('filters').updateItem(id);
	            }
	
	            p.close();
	        }, this));
	    },
	
	    data_setter: function data_setter(value) {
	        this.$$("fields").clearAll();
	        this.$$("fields").parse(value.fields);
	        this.$$("fields").filter(function (item) {
	            return item.name != "id";
	        });
	
	        this.$$("filters").clearAll();
	        this.$$("filters").parse(value.filters);
	
	        this.$$("groupBy").clearAll();
	        this.$$("groupBy").parse(value.groupBy);
	
	        this.$$("values").clearAll();
	        this.$$("values").parse(value.values);
	    },
	    getStructure: function getStructure() {
	        var structure = { groupBy: "", values: [], filters: [] };
	
	        var groupBy = this.$$("groupBy");
	        if (groupBy.count()) structure.groupBy = groupBy.getItem(groupBy.getFirstId()).name;
	
	        var values = this.$$("values");
	        var temp;
	        values.data.each(webix.bind(function (obj) {
	            for (var j = 0; j < obj.operation.length; j++) {
	                temp = webix.copy(obj);
	
	                webix.extend(temp, { operation: obj.operation[j], color: obj.color[j] || webix.$$(this.config.pivot).config.color }, true);
	
	                structure.values.push(temp);
	            }
	        }, this));
	
	        var filters = this.$$("filters");
	        filters.data.each(function (obj) {
	            structure.filters.push(obj);
	        });
	
	        return structure;
	    }
	}, webix.ui.window, webix.IdSpace);

/***/ }
/******/ ]);