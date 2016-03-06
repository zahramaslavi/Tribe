var tribeServices = angular.module('tribeServices', []);


//Tribe service
tribeServices.factory('tribes', function($http) {

    return {
        requestTribes: function()
        {
            var myUrl = '/tribe';
            var promise = $http({
                method: 'GET',
                url: myUrl,
                dataType:'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });

            promise.success(function(data) {
                console.log(JSON.stringify({data: data}));
                return JSON.stringify({data: data});
            });

            promise.error(function(data) {
                return "failure message: " + JSON.stringify({data: data});
            });
            return promise;
        },
        createTribe: function(tribeName, tribeDescription, userId, tribePhoto){
            var myUrl = '/tribe/upload';
            var fd = new FormData();
            fd.append('name', tribeName);
            fd.append('description', tribeDescription);
            fd.append('members', userId);
            fd.append('photo', tribePhoto);
            var promise = $http.post(myUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
            promise.success(function(data) {
                return JSON.stringify({data: data});
            });

            promise.error(function(data) {
                return "failure message: " + JSON.stringify({data: data});
            });
            return promise;
        },
        /*Update tribe
         URL: http://localhost:1337/tribe/:id
         METHOD: PUT
         PARAMS: name (string), description (string), members(int id of user member), topics (int id of topics), image_url (string)*/
        /////////Under development
        updateTribe: function(tribeId, tribeName, tribeDescription, tribePhoto)
        {
            var dataObjGraph = {
                name : tribeName,
                description : tribeDescription,
                photo:tribePhoto
            };
            var myUrl = '/tribe/' + tribeId;
            var promise = $http({
                method: 'PUT',
                url: myUrl,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                'data': dataObjGraph
            }).then(function(response,status, headers, config){
                return response.data;
            });
            return promise;



            /*var myUrl = '/tribe/' + tribeId;
             var fd = new FormData();
             fd.append('name', tribeName);
             fd.append('description', tribeDescription);
             fd.append('image_url', tribePhoto);
             var promise = $http.put(myUrl, fd, {
             transformRequest: angular.identity,
             headers: {'Content-Type': undefined}
             });
             promise.success(function(data) {
             return JSON.stringify({data: data});
             });

             promise.error(function(data) {
             return "failure message: " + JSON.stringify({data: data});
             });
             return promise;*/
        },
        deleteTribe: function(tribeId)
        {
            var myUrl = '/tribe/' + tribeId;
            var promise = $http({
                method: 'DELETE',
                url: myUrl,
                dataType:'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            });

            promise.success(function(data) {
                return JSON.stringify({data: data});
            });

            promise.error(function(data) {
                return "failure message: " + JSON.stringify({data: data});
            });
            return promise;
        },
        becomeMember: function(userId)
        {
            var myUrl = '/tribe/' + userId + '/join';

            var promise = $http.post(myUrl, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
            promise.success(function(data) {
                return JSON.stringify({data: data});
            });

            promise.error(function(data) {
                return "failure message: " + JSON.stringify({data: data});
            });
            return promise;
        },
    };
});
