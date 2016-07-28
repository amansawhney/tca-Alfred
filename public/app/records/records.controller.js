var locations = angular.module('locations', ['toastr']);
function LocationsController($scope,   $filter,   $http,   editableOptions,   editableThemes ,  LocationsService,   LoginService,   $modal, toastr){

    LoginService.ensureLogin();

    $scope.getLocations = function(){
        LocationsService.getLocations({}, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                $scope.locations = data;
            }
        });
    }

    $scope.changeStatus = function(location, status) {
        LocationsService.updateLocation({_id: location._id, active: status}, function(err){
            if(err) toastr.error('Server Error');
            $scope.getLocations();
        });
    }
    $scope.getLocations();

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';


    $('.footable').footable();
    $('.footable').trigger('footable_redraw');
}


locations.controller('LocationsController', LocationsController);

locations.directive('footableDirective', function(){
    return function(scope, element){
        var footableTable = element.parents('table');


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
