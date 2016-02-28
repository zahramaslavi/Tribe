var sharedProperties = angular.module('sharedProperties', ['ngCookies']);

//Shared variables and cookies
sharedProperties.factory('sharedProperties', function($cookies) {
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
