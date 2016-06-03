var height = 0;
$('content p').each(function(i, value){
    height += parseInt($(this).height());
});

height += '';

$('content').animate({scrollTop: height});