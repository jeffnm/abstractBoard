/*************************************************************
**************************************************************
***********                                     **************
***********		Game Mechanics Javascript		**************
***********										**************
**************************************************************
*************************************************************/
var b_canvas;
var b_context;
var WIDTH = 700;
var HEIGHT = 700;
var cell;
var dragok = false;
var pieces = [];

var mvingpc;
var trash = {};

//Line from the Firebase version. Remove once node.js version is working again. 
//var myDataRef = new Firebase('http://gamma.firebase.com/absboard');
//
//
//myDataRef.on('child_changed', function(snapshot) {
//	pieces = snapshot.val();
//	console.log("Child Changed - Firebase update effected");
//	console.log(pieces);
//	});
//
//myDataRef.on('child_added', function(snapshot) {
//	if(snapshot.val() !== undefined){
//		pieces = snapshot.val();	
//	}
//	console.log("Child Added - Firebase update effected");
//	console.log(pieces);
//	});
//
window.onload = init;

function init(){
	board();

	document.getElementById('new_p').onclick = newPiece;

	b_canvas.onmousedown = myDown;
	b_canvas.onmouseup = myUp;
	
	return setInterval(draw, 10);
}

/*function updatePieces(){
	aj = ajax("post","php/game.php","action=updatePieces&name="+username+"&pieces="+pieces);
}*/

function updatePCs(){
	myDataRef.set({pieces: pieces});
}

//Game Board Modify
//Object to allow dynamic board construction

function board(){
	b_canvas = document.getElementById("game_board");
	b_context = b_canvas.getContext("2d");


// objects to be drawn
	var b_trash = function (cxt){
		var height = 90;
		var width = 90;
		var offset = 30;
	
		x = b_canvas.width + (offset - b_canvas.width);
		y = b_canvas.height - (height + offset);
		trash.x = x;
		trash.y = y;


		cxt.beginPath();
		cxt.moveTo(x,y);

		
		cxt.fillStyle = "000";
		cxt.fillRect(x-1, y-1, width+2, height+2);
		cxt.fillStyle = '#FF0000';
		cxt.fillRect(x, y, width, height);

		cxt.strokeStyle = "#000";
		cxt.stroke();
	};

	var triangle = function(cxt, x, y){
		var xFullOff = 50;
		var yFullOff = 50;

		cxt.beginPath();
		cxt.moveTo(x,y);

		x = x + xFullOff;
		cxt.lineTo(x,y);

		x = x - xFullOff/2;
		y = y - yFullOff;
		cxt.lineTo(x,y);

		x = x - xFullOff/2;
		y = y + yFullOff;
		cxt.lineTo(x,y);

		cxt.strokeStyle = "#000";
		cxt.stroke();
	};

	var triangle2 = function(cxt, x, y){
		var xFullOff = 50;
		var yFullOff = 50;

		cxt.beginPath();
		y = y - yFullOff;
		cxt.moveTo(x,y);


		x = x + xFullOff;
		cxt.lineTo(x,y);

		x = x - xFullOff/2;
		y = y + yFullOff;
		cxt.lineTo(x,y);

		x = x - xFullOff/2;
		y = y - yFullOff;
		cxt.lineTo(x,y);

		cxt.strokeStyle = "#000";
		cxt.stroke();
	};


//Begin drawing the objects
	var c = 1;
	var r = 0;

	var b_center_x = (b_canvas.width/2);
	var b_center_y = (b_canvas.height/2);

	for( h = 50; h <= 650; h+=50){

		var wpush;
		var label;

			if(r == 1 || r == 12){
				wpush = 125.5;
			}else if(r == 2 || r == 11){
				wpush = 100.5;
			}else if(r == 3 || r == 10){
				wpush = 75.5;
			}else if (r == 4 || r == 9){
				wpush = 50.5;
			}else if (r == 5 || r == 8){
				wpush = 25.5;
			}else if (r === 0){
				wpush = 600.5;
			}else{
				wpush = 0.5;
			}


		for (w = 50; w < (650 - (2*wpush)); w+=50){

			x = w + wpush;
			if(r <=6){
				triangle(b_context,x,h);
			}else if (r > 6){
				triangle2(b_context,x,h);
			}
			c++;
		}
		r++;
	}
	b_trash(b_context); // This needs to be dynamically stored someplace so that the deletion script can look up the correct location.  
}

