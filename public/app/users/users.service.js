
angular.module('users')
    .factory('UsersService', function ($http,  $state,  $window,   toastr){
        return {

            getUsers: function (query, callback){
                $http({
                    method: 'get',
                    url: '/api/users',
                    params: query,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    }
                })
                    .then(function(data) {
                        var response = data.data
                        //toastr.error(response);
                        if ( response.users) {
                            callback(false, response.users);
                         }else{
                            $state.go('app.dashboard');
                         }
                    }, function(x) {
                        callback(x);
                        toastr.error('Server Error');
                });

            },

            updateUser: function(user){
                var url = '/api/v1/users/' + user._id;
                var data = user;

                $http({
                    method: 'patch',
                    url: url,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    },
                    data:data
                })
                    .then(function(data) {
                        //alert(JSON.stringify(data.data));
                        if ( data.data.success ) {
                            toastr.success('User updated');
                        }else{
                            $state.go('app.dashboard');
                        }
                    }, function(x) {
                        toastr.error('Server Error');
                    }
                );
            },

            removeUser: function(id){
                var url = '/api/v1/users/' + id;

                return $http({
                    method: 'delete',
                    url: url,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    }
                });
            }
        }
    }
);