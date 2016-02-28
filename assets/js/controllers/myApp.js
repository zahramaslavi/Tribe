
var app = angular.module('myApp', ['ngMaterial',
                                    'ngMdIcons',
                                    'ngCookies',
                                    'fileDirectives',
                                    'backgroundDirective',
                                    'sharedProperties',
                                    'modalServices',
                                    'tribeServices']);


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
                console.log('result', $scope.createdtribe);

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

    //Action to update tribe
    /////Under development
    $scope.updateTribe = function(){
        var tribeId = $scope.modal.tribeId;
        var tribeName = $scope.modal.name;
        var tribeDescription = $scope.modal.description;
        var file = $scope.modal.image_url;
       tribes.updateTribe(tribeId, tribeName, tribeDescription, file).then(function(results){
            $scope.updatedtribe = results.data;
            console.log('result:', results.data);

            $mdDialog.cancel();
            showSimpleToast("Tribe updated");
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


    ///////////////Become a member
    $scope.becomeMember = function(userId){

        tribes.becomeMember(userId).then(function(results){
            $scope.deletedtribe = results.data;
            console.log(results.data);

            $scope.member = 'true';

        });
    }
    ///////////////End of become a member



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


