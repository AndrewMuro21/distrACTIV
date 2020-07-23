
var data = require('../public/data.json');
var act = require('../public/activities.json');
const fs = require('fs');

var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Amsql21",
	database: "distractiv"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("connected");
});

exports.view = function(req, res) {
	let template = {
  "activity_name": "",
  "hours": "",
  "mins": "",
  "active_user": "",
  "user_id": 0,
  "activity_id": "",
  "date": "",
  "duration": "",
  "distractions": [],
  "mostCommon": ""

};	
	let write = JSON.stringify(template, null, 2);
	fs.writeFileSync('./public/data.json', write);

	res.render('login', act);
}


exports.checkUser = function(req,res){
	var name = req.params.name;
	con.query("SELECT * FROM users WHERE username='" +name +"'", function (err, result, fields) {
		if (err) result = [];
		res.send(result);
		});
}

exports.fbCheckUser = function(req,res){
	var name = req.params.username;
	var id = req.params.id;
	var sql = "SELECT * FROM users WHERE username='" +name +"' AND fbID='" +id +"'";
	con.query(sql, function (err, result, fields) {
		if (err) result = [];
		res.send(result);
		});
}

exports.normalLogCheck = function(req,res){
	var name = req.params.name;
	var pass = req.params.password;
	var sql = "SELECT * FROM users WHERE username='" +name+ "' AND password='" + pass +"'";
	con.query(sql, function (err, result, fields) {
		if (err) result = [];
		//console.log(result);
		res.send(result);
	});
}


// save user in data
exports.log = function(req, res) {
	var name = req.params.name;
	var userId = req.params.id;
	data.active_user = name;
	data.user_id = userId;
	//data.fbID="";
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	res.json(data);
}

//save fb user in data
exports.fbLog = function(req,res){
	var name = req.params.name;
	//var fbId = req.params.fbId;
	var usId = req.params.userId;
	data.active_user = name;
	//data.fbID = fbId;
	data.user_id= usId;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	res.json(data);
}

//normal login new user
exports.sig = function(req, res) {
	var name = req.params.name;
	var u_email = req.params.email;
	var u_password = req.params.password;
	//insert user into user table
	var sql = "INSERT INTO users (username, password, email) VALUES ('" + name + "','" +u_password + "','" + u_email + "')";
  	con.query(sql, function (err) {
		if (err) throw err;
		console.log("new user inserted");
		var getUserId = "SELECT user_id FROM users WHERE username ='" + name + "' AND email ='" + u_email +"' AND password='" + u_password +"'";
		con.query(getUserId, function (err, result) {
		  if (err) throw err;
		  //update data.json
		  data.active_user = name;
		  data.user_id = result[0].user_id;
		  let write = JSON.stringify(data, null, 2);
		  fs.writeFileSync('./public/data.json', write);
		  res.json(data);
		});
  	});
}

//new fb user
exports.fbCreateUser = function(req,res) {
	var name = req.params.name;
	var id = req.params.id;
	data.active_user = name;
	//data.fbID = id;

	//insert user into user table
	var sql = "INSERT INTO users (username, fbID) VALUES ('" + name + "','" +id + "')";
  	con.query(sql, function (err) {
		if (err) throw err;
		console.log("new fb user inserted");
		var getUserId = "SELECT user_id FROM users WHERE username ='" + name + "' AND fbID ='" + id +"'";
		con.query(getUserId, function (err, result) {
			if (err) throw err;
			//update data.json
			data.user_id = result[0].user_id;
			let write = JSON.stringify(data, null, 2);
			fs.writeFileSync('./public/data.json', write);
			res.json(data);
		});
  	});
}