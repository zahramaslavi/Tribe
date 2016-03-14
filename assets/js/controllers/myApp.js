
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
                                    'photoServices'
                                    ]);

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
app.controller('navbarCtrl', function($scope, $timeout, $interval, sharedProperties) {

  $interval( function(){
        $scope.headerName = sharedProperties.getHeaderName();
        $scope.headerTitle =sharedProperties.getHeaderTitle();
    }, 1000);

  $scope.setUser= function(userName,id){
    sharedProperties.setUserId(id);
    sharedProperties.setUsername(userName);


  };

  });

app.controller('tribesCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, tribes, sharedProperties, myModals) {


    $interval( function(){
        $scope.tribes = sharedProperties.getTribes();
    }, 2000);

    /*The style for add member Icon*/

    $scope.memberIdCheck = [];

    //Load all tribes when the page loads
        $scope.tribesRequest = function(){
            tribes.requestTribes().then(function(results){
                $scope.tribes = results.data;
                sharedProperties.setTribes(results.data);
                //$scope.userId = sharedProperties.getUserId();
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
           console.log('userId in create:',userId);
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
        var url = '/modals/updateTribe.html'
        myModals.updateTribeModal(ev, url, name, description, tribeId, image_url);
        console.log('first url:', image_url);
    };

    //Action to update tribe
    /////Under development
    $scope.updateTribe = function(photo){
        var tribeId = $scope.modal.tribeId;
        var tribeName = $scope.modal.name;
        var tribeDescription = $scope.modal.description;
       // var file = $scope.myFile;

       tribes.updateTribe(tribeId, tribeName, tribeDescription).then(function(results){
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
    $scope.becomeMember = function(tribeId){
        console.log('userId in member', tribeId);
        tribes.becomeMember(tribeId).then(function(results){
            $scope.memberData = results.data;
            console.log('$scope.memberData', results);
            tribesReload();
            /*$scope.member = 'true';
            $scope.memberIdCheck.push($scope.memberData.id);
            console.log($scope.memberIdCheck);*/
        });
    }
    ///////////////End of become a member


  //////////////Set clicked tribe so we can have access to it in the tribe controller
  $scope.clickedTribe = function(clickedTribeId, clickedTribeName){
    sharedProperties.setClickedTribeId(clickedTribeId);
    sharedProperties.setClickedTribeName(clickedTribeName);
    console.log("hi",clickedTribeId);
    console.log("zahraa",clickedTribeName);

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
                console.log('$scope.headerName',$scope.headerName);
                sharedProperties.setHeaderTitle("Tribes");
                sharedProperties.setHeaderName($scope.headerName);
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
        console.log('$scope.memberIdCheck', $scope.memberIdCheck);
    }


});


app.controller('topicsCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, sharedProperties, myModals, topics) {

  /*Get the clicked tribeId on page load and get all related topics*/
  $scope.clickedTribe = function(){
    $timeout( function(){
           $scope.clickedTribeId = sharedProperties.getClickedTribeId();
           $scope.clickedTribeName = sharedProperties.getClickedTribeName();
           sharedProperties.setHeaderTitle("Topics");
           sharedProperties.setHeaderName($scope.clickedTribeName);

            topics.requestTopics($scope.clickedTribeId).then(function(results){
              $scope.topics = results.data.topics;
              console.log('$scope.topics',results.data);
              sharedProperties.setTopics(results.data.topics);
            });
    }, 1000);
  }

  /*Get topics every 2 sec so we get all updates including topic-delete and topic-update*/
  $interval( function(){
    $scope.topics = sharedProperties.getTopics();
    $scope.clickedTribeId = sharedProperties.getClickedTribeId();
    $scope.clickedTribeName = sharedProperties.getClickedTribeName();
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
      console.log('result', $scope.createdTopic);

      $mdDialog.cancel();
      showSimpleToast("Topic created");
    });

    $timeout(function(){topicsReload(tribeId);}, 1000);

  }
  ////////////////////End of create topic



  ////////////////////Update Tribe

  //Get modal to update tribe
  $scope.updateTopicModal = function(ev, description, topicId) {
    var url = '/modals/updateTopic.html';
    console.log('topicId', topicId);
    myModals.updateTopicModal(ev, url, description, topicId);
    console.log('first url:', image_url);
  };

  //Action to update tribe
  /////Under development
  $scope.updateTopic = function(){
    var topicId = $scope.modal.topicId;
    var topicDescription = $scope.modal.description;

    topics.updateTopic(topicDescription, topicId).then(function(results){
      $scope.updatedtribe = results.data;
      console.log('result:', results.data);

      $mdDialog.cancel();
      showSimpleToast("Topic updated");
    });

    $timeout(function(){
      var tribeId = sharedProperties.getClickedTribeId();
      topicsReload(tribeId);
    }, 1000);

  }
  ////////////////////End of update tribe

  ////////////////////Delete tribe
  $scope.deleteThisTopic=function(topicId){

    topics.deleteTopic(topicId).then(function(results){
      $scope.deletedtopic = results.data;
      console.log(results);

      showSimpleToast("Topic deleted");

      var tribeId = sharedProperties.getClickedTribeId();
      topicsReload(tribeId);
    });
  }
  ///////////////////End of delete tribe



  //////////////Set clicked tribe so we can have access to it in the tribe controller
  $scope.clickedTopic = function(clickedTopicId, clickedTopicDes){
    sharedProperties.setClickedTopicId(clickedTopicId);
    sharedProperties.setClickedTopicDes(clickedTopicDes);
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
     $scope.clickedTribeName = "Zahraa"
      //$scope.clickedTribeName = sharedProperties.getClickedTribeName();
     // console.log($scope.clickedTribeId, "name" , $scope.clickedTribeName);

      topics.requestTopics($scope.clickedTribeId).then(function(results){
        $scope.topics = results.data.topics;
        console.log(results.data);
        sharedProperties.setTopics(results.data.topics);
      });

    }, 1000);
  }


});




