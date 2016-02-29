/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  //Root will redirect to the APP for now, this should obviously be deprecated
  'get /' : 'AppController.index',


  //Temporary routes for an example webapp
  'get /app': 'AppController.index',
  'get /app/tribe/:id': {
    controller: 'AppController',
    action: 'tribe'
  },
  'get /app/topic/:id': {
    action: 'topic',
    controller: 'AppController'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  'post /photo/:id/upvote': {
    controller: 'PhotoController',
    action: 'upvote',
    skipAssets: true
  },

  'post /tribe/:id/join': {
    controller: 'TribeController',
    action: 'join',
    skipAssets: true
  },

  'get /content/img/:id': {
    controller: 'ContentController',
    action: 'img',
    skipAssets: true
  },

  //Passport related routes for user creation.

  'get /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.register',
  'post /auth/local': 'AuthController.callback',
  'post /auth/local/:action': 'AuthController.callback',

  'get /auth/:provider': 'AuthController.provider',
  'get /auth/:provider/callback': 'AuthController.callback',
  'get /auth/:provider/:action': 'AuthController.callback'

};
