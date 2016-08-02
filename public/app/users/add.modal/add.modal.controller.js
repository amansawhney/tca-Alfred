

(function() {
    'use strict';

    angular
        .module('users')
        .controller('AddUsersModalController', AddUsersModalController);

    function AddUsersModalController($http, $scope, UsersService, $uibModalInstance){

        var vm = this;
        vm.showError = false;

        $scope.user = {};

        $scope.addUser = function(user){
            $scope.isDisabled = true;
            UsersService.addUser(user, function(err){
                $uibModalInstance.close();
            });
        }

    }

})()