var b_clear = function() {
	b_context.clearRect(0, 0, WIDTH, HEIGHT);
	b_context.rect(0,0,WIDTH,HEIGHT);
	
};

var draw = function(){
	b_clear();

	board();
	


	//aj = ajax("post","php/game.php","action=getPieces&name="+username);
	//Needs safety check that aj has returned good pieces data. 
	//pieces = JSON.parse(aj);
	var pcLength;
	if(pieces !== null && pieces !== undefined)
	{
		pcLength = pieces.length;	
	}else{
		
		pcLength = 0;
	}
	for (i=0; i<pcLength; i++){
		
		x = pieces[i].col;
		y = pieces[i].row;
		radius = pieces[i].radius;

		b_context.beginPath();
		b_context.arc(x, y, radius, 0, Math.PI*2, false);
		b_context.closePath();

		if(pieces[i].color == "000"){
			b_context.fillStyle = "#000";
		}
		else if(pieces[i].color == 'FFF')
		{
			b_context.fillStyle = "#FFF";
		}else if( pieces[i].color == 808080){
			b_context.fillStyle = "#808080";
		}else{
			alert('No color associated with pieces! Maybe there is something wrong with the piece?');
		}
		b_context.fill();

		b_context.strokeStyle = "#000";

		if(b_context.fillStyle == '#808080'){
			b_context.strokeStyle = "#808080";
		}

		b_context.stroke();
		}


};

function newPiece() {
	var color = document.getElementById('p_color').value;
	var radius = document.getElementById('p_radius').value;
	var count = document.getElementById('p_count').value;
	for(i=0; i<count; i++){
		var piece = new p(color,radius);
		console.log(pieces);
		pieces.push(piece);
		updatePCs();
		//updatePieces();
	}


	//draw();
}

var p = function(color,radius){
	//this.id;
	//this.location;
	this.color = color;
	this.radius = radius;
	this.col = 15;
	this.row = 15;

	return this;
};





function myMove(e){
	if (dragok){
		x = e.pageX - b_canvas.offsetLeft;
		y = e.pageY - b_canvas.offsetTop;
		for (i=0; i<pieces.length; i++){
			if(pieces[i] == mvingpc){
				pieces[i].col = x;
				pieces[i].row = y;
		
				//updatePCs();
				//updatePieces();
			}
		}
	}
}

function myDown(e){
	for (i=0; i<pieces.length; i++){
		x = pieces[i].col;
		y = pieces[i].row;
		if ( x > e.pageX-b_canvas.offsetLeft - 50 && x < e.pageX-b_canvas.offsetLeft + 50 && y > e.pageY - b_canvas.offsetTop - 50 && y < e.pageY - b_canvas.offsetTop + 50){
			if (e.pageX < x + 15 + b_canvas.offsetLeft && e.pageX > x - 15 +
				b_canvas.offsetLeft && e.pageY < y + 15 + b_canvas.offsetTop &&
				e.pageY > y -15 + b_canvas.offsetTop){
				x = e.pageX - b_canvas.offsetLeft;
				y = e.pageY - b_canvas.offsetTop;
				//alert(x + " and " + y);
				dragok = true;
				mvingpc = pieces[i];
				b_canvas.onmousemove = myMove;
		
				//updatePCs();

				//updatePieces();
			}	
		}
	}
}

function myUp(){
	dragok = false;

	for (i=0; i<pieces.length; i++){
		if(pieces[i] == mvingpc){
			if(	pieces[i].col < (trash.x + 90) && pieces[i].col > (trash.x) && pieces[i].row < (trash.y + 90) && pieces[i].row > (trash.y)){
				pieces.splice(i,1);
			}
		}
	}
	updatePCs();

	//updatePieces();
	mvingpc = null;
	b_canvas.onmousemove = null;
}