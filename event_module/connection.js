var path				= require("path");

module.exports = function(io){
	io.sockets.on("connection",function(socket){
		socket.session = socket.client.conn.request.session;
		if (!socket.session || !socket.session.user) { return; } // 비로그인시 차단
		socket.session.project = null; // 초기화
	});
};