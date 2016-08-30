var records = angular.module('records', ['toastr']);


function forEachIntersection(datafield, intersection, datasource, callback) {
    var all = intersection === 'all';
    intersection = all ? datasource : intersection;
    if (intersection.length > 0) {
        for (var i = 0; i < intersection.length; i++) {
            //console.log(intersection[i][datafield]);
            callback((all ? intersection[i] : datasource[intersection[i]])[datafield], (all ? intersection[i] : datasource[intersection[i]])["filled"]);
        }
    }
}
function RecordsController($scope,   $filter,   $http,   editableOptions,   editableThemes ,  RecordsService,   LoginService,   $uibModal, toastr){

    LoginService.ensureLogin();
    $scope.$root.recordButtonStyle = {'text-decoration': 'underline'};
    $scope.$root.userButtonStyle = {};

    $scope.getRecords = function(){
        RecordsService.getRecords({}, function(err, data){
            console.log("RecordsService.getRecords")

            if(err){
                console.log(err);
            }
            else{
                $scope.records = data;
                // instantiate and show the pivot grid
                //config.dataSource = data;
                $scope.total_records = "Total : " + data.length + " Records";

                //console.log(data[999])
                $$("pivot").data.clearAll();
                $$("pivot").parse(data);
            }
        });
    }

    $scope.getStatics = function(){
        RecordsService.getStatics({}, function(err, data){
            console.log("RecordsService.getStatics")

            if(err){
                console.log(err);
            }
            else{
                refreshControlls(data);
            }
        });
    }

    $scope.changeStatus = function(record, status) {
        RecordsService.updateRecord({_id: record._id, active: status}, function(err){
            if(err) toastr.error('Server Error');
            $scope.getRecords();
        });
    }
    //$scope.getStatics();

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';





    $scope.dateOptionsStart = {
        dateDisabled: disabledStart,
        formatYear: 'yy',
        //maxDate: new Date(2020, 5, 22),
        //minDate: new Date(),
        startingDay: 1
    };
    $scope.dateOptionsEnd = {
        dateDisabled: disabledEnd,
        formatYear: 'yy',
        //maxDate: new Date(2020, 5, 22),
        //minDate: new Date(),
        startingDay: 1
    };
    //// Disable weekend selection
    function disabledStart(data) {
        var date = data.date,
            mode = data.mode;
        if (!$scope.endDate)
        {
            return false;
        }

        return mode === 'day' && (date >= $scope.endDate);
    }
    function disabledEnd(data) {
        var date = data.date,
            mode = data.mode;
        if (!$scope.startDate)
        {
            return false;
        }
        return mode === 'day' && (date <= $scope.startDate);
    }

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.openInstruction = function() {
        $('.webix_pivot_config_msg').attr("data-intro", "Click to configure Fields for Row, Column and Value").attr("data-position", "bottom");
        $('.webix_layout_toolbar').attr("data-intro", "Choose filters for client, trader, algo, exch, instrument and fcm.").attr("data-position", "bottom");
        $('.webix_ss_center .webix_first').attr("data-intro", "Double click any cell for a detailed view").attr("data-position", "right");

        //webix_layout_toolbar
        $('body').chardinJs('start');
    };

    $scope.dateRangeOptionChange = function() {
        console.log($scope.dateRangeOption);

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth(); //January is 0!
        var yyyy = today.getFullYear();
        //var hours = today.getHours();
        //console.log(hours);
        $scope.endDate = new Date();
        if($scope.dateRangeOption == "lastday")
        {
            today.setDate(dd - 1);
        }
        else if($scope.dateRangeOption == "lastweek")
        {
            today.setDate(dd - 7);
        }
        else if($scope.dateRangeOption == "lastmonth")
        {
            today.setMonth(mm - 1);
        }
        else if($scope.dateRangeOption == "lastquarter")
        {
            today.setMonth(mm - 3);
        }
        else if($scope.dateRangeOption == "lastyear")
        {
            today.setYear(yyyy - 1);
        }
        $scope.startDate = today;
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = $scope.formats[0];//['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.filterPivotTable = function() {

        console.log("filterPivotTable");

        var params = {"filter":"filter", "currDate": $scope.currDate, "startDate": $scope.startDate, "endDate": $scope.endDate, "minSize": $scope.minSize, "maxSize": $scope.maxSize,
            "client": $scope.client, "fcm": $scope.fcm,  "trader": $scope.trader, "algo": $scope.algo, "exchange": $scope.exchange, "instrument": $scope.instrument};

        RecordsService.getRecords(params, function(err, data){
            console.log("RecordsService.getRecords");

            if(err){
                console.log(err);
            }
            else{
                $scope.records = data;
                // instantiate and show the pivot grid
                //config.dataSource = data;
                //console.log(data.length);
                $scope.total_records = "Total : " + data.length + " Records";
                $$("pivot").data.clearAll();
                $$("pivot").parse(data);
                //new orb.pgridwidget(config).render(document.getElementById('pgrid'));
            }
        });
    };

    $scope.expandAll = function()
    {
        $$("pivot").$$("data").openAll();
    };

    $scope.collapseAll = function()
    {
        $$("pivot").$$("data").closeAll();
    };


    $scope.items = [];
    $scope.fields_arr = ["date", "client", "trader", "exch", "algo", "instrument", "fcm", "size", "filled", "duration", "volume", "ivolume", "passive", "cleanup", "ap", "stf", "ivwap", "vwap", "twap"];
    $scope.modalTitle = "Modal";

    if(!$scope.isPivotSetup)
    {
        //if($$("pivot"))
        //{
        //    $$("pivot").removeView();
        //}
        $scope.isPivotSetup = true;
        setupPivotTable($scope);
        $scope.getRecords();


        grida.onDoubleClicked = function(data, field_values) {
            console.log("Grida On Double Clicked");
            $scope.modalTitle = field_values.join(' / ');
            $scope.items = data;
            $scope.open();
        };
    }



    $scope.open = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: "xlg",
            resolve: {
                items: function () {
                    return $scope.items;
                },
                modalTitle: function () {
                    return $scope.modalTitle;
                },
                fields_arr: function () {
                    return $scope.fields_arr;
                }
            }
        });

        //modalInstance.result.then(function (selectedItem) {
        //    $scope.selected = selectedItem;
        //}, function () {
        //    $log.info('Modal dismissed at: ' + new Date());
        //});
    };

}


