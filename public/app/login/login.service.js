

angular.module('login')
    .factory('LoginService', [
                  '$http','$state','$window',
        function ( $http , $state , $window) {

            return {
                /**
                 * Login user to API
                 *
                 * @user - {Object}
                 * */
                doLogin: function (user, $scope) {

                    $http({
                        method: 'POST',
                        url: '/api/admin/login',
                        data: {
                            email: user.email,
                            password: user.password
                        }
                    })
                        .then(function(data) {
                            //console.log("doLogin");
                            //console.log(user);
                            //console.log("*****");
                            //console.log(data);
                            //console.log("*****Done");
                            if(data.data.api_token) {//data.api_token &&// && data.data.user.userType == "admin"
                                $window.sessionStorage.setItem("api_token", data.data.api_token);
                                $window.sessionStorage.setItem("userType", data.data.user.userType);
                                $window.sessionStorage.setItem("lastName", data.data.user.lastName);
                                $window.sessionStorage.setItem("firstName", data.data.user.firstName);
                                $window.sessionStorage.setItem("username", data.data.user.username);

                                $scope.$root.userType = $window.sessionStorage.getItem("userType");
                                var userDisplayName = $window.sessionStorage.getItem("username");
                                if($window.sessionStorage.getItem("firstName") && $window.sessionStorage.getItem("lastName") && ($window.sessionStorage.getItem("firstName") != "" || $window.sessionStorage.getItem("lastName") != ""))
                                {
                                    userDisplayName = $window.sessionStorage.getItem("firstName") + " " + $window.sessionStorage.getItem("lastName");
                                }

                                $window.sessionStorage.setItem("displayName", userDisplayName);
                                $scope.$root.userDisplayName = $window.sessionStorage.getItem("displayName");
                                if($scope.$root.userType == "admin")
                                {
                                    $state.go('admin.users');
                                }
                                else {
                                    $state.go('admin.records');
                                }
                            }
                            else{
                                $scope.authError = 'Login Failed';
                            }
                        }, function(x) {
                            if(x.data.status && x.data.status == "401")
                                $scope.authError = x.data.reason;
                            else
                                $scope.authError = 'Server Error';
                        });
                },

                /**
                 * Logout current user
                 * */
                doLogout: function () {
                    $window.sessionStorage.removeItem('api_token');
                    $state.go('login');
                },

                /**
                 * @return user {Object}
                 * */
                ensureLogin: function(){
                    if(!$window.sessionStorage.getItem('api_token')){
                        $state.go('login');
                    }
                },

                getUser: function () {
                    return $window.sessionStorage.getItem('api_token');
                }
            }
        }
    ]);