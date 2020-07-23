'use strict';

$(document).ready(function(e){
	$(".signup").hide();
});

//on login page, click sign up to show sign up page
$(".signup-btn").click(function(e){
	e.preventDefault();
	$(".login").hide();
	$(".signup").show();
});

//on create account/sign up page, click to go back to login
$(".login-btn").click(function(e){
	e.preventDefault();
	$(".signup").hide();
	$(".login").show();
});



//on login page
$("#log").click(function(e){
	e.preventDefault();
	//reset data target
	$("#log").attr('data-target', "#");


	var name = $("#log-name").val();
	var pass = $("#log-pass").val();
	//error modal
	if(name=="" | pass==""){
		$("#log").attr('data-target', "#logAndSignReq");
	}
	else if(name!="" && pass!=""){
		$.get("/checkUser/" +name+ "/"+ pass, userCheck);
	}
});

function userCheck(result){
	var name = $("#log-name").val();
	//user found
	//console.log(result);
	if (result.length > 0){
		$.get("/login/" + name +"/" + result[0].user_id, redirect);
	}
	//user not found	
	else{
		$("#notFound").modal('show');
	}
}

//on create account/sign up page, click sign up to sign up, goes to start activity
$("#sig").click(function(e){
	e.preventDefault();
	//reset data target
	$("#sig").attr('data-target', "#");

	var email = $("#inputEmail").val();
	var name = $("#sig-name").val();
	var pass= $("#passWord").val();
	//error modal
	if(email=="" | name=="" | pass==""){
		$("#sig").attr('data-target', "#logAndSignReq");
	}
	else{
		$.get("/login/" + name, existingUser); 

	}
});


function existingUser(result){
	//console.log(result);
	var name = $("#sig-name").val();
	var email = $("#inputEmail").val();
	var pass= $("#passWord").val();
	var exists = null; 

	if (result.length > 0){
		$("#userExists").modal('show');
	}
	else{
		$.get("/signup/" + name + "/" + email + "/" + pass, redirect);
	}
}

function redirect(result){
	window.location.href = "/home";
} 