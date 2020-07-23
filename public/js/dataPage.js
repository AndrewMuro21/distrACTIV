//Change activity type dropdown text to match selected text
$("#Type .dropdown .dropdown-menu li").click(function(e) {
	$("#Type .dropdown #actButton").text($(this).text());
	//call for user data and activities and distractions for this specific dropdown
	$.get("/data/charts/" + $(this).text(), addChart);
});


//set bar graph output
$("#Graph #Bar").click(function(e) {
	$("#Graph #Line").attr('class', "btnOff")
	$("#Graph #Bar").attr('class', "btnOn")
		
	//give correct class attribute for modal
	$("#dataGraph").removeClass("line").addClass("bar");

	//graph
	//call for user data
	$.get("/data/charts", addChart);

});

//set line graph output
$("#Graph #Line").click(function(e) {
	$("#Graph #Bar").attr('class', "btnOff")
	$("#Graph #Line").attr('class', "btnOn")

	//give correct class attribute for modal
	$("#dataGraph").removeClass("bar").addClass("line");

	//call for user data
	$.get("/data/charts", addChart);

});

//set previous graph output
$("#Timeline #Previous").click(function(e) {
	$("#Timeline #Last5").attr('class', "btnOff")
	$("#Timeline #Last10").attr('class', "btnOff")
	$("#Timeline #Previous").attr('class', "btnOn")
	//call create graph function


	//give correct class attribute for modal
	$("#dataGraph").removeClass("last5 last10").addClass("previous");

	//call for user data
	$.get("/data/charts", addChart);

});

//set last5 graph output
$("#Timeline #Last5").click(function(e) {
	$("#Timeline #Previous").attr('class', "btnOff")
	$("#Timeline #Last10").attr('class', "btnOff")
	$("#Timeline #Last5").attr('class', "btnOn")
		
	//call create graph function

	//give correct class attribute for modal
	$("#dataGraph").removeClass("previous last10").addClass("last5");

	//call for user data
	$.get("/data/charts", addChart);

});

//set last10 graph output
$("#Timeline #Last10").click(function(e) {
	$("#Timeline #Previous").attr('class', "btnOff")
	$("#Timeline #Last5").attr('class', "btnOff")
	$("#Timeline #Last10").attr('class', "btnOn")	
	//call create graph function

	//give correct class attribute for modal
	$("#dataGraph").removeClass("previous last5").addClass("last10");

	//call for user data
	$.get("/data/charts", addChart);

});


//display correct modal for data, doesn't depend on if you click a line or bar graph
$("#dataGraph").click(function(e){
	if($(this).hasClass("previous") == true){
		$("#dataGraph").attr('data-target', "#previousData" );
	}
	if($(this).hasClass("last5") == true){	
		$("#dataGraph").attr('data-target', "#last5Data" );
	}
	if($(this).hasClass("last10") == true){
		$("#dataGraph").attr('data-target', "#last10Data" );
	}
});


