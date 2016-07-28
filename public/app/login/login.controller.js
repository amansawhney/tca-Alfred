
var login = angular.module('login', []);
login.controller('LoginController', ['$scope', '$http', '$state','LoginService', function($scope, $http, $state, LoginService) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
        $scope.authError = null;
        LoginService.doLogin($scope.user, $scope);
    };
}])
;