function setupPivotTable($scope)
{


    var pivoHeight = $(window).innerHeight() - 410;
    if (pivoHeight < 300)
    {
        pivoHeight = 300;
    }
    //grida.define("height", pivoHeight);
    //grida.height = pivoHeight;
    //grida.adjust();
    grida = webix.ui({
      container: "pgrid",
        view: "pivot",
        height: pivoHeight,
        //autoheight:false,
        id: "pivot",
        footer: "wavg",
        totalColumn: true,
        max: true,
        columnWidth: 100,
        fieldMap: { client:"Client", trader:"Trader", exch:"Exchange", algo:"Algo", instrument:"Instrument", fcm: "FCM", size:"Size", filled:"Filled", duration:"Duration", volume:"Volume",
            ivolume:"iVolume", passive:"Passive", cleanup:"CleanUp", "ap" : "AP", stf:"STF", ivwap:"IVWAP",vwap:"VWAP", twap:"TWAP"},
        structure: {
            rows: ["client", "algo"],
            columns: ["trader"],
            values: [{
                name: "twap",
                operation: "wavg", format:webix.i18n.numberFormat
                },
                {name: "size",
                    operation: "avg", format:webix.i18n.numberFormat
                }
            ],
            fields_all: ["client", "trader", "exch", "algo", "instrument", "fcm", "size", "filled", "duration", "volume", "ivolume", "passive", "cleanup", "ap", "stf", "ivwap", "vwap", "twap"],
            rows_all: ["client", "trader", "exch", "algo", "instrument", "fcm"],
            columns_all: ["client", "trader", "exch", "algo", "instrument", "fcm"],
            values_all: ["size", "filled", "duration", "volume", "ivolume", "passive", "cleanup", "ap", "stf", "ivwap", "vwap", "twap"],
            filters: [{
                name: "client",
                type: "multiselect"
            }, {
                name: "trader",
                type: "multiselect"
            }, {
                name: "algo",
                type: "multiselect"
            }, {
                name: "exch",
                type: "multiselect"
            }, {
                name: "instrument",
                type: "multiselect"
            }, {
                name: "fcm",
                type: "multiselect"
            }]
        }
    });


    grida.operations.wavg = function(args, args2, args3, args4) {
        var sum = 0;
        var filledSum = 0;
        for (var i = 0; i < args.length; i++) {
            var arg = window.parseFloat(args[i], 10);
            var filled = NaN;
            if(args3['filled_' + args4] && i < args3['filled_' + args4].length)
            {
                filled = args3['filled_' + args4][i];
            }
            else
            {
                //return "Hello";
                filled = 0;
            }

            if (!window.isNaN(arg) && !window.isNaN(filled))
            {
                sum += arg * filled;
                filledSum += filled;
            }
        }
        if(filledSum > 0)
        {
            num = sum / filledSum
            return (Math.round(num * 1000) / 100) /10
        }
        if(sum > 0)
        {
            return (Math.round(sum * 1000) / 100) /10
        }
        return "";
    };



    grida.operations.avg = function(args, args2, args3, args4) {
        var sum = 0;
        var filledSum = 0;
        for (var i = 0; i < args.length; i++) {
            var arg = window.parseFloat(args[i], 10);

            if (!window.isNaN(arg))
            {
                sum += arg;
                filledSum = filledSum + 1;
            }
        }
        if(filledSum > 0)
        {
            return sum / filledSum;
        }
        if(sum > 0)
        {
            return sum;
        }
        return "";
    };
    webix.i18n.decimalSize = 3;
    webix.i18n.setLocale();

    webix.event(window, "resize", function() {
        console.log("resize");
        var pivoHeight = $(window).innerHeight() - 410;
        if (pivoHeight > grida.rows.length * 10) {
            pivoHeight = grida.rows.length * 10;
        }
        if (pivoHeight < 300)
        {
            pivoHeight = 300;
        }
        grida.define("height", pivoHeight);
        //grida.height = pivoHeight;
        grida.adjust();
    });

}


