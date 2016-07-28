

(function() {
    'use strict';

    angular
        .module('users')
        .controller('AddUsersModalController', AddUsersModalController);

    function AddUsersModalController($http, $scope,  MenuitemsService, $modalInstance){

        var vm = this;
        vm.showError = false;

        $scope.menuitem = {};
    }

})()
