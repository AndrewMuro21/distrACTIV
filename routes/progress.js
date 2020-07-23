/*
 * GET progress page.
 */

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


exports.view = function(req, res){
	data["viewAlt"] = false;
	res.render('progress', data);
}

exports.view2 = function(req, res){
	data["viewAlt"] = true;
	res.render('progress', data);
}

exports.save = function (req, res){
	let flag = false;
	let dist = req.params.dist;
	if(data.distractions.length == 0) {
		dist = {
			"type": `${dist}`,
			"count": "1"
		};
		data.distractions.push(dist);
	} else {
		for(let val of data.distractions){
			if(val.type == dist) {
				console.log("same");
				val.count++;
				flag = true;
				break;
			} else {
				console.log("different");
			}
		}
		if(!flag){
			dist = {
			"type": `${dist}`,
			"count": "1"
			};
			data.distractions.push(dist);
		}
	}
	let write = JSON.stringify(data, null, 2);
	fs.writeFileSync('./public/data.json', write);
	res.json(data);
}

//insert into database
exports.complete = function(req, res){
	let total = req.params.total;
	let dur = req.params.dur;

	//first insert the specific activity instance data
	var sql = "INSERT INTO activity_data (act_id, duration, total) VALUES (" + data.activity_id + ",'" +dur + "','" + total + "')";
	con.query(sql, function (err) {
		if (err) throw err;
		console.log("new activity instance");
		//get the id for the inserted activity
		var sqlId = "SELECT act_data_id FROM activity_data WHERE act_id = " + data.activity_id + " ORDER BY act_data_id DESC LIMIT 1";
		con.query(sqlId, function (err, result) {
			if (err) throw err;
			//console.log(result);
			var curActInstanceId = result[0].act_data_id;
			//console.log(curActInstanceId)

			
		//then insert each distraction
			for (i=0; i<data.distractions.length; i++) {
				var sqlDistraction = "INSERT INTO distractions (act_data_id, type, count) VALUES (" + curActInstanceId + ",'" + data.distractions[i].type + "','" + data.distractions[i].count +"')";	
				con.query(sqlDistraction, function(err){
					if (err) throw err;
				});
			}
		});	
	});
	res.json(data);
}

