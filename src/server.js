var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jade = require('jade');
var session = require('express-session');
var compress = require('compression');
var bodyparse = require('body-parser');

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(compress());
app.use(bodyparse.json());



// Start http server,MongoDB, sockets and initialize routing or fail gracefully
var start = function(connection, route, db, handlers) {
	console.log("------- Startup --------");
	app.connection = connection;

	db.connect(connection, function(dbm,srv){
		console.log('MONGO: Database found. (Port %d)', srv.dbPort);
		http.listen(srv.httpPort, function(err){

			console.log('HTTP: Server Started. (Port %d)', srv.httpPort);

			handleInit(handlers,db,function(){
				route(app, db, handlers);
				finalizeInit();
			});
		});

	},
	function(err,srv){
		console.error('ERR: Mongo database not found on %s:%d. Exiting.',srv.address, srv.dbPort);
		console.error(err);
		console.error('----');
		finalizeInit();
	});

}

// Depricated Method, contained socket.io events,
// Retained to handle user-related events later
var handleInit = function(handlers,db,callback){
	Object.keys(handlers).forEach(function(key){
		handlers[key].init(app,io,db,session,handlers.auth);
	})
	callback();
}

// Final output for startup
var finalizeInit = function(){
	console.log("------------------------");
}




exports.start = start;