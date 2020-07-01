/*
 * GET progress page.
 */

var data = require("../public/data.json");
var fs = require("fs");
var acts = require("../public/activities.json");


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

exports.complete = function(req, res){
	let total = req.params.total;
	let dur = req.params.dur;
	let name = data.active_user;
	let curfbID = data.fbID;
	let template = {"name": data.activity_name, "instances": [{"duration" : dur, "distractions": data.distractions, "mostCommon": "", "total": total}]};
	let flag = false;

	for(let val of acts.users){
		if(val.name == name && val.fbID == curfbID) {
			if(val.activities.length == 0){
				val.activities.push(template);
				break;
			} else {
				for(let activity of val.activities) {
					if(activity.name == data.activity_name){
						activity.instances.push({"duration": dur, "distractions": data.distractions, "mostCommon": "", "total": total});
						flag = true;
						break;
					}				
				}
				if(!flag){
					val.activities.push(template);
				}
			}
			break;
		}
	}

	let write = JSON.stringify(acts, null, 2);
	fs.writeFileSync('./public/activities.json', write);
	res.json(acts);

}