app.controller('photosCtrl', function($scope, $timeout, $interval, $mdDialog, $mdToast, sharedProperties, myModals, photos) {

  /*Get the clicked tribeId on page load and get all related topics*/
  $scope.clickedTopicPhotos = function(){
    $timeout( function(){
      $scope.clickedTopicId = sharedProperties.getClickedTopicId(); 
      $scope.clickedTopicDes = sharedProperties.getClickedTopicDes();

      photos.requestPhotos($scope.clickedTopicId).then(function(results){
        $scope.photos = results.data.photos;
        console.log(results.data);
        sharedProperties.setPhotos($scope.photos);
      });
    }, 1000);
  }

  /*Get Photos every 2 sec so we get all updates including photo-delete and photos-update*/
  $interval( function(){
    $scope.Photos = sharedProperties.getPhotos();
  }, 2000);


  ////////////////////Create Photp

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
    console.log(photoDescription);
    console.log("tribeId in create get",topicId);
    photos.createPhoto(photoDescription, topicId, ownerId, file).then(function(results){
      $scope.createdPhoto = results;
      console.log('result', $scope.createdPhoto);

      $mdDialog.cancel();
      showSimpleToast("Photo created");
      //photosReload();
    });

    //$timeout(function(){
      var topicId = sharedProperties.getClickedTopicId(); 
      photosReload(topicId);
    //}, 2000);

  }
  ////////////////////End of create topic



  ////////////////////Update Tribe

  //Get modal to update tribe
  $scope.updatePhotoModal = function(ev, description, photoId, image_url) {
    var url = '/modals/updatePhoto.html';
    console.log('photoId', photoId);
    myModals.updatePhotoModal(ev, url, description, photoId, image_url);
  
  };

  //Action to update tribe
  /////Under development
  $scope.updatePhoto = function(){
    var photoId = $scope.modal.photoId;
    var photoDescription = $scope.modal.description;

    photos.updatePhoto(photoDescription, photoId).then(function(results){
      $scope.updatedPhoto = results.data;
      console.log('result:', $scope.updatedPhoto);

      $mdDialog.cancel();
      showSimpleToast("Topic updated");
    });

   // $timeout(function(){
      var topicId = sharedProperties.getClickedTopicId(); 
      photosReload(topicId);
    //}, 1000);

  }
  ////////////////////End of update tribe

  ////////////////////Delete tribe
  $scope.deleteThisPhoto=function(photoId){

    photos.deletePhoto(photoId).then(function(results){
      $scope.deletedPhoto = results.data;
      console.log($scope.deletedPhoto);

      showSimpleToast("Photo deleted");

      var topicId = sharedProperties.getClickedTopicId(); 
      photosReload(topicId);
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
  function photosReload(topicId){
    $timeout(function(){
      //var topicId = sharedProperties.getClickedTopicId();
      $scope.clickedTopicDes = sharedProperties.getClickedTopicDes();
      
      photos.requestPhotos(topicId).then(function(results){
        $scope.photos = results.data.photos;
        console.log(results.data);
        sharedProperties.setPhotos($scope.photos);
        console.log('page loaded', $scope.photos);
      });
    }, 1000);
  }


/////////////Upvote

   $scope.upvote = function(photoId){
        photos.upvotePhoto(photoId).then(function(results){
            $scope.upvoteData = results.data;
            console.log('$scope.upvoteData', results);

            var topicId = sharedProperties.getClickedTopicId(); 
            photosReload(topicId);
        });
    }

});
