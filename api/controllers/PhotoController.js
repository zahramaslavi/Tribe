/**
 * PhotoController
 *
 * @description :: Server-side logic for managing photos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req,res){
		res.view('photo/new')
	},


	upvote: function (req, res, next) {
	  var newVotes = 0;
	  Photo.findOne(req.param('id'), function (err, photo) {
	    	if (err){
	        return next(err);
	    	}
	    	photo.votes++;
	    	newVotes = photo.votes;
	    	Photo.update(req.param('id'), {votes : newVotes}, function (err, updated) {
	        if (err){
	        	return res.negotiate(err);
	        }
	        return res.json(updated[0]); // we only updated 1, so let's return only that one
	    	});
		});
	},

  upload: function  (req, res) {

    req.file('photo').upload(
		{
			adapter: require('skipper-gridfs'),
			uri: process.env.MONGOLAB_URI + '.bucket' || sails.config.skipperconf.local_uri //bucket is necessary (bug)
		}, function (err, files) {

      if (err)
        return res.serverError(err);

			var url = files[0].fd.substring(files[0].fd.lastIndexOf('/')+1,files[0].fd.length);
			var description = req.param('description');
			var owner = req.param('owner');
			var topic = req.param('topic');

			Photo.create({
				image_url:url,
				description: description,
				votes: 0,
				owner: owner,
				topic: topic
			}).exec(function createCB(err, created){
				return res.json(created);
			});
    });
  }

};
