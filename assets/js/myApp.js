
var app = angular.module('myApp', ['ngMaterial', 'ngMdIcons', 'ngCookies']);

//Shared variables and cookies
app.factory('sharedProperties', function($cookies) {
    var userId;
    var tribes;
    return {
        getUserId: function() {
            userId = $cookies.userId;
            return userId;
        },
        setUserId: function(value) {
            $cookies.userId = value;
        },
        getTribes: function() {
            tribes = $cookies.tribes;
            return tribes;
        },
        setTribes: function(value) {
            $cookies.tribes = value;

        },
    };
});




//A service for creating modal
app.factory('myModals', function($mdDialog) {

    return {
        createTribeModal: function(ev, modalUrl) {
            //$scope.status = '  ';
            //$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            $mdDialog.show({
                    templateUrl: modalUrl,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                });
        },
        updateTribeModal: function(ev, modalUrl, name, description, tribeId, image_url) {
            //$scope.status = '  ';
            //$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
            $mdDialog.show({
                templateUrl: modalUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                controller: function($mdDialog){
                    this.name = name;
                    this.description = description;
                    this.tribeId = tribeId;
                    this.image_url = image_url;
                },
                controllerAs:'modal'
            });
        },
    };
});

//End of modal service


//Service for creating a new tribe
app.factory('tribes', function($http) {

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
    };
});



app.controller('indexCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, tribes, sharedProperties, myModals) {


    $interval( function(){
        $scope.tribes = sharedProperties.getTribes();
    }, 2000);


    //Load all tribes when the page loads
        $scope.tribesRequestAndSession = function(id){
            tribes.requestTribes().then(function(results){
                $scope.tribes = results.data;
                sharedProperties.setUserId(id);
                sharedProperties.setTribes(results.data);
            });
        }


    ////////////////////Create Tribe

        //Get modal to create tribe
        $scope.createTribeModal = function(ev) {
            var url = '/modals/createTribe.ejs'
            myModals.createTribeModal(ev, url);
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        //Action to create a new tribe
        $scope.createNewTribe = function(){

            var tribeName = $scope.name;
            var tribeDescription = $scope.description;
            var userId = sharedProperties.getUserId();
            var file = $scope.myFile;
            tribes.createTribe(tribeName, tribeDescription, userId, file).then(function(results){
                $scope.createdtribe = results.data;
                console.log(results);

                $mdDialog.cancel();
                showSimpleToast("Tribe created");
            });

            $timeout(function(){tribesReload();}, 1000);

        }
    ////////////////////End of create tribe



    ////////////////////Update Tribe

    //Get modal to update tribe
    $scope.updateTribeModal = function(ev, name, description, tribeId, image_url) {
        var url = '/modals/updateTribe.ejs'
        myModals.updateTribeModal(ev, url, name, description, tribeId, image_url);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    //Action to update tribe
    $scope.updateNewTribe = function(){

        var tribeName = $scope.name;
        var tribeDescription = $scope.description;
        var userId = sharedProperties.getUserId();
        var file = $scope.myFile;
        tribes.updateTribe(tribeName, tribeDescription, userId, file).then(function(results){
            $scope.createdtribe = results.data;
            console.log(results);

            $mdDialog.cancel();
            showSimpleToast("Tribe created");
        });

        $timeout(function(){tribesReload();}, 1000);

    }
    ////////////////////End of update tribe

    ////////////////////Delete tribe
    $scope.deleteThisTribe=function(tribeId){
        tribes.deleteTribe(tribeId).then(function(results){
            $scope.deletedtribe = results.data;
            console.log(results);

            showSimpleToast("Tribe deleted");

            tribesReload();
        });
    }
    ///////////////////End of delete tribe



    //////////toast
    $scope.toastPosition= {
        top: false,
        top: 200,
        left: 200
        //right: true
    };

    function showSimpleToast(message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position($scope.toastPosition)
                .hideDelay(3000)
        );
    };


    ////////////Tribes reload
    function tribesReload(){
        $timeout(function(){
            tribes.requestTribes().then(function(results){
                $scope.tribes = results.data;
                sharedProperties.setTribes(results.data);
                console.log($scope.tribes);
            });

        }, 1000);
    }


});




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
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
//A directive for saving the image in angular variable to immediately retrive in the UI

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

