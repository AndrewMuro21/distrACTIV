 /*
 * GET data page.
 */
var data = require('../public/data.json')
var act = require('../public/activities.json');

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
	var curUserId = data.user_id;
	var sql = "SELECT act_name FROM activities WHERE user_id = " + curUserId;
	con.query(sql, function (err, result) {
		if (err) throw err;
		var allActNames = {"titleList" : []};
		for (i=0; i<result.length; i++){
			allActNames.titleList.push({"title": result[i].act_name});
		}
		res.render('data', allActNames);
  	});
};


exports.updateChart = function(request, response){
	//var curAct = getActID(request.params.activity, data.user_id);
	//console.log(curAct);
	//console.log(getActID(request.params.activity, data.user_id));
	//response.json(getActID(request.params.activity, data.user_id));


	response.json({"hi": "yo"});

	//get the activity id for this user
	/*var sqlActId = "SELECT act_id FROM activities WHERE act_name = '" + request.params.activity +"' AND user_id = " + data.user_id;
	con.query(sqlActId, function (err, result) {
		if (err) throw err;
		//console.log(result);
		var actId = result[0].act_id;

		//push the instances
		var actInstances = {"instances" : []};
		var sql = "SELECT * FROM activity_data WHERE act_id = " + actId;
		con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result);
			for (i=0; i<result.length; i++){
				var template = {"duration": result[i].duration, "total": result[i].total, "distractions": []}
				var distractionSQL = "SELECT * FROM distractions WHERE act_data_id =" + result[i].act_data_id;
				con.query(distractionSQL, function (err, result) {
					if (err) throw err;
					//console.log(result);
					for (i=0; i<result.length; i++){
						template.distractions.push({"type" : result[i].type, "count": result[i].count});
					}
					actInstances.instances.push(template);
					console.log(template);

				});	
				//console.log(template);			
			}
			//console.log(actInstances);
			//response.json(actInstances);
		});

		//console.log(actInstances);
		//response.json(actInstances);
	});*/

};

function getActID(actName, userID){
	//get the activity id for this user
	var sqlActId = "SELECT act_id FROM activities WHERE act_name = '" + actName +"' AND user_id = " + userID;
	con.query(sqlActId, function (err, result) {
		if (err) throw err;
		//console.log(result);
		var actId = result[0].act_id;
		/*return*/ getActivities(actId);
		//console.log(getActivities(actId));
	});
}


function getActivities(activityID){
	//push the instances
	var actInstances = {"instances" : []};
	var sql = "SELECT * FROM activity_data WHERE act_id = " + activityID;
	con.query(sql, function (err, result) {
		//need to pass in 
		var act_ID_vals = ""
		for (i=0; i<result.length; i++){
			//console.log(getDistractions(result[i].duration, result[i].total, result[i].act_data_id));
			actInstances.instances.push({"duration": result[i].duration, "total": result[i].total, "act_data_id": result[i].act_data_id, "distractions": []});
			//act_ID_arr+= result[i].act_data_id;   //   .push(result[i].act_data_id);
			if(i != result.length - 1){
				act_ID_vals += result[i].act_data_id + ",";
			}
			else{
				act_ID_vals += result[i].act_data_id;
			}
		}
		//console.log(actInstances);
		//console.log(act_ID_arr);
		/*return(*/getDistractions(actInstances, act_ID_vals);
		//return getDistractions(actInstances);
		//return getDistractions(result[i].duration, result[i].total, result[i].act_data_id);
		//if (err) throw err;
		//console.log(result);
		/*for (i=0; i<result.length; i++){
			//console.log(getDistractions(result[i].duration, result[i].total, result[i].act_data_id));
			actInstances.instances.push(getDistractions(result[i].duration, result[i].total, result[i].act_data_id));
			console.log(actInstances);
			if (i == result.length) {
			console.log(actInstances);
			}
		}
		//console.log("here");
		//return actInstances;*/
	});
}

/*function eachActivity(result){
	var actInstances = {"instances" : []};

}*/
//function getDistractions(result)



function getDistractions(actInstances, act_ID_vals/*duration, total, act_data_id*/){
	var sql = "SELECT * FROM distractions WHERE act_data_id IN (" + act_ID_vals + ")";
	con.query(sql, function (err, result) {
		if (err) throw err;
		//console.log(result);
		var start = 0;
		for( i = 0; i<actInstances.instances.length; i++){
			for(j=start; j<result.length; j++){
				if(actInstances.instances[i].act_data_id == result[j].act_data_id){
					actInstances.instances[i].distractions.push({"type" : result[j].type, "count": result[j].count});
				}
				else{
					start = j;
					break;
				}
			}
			//console.log(actInstances.instances[i].distractions);
		}
		//console.log(JSON.stringify(actInstances));
		return actInstances;
		//return(JSON.stringify(actInstances));

		//return (JSON.stringify({"HI": 2}));
	});
	/*for(i=0; i < actInstances.instances.length; i++){
		var sql = "SELECT * FROM distractions WHERE act_data_id =" + actInstances.instances[i].act_data_id;
		//console.log(sql);
		index = i;
		console.log(index);
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log(result);
			//index -= 1;
			for(i=0; i< result.length; i++){
				actInstances.instances[index].distractions.push({"type" : result[i].type, "count": result[i].count});
				//console.log(actInstances);
				console.log(actInstances.instances[index]);
			}
			//console.log(actInstances.instances[index]);
			//actInstances.instances[index].distractions.push({"type" : result[index].type, "count": result[index].count});
			//console.log(actInstances);
			/*if(index == actInstances.instances.length){
				console.log(actInstances);
			}
		});


	}*/
	//console.log(actInstances);
	
	//var distractionSQL = "SELECT *," + duration + " as duration," + total + " as total FROM distractions WHERE act_data_id = " + act_data_id;
	//console.log(distractionSQL);
	/*var distractionSQL = "SELECT * FROM distractions WHERE act_data_id =" + act_data_id;
	var template = {"duration": duration, "total": total, "distractions": []}
	con.query(distractionSQL, function (err, result) {
		if (err) throw err;
		//console.log(result);
		//return result;
		//console.log(result);
		for (i=0; i<result.length; i++){
			template.distractions.push({"type" : result[i].type, "count": result[i].count});
		}
		return JSON.stringify(template);
		//console.log(JSON.stringify(template));
		//return "hi";//JSON.stringify(template);
	});	*/
}

//function getDistForAll(actInstances, )