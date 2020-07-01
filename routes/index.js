var data = require("../public/data.json");
var fs = require("fs");
var acts = require("../public/activities.json");
/*
 * GET home page.
 */

exports.view = function(req, res){
	var name = data.active_user;
	var curfbID = data.fbID;
	console.log(`name is ${name}`);
	for(let val of acts.users){
		if(val.name == name && val.fbID == curfbID){
			var actData = val;
		}
	} 
	//console.log(actData);
  	res.render('index', actData);
}

exports.next = function(req, res){
	var name = req.params.name;
	var hrs = req.params.hrs;
	var mins = req.params.mins;

	data.activity_name = name;
	data.hours = hrs;
	data.mins = mins;
	data.date = new Date();
	data.distractions = [];
	if((typeof data)==='object') {
		var write = JSON.stringify(data, null, 2);
	}
	fs.writeFileSync('./public/data.json', write);
	res.json(data);
}

