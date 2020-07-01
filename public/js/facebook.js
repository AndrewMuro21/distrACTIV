//
var name = "";
var id="";

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
  name = response.name;
  id = response.id;
  //console.log(response.id);
  $.get("/login/username/id", fbExistingUser);
}

function fbExistingUser(result){
  var exists = null; 
 // console.log("existingUser "+ name);

  //fb user exists
  for(var i = 0; i<result['users'].length; i++){
    if((result['users'][i]['name'] == name) && (result['users'][i]['fbID'] == id)){
      exists = true;    
      $.get('/fbLogin/' + name + "/" + id, redirect);

    }
  }  
  
  //fb user doesn't exist
  if(exists != true){
    $.get("/login/" + name + "/" + id, redirect);
  }
}



function redirect(result){
  window.location.href = "/home";
} 