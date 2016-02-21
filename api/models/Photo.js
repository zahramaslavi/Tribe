/**
* Photo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
     image_url:'string',
     description:'string',
     votes:'integer',
     owner: {
       model:'user'
     },
     topic: {
      model:'topic'
     }
  }
};
