$(".signUp").hide();
$("#signUpClick").on("click", function(){
    $(".signUp").show();
    $(".login").hide();
});
$("#loginClick").on("click", function(){
    $(".login").show();
    $(".signUp").hide();
});