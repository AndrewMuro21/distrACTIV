
var data = require('../public/data.json');
var act = require('../public/activities.json');
const fs = require('fs');

exports.view = function(req, res) {
	let template = {
  "activity_name": "",
  "hours": "",
  "mins": "",
  "active_user": "",
  "fbID": "",
  "date": "",
  "duration": "",
  "distractions": [],
  "mostCommon": ""

};	
	let write = JSON.stringify(template, null, 2);
	fs.writeFileSync('./public/data.json', write);
	//fs.writeFile('./public/data.json', write);
	res.render('login', act);
}

// TODO check if user exists
exports.checkUser = function(req,res){
	res.json(act);
}

// save user in data
exports.log = function(req, res) {
	var name = req.params.name;
	//var id = req.params.fbID;
	//console.log(req.params);
	data.active_user = name;
	data.fbID="";
	//data.fbID = ;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	//fs.writeFile('./public/data.json', write);
	res.json(data);
}

//save fb user in data
exports.fbLog = function(req,res){
	var name = req.params.name;
	var id = req.params.id;
	data.active_user = name;
	data.fbID = id;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	//fs.writeFile('./public/data.json', write);
	res.json(data);
}

exports.sig = function(req, res) {
	var name = req.params.name;
	var email = req.params.email;
	var password = req.params.password;
	data.active_user = name;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	//fs.writeFile('./public/data.json', write);

	let template = 
		{
			"name" : "",
			"pass" : "",
			"mail" : "",
			"fbID" : "",
			"activities": [
			]
		};

	template.name = name;
	template.mail = email;
	template.pass = password;

	act.users.push(template);
	let newAct = JSON.stringify(act, null, 2);
	fs.writeFileSync('./public/activities.json', newAct);

	res.json(data);
}

exports.fbCreateUser = function(req,res) {
	var name = req.params.name;
	var id = req.params.id;
	data.active_user = name;
	data.fbID = id;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);

	let template = 
		{
			"name" : "",
			"pass" : "",
			"mail" : "",
			"fbID" : "",
			"activities": [
			]
		};

	template.name = name;
	template.fbID = id;

	act.users.push(template);
	let newAct = JSON.stringify(act, null, 2);
	fs.writeFileSync('./public/activities.json', newAct);

	res.json(data);
}