var twitterConfig = require('./twitterConfig');

module.exports = {
	http : {
		host : '127.0.0.1',
		port : 8888,
	},

	db : {
		host : '127.0.0.1',
		port : 27017,
		database : 'codeucation',
	},

	auth : {
		twitter : twitterConfig
	}
}
