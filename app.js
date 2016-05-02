var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var engine = require('ejs-locals');
/*var bodyParser = require('body-parser');*/
var http = require('http');
var path = require('path');
var app = express();



// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
//parse application/json
/*app.use(bodyParser()); // pull information from html in POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());*/

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('server start! port: ' + app.get('port'));
});

