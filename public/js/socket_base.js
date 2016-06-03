$(function(){
	socket = io.connect();
	socket.on("disconnect", function(){
		socket = io.connect();
	});
});

function timeview(t){
	var d = new Date(t);
	var time = ""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
	return time;
}