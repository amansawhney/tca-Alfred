function numHelper(fvalue, value, func) {
    if(typeof fvalue == "object"){
        for(var i=0; i < fvalue.length; i++){
            fvalue[i] = window.parseFloat(fvalue[i]);
            if (window.isNaN(fvalue[i])) return true;
        }
    }
    else{
        fvalue = window.parseFloat(fvalue);
        // if filter value is not a number then ignore such filter
        if (window.isNaN(fvalue)) return true;
    }
    // if row value is not a number then don't show this row
    if (window.isNaN(value)) return false;
    return func(fvalue, value);
}

export const rules = {
    contains: function(fvalue, value) {
        return value.indexOf(fvalue.toString().toLowerCase()) >= 0;
    },
    equal: function(fvalue, value) {
        return numHelper(fvalue, value, function(fvalue, value) {
            return (fvalue == value);
        });
    },
    not_equal: function(fvalue, value) {
        return numHelper(fvalue, value, function(fvalue, value) {
            return (fvalue != value);
        });
    },
    less: function(fvalue, value) {
        return numHelper(fvalue, value, function(fvalue, value) {
            return (value < fvalue);
        });
    },
    less_equal: function(fvalue, value) {
        return numHelper(fvalue, value, function(fvalue, value) {
            return (value <= fvalue);
        });
    },
    more: function(fvalue, value) {
        return numHelper(fvalue, value, function(fvalue, value) {
            return (value > fvalue);
        });
    },
    more_equal: function(fvalue, value) {
        return numHelper(fvalue, value, function(fvalue, value) {
            return (value >= fvalue);
        });
    },
    multi: function(fvalues, value){
        var result = false;
        fvalues = fvalues.split(",");
        for(var i=0; i < fvalues.length; i++){
            result = result|| (value.indexOf(fvalues[i].toString().toLowerCase()) >= 0);
        }
        return result;
    },
    range: function(fvalue, value){
        return numHelper(fvalue, value, function(fvalue, value) {
            return (value < fvalue[1] && value >= fvalue[0]);
        });
    },
    range_inc: function(fvalue, value){
        return numHelper(fvalue, value, function(fvalue, value) {
            return (value <= fvalue[1] && value >= fvalue[0]);
        });
    }
};

export function init(filters){
    for (var i = 0; i < filters.length; i++) {
        var f = filters[i];

        var fvalue = (f.value || "");
        if(webix.isDate(fvalue)){
            fvalue = webix.i18n.parseFormatStr(fvalue);
        }
        else if(typeof fvalue == "string"){
            if(fvalue.trim)
                fvalue = fvalue.trim();
        }

        if (fvalue.substr(0,1) == "=") {
            f.func = rules.equal;
            fvalue = fvalue.substr(1);
        } else if (fvalue.substr(0,2) == "<>") {
            f.func = rules.not_equal;
            fvalue = fvalue.substr(2);
        } else if (fvalue.substr(0,2) == ">=") {
            f.func = rules.more_equal;
            fvalue = fvalue.substr(2);
        } else if (fvalue.substr(0,1) == ">") {
            f.func = rules.more;
            fvalue = fvalue.substr(1);
        } else if (fvalue.substr(0,2) == "<=") {
            f.func = rules.less_equal;
            fvalue = fvalue.substr(2);
        } else if (fvalue.substr(0,1) == "<") {
            f.func = rules.less;
            fvalue = fvalue.substr(1);
        }else if (fvalue.indexOf("...") > 0) {
            f.func = rules.range;
            fvalue = fvalue.split("...");
        }else if (fvalue.indexOf("..") > 0) {
            f.func = rules.range_inc;
            fvalue = fvalue.split("..");
        } else if(f.type == "multiselect"){
            f.func = rules.multi;
        } else if(f.type == "datepicker"){
            f.func = function(fvalue, value) {
                return fvalue == value;
            };
        }else
            f.func = rules.contains;

        f.fvalue = fvalue;
    }
}

export function filterItem(filters, item){
    for (var i = 0; i < filters.length; i++) {
        var f = filters[i];
        if (f.fvalue){
            if (webix.isUndefined(item[f.name]))
                return false;

            var value = item[f.name].toString().toLowerCase();
            var result = f.func(f.fvalue, value);

            if (!result)
                return false;
        }
    }
    return true;
}