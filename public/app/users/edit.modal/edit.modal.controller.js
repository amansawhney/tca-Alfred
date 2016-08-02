

(function() {
    'use strict';

    angular
        .module('users')
        .controller('EditUsersModalController', EditUsersModalController);

    function EditUsersModalController($http, $scope, UsersService, $uibModalInstance, user){

        var vm = this;
        vm.showError = false;

        $scope.user = user;

        $scope.updateUser = function(user){
            $scope.isDisabled = true;
            UsersService.updateUser(user, function(err){
                $uibModalInstance.close();
            });
        }
    }

})()
