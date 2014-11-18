var server = require("./server");
var router = require("./router");
var db = require('./database');

var handlers = {
		ide : require('./ideHandler')
	};


server.start(router.route, db, handlers);
