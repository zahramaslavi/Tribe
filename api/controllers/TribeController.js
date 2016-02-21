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

	//Upload file to Gridfs service
	/*uploadFile: function (req, res) {
		req.file('avatar').upload({
			adapter: require('skipper-gridfs'),
			uri: 'mongodb://[username:password@]host1[:port1][/[database[.bucket]]'
		}, function (err, filesUploaded) {
			if (err) return res.negotiate(err);
			return res.ok();
		});
	},*/

	upload: function  (req, res) {

		var name = req.param('name');
		var description = req.param('description');
		var members = req.param('members');


		req.file('photo').upload(
		//TODO: currently uploads are stored in ''/assets/images/photos/'.
		// This is very inefficinent, you should use something like S3 or another file storage service.
		{
			dirname: sails.config.appPath+'/assets/public/tribes/'

		},
		function (err, files) {

      if (err)
        return res.serverError(err);

			//var url = files[0].fd.substring(files[0].fd.lastIndexOf('/')+1,files[0].fd.length);
			sails.log(files);

			Tribe.create({
				image_url:files,
				description: description,
				name: name,
				members: members
			}).exec(function createCB(err, created){
				return res.json(created);
			});
    });
  }



};
