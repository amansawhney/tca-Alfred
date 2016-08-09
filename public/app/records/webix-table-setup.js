  //webix.ui({
  //    view: "pivot",
  //    container: "pgrid",
  //    height: 600,
  //    id: "pivot",
  //    footer: true,
  //    totalColumn: true,
  //    max: true,
  //    structure: {
  //        rows: ["client", "exch"],
  //        columns: ["instrument"],
  //        values: [{
  //            name: "size",
  //            operation: "sum"
  //        }, {
  //            name: "duration",
  //            operation: "sum"
  //        }],
  //        filters: [
  //          {name: "client", type:"select" }
  //        ]
  //}
  //});


  //function setupPivotTable()
  //{
  //    grida = webix.ui({
  //        view: "pivot",
  //        container: "pgrid",
  //        height: 600,
  //        id: "pivot",
  //        footer: true,
  //        totalColumn: true,
  //        max: true,
  //        structure: {
  //            rows: ["client", "exch"],
  //            columns: ["algo"],
  //            values: [{
  //                name: "size",
  //                operation: "sum"
  //            }, {
  //                name: "duration",
  //                operation: "sum"
  //            }],
  //            filters: [{
  //                name: "client",
  //                type: "multiselect"
  //            }, {
  //                name: "trader",
  //                type: "multiselect"
  //            }, {
  //                name: "algo",
  //                type: "multiselect"
  //            }, {
  //                name: "exch",
  //                type: "multiselect"
  //            }, {
  //                name: "instrument",
  //                type: "multiselect"
  //            }, {
  //                name: "fcm",
  //                type: "multiselect"
  //            }]
  //        }
  //    });
  //
  //
  //    grida.operations.abssum = function(args) {
  //        var sum = 0;
  //        for (var i = 0; i < args.length; i++) {
  //            var arg = window.parseFloat(args[i], 10);
  //            if (!window.isNaN(arg))
  //                sum += Math.abs(arg);
  //        }
  //        return sum;
  //    };
  //}
  //
  //
  //setupPivotTable();