var sharedProperties = angular.module('sharedProperties', ['ngCookies']);

//Shared variables and cookies
sharedProperties.factory('sharedProperties', function($cookies) {
    var userId;
    var username;
    var tribes;
    return {
        getUserId: function() {
            userId = $cookies.userId;
            return userId;
        },
        setUserId: function(value) {
            $cookies.userId = value;
        }, 
        getUsername: function() {
            userId = $cookies.username;
            return username;
        },
        setUsername: function(value) {
            $cookies.username = value;
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