//later create graph function
function addChart(result){
	console.log(result);

	//get title
	var Title = $("#Type .dropdown #actButton").text();

	//get number timeframe
	var num = 0;
	if($("#dataGraph").hasClass("previous") == true){
		num = 1;
	}
	if($("#dataGraph").hasClass("last5") == true){
		num = 5;
	}
	if($("#dataGraph").hasClass("last10") == true){
		num = 10;
	}
	

	//get bar or line
	var graphType = null;
	if($("#dataGraph").hasClass("bar") == true){
		graphType = "column";
	}
	if($("#dataGraph").hasClass("line") == true){
		graphType = "line";
	}

	var dataPoints = [];
	dataPoints.push({label:1, y:2});

	/*get proper index following activities
	var actIndex = null;
	for(var i = 0; i<result['activities'].length; i++){
		//console.log(Title);
		//console.log(result['activities'][0]['name']);
		if(Title == result['activities'][i]['name']){
			actIndex = i;
			break;
		}
	}

	//do nothing if activity doesnt'exist
	if(actIndex == null){
		return;
	}

	//array to fill chart with points
	var dataPoints = [];


	//get start index of data
	var index = null;
	if(result['activities'][actIndex]['instances'].length>num){
		index = result['activities'][actIndex]['instances'].length - num;
	}
	else if(result['activities'][actIndex]['instances'].length<=num){
		index = 0;
	}
		
	//template for html modal words
	var chartModalTemp = "";

	var startGreater = 0;
	var startTrue = 0;

	//get proper counts, fill dataPoints
	for (var i = index, j = 1; i < num + index; i++, j++) {
		//input filler values for x-axis 
		if(i>=result['activities'][actIndex]['instances'].length){
			if(startTrue == 0){
				startGreater = j;
				startTrue = 1;
			}

			dataPoints.push({
				label: j			
			});

			if(i == (num-1)){
				if(startGreater!=num){
					chartModalTemp += '<p>' + startGreater +'-' + num +'. '+ 'No data for these activities.' +'</p>';
				}
				else{
					chartModalTemp += '<p>' + startGreater + '. '+ 'No data for activity.' + '</p>';
				} 
			}
		}

		else{
			//instance for when there are no distractions
			if(result['activities'][actIndex]['instances'][i]['distractions'].length == 0){
				dataPoints.push({
					label: j,
					y: 0
				});
				chartModalTemp += '<p>' + j + '. '+ '0 distractions. Great Job!' + 
				'<br>' + '&nbsp&nbsp&nbsp&nbspDuration: ' + result['activities'][actIndex]['instances'][j-1]['duration']
				+ '<br>' + '&nbsp&nbsp&nbsp&nbspMost Common: None' + '</p>';
			}
			//distractions exist
			else{
				dataPoints.push({
					label: j,
					y: parseInt(result['activities'][actIndex]['instances'][i]['total'])
				});

				//make another template to add to chart Modal temp that loops through result
				var helpTemp = "";

				var mostCommon = [];
				var max = 0;
				
				//get specific distractions and their counts, most Common as well
				for (var k = 0; k < result['activities'][actIndex]['instances'][i]['distractions'].length; k++){
					helpTemp += '<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspInstance: ' + 
					result['activities'][actIndex]['instances'][i]['distractions'][k]['type'] + ', count: '
					+ result['activities'][actIndex]['instances'][i]['distractions'][k]['count'];

					//most common check
					var maxCheck = parseInt(result['activities'][actIndex]['instances'][i]['distractions'][k]['count']);
					if( maxCheck > max){
						//reset mostCommon and push new distraction type
						mostCommon = [];
						mostCommon.push(result['activities'][actIndex]['instances'][i]['distractions'][k]['type']);
						max = maxCheck;
					}
					else if(maxCheck == max){
						mostCommon.push(result['activities'][actIndex]['instances'][i]['distractions'][k]['type']);
					}
				}

				//template for most Common 
				var mostCommonText = "";
				//fill mostCommonText
				for(var s = 0; s < mostCommon.length; s++){
					if(s == (mostCommon.length - 1)){
							mostCommonText += mostCommon[s]; 
					}
					else{
							mostCommonText += mostCommon[s] + ", ";
					}
				}

				//main template
				chartModalTemp += '<p>' + j + '. Total distractions: ' + result['activities'][actIndex]['instances'][i]['total'] 
				+ helpTemp + '<br>' + '&nbsp&nbsp&nbsp&nbspDuration: ' + result['activities'][actIndex]['instances'][i]['duration'] + 
				'<br>' + '&nbsp&nbsp&nbsp&nbspMost Common: ' + mostCommonText + '</p>';
			}
		}
	}
	//change title of correct modal
	var modalTitle = Title;

	//set html of the modal
	if($("#dataGraph").hasClass("previous") == true){
		$("#pdTitle").html(modalTitle);
		$("#prevText").html(chartModalTemp);
	}
	if($("#dataGraph").hasClass("last5") == true){
		$("#l5Title").html(modalTitle);
		$("#last5Text").html(chartModalTemp);	
	}
	if($("#dataGraph").hasClass("last10") == true){
		$("#l10Title").html(modalTitle);
		$("#last10Text").html(chartModalTemp);
	}*/

	var chart = new CanvasJS.Chart("dataGraph", {
		animationEnabled: true,
		theme: "light1",
		title: {
			text: Title
		},
		axisY: {
			title: "Distraction Count",
			titleFontSize: 20
		},
		data: [{
			type: graphType,
			yValueFormatString: "#,### Units",
			dataPoints: dataPoints
		}]
	});
	chart.render();

}

$("#logoutButton").click(function(e){
	$.get("/login/logout");
});