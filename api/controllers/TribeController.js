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
	}
};
