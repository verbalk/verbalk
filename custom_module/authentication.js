var path = require("path");
var fs = require("fs");
var async = require("async");
var remove 				= require("remove").removeSync;

var tmpdir			= path.join(__dirname, "../upload_file");
var dbdir				= path.join(__dirname, "../database");
var download_tmp_dir				= path.join(__dirname, "../download_tmp");

var logout_timer = 1000 * 60 * 180; // 3시간

module.exports.isLogin = function(req, res, next){
	if (!req.session.user) { res.redirect("login"); return; }

	// 일정시간 초과후 강제 로그아웃
	var now = new Date();
	var duration = now.getTime() - new Date(req.session.access_time).getTime();
	if (duration > logout_timer) {
		try{
			remove(path.join(download_tmp_dir, req.sessionID));
		}catch(e){}
		try{
			remove(path.join(tmpdir, req.session.user.user_id));
		}catch(e){}
		
		delete req.session.user; // 유저 삭제
		req.session.destroy(); // 세션 삭제
		res.clearCookie('sik'); // 세션 쿠키 삭제
		res.redirect("login?timeout=1");
	} else {
		req.session.access_time = now;
		next();
	}
};

module.exports.isLogout = function(req, res, next){
	if (req.session.user) { res.redirect("/"); return; }
	next();
};