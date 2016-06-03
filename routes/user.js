var path 					= require("path");
var fs						= require('fs');
var ejs 					= require('ejs');
var url 					= require('url');
var async					= require('async');
var crypto 				= require("crypto");
var remove 				= require("remove").removeSync;

var tmpdir			= path.join(__dirname, "../upload_file");
var dbdir				= path.join(__dirname, "../database");
var download_tmp_dir				= path.join(__dirname, "../download_tmp");


var sessionStore			= require(path.join(__dirname, './../app.js')).sessionStore;
var UserManager		= require(path.join(__dirname, './../custom_module/user.js'));

exports.login_user = function(req, res){
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	
	var filter = {};
	filter.user_id = req.body.id;
	
	UserManager.getUser(filter, function(user) {
		res.setHeader('Content-Type', 'application/json');
		if (user) {
			user.login(req.body.id, req.body.pw, function(success) {
				if (success) {
					req.session.access_time = new Date();
					req.session.user = user;
				}
				res.send(JSON.stringify(success));
			});
		} else {
		    res.send(JSON.stringify(false));
		}
	});
};

exports.logout_user = function(req, res){
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	
	if (req.session.user) {
		try{
			remove(path.join(download_tmp_dir, req.sessionID));
		}catch(e){}
		try{
			remove(path.join(tmpdir, req.session.user.user_id));
		}catch(e){}
		delete req.session.user; // 유저 삭제
		req.session.destroy(); // 세션 삭제
		res.clearCookie('sid'); // 세션 쿠키 삭제
	}
	res.redirect("login");
};