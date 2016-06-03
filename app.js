var express				= require('express');
var app 					= express();
var os 					= require('os');
var routes 				= require('./routes');
var user					= require('./routes/user');
//var routes					= require('./routes/socket.room.js');
var remove 				= require("remove").removeSync;
var engine 				= require('ejs-locals');
var http 					= require('http');
var path 					= require('path');
var socketio 			= require("socket.io");
var fs 					= require("fs");
var util 					= require('util');
var cookieParser		= require('cookie-parser');
var cookie				= require('cookie');
//login session
var session				= require('express-session');

var authentication		= require(path.join(__dirname, './custom_module/authentication.js'));
var system_event		= require(path.join(__dirname, './event_module/events_module.js'));

var dbdir				= path.join(__dirname, "/database");

app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser( {uploadDir:__dirname+'/image'} ));
app.use(express.cookieParser());

app.use(express.static(__dirname + '/public'));

app.use(session({
	// 설정
	store : module.exports.sessionStore,
	key : 'sik', // 세션키
	secret : 'keyboardpass', // 비밀키
	cookie : {
		maxAge : 1000 * 60 * 60 * 24 * 365 * 200, // 200년
	},
	saveUninitialized : true,
	resave : false
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/', authentication.isLogin, routes.index);
app.get('/index', authentication.isLogin, routes.index);
app.get('/login', authentication.isLogout, routes.login);

app.post('/login_user', authentication.isLogout, user.login_user);
app.get('/logout_user', authentication.isLogin, user.logout_user);

var server=http.createServer(app);

var io=socketio.listen(server);

io.sockets.on( 'connection', function(socket){
	socket.on( 'join', function(data){
		/*test*/console.log(data) 
		socket.join(data); 
		socket.room = data; 
	});
	
	socket.on( 'message', function(data){

		console.log( 'id : %s, msg : %s, date : %s', data.id, data.message, data.date );
		io.sockets.emit( socket.room ).emit('message', data); 
	});
});

module.exports.io = io;


server.listen(8000, function(){ 
	console.log('server port: ' + app.get('port'));
});



//Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
var addedUser = false;

// when the client emits 'new message', this listens and executes
socket.on('new message', function (data) {
 // we tell the client to execute 'new message'
 socket.broadcast.emit('new message', {
   username: socket.username,
   message: data
 });
});

// when the client emits 'add user', this listens and executes
socket.on('add user', function (username) {
 if (addedUser) return;

 // we store the username in the socket session for this client
 socket.username = username;
 ++numUsers;
 addedUser = true;
 socket.emit('login', {
   numUsers: numUsers
 });
 // echo globally (all clients) that a person has connected
 socket.broadcast.emit('user joined', {
   username: socket.username,
   numUsers: numUsers
 });
});

// when the client emits 'typing', we broadcast it to others
socket.on('typing', function () {
 socket.broadcast.emit('typing', {
   username: socket.username
 });
});

// when the client emits 'stop typing', we broadcast it to others
socket.on('stop typing', function () {
 socket.broadcast.emit('stop typing', {
   username: socket.username
 });
});

// when the user disconnects.. perform this
socket.on('disconnect', function () {
 if (addedUser) {
   --numUsers;

   // echo globally that this client has left
   socket.broadcast.emit('user left', {
     username: socket.username,
     numUsers: numUsers
   });
 }
});
});

