/**
 * TopicController
 *
 * @description :: Server-side logic for managing topics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	new: function(req,res){
		if ( !req.isAuthenticated() ) return res.forbidden();
		res.view({tribe: req.tribe},'topic/new')
	},
};
