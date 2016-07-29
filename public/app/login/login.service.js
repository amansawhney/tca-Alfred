

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
                            if(data.data.api_token && data.data.user.userType == "admin") {//data.api_token &&
                                $window.sessionStorage.setItem("api_token", data.data.api_token);
                                $state.go('admin.records');
                            }
                            else{
                                $scope.authError = 'You are not admin user';
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