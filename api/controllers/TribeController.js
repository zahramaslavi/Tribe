/**
 * TribeController
 *
 * @description :: Server-side logic for managing tribes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req,res){
	  if ( !req.isAuthenticated() ) return res.forbidden();
		res.view({user: req.user},'tribe/new')
	},

	upload: function  (req, res) {

    req.file('photo').upload(
		{
			adapter: require('skipper-gridfs'),
			uri: process.env.MONGOLAB_URI + '.bucket' || sails.config.skipperconf.local_uri //bucket is necessary (bug)
		},
		function (err, files) {

      if (err)
        return res.serverError(err);

			//TODO: compress before saving
			var url = files[0].fd.substring(files[0].fd.lastIndexOf('/')+1,files[0].fd.length);
			var name = req.param('name');
			var description = req.param('description');
			var members = req.param('members');

			Tribe.create({
				image_url:url,
				description: description,
				name: name,
				members: members
			}).exec(function createCB(err, created){
				return res.json(created);
			});
		});
	},

	join: function (req, res) {
		Tribe.find({id: req.param('id')}).populate('members').exec(function(e,r){
			r[0].members.add(req.user.id);
			r[0].save(function(err,updated){
				return res.json(updated);
			});
		});
	}

};
