var users = angular.module('users', ['toastr']);

function UsersController($scope, $filter, $http, editableOptions, editableThemes ,UsersService, LoginService, $modal, toastr){

    LoginService.ensureLogin();

    $scope.getUsers = function(){
        UsersService.getUsers({}, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                $scope.users = data;
            }
        });
    }

    $scope.showAddModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'app/users/add.modal/add.modal.html',
            controller: 'AddUsersModalController',
            controllerAs: 'addModalCtrl',
            size:'md'
        });
        modalInstance.result.then(function () {
            $scope.getUsers();
        }, function () {
            $scope.getUsers();
        });
    }

    $scope.showUpdateModal = function(user) {
        var modalInstance = $modal.open({
            templateUrl: 'app/users/edit.modal/edit.modal.html',
            controller: 'EditUsersModalController',
            controllerAs: 'editModalCtrl',
            resolve: {
                user: function() {
                    return user;
                }
            },
            size:'md'
        });
        modalInstance.result.then(function () {
            $scope.getUsers();
        }, function () {
            $scope.getUsers();
        });
    }

    $scope.removeUser = function(id){
        UsersService.removeUser(id).then(function(data) {
            if ( data.data.success ) {
                toastr.success('User #:' + id + ' Removed', '');
            }
            $scope.getUsers();
        }, function(x) {
            toastr.error('Server Error');
        })
    }

    $scope.getUsers();

    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';


    $('.footable').footable();
    $('.footable').trigger('footable_redraw');
}


users.controller('UsersController', UsersController);

users.directive('footableDirective', function(){
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
