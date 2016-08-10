
angular.module('records')
    .factory('RecordsService', function ($http,  $state,  $window,   toastr){
        return {

            getRecords: function (query, callback){
                $http({
                    method: 'get',
                    url: '/api/admin/records',
                    params: query,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    }
                })
                    .then(function(data) {
                        var response = data.data
                        //console.log(response)
                        if ( response.records) {
                            callback(false, response.records);
                         }else{
                            toastr.error(response);
                            //$state.go('app.dashboard');
                         }
                    }, function(x) {
                        callback(x);
                        toastr.error('Server Error');
                });

            },

            getStatics: function (query, callback){
                $http({
                    method: 'get',
                    url: '/api/admin/records/statics',
                    params: query,
                    headers: {
                        'X-Auth-Token': $window.sessionStorage.getItem('api_token')
                    }
                })
                    .then(function(data) {
                        var response = data.data;
                        //console.log(response)
                        if ( response.clients) {
                            callback(false, response);
                        }else{
                            toastr.error(response);
                            //$state.go('app.dashboard');
                        }
                    }, function(x) {
                        callback(x);
                        toastr.error('Server Error');
                    });

            }
        }
    }
);