
var app = angular.module('myApp', ['ngMaterial',
                                    'ngMdIcons',
                                    'ngCookies',
                                    'ngRoute',
                                    'fileDirectives',
                                    'backgroundDirective',
                                    'sharedProperties',
                                    'modalServices',
                                    'tribeServices',
                                    'topicServices',
                                    'photoServices', 
                                    'LocalStorageModule'
                                    ]);

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

// configure our routes
    app.config(function($routeProvider) {
        $routeProvider
            .when('/tribes', {
                templateUrl : 'templates/tribes.html',
                controller  : 'tribesCtrl'
            })
            .when('/topics', {
                templateUrl : 'templates/topics.html',
                controller  : 'topicsCtrl'
            })
            .when('/photos', {
                templateUrl : 'templates/photos.html',
                controller  : 'photosCtrl'
            });
    });
app.controller('navbarCtrl', function($scope,$log, $timeout, $interval, sharedProperties, localStorageService) {

  $interval( function(){
        $scope.headerName = sharedProperties.getHeaderName();
        $scope.headerTitle =sharedProperties.getHeaderTitle();
        $scope.usernameNav=sharedProperties.getUsername();
        //if(localStorage.getItem("clickedTopicDes")){
          $scope.topicNav=getFourWord(localStorage.getItem("clickedTopicDes"));
          //$scope.topicNav=localStorage.getItem("clickedTopicDes");
        //}
       
       // if(localStorage.getItem("clickedTribeName")){
          $scope.tribeNav=localStorage.getItem("clickedTribeName");
       // }
        
    }, 1000);

  $scope.setUser= function(userName,id){
    sharedProperties.setUserId(id);
    sharedProperties.setUsername(userName);


  };

  function getFourWord(str) {
        if (str.indexOf(' ') === -1)
            return str;
        else
            //return str.substr(0, str.indexOf(' '));
          return str.substr(0, 30);
    };


  });

app.controller('tribesCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, tribes, sharedProperties, myModals, localStorageService) {


    $interval( function(){
        tribesReload();
    }, 2000);

    /*The style for add member Icon*/

    $scope.memberIdCheck = [];

    //Load all tribes when the page loads
        $scope.tribesRequest = function(){
            tribes.requestTribes().then(function(results){
                $scope.tribes = results.data;
                sharedProperties.setTribes(results.data);
                checkMember($scope.tribes);
                /////Set navbar info
                $scope.headerName = sharedProperties.getUsername();
                sharedProperties.setHeaderTitle("Tribes");
                sharedProperties.setHeaderName($scope.headerName);

            });
        }

    ////////////////////Create Tribe

        //Get modal to create tribe
        $scope.createTribeModal = function(ev) {
            var url = '/modals/createTribe.html'
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

                $mdDialog.cancel();
                showSimpleToast("Tribe created");
            });

        }
    ////////////////////End of create tribe



    ////////////////////Update Tribe

    //Get modal to update tribe
    $scope.updateTribeModal = function(ev, name, description, tribeId, image_url) {
        var url = '/modals/updateTribe.html'
        myModals.updateTribeModal(ev, url, name, description, tribeId, image_url);
    };

    //Action to update tribe
    /////Under development
    $scope.updateTribe = function(photo){
        var tribeId = $scope.modal.tribeId;
        var tribeName = $scope.modal.name;
        var tribeDescription = $scope.modal.description;

       tribes.updateTribe(tribeId, tribeName, tribeDescription).then(function(results){
            $scope.updatedtribe = results.data;

            $mdDialog.cancel();
            showSimpleToast("Tribe updated");
        });

    }
    ////////////////////End of update tribe

    ////////////////////Delete tribe
    $scope.deleteThisTribe=function(tribeId){
        tribes.deleteTribe(tribeId).then(function(results){
            $scope.deletedtribe = results.data;

            showSimpleToast("Tribe deleted");
        });
    }
    ///////////////////End of delete tribe


    ///////////////Become a member
    $scope.becomeMember = function(tribeId){
        console.log('userId in member', tribeId);
        tribes.becomeMember(tribeId).then(function(results){
            $scope.memberData = results.data;
        });
    }
    ///////////////End of become a member


  //////////////Set clicked tribe so we can have access to it in the tribe controller
  $scope.clickedTribe = function(clickedTribeId, clickedTribeName){
  
    localStorage.setItem("clickedTribeId", clickedTribeId);
    localStorage.setItem("clickedTribeName", clickedTribeName);
  }

  //////////////End of set clicked tribe



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
                $scope.userId = sharedProperties.getUserId();
                checkMember($scope.tribes);
                /////Set navbar info
                $scope.headerName = sharedProperties.getUsername();
                //sharedProperties.setHeaderTitle("Tribes");
                //sharedProperties.setHeaderName($scope.headerName);
            });

        }, 1000);
    }

    /*This function is called when a tribes page is loaded so it can say the
     user is a member of a tribe or not: if yes the member Icon will appear red*/
    function checkMember(tribes){
        $scope.currentUserId = sharedProperties.getUserId();
        angular.forEach(tribes, function(value, key) {
              angular.forEach(value.members, function(memberValue, key){
                if((memberValue.id == $scope.currentUserId) && ($scope.memberIdCheck.indexOf(value.id) == -1)){
                    $scope.memberIdCheck.push(value.id);  
                }
              }); 
            });
    }


});


app.controller('topicsCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, sharedProperties, myModals, topics, localStorageService) {

  /*Get the clicked tribeId on page load and get all related topics*/
  $scope.clickedTribe = function(){
    $timeout( function(){
          
           $scope.clickedTribeId = localStorage.getItem("clickedTribeId"); 
           $scope.clickedTribeName = localStorage.getItem("clickedTribeName");

           sharedProperties.setClickedTribeId($scope.clickedTribeId);
           sharedProperties.setClickedTribeName($scope.clickedTribeName);

           sharedProperties.setHeaderTitle("Topics");
           sharedProperties.setHeaderName($scope.clickedTribeName);

            topics.requestTopics($scope.clickedTribeId).then(function(results){
              $scope.topics = results.data.topics;
              sharedProperties.setTopics(results.data.topics);
            });
    }, 1000);
  }

  /*Get topics every 2 sec so we get all updates including topic-delete and topic-update*/
  $interval( function(){
    var tribeId = sharedProperties.getClickedTribeId();
      topicsReload(tribeId);
  }, 2000);


  ////////////////////Create Topic

  //Get modal to create topic
  $scope.createTopicModal = function(ev) {
    var url = '/modals/createTopic.html'
    myModals.createTopicModal(ev, url);
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  //Action to create a new topic
  $scope.createNewTopic = function(){

    var topicDescription = $scope.description;
    var tribeId = sharedProperties.getClickedTribeId();
    topics.createTopic(topicDescription, tribeId).then(function(results){
      $scope.createdTopic = results;

      $mdDialog.cancel();
      showSimpleToast("Topic created");
    });
  }
  ////////////////////End of create topic



  ////////////////////Update Tribe

  //Get modal to update tribe
  $scope.updateTopicModal = function(ev, description, topicId) {
    var url = '/modals/updateTopic.html';
    myModals.updateTopicModal(ev, url, description, topicId);
  };

  //Action to update tribe
  /////Under development
  $scope.updateTopic = function(){
    var topicId = $scope.modal.topicId;
    var topicDescription = $scope.modal.description;

    topics.updateTopic(topicDescription, topicId).then(function(results){
      $scope.updatedtribe = results.data;

      $mdDialog.cancel();
      showSimpleToast("Topic updated");
    });

  }
  ////////////////////End of update tribe

  ////////////////////Delete tribe
  $scope.deleteThisTopic=function(topicId){

    topics.deleteTopic(topicId).then(function(results){
      $scope.deletedtopic = results.data;
     
      showSimpleToast("Topic deleted");

    });
  }
  ///////////////////End of delete tribe



  //////////////Set clicked tribe so we can have access to it in the tribe controller
  $scope.clickedTopic = function(clickedTopicId, clickedTopicDes){
    localStorage.setItem("clickedTopicId", clickedTopicId);
    localStorage.setItem("clickedTopicDes", clickedTopicDes);
  }

  //////////////End of set clicked tribe


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
  function topicsReload(tirbeId){
    $timeout(function(){
      $scope.clickedTribeId = tirbeId;
    
     
      topics.requestTopics($scope.clickedTribeId).then(function(results){
        $scope.topics = results.data.topics;
        sharedProperties.setTopics(results.data.topics);
      });

    }, 1000);
  }


});




