

(function() {
    'use strict';

    angular
        .module('users')
        .controller('AddUsersModalController', AddUsersModalController);

    function AddUsersModalController($http, $scope, UsersService, $uibModalInstance){

        var vm = this;
        vm.showError = false;
        //$scope.options = [{
        //    name: 'Client',
        //    value: 'client'
        //}, {
        //    name: 'Trader',
        //    value: 'trader'
        //}];
        //$scope.userTypes = {"Client", "Trader"};

        $scope.user = {};

        $scope.addUser = function(user){

            $scope.isDisabled = true;
            UsersService.addUser(user, function(err){
                $uibModalInstance.close();
            });
        }

    }

})()
