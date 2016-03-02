/**
 * TribeController
 *
 * @description :: Server-side logic for serving gridfs content
 */

module.exports = {

	img: function (req, res) {
		var blobAdapter = require('skipper-gridfs')({
			uri: process.env.MONGOLAB_URI + '.bucket' || sails.config.skipperconf.local_uri //bucket is necessary (bug)
		});
		var fd = req.param('id');
		blobAdapter.read(fd, function(error , file) {
			if(error) {
				res.json(error);
			} else {
				res.contentType('image/png');
				res.send(new Buffer(file));
			}
		});
	}

};
