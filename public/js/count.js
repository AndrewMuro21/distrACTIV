// vars for time
var secs = 0;
var mins = 0;
var hrs = 0;
var init_secs = 0;
var init_mins = 0;
var init_hrs = 0;
var timeset = true;
var selected = 0;
var preset = ["Facebook", "Instagram", "Twitter", "Reddit"];
var distractions = [];
var totalMinutes = 0;

$(document).ready(function(e){
	secs = parseInt($("#secs").text());
	mins = parseInt($("#mins").text());
	hrs = parseInt($("#hours").text());
	init_hrs = hrs;
	init_mins = mins;
	init_secs = secs;
	if(secs==0 && mins==0 && hrs==0) {
		$(".time-elap").text("Time Elapsed");
		timeset = false;
	}
});
// hide popup at the start
// start the clock too
$(".pop-up").hide();

var clock = setInterval(tick, 1000);

$(".pause").click(pause);

function pause(e) {
	var text = $(".pause").text();
	if(text.includes("Pause")){
		$(".pause").text("Start");
		clearInterval(clock);
	} else {
		$(".pause").text("Pause");
		clock = setInterval(tick,1000);
	}
}

// update clock
function tick(){

	secs = parseInt($("#secs").text());
	mins = parseInt($("#mins").text());
	hrs = parseInt($("#hours").text());

	if(!timeset) {
		// check if 1 minute has passed
		if(secs==60){
			mins++;
			secs = 0;
		}
		else if(mins==60){
			hrs++;
			mins = 0;
		} else {
			secs++;
		}
	} 
	//time is set
	else {

		if(secs==0){
			if(mins != 0){
				mins--;
				totalMinutes++;
				secs = 59;
			} else if(hrs!=0){
				mins = 59;
				secs = 59;
				hrs--;
			} else{
				clearInterval(clock);

			}
		} else {
			secs--;
		}
	}

	// format with 0 and update display
	if(hrs<10){
		$("#hours").text("0" + hrs);
	} else {
		$("#hours").text(hrs);
	}

	if(mins<10){
		$("#mins").text("0" + mins);
	} else {
		$("#mins").text(mins);
	}

	if(secs<10){
		$("#secs").text("0" + secs);
	} else {
		$("#secs").text(secs);
	}

}

// distraction functionality

// increase distraction counter by one
$(".distracted").click(function(e) {
	e.preventDefault();
	$("#distModal").attr('data-backdrop', "static")
	var count = parseInt($(".dist-num .num").text());
	count+= 1;
	$(".dist-num .num").text(count);
	//$(".pop-up").show();
	pause();

});

$(".ok").click(function(e){
	//google analytics
	ga("send", "event", "distract", "click");

	//reset data target
	$(".ok").attr('data-target', "#" );
		
	console.log(selected);

	if(selected == 0 && $(".dist-type").val() == ""){
		console.log("no distraction");
		$(".ok").attr('data-target', "#enterDist" );
	}
	else{
		// save the entry
		let dist = "";
		if($(".dist-type").val() != ""){
			dist = $(".dist-type").val();
			$(".dist-type").val("");
		} else {
			dist = preset[selected-1];
		}

		$.get("/save/"+ dist, donothing);

		// clear the selected color
		for(let i = 1; i < 5; i++){
			$(`#${i}.icon`).css("color", "black");
		}
		//clear selected
		selected = 0;
		// exit the modal
		$("#distModal").attr('data-backdrop', "true")
		$("#distModal").modal('toggle');

		pause();
	}
});

//if user clicks to enter text while an icon is selected
$(".dist-type").click(function(e){
	// clear the selected color
	for(let i = 1; i < 5; i++){
		$(`#${i}.icon`).css("color", "black");
	}
	//clear select
	selected = 0;
});


function donothing(result){
	// do nothing
}

$(".cancel").click(function(e){
	// don't save the entry
	// clear the selected color and input
	for(let i = 1; i < 5; i++){
		$(`#${i}.icon`).css("color", "black");
	}
	selected = 0;
	$(".dist-type").val("");

	// exit modal
	$("#distModal").attr('data-backdrop', "true")
	$("#distModal").modal('toggle');

	pause();
	let count = parseInt($(".dist-num .num").text());
	count--;
	$(".dist-num .num").text(count);
});

//icon click
$(".icon").click( function(e){
	//clear text
	$(".dist-type").val("");


	for(let i = 1; i < 5; i++){
		if($(this).attr('id') == i){
			$(this).css("color", "#646FFF");
			selected = i;
		} else {
			$(`#${i}.icon`).css("color", "black");
		}
	}
});


$("#complete").click( function(e){
	// compute duration
	let duration = "";
	let total = $(".dist-num .num").text();

	if(!timeset){
		duration = hrs + ":" + mins + ":" + secs;
	} else {
		console.log("here");
		duration = getDur();
		//console.log(duration);
	}
 	//console.log(duration);
	$.get("/complete/" + duration + "/" + total, redirect);
});

function redirect(result) {
	window.location.href = "/data";
}

function getDur(){
console.log(hrs + " " + mins + " " + secs);
var sec_elap = null;
if(secs != 0){
	sec_elap = 60 - secs;
}
else{
	sec_elap = 0;
 }

var mins_elap = null;
 if(mins != 0 && init_mins != 0){
	mins_elap = init_mins - mins - 1;
}
else if(mins != 0 && init_mins == 0){
	mins_elap = 60 - mins - 1;
}
else{
	mins_elap = 0;
 }


	var hrs_elap = null
	if(totalMinutes<60){
		hrs_elap = 0;
	}
	else{
		hrs_elap = totalMinutes%60;
	}

	return hrs_elap+":"+mins_elap+":"+ sec_elap;
}