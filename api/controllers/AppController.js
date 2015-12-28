/**
 * HomepageController
 *
 * @description :: Server-side logic for managing homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
		res.view('app/index', {layout:'app/layout', user: req.user});
  },

	tribe: function(req,res) {
		res.view('app/tribe', {layout: 'app/layout', user:req.user, tribeId: req.param('id') });
	},

	topic: function(req,res) {
		res.view('app/topic', {layout: 'app/layout', user:req.user, topicId: req.param('id') })
	}

};
