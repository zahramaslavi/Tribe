var photoServices = angular.module('photoServices', []);


//Tribe service
photoServices.factory('photos', function($http) {
  return {
    requestPhotos: function(topicId)
    {
      var myUrl = '/topic/' + topicId;
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
    createPhoto: function(description, topic, owner, photo){
      var myUrl = '/photo/upload';
      var fd = new FormData();
      fd.append('description', description);
      fd.append('topic', topic);
      fd.append('owner', owner);
      fd.append('photo', photo);
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
    
    /////////Under development
    updatePhoto: function(photoDescription, photoId)
    {
       var dataObj = {
       description : photoDescription
       };
       var myUrl = '/photo/' + photoId;
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
    deletePhoto: function(photoId)
    {
      var myUrl = '/photo/' + photoId;
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
    upvotePhoto: function(photoId)
    {
      var myUrl = '/photo/' + photoId + '/upvote';
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
