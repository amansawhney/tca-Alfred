
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
                            //$state.go('app.dashboard');
                         }
                    }, function(x) {
                        callback(x);
                        toastr.error('Server Error');
                });

            },

            addUser: function(user, callback){
                var url = '/api/users';
                var data = user;

                $http({
                    method: 'post',
                    url: url,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    },
                    data:data
                })
                    .then(function(data) {
                            //alert(JSON.stringify(data.data));
                            if ( data.data.user ) {
                                toastr.success('User Created');
                            }else{
                                toastr.error('Server Error');
                                //$state.go('app.dashboard');
                            }
                        callback(data);
                        }, function(x) {
                            toastr.error('Server Error');
                        callback(x);
                        }
                    );
            },

            updateUser: function(user, callback){
                var url = '/api/user/' + user._id;
                var data = user;

                $http({
                    method: 'put',
                    url: url,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    },
                    data:data
                })
                    .then(function(data) {
                        //alert(JSON.stringify(data.data));
                        //if ( data.data.success ) {
                            toastr.success('User updated');
                        //}else{
                        //    $state.go('app.dashboard');
                        //}
                        callback(data);
                    }, function(x) {
                        toastr.error('Server Error');
                        callback(x);
                    }
                );
            },

            removeUser: function(id){
                var url = '/api/users/' + id;

                return $http({
                    method: 'delete',
                    url: url,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    }
                });
            },

            getStatics: function (query, callback) {
                $http({
                    method: 'get',
                    url: '/api/admin/records/statics',
                    params: query,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    }
                })
                    .then(function (data) {
                        var response = data.data;
                        //console.log(response)
                        if (response.clients) {
                            callback(false, response);
                        } else {
                            toastr.error(response);
                            //$state.go('app.dashboard');
                        }
                    }, function (x) {
                        callback(x);
                        toastr.error('Server Error');
                    });
            }
        }
    }
);