  webix.ui({
      view: "pivot",
      container: "pgrid",
      height: 600,
      id: "pivot",
      footer: true,
      totalColumn: true,
      max: true,
      structure: {
          rows: ["client", "exch"],
          columns: ["instrument"],
          values: [{
              name: "size",
              operation: "sum"
          }, {
              name: "duration",
              operation: "sum"
          }],
          filters: [
            {name: "client", type:"select" }
          ]
  }
  });
