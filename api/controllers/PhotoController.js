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

  upload: function  (req, res) {

		var description = req.param('description');
		var owner = req.param('owner');
		var topic = req.param('topic');

    req.file('photo').upload(
		//TODO: currently uploads are stored in ''/assets/images/photos/'.
		// This is very inefficinent, you should use something like S3 or another file storage service.
		{
			dirname: sails.config.appPath+'/public/photos/'
		},
		function (err, files) {

      if (err)
        return res.serverError(err);

			var url = files[0].fd.substring(files[0].fd.lastIndexOf('/')+1,files[0].fd.length);
			Photo.create({
				url:url,
				description: description,
				votes: 0,
				owner: owner,
				topic: topic
			}).exec(function createCB(err, created){
			  console.log('Uploaded photo ' + created.url);
			});

      return res.json({
        message: files.length + ' file(s) uploaded successfully!',
        files: files
      });
    });
  }

};
