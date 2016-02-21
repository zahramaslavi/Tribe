
var app = angular.module('myApp', ['ngMaterial', 'ngMdIcons', 'ngCookies']);

//Shared variables and cookies
app.factory('sharedProperties', function($cookies) {
    var userId;
    return {
        getUserId: function() {
            userId = $cookies.userId
            return userId;
        },
        setUserId: function(value) {
            $cookies.userId = value;
        },
    };
});


//Service for loading the tribes
app.factory('loadTribes', function($http) { //, $q, $rootScope, , $timeout

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
                return JSON.stringify({data: data});
            });

            promise.error(function(data) {
                return "failure message: " + JSON.stringify({data: data});
            });
            return promise;
        },
    };
});

//Service for creating a new tribe

/* Create
    URL: http://localhost:1337/tribe
    METHOD: POST
    PARAMS: name (string), description (string), members(int id of user member)
*/


/*Update
    URL: http://localhost:1337/tribe/:id
    METHOD: PUT
 PARAMS: name (string), description (string), members(int id of user member), topics (int id of topics), image_url (string)*/


app.factory('crudTribe', function($http) {

    return {
        createTribe: function(tribeName, tribeDescription, userId, tribePhoto)
        {
            var dataObjTribe = {
                name : tribeName,
                description : tribeDescription,
                members : userId,
                photo:tribePhoto
            };

            var myUrl = '/tribe/upload';

            var promise = $http({
                method: 'Post',
                url: myUrl,
                headers: {'Content-Type': 'application/json'},
                /*transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(p + "=" + obj[p]);
                    return str.join("&");
                },*/
                'data': dataObjTribe
            }).then(function(response){
                return response.data;
            });
            return promise;
        },
       /* updateTribe: function(userId, tribeName, tribeDescription, topicId, imageUrl)
        {
            var dataObjGraph = {
                members : userId,
                name : tribeName,
                description : tribeDescription,
                topics: topicId,
                image_url:imageUrl
            };
            var myUrl = 'http://argGraph.localhost/graph/' + id;
            var promise = $http({
                method: 'PUT',
                url: myUrl + ,
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
        },*/
    };
});



app.controller('indexCtrl', function($scope, $mdDialog, $mdMedia, loadTribes, crudTribe, sharedProperties) {

    $scope.tribesRequestAndSession = function(id){
        loadTribes.requestTribes().then(function(results){
            $scope.tribes = results.data;
            console.log(results.data);

            //Set session data
           /* $scope.userIdSession = id;
            console.log('userIdNav:',id);
            console.log('userIdNavScope:',$scope.userIdSession);*/

            sharedProperties.setUserId(id);
        });
    }





    //Create Tribe


    $scope.createNewTribe = function(){

        var tribeName = $scope.name;
        var tribeDescription = $scope.description;

        var tribePhoto = $scope.uploadme;
        var userId = sharedProperties.getUserId();

        console.log('tribe name: ', tribeName);
        console.log('tribeDescription:', tribeDescription);
        console.log('userId:', userId);
        console.log('tribePhoto:', tribePhoto);


        crudTribe.createTribe(tribeName, tribeDescription, userId, tribePhoto).then(function(results){
            $scope.createdtribe = results.data;
            console.log(results);
        });

    }


    //modal

    $scope.status = '  ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

    $scope.sayHi = function(){console.log('hi');}

    $scope.showAdvanced = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
                controller: DialogController,
                templateUrl: '/modals/createTribe.ejs',
               // templateUrl: '/modals/addTribeModal.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

});

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}


//Background image directive for login and register page
app.directive('backgroundImageDirective', function () {
    return function (scope, element, attrs) {
        element.css({
            //'background-image': 'url(' + attrs.backgroundImageDirective + ')',
            'background': 'url(' + attrs.backgroundImageDirective + ') no-repeat center center fixed',
            //'background-repeat': 'no-repeat center center fixed',
            '-webkit-background-size': 'cover',
            '-moz-background-size':'cover',
            '-o-background-size': 'cover',
            'background-size': 'cover',

        });
    };
})

//A directive for reading files (images) instead of input type="file"
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);