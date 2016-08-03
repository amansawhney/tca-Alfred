'use strict';

/* App Module */

var admin = angular.module('admin', ['ui.router', 'login', 'records', 'users', 'xeditable','ngAnimate', 'ui.bootstrap', 'angular-confirm', 'xeditable']);
admin.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
admin.config(['$stateProvider', '$urlRouterProvider', 'toastrConfig',
    function($stateProvider, $urlRouterProvider, toastrConfig) {
        angular.extend(toastrConfig, {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        });
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "app/login/login.html",
                controller: 'LoginController'
            })
            .state('admin', {
                abstract: true,
                url: '/admin',
                templateUrl: "app/admin/admin.html",
            })
            .state('admin.records', {
                url: '/records',
                templateUrl: "app/records/records.html",
                controller: 'RecordsController'
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: "app/users/users.html",
                controller: 'UsersController'
            })

        $urlRouterProvider.otherwise('/login');
    }
]);
