var records = angular.module('records', ['toastr']);

var config = {
    dataSource: records,
    dataHeadersLocation: 'columns',
    theme: 'blue',
    toolbar: {
        visible: true
    },
    grandTotal: {
        rowsvisible: true,
        columnsvisible: true
    },
    subTotal: {
        visible: true,
        collapsed: true
    },
    fields: [
        { name: '0', caption: 'Date' },
        { name: '1', caption: 'Client' },
        { name: '2', caption: 'Trader' },
        { name: '3', caption: 'Exch'},
        { name: '4', caption: 'Algo' },
        { name: '5', caption: 'Instrument'},
        { name: '6', caption: 'FCM' },
        { name: '7', caption: 'Size' },
        { name: '8', caption: 'Filled'},
        { name: '9', caption: 'Duration' },
        { name: '10', caption: '%Volume', dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '11', caption: '%iVolume', dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '12', caption: '%Passive' , dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '13', caption: '%Cleanup', dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '14', caption: 'AP' , dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '15', caption: 'STF', dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        } },
        { name: '16', caption: 'IVWAP', dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '17', caption: 'VWAP' , dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        { name: '18', caption: 'TWAP', dataSettings: {
            aggregateFunc: 'avg',
            formatFunc: function(value) {
                return parseFloat(value);
            }
        }},
        /*{
         name: '19',
         caption: 'Amount',
         dataSettings: {
         aggregateFunc: 'avg',
         formatFunc: function(value) {
         return Number(value).toFixed(0);
         }
         }
         }*/
    ],
    //rows    : [ 'client', 'trader', 'exch' ],
    rows    : [ 'client', 'trader' ],
    //columns : [ 'algo', 'instrument', 'fcm', 'size' ],
    columns : [ 'algo' ],
    data    : [ 'volume', 'ivolume', 'passive', 'cleanup', 'ap', 'stf', 'ivwap', 'vwap', 'twap' ],
    /*preFilters : {
     'Manufacturer': { 'Matches': /n/ },
     'Amount'      : { '>':  40 }
     },*/
    width: 1500,
    height: 645
};



function RecordsController($scope,   $filter,   $http,   editableOptions,   editableThemes ,  RecordsService,   LoginService,   $uibModal, toastr){

    LoginService.ensureLogin();

    $scope.getRecords = function(){
        RecordsService.getRecords({}, function(err, data){
            console.log("RecordsService.getRecords")

            if(err){
                console.log(err);
            }
            else{
                $scope.records = data;
                // instantiate and show the pivot grid
                config.dataSource = data;
                $scope.total_records = "Total : " + data.length + " Records";

                //console.log(data[999]);
                new orb.pgridwidget(config).render(document.getElementById('pgrid'));
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
    $scope.getRecords();
    $scope.getStatics();

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';


    //var checkin = $('#beginDateDiv').datepicker({
    //    format: 'mm/dd/yyyy',
    //    onRender : function(date) {
    //        return date.valueOf() < now1.valueOf() ? 'disabled' : '';
    //    }
    //}).on('changeDate', function(ev) {
    //    // if (ev.date.valueOf() > date.valueOf()) {
    //    var newDate = new Date(ev.date);
    //    newDate.setDate(newDate.getDate() + 1);
    //    checkout.setValue(newDate);
    //    // }
    //    checkin.hide();
    //    // setTimeout(function(){
    //    $('#endDateDiv').focus();
    //    // }, 1000);
    //
    //}).data('datepicker');
    //var checkout = $('#endDateDiv').datepicker({
    //    format: 'mm/dd/yyyy',
    //    onRender : function(date) {
    //        return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
    //    }
    //}).on('changeDate', function(ev) {
    //    checkout.hide();
    //}).data('datepicker');
    //$('.footable').footable();
    //$('.footable').trigger('footable_redraw');



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

        return mode === 'day' && (date > $scope.endDate);
    }
    function disabledEnd(data) {
        var date = data.date,
            mode = data.mode;
        if (!$scope.startDate)
        {
            return false;
        }
        return mode === 'day' && (date < $scope.startDate);
    }

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };


    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

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
            console.log("RecordsService.getRecords")

            if(err){
                console.log(err);
            }
            else{
                $scope.records = data;
                // instantiate and show the pivot grid
                config.dataSource = data;
                //console.log(data.length);
                $scope.total_records = "Total : " + data.length + " Records";
                $("#pgrid").empty();
                var pgridw = new orb.pgridwidget(config);
                pgridw.render(document.getElementById('pgrid'));
                pgridw.refreshData(data);
                //new orb.pgridwidget(config).render(document.getElementById('pgrid'));
            }
        });
    };
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
