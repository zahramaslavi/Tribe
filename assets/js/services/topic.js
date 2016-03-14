var topicServices = angular.module('topicServices', []);


//Tribe service
topicServices.factory('topics', function($http) {

  return {
    requestAllTopics: function()
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
    requestTopics: function(tribeId)
    {
      var myUrl = '/tribe/' + tribeId;
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
    createTopic: function(topicDescription, tribeId){  //description (string), tribes (int id of tribe it belongs to)
       var dataObj = {
       description : topicDescription,
        tribes : tribeId
       };
       var myUrl = '/topic';
       var promise = $http({
       method: 'POST',
       url: myUrl,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {
       var str = [];
       for(var p in obj)
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
       return str.join("&");
       },
       'data': dataObj
       }).then(function(response,status, headers, config){
       return response.data;
       });
       return promise;
    },

    updateTopic: function(topicDescription, topicId)
    {
       var dataObj = {
       description : topicDescription
       };
       var myUrl = '/topic/' + topicId;
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
       'data': dataObj
       }).then(function(response,status, headers, config){
       return response.data;
       });
       return promise;

    },
    deleteTopic: function(topicId)
    {
      var myUrl = '/topic/' + topicId;
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
