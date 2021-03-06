var mod = require('../modules/rm');
var lib = require('../modules/lib');
var User = require('../models/User');

module.exports = function (express) {
    var appRouter = express.Router();

    /**
     * GET
     * '/'
     * Deliver's index with random background
     * TODO Parse session data into index
     */
    appRouter.get('/', function (req, res) {
        var $ = req.session;

        var file = "index";
        if ($.loggedIn) {
            mod.renderLoggedIn(req, res, file);
        }
        else {
            mod.renderLoggedOut(req, res, file);
        }
    });

    /**
     * GET
     * ''
     * Deliver's index with random background
     * TODO Parse session data into index
     */
    appRouter.get('', function (req, res) {
        var $ = req.session;
        var file = "index";
        if ($.loggedIn) {
            mod.renderLoggedIn(req, res, file);
        }
        else {
            mod.renderLoggedOut(req, res, file);
        }
    });

    /**
     * GET
     * '/'
     * Deliver's index with random background
     * TODO Parse session data into index
     */
    appRouter.get('/debug', function (req, res) {

        var getReq = req.query['q'];
        // console.log(getReq);

        res.render('debug.jade', {
            getReq: getReq
        });

    });

    // File Routes
    // File called with no extension

    /**
     * GET
     * '/u/'+username
     * User profile page
     * //TODO generate from restful api
     */
    appRouter.get('/o/:user', function (req, res) {
         // req.params.user;
        var $ = req.session;
        var file = "profile";

        if ($.loggedIn) {
            mod.renderLoggedIn(req, res, file);
        }
        else {
            mod.renderLoggedOut(req, res, file);
        }
    });

      /**
     * GET
     * '/u/'+username
     * Server-Side User profile page
     * //TODO generate from restful api
     */
    appRouter.get('/u/:user', function (req, res) {
        // console.log(req.params.user);
        var $ = req.session;
        var file = "sprof";

        if ($.loggedIn) {
            mod.renderLoggedIn(req, res, file);
        }
        else {
            mod.renderLoggedOut(req, res, file);
        }
    });


    /**
     * GET
     * '/p/'+paper
     * User paper page
     * //TODO generate from restful api
     */
    appRouter.get('/p/:paper', function (req, res) {
        // req.params.user;
        var $ = req.session;
        var file = "paper";

        if ($.loggedIn) {
            mod.renderLoggedIn(req, res, file);
        }
        else {
            mod.renderLoggedOut(req, res, file);
        }
    });

    appRouter.get('/sitemap.xml', function (req, res){
		 res.header('Content-Type', 'application/xml');
	  	 res.sendFile(appRoot+'/views/sitemap.xml');
    });

    appRouter.get('/:file', function (req, res) {
        //TODO q doesn't work on / ONLY index
        var $ = req.session;
        var file = req.params.file;

        // if ($.user) {
        //     if ($.user.Created.contains('T')) {
        //         $.user.Created = $.user.Created.substring(4, 15);
        //         // console.log($.user.Created);
        //     }
        //     if ($.user.DateOfBirth.contains('T')) {
        //         $.user.DateOfBirth = $.user.DateOfBirth.substring(4, 15);
        //         // console.log($.user.DateOfBirth);
        //     }
        // }

        if ($.loggedIn) {
            mod.renderLoggedIn(req, res, file);
        }
        else {
            mod.renderLoggedOut(req, res, file);
        }

    });

    return appRouter;
};
