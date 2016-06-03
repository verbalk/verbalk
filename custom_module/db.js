var path = require("path");
var crypto = require("crypto");
var UserManager = require(path.join(__dirname, './user.js'));

var users = [];

users.push(new UserManager.User({
	user_id : "admin",
	user_pw : "c3ed60b5319bf21c6c0bd49ffd67087a808de673b6e4ae0c67a07ddecd4bf640",
	data : {}
}));

module.exports.getUser = function(user, callback) {
	var user = users.filter(function(e){ return e.user_id == user.user_id; });
	if (user.length > 0) {
		callback(user[0]);
	} else {
		callback(false);
	}
};

module.exports.updateUser = function(user, callback) {
	module.exports.getUser(user, function(origin_user) {
		if (origin_user) {
			origin_user.user_id = user.user_id;
			origin_user.user_pw = user.user_pw;
			origin_user.data = user.data;
		} else {
			users.push(new UserManager.User(user));
		}
		callback();
	});
};

