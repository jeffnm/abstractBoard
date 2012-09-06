/*************************************************************
**********    	General Javascript Functions  ****************
*************************************************************/


/* -------------------------- AJAX FUNCTIONS --------------------------- */
 
// ------------------------------------------------------------------------
// Copied and Pasted this AJAX FUNCTIONS section from:
// http://ella.slis.indiana.edu/~jtweedy/S603_AJAX/javascript.js
//
// Minor modifications by Jeffrey Mudge
//
// ------------------------------------------------------------------------
 
var xmlHttp;
//AJAX function
function ajax(method,url,params)
{
  
	method = method.toUpperCase();
  
	if (!(params) || (params==null))
	{
		params = "";
	}
  
	xmlHttp=GetXmlHttpObject();
	xmlHttp.onreadystatechange=function ()
	{
		if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
		{
		  
		}
	};
	// defaults to 'get' in case of 'passive/active' nonsense from before
	if (method=="POST")
	{
		xmlHttp.open("POST", url, false);
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//xmlHttp.setRequestHeader("Content-length", params.length);
		//xmlHttp.setRequestHeader("Connection", "close");
		xmlHttp.send(params);

	}
	else
	{
		if (params!="")
		{
			xmlHttp.open("GET",url+"?"+params,false);
		}
		else
		{
			xmlHttp.open("GET",url,false);
		}
		xmlHttp.send(null);
	}
	var ajaxReturnValue = (xmlHttp.responseText);
	return ajaxReturnValue;
}
  
 
 
 //Get XML HTTP Request
function GetXmlHttpObject()
{
  var xmlHttp=null;
  try
  {
	// Firefox, Opera 8.0+, Safari, etc
	xmlHttp=new XMLHttpRequest();
  }
  catch (e)
  {
	// Internet Explorer
	try
	{
	  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e)
	{
	  xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
  }
  return xmlHttp;
}
 
/* -------------------- END AJAX FUNCTIONS --------------------------- */



/***********************************************************************************************
Generic Form Functions
***********************************************************************************************/
/************** Form Clear script *****************************/
 
function formClear(element){
	// Get the current element id
	element = document.getElementById(element);
	// Get the starting value
	var val = element.value;
	
	//I need to figure out a satisfactory way to dynamically determine what the default value for the form is.
	if(val == 'Your Name'){
		// Make the value blank  
		element.value = "";
	} 
}

/*************************************/
/***** End of Form Functions *********/
/*************************************/





/**************************************/
/***** Player Management Functions ****/
/**************************************/

//Initialize Player variables
var currentPlayer;

//Replace number with a string
function replacer(key, value) {
	if (typeof value === 'number' && !isFinite(value)) {
		return String(value);
	}
	return value;
}

// Player Object 
var player = function(name){

	var d = new Date();
	var invitations = function(){
		this.fromMe = [];
		this.toMe = [];
		}

	this.name = name;
	this.status = "lobby";
	this.logged = d.getTime();
	this.inactive = 0;
	this.invitations = new invitations();
	}

// Game Object 
var game = function(p1, p2, type){
	var d = new Date();

	this.id = 0;
	this.p1 = p1;
	this.p2 = p2;
	this.started = d.getTime();
	this.inactive = 0;
	this.total_pieces = 0;
	this.pieces = array();
	}

// Function to create a new player
function pName(element){

	//Get the value of the the field that called the function
	element = document.getElementById(element);
	var val = element.value;

	//If it's empty - stop right there!
	if(val == ""){return false;}

	if(currentPlayer != null){
		var oldPlayer = currentPlayer;
	}

	//Put the new value into a player object that is the currentPlayer	
	currentPlayer = new player(val);
	alert(currentPlayer);
	var update = JSON.stringify(currentPlayer,replacer);	

	aj = ajax("post","php/name.php","action=newName&name="+update);
	
	if(aj =='nameExists'){
		currentPlayer = oldPlayer;
		alert('Name is in use');
	}

	if(aj == 'success'){
		alert('server says it successfully updated the file');
	}
}



//Display current players
function names_list(){

	//Initialize variables
	var names = new Array();
	var txt ="<ul>";
	
	//AJAX call the php script for the list of player objects
	if(aj = ajax('post','php/name.php','action=getNames')){

		//Rudimentary check to maek sure it contains more than []
		if(aj.length > 5){
			//Parse the JSON
			names = JSON.parse(aj);
		}else{
			//Empty player list message
			names = "No one is online now";
		}
	}else{
		//Failed AJAX request
		names = "No response from the lobby server";
	}

	//Check the returned player list's type
	if(typeof(names) == 'object'){
		for (k in names){
			//Check invitation status in relation to currentPlayer
			if(names[k].invitations.fromMe = currentPlayer.name){
				invited=true;
			}else{
				invited=false;
			}

			//Write player names based on invitation status
			if(invited==true){
				txt += "<strong><li id='"+names[k].name+"' onclick=invite(this.id);>"+names[k].name+" ["+names[k].inactive+"]</li></strong>";
			}else{
				txt += "<li id='"+names[k].name+"' onclick=invite(this.id);>"+names[k].name+" ["+names[k].inactive+"]</li>";
			}

		}
	}else{
		txt +="<li>"+names+"</li>"
		}
	txt += "</ul>";


	document.getElementById('p_names').innerHTML = txt;
	//alert(aj);

}


function invite(p){

	var p = document.getElementById(p);
	var player = p.id;

	//Send player name to php	
	aj = ajax('post','../php/name.php','action=invite&player='+player);

}


/*function newGame(p1,p2,type){
	var newGame = new game(p1,p2,type);

	aj = ajax('post','../php/game.php', 'action=newGame&game='+newGame);

}*/

//Start the lobby interval
function init_lobby(){
	return(setInterval(names_list, 5000))
}
