var fs=require("fs");
var url = require('url');
var path = require('path');
var queries = require(path.join(__dirname, './../custom_modules/queries.js'));

module.exports = function(req,res){
	if(req.session.uid){
		var vid = url.parse(req.url,true).path;
		vid = vid.split('.');
		vid = vid[0];
		vid = vid.split('/');
		vid = vid[1];
		queries.getContents({idx:vid},function(data){
			if(data){
				var file = path.join("video",data[0].video_path);
				fs.exists(file, function(exists){
					if(exists===true){
						var file = path.join("video",data[0].video_path);
						var stat = fs.statSync(file);
						var total = stat.size;
						if (req.headers['range']) {
							var range = req.headers.range;
							var parts = range.replace(/bytes=/, "").split("-");
							var partialstart = parts[0];
							var partialend = parts[1];
							var start = parseInt(partialstart, 10);
							var end = partialend ? parseInt(partialend, 10) : total-1;
							var chunksize = (end-start)+1;
							var chunktruck = 0;
							var file = fs.createReadStream(file, {
								start: start,
								end: end
							});
							res.writeHead(206, {
								'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
								'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
								'Content-Type': 'video/mp4'
							});
							file.pipe(res);
							queries.processViewOfContents(vid, req.session.uid, chunktruck, end, data[0].category, function(data){
								if(data){
									console.log(data);
								}
							});
						} else {
							console.log('ALL: ' + total);
							res.writeHead(200, {
								'Content-Length': total,
								'Content-Type': 'video/mp4'
							});
							fs.createReadStream(file).pipe(res);
						}
					}
				});
			}else{
				var message="Error! 404 Not found.";
				var total= message.size;
				res.write(message);
				res.end();
			}
		});
	}
};