app.controller('photosCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, sharedProperties, myModals, photos, localStorageService) {

  /*Get the clicked tribeId on page load and get all related topics*/
  $scope.clickedTopicPhotos = function(){
    $timeout( function(){
      $scope.clickedTopicId = localStorage.getItem("clickedTopicId");
      $scope.clickedTopicDes = localStorage.getItem("clickedTopicDes");

      sharedProperties.setClickedTopicId($scope.clickedTopicId);
      sharedProperties.setClickedTopicDes($scope.clickedTopicDes);

      sharedProperties.setHeaderTitle("Photos");
      sharedProperties.setHeaderName($scope.clickedTopicDes);

      photos.requestPhotos($scope.clickedTopicId).then(function(results){
        $scope.photos = results.data.photos;
        sharedProperties.setPhotos($scope.photos);
      });
    }, 1000);
  }

  /*Get Photos every 2 sec so we get all updates including photo-delete and photos-update*/
  $interval( function(){
    photosReload();
  }, 2000);

  

  ////////////////////Create Photo

  //Get modal to create photo
  $scope.createPhotoModal = function(ev) {
    var url = '/modals/createPhoto.html'
    myModals.createPhotoModal(ev, url);
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  //Action to create a new photo
  $scope.createNewPhoto = function(){

    var photoDescription = $scope.description;
    var topicId = sharedProperties.getClickedTopicId();
    
    var ownerId= sharedProperties.getUserId();
    var file = $scope.myFile;
    
    photos.createPhoto(photoDescription, topicId, ownerId, file).then(function(results){
      $scope.createdPhoto = results;

      $mdDialog.cancel();
      showSimpleToast("Photo created");
     
    });


  }
  ////////////////////End of create topic



  ////////////////////Update Tribe

  //Get modal to update tribe
  $scope.updatePhotoModal = function(ev, description, photoId, image_url) {
    var url = '/modals/updatePhoto.html';
    myModals.updatePhotoModal(ev, url, description, photoId, image_url);
  
  };

  //Action to update tribe
  /////Under development
  $scope.updatePhoto = function(){
    var photoId = $scope.modal.photoId;
    var photoDescription = $scope.modal.description;

    photos.updatePhoto(photoDescription, photoId).then(function(results){
      $scope.updatedPhoto = results.data;
     
      $mdDialog.cancel();
      showSimpleToast("Photo updated");

      
    });

    

  }
  ////////////////////End of update tribe

  ////////////////////Delete tribe
  $scope.deleteThisPhoto=function(photoId){

    photos.deletePhoto(photoId).then(function(results){
      $scope.deletedPhoto = results.data;

      showSimpleToast("Photo deleted");

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
  function photosReload(){
   
    $timeout(function(){
      var topicId = sharedProperties.getClickedTopicId();
      photos.requestPhotos(topicId).then(function(results){
        $scope.photos = results.data.photos;
        sharedProperties.setPhotos($scope.photos);
      });
    }, 1000);
  }


/////////////Upvote

   $scope.upvote = function(photoId){
        photos.upvotePhoto(photoId).then(function(results){
            $scope.upvoteData = results.data;
            console.log('$scope.upvoteData', results);
        });
    }

});
