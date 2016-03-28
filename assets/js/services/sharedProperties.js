 var sharedProperties = angular.module('sharedProperties', ['ngCookies']);

//Shared variables and cookies
sharedProperties.factory('sharedProperties', function($cookies) {
    var userId;
    var username;
    var headerName;
    var headerTitle;
    var tribes;
    var clickedTribeId="";
    var clickedTribeName="";
    $cookies.clickedTribeName="";
    $cookies.clickedTribeId = "";
    var topics;
    var clickedTopicId;
    var clickedTopicDes;
    $cookies.clickedTopicId="";
    $cookies.clickedTopicDes = "";
    return {
        getUserId: function() {
            userId = $cookies.userId;
            return userId;
        },
        setUserId: function(value) {
            $cookies.userId = value;
        },
        getUsername: function() {
            username = $cookies.username;
            return username;
        },
        setUsername: function(value) {
            $cookies.username = value;
        },
        getHeaderTitle: function() {
            headerTitle = $cookies.headerTitle;
            return headerTitle;
        },
        setHeaderTitle: function(value) {
            $cookies.headerTitle = value;
        },
        getHeaderName: function() {
            headerName = $cookies.headerName;
            return headerName;
        },
        setHeaderName: function(value) {
            $cookies.headerName = value;
        },
        getTribes: function() {
            tribes = $cookies.tribes;
            return tribes;
        },
        setTribes: function(value) {
            $cookies.tribes = value;
            /*console.log('value:',value);*/

        },
        getClickedTribeId: function() {
            clickedTribeId = $cookies.clickedTribeId;
            return clickedTribeId;
        },
        setClickedTribeId: function(value) {
            $cookies.clickedTribeId = value;
        },
        getClickedTribeName: function() {
            clickedTribeName = $cookies.clickedTribeName;
            return clickedTribeName;
        },
        setClickedTribeName: function(value) {
            $cookies.clickedTribeName = value;
        },
        getTopics: function() {
            topics = $cookies.topics;
            return topics;
        },
        setTopics: function(value) {
            $cookies.topics = value;

        },
        getClickedTopicId: function() {
            clickedTopicId = $cookies.clickedTopicId;
            return clickedTopicId;
        },
        setClickedTopicId: function(value) {
            $cookies.clickedTopicId = value;
            //clickedTopicId = value;

        },
        getClickedTopicDes: function() {
            clickedTopicDes = $cookies.clickedTopicDes;
            return clickedTopicDes;
        },
        setClickedTopicDes: function(value) {
           $cookies.clickedTopicDes = value;
           //clickedTopicDes = value;
        },
        getPhotos: function() {
            photos = $cookies.photos;
            return photos;
        },
        setPhotos: function(value) {
            $cookies.photos = value;

        },
    };
});
