
// Dependencies
var express = require('express'),
	config = require('config'),
	routes = require('./routes'),
	app = module.exports = express.createServer();

// Configuration
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.post('/train', routes.train);
app.post('/guess', routes.guess);

app.listen(config.server.port, function(){
	console.log("Express server listening on port %d in %s mode",
		app.address().port, app.settings.env);
});
