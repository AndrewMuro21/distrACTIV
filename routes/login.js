
var data = require('../public/data.json');
var act = require('../public/activities.json');
const fs = require('fs');

exports.view = function(req, res) {
	let template = {
  "activity_name": "",
  "hours": "",
  "mins": "",
  "active_user": "",
  "date": "",
  "duration": "",
  "distractions": [],
  "mostCommon": ""

};	
	let write = JSON.stringify(template, null, 2);
	fs.writeFileSync('./public/data.json', write);
	res.render('login', act);
}

// TODO check if user exists
exports.checkUser = function(req,res){
	res.json(act);
}

// save user in data
exports.log = function(req, res) {
	var name = req.params.name;
	data.active_user = name;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	res.json(data);
}

exports.sig = function(req, res) {
	var name = req.params.name;
	var email = req.params.email;
	var password = req.params.password;
	data.active_user = name;
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);

	let template = 
		{
			"name" : "",
			"pass" : "",
			"mail" : "",
			"activities": [
			]
		};
/*		{
			"name" : "",
			"pass" : "",
			"mail" : "",
			"activities": [
				{
          "name": "",
          "instances": [
            {
              "duration": "",
              "distractions": [
              ],
              "mostCommon": ""
            }
          ]
        		}
			]
		};*/

	template.name = name;
	template.mail = email;
	template.pass = password;

	act.users.push(template);
	let newAct = JSON.stringify(act, null, 2);
	fs.writeFileSync('./public/activities.json', newAct);

	res.json(data);
}