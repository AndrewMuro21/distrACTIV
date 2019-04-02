//
var name = "";
var email="example@gmail.com";

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
  console.log('Facebook login status changed.');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
        console.log('Successfully logged in with Facebook');
        FB.api('/me?fields=name,first_name,picture.width(480)', changeUser);
  }
}

function changeUser(response) {
  name = response.first_name;
  console.log("changeUser " + name);
  $.get("/login/username/password", redirect);
}

function existingUser(result){
  var exists = null; 
  console.log("existingUser "+ name);
  
  for(var i = 0; i<result['users'].length; i++){
    if(result['users'][i]['name'] == name){
      exists = true;    
      $("#userExists").modal('show');

    }
  }   
  if(exists != true){

    console.log("signup "+ name + "  " + email);
    $.get("/signup/Kush/noneCares@gmail.com", redirect);
    //console.log("no user found");
  } else {
    $.get("/login/" + name, redirect);
  }
}

function redirect(result){
  window.location.href = "/home";
} 