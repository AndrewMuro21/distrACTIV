// vars for time
var mins = 0;
var hrs = 0;

$("#startButton").click(function(e){
	e.preventDefault();
	$("#Start a").attr('data-target', "#");
	var name = $("#inAct").val();
	var hrs = $("#hours").val();
	var mins = $("#mins").val();	
	//activity check
	if(name==""){
		$("#Start a").attr('data-target', "#inputRequired");
		console.log("required field");
		//add popover
	}
	else{
		$.get("/home/" + name + "/" + hrs + "/" + mins, redirect);
	}
});

function redirect(result){
	window.location.href = "/start";
}


//24 hour time limit
$("#hours").change(function(){
	//console.log($(this).val());
	if($(this).val()==24){
		//console.log("here");
		var zeroMinutes = '<option value="00">00</option>';
		//console.log(zeroMinutes);
		$("#mins").html(zeroMinutes);
	}
	else{
		var normalMinutes = '<option value="00">00</option>'+
						'<option value="05">05</option>'+
						'<option value="10">10</option>'+
						'<option value="15">15</option>'+
						'<option value="20">20</option>'+
						'<option value="25">25</option>'+
						'<option value="30">30</option>'+
						'<option value="35">35</option>'+
						'<option value="40">40</option>'+
						'<option value="45">45</option>'+
						'<option value="50">50</option>'+
						'<option value="55">55</option>';
		$("#mins").html(normalMinutes);
		}
});



