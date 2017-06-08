$(document).ready(function(){
    $(".submenu a").click(function(){
        $(this).siblings(".dropdown").slideToggle();
    });
});
