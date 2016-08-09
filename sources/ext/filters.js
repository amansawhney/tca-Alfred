webix.ui.datafilter.pivotSumColumn = webix.extend({
    refresh:function(master, node, value){
        var result = 0;
        master.mapCells(null, value.columnId, null, 1, function(value, id){
            if (!isNaN(value) && master.getItem(id).$level == 1)
                result+=value*1;
            return value;
        });

        if (value.format)
            result = value.format(result);
        if (value.template)
            result = value.template({value:result});

        node.firstChild.innerHTML = result;
    }
}, webix.ui.datafilter.summColumn);