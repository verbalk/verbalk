var path = require("path");
var crypto = require("crypto");
var fs = require("fs");

var tmpdir = path.join(__dirname, "../upload_file");
var dbdir = path.join(__dirname, "../database");
var download_tmp_dir				= path.join(__dirname, "../download_tmp");

module.exports.User = function(user){
	this.user_id = user.user_id;
	this.user_pw = user.user_pw;
	this.data = user.data;
};

var db = require(path.join(__dirname, './db.js'));

//자바스크립트 함수객체
module.exports.User.prototype.login = function(id, pw, callback) {
	var pass = crypto.createHash('sha256').update(pw).digest('hex');
	this.data = {};
	var user_id = this.user_id;
	var user_pw = this.user_pw;
	
	db.updateUser(this, function() {
		if (user_id == id && user_pw == pass) { // 로그인 성공
			callback(true);
		} else { // 로그인 실패
			callback(false);
		}
	});
};

module.exports.User.prototype.existsFile = function(file_sha256, callback) {
	var file_path = path.join(path.join(tmpdir, this.user_id), file_sha256);
	fs.exists(file_path, function(exists) {
	    if (exists) {
	    	callback(true);
	    } else {
	    	callback(false);
	    }
	});
};

module.exports.User.prototype.setData = function(key, value, callback) {
	this.data[key] = value;
	db.updateUser(this, function() {
		callback();
	});
};

module.exports.User.prototype.getData = function(key) {
	return this.data[key];
};

module.exports.getUser = function(id, callback) {
	db.getUser(id, function(user) {
		callback(new module.exports.User(user));
	});
};




