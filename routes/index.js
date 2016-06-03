var path 					= require("path");
var fs						= require('fs');
var ejs 					= require('ejs');
var url 					= require('url');
var async					= require('async');
var mime					= require('mime');

var UserManager		= require(path.join(__dirname, './../custom_module/user.js'));
//var wip_function		= require(path.join(__dirname, './../custom_module/wip_function.js'));

var tmpdir			= path.join(__dirname, "../upload_file");
var dbdir				= path.join(__dirname, "../database");
var download_tmp_dir				= path.join(__dirname, "../download_tmp");

exports.login = function(req, res){
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	
	var params = url.parse(req.url, true).query;
	
	var ejs_value = {page:"Login"};
	ejs_value.user = req.session.user;
	
	if (params.timeout) {
		ejs_value.timeout = true;
	}
	
	res.render("login", ejs_value);
};

exports.index = function(req, res){
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	
	
	var ejs_value = {page:"index"};
	ejs_value.user = req.session.user;
	
	res.render("index", ejs_value);
};









