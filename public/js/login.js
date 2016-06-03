$(function() {
    $('#login-btn').on('click', function () {
        if ($('#login-btn')) {
        	login();
        }
    });
});
function login() {
	var user = {};
	user.id = $('#user_input').val();
	user.pw = $('#password_input').val();
	
	var url = "/login_user";
	var posting = $.post(url, user);
	
	posting.done(function(success) {
		if (success) {
			location.href = "/";
		} else {
			alert('로그인 실패');
		}
	});
}