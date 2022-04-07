var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

c.fillStyle = "transparent";
c.strokeStyle = "transparent";

var clockCenterX = canvas.width/2;
var clockCenterY = canvas.height/2;
var r = 200;

var timer = setInterval(function(){
	showClockFrame(clockCenterX, clockCenterY, r);
}, 100);

function showClockFrame(x,y,r){
	c.clearRect(0, 0, canvas.width, canvas.height); //Clear everything
	c.save();
	c.strokeStyle = "transparent";
	c.fillStyle = "transparent";
	c.lineWidth = r/20;

	c.beginPath(); //Outer frame
	c.arc(x, y, r, 0, Math.PI*2, true);
	c.fill();
	c.stroke();
	c.closePath();
	
	c.beginPath(); //Center dot
	c.arc(x, y, r/20, 0, Math.PI*2, true);
	c.fillStyle = "transparent";
	c.fill();
	c.closePath();	

	c.lineWidth = 4;
	c.lineCap = "round";
	var currTime = new Date();
	var secs = currTime.getSeconds(); //SECS!
	var mins = currTime.getMinutes();
	var hour = currTime.getHours()%12; //to get 0-11
	var secsAng = secs*((Math.PI*2)/60)-Math.PI/2;
	var minsAng = (mins*((Math.PI*2)/60)-Math.PI/2) + ((secs*((Math.PI*2)/60)/60));
	var hourAng = (hour*((Math.PI*2)/12)-Math.PI/2) + ((mins*((Math.PI*2)/60)/12));
	showDigits(r);
	showHourHand(r, hourAng);
	showMinuteHand(r, minsAng);
	showSecondHand(r, secsAng);
	c.restore();
}

function updateSlider(newNum){
	var chosen = document.getElementById("chosen");
	r = newNum;
	showClockFrame(clockCenterX, clockCenterY, newNum);
	chosen.innerHTML = newNum;
}

function showDigits(r){
	c.save();
	c.fillStyle = "transparent";
	c.font = "20pt Consolas";
	c.fillText("12", 285, 330-r);
	c.fillText("6", 290, 290+r);
	c.fillText("3", 275+r, 309);
	c.fillText("9", 310-r, 309);
	c.restore();
}

function showHourHand(r, angle){
	c.save();
	c.beginPath();
	c.moveTo(clockCenterX, clockCenterY);
	c.strokeStyle = "#55AAAA";
	c.arc(clockCenterX, clockCenterY, r*0.4, angle, angle, false);
	c.stroke();
	c.restore();
}

function showMinuteHand(r, angle){
	c.save();
	c.beginPath();
	c.moveTo(clockCenterX, clockCenterY);
	c.strokeStyle = "#55AAAA";
	c.arc(clockCenterX, clockCenterY, r*0.55, angle, angle, false);
	c.stroke();
	c.restore();
}

function showSecondHand(r, angle){
	c.save();
	c.beginPath();
	c.moveTo(clockCenterX, clockCenterY);
	c.strokeStyle = "gray";
	c.arc(clockCenterX, clockCenterY, r*0.7, angle, angle, false);
	c.stroke();
	c.restore();
}