function refreshControlls(stats)
{
    refreshComponents(stats.clients, "#client");
    refreshComponents(stats.fcms, "#fcm");
    refreshComponents(stats.traders, "#trader");
    refreshComponents(stats.exchs, "#exchange");
    refreshComponents(stats.instruments, "#instrument");
    refreshComponents(stats.algos, "#algo");
    refreshComponents(stats.dates, "#currDate");
}

function refreshComponents(arrData, component)
{
    //console.log("refreshComponents: " + component);
    var arrayLength = arrData.length;
    var allHTML = "<option value='all'>ALL</option>";
    for (var i = 0; i < arrayLength; i++) {
        allHTML += "<option value='"+arrData[i]+"'>"+arrData[i]+"</option>";
    }
    //console.log(allHTML);
    $(component).html(allHTML);
}
records.controller('RecordsController', RecordsController);

records.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, fields_arr, modalTitle) {

    $scope.items = items;
    $scope.fields_arr = fields_arr;
    $scope.modalTitle = modalTitle;

    $scope.ok = function () {
        $uibModalInstance.close();
    };
});
records.directive('footableDirective', function(){
    return function(scope, element){
        var footableTable = element.parents('table');
        //console.log("records.directive")

        if( !scope.$last ) {
            return false;
        }

        scope.$evalAsync(function(){

            if (! footableTable.hasClass('footable-loaded')) {
                footableTable.footable();
            }

            footableTable.trigger('footable_initialized');
            footableTable.trigger('footable_resize');
            footableTable.data('footable').redraw();

        });
    };
});
