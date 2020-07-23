var data = require("../public/data.json");
var fs = require("fs");
var acts = require("../public/activities.json");

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
/*
 * GET home page.
 */

//populates dropdown
exports.view = function(req,res){
	var curUserId = data.user_id;
	var sql = "SELECT act_name FROM activities WHERE user_id = " + curUserId;
	con.query(sql, function (err, result) {
		if (err) throw err;
		var allActNames = {"titleList" : []}
		for (i=0; i<result.length; i++){
			allActNames.titleList.push({"title": result[i].act_name});
		}
		//console.log(allActNames);
		res.render('index', allActNames);
  	});
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
	
	//if activity doesn't exist in the activities table, then insert activity into activity table
	var sqlCheck = "SELECT act_id FROM activities WHERE user_id = '" + data.user_id + "' AND act_name = '" + data.activity_name + "'" ;
	con.query(sqlCheck, function(err, result) {
		if (err) throw err;
		//console.log(result);
		if (result.length == 0) {
			var sql = "INSERT INTO activities (user_id, act_name) VALUES ('" + data.user_id + "','" +data.activity_name + "'"+ ")";
			con.query(sql, function (err) {
		  		if (err) throw err;
				console.log("new activity inserted");
			    con.query(sqlCheck, function(err, result) {
					if (err) throw err;
					data.activity_id = result[0].act_id;
				});
			});
		}
		else data.activity_id = result[0].act_id;
		
		if((typeof data)==='object') {
			var write = JSON.stringify(data, null, 2);
		}
		fs.writeFileSync('./public/data.json', write);
	});	
	res.json(data);
}

