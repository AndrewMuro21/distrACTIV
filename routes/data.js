 /*
 * GET data page.
 */
var data = require('../public/data.json')
var act = require('../public/activities.json');


exports.view = function(req, res){

	for (let val of act.users){
		if(val.name == data.active_user && val.fbID == data.fbID){
			var curAct = val;
		}
	}
	console.log(curAct);
	res.render('data', curAct);


};


exports.updateChart = function(request, response){

	for (let val of act.users){
		if(val.name == data.active_user && val.fbID == data.fbID){
			var curAct = val;
		}
	}
	console.log(curAct);
  	response.json(curAct);
};

