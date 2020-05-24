var date = new Date();
var showedjokes = [];
var savedjokes = [];

var getdata = function (url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, false);
	request.send();
	var result = request.responseText;
	return result;
}

var save = function() {
	localStorage.setItem('savedjokes', JSON.stringify(savedjokes));
}

var load = function() {
	var retrievedObject = localStorage.getItem('savedjokes');
	savedjokes = JSON.parse(retrievedObject);
}

load();

if (savedjokes == null) {
	savedjokes = [];
}

var categories = JSON.parse(getdata('https://api.chucknorris.io/jokes/categories'));
var categoriesHTML = "";

for (var i = 0; i < categories.length; i++) {
	categoriesHTML = categoriesHTML + '<input type="radio" id="option-'+i+'" value="'+categories[i]+'" name="category"><label for="option-'+i+'">'+categories[i]+'</label>';
	document.getElementById('categories').innerHTML = categoriesHTML;
}

var checkheartstatus = function(id) {
	for (var i = 0; i < savedjokes.length; i++) {
		if (savedjokes[i].id == id) {
			savedjokes.splice(i, 1);
			return 'full';
		}
		else {
			return 'empty';
		}
	}
}

var printjoke = function (joke){
	showedjokes.push(joke);
	joke.lastupdate = Math.round((date-(new Date(joke.updated_at)))/3600000);
	var categoryHTML = "";
	//var heartstatus = "empty";
	if (joke.categories[0] != undefined) {
		categoryHTML = '<span class="category">'+joke.categories[0]+'</span>'
	}
	if (checkheartstatus(joke.id) == 'full') {
		document.getElementById('place-for-joke').innerHTML += '<div class="joke-block-light"><div id="heart-'+joke.id+'" class="heart-icon"><img src="SVG/heart-full.svg" onclick="delfav(\''+joke.id+'\')"></div><div class="message-icon"><img src="SVG/message-light.svg"></div><p id="joke-id" class="id">ID: <a href="'+joke.url+'">'+joke.id+'<span class="link-icon"><img src="SVG/link.svg"></span></a></p><p id="joke-text" class="text-main">'+joke.value+'</p><span class="last-update">Last update: '+joke.lastupdate+' hours ago</span>'+categoryHTML+'</div>';
	}
	else{
		document.getElementById('place-for-joke').innerHTML += '<div class="joke-block-light"><div id="heart-'+joke.id+'" class="heart-icon"><img src="SVG/heart-empty.svg" onclick="addfav(\''+joke.id+'\')"></div><div class="message-icon"><img src="SVG/message-light.svg"></div><p id="joke-id" class="id">ID: <a href="'+joke.url+'">'+joke.id+'<span class="link-icon"><img src="SVG/link.svg"></span></a></p><p id="joke-text" class="text-main">'+joke.value+'</p><span class="last-update">Last update: '+joke.lastupdate+' hours ago</span>'+categoryHTML+'</div>';
	}
	
}

var getjoke = function () {
	var searchtype = document.querySelector('input[name="searchtype"]:checked').value;
	try{
		var category = document.querySelector('input[name="category"]:checked').value;
	}
	catch{}
	try{
		var query = document.getElementById("query").value;
	}
	catch{}
	if (searchtype == "random") {
		var joke = JSON.parse(getdata('https://api.chucknorris.io/jokes/random'));
		document.getElementById('place-for-joke').innerHTML = "";
		printjoke(joke);
	}
	else if (searchtype == "from-categories") {
		var joke = JSON.parse(getdata('https://api.chucknorris.io/jokes/random?category='+category));
		document.getElementById('place-for-joke').innerHTML = "";
		printjoke(joke);
	}
	else {
		document.getElementById('place-for-joke').innerHTML = "";
		searchjoke(query);
	}
}

var searchjoke = function(query) {
	var jokes = JSON.parse(getdata('https://api.chucknorris.io/jokes/search?query='+query)).result;
	for (var i = 0; i < jokes.length; i++) {
		printjoke(jokes[i]);
	}
}

var showfav = function() {
	var favouritesHTML = "";
	for (var i = 0; i < savedjokes.length; i++) {
		favouritesHTML += '<div class="joke-block"><div id="heart-'+savedjokes[i].id+'" class="heart-icon"><img src="SVG/heart-full.svg" onclick="delfav(\''+savedjokes[i].id+'\')"></div><div class="message-icon"><img src="SVG/message.svg"></div><p class="id">ID: <a href="'+savedjokes[i].url+'">'+savedjokes[i].id+'<span class="link-icon"><img src="SVG/link.svg"></span></a></p><p class="text-fav">'+savedjokes[i].value+'</p><span class="last-update">Last update: '+savedjokes[i].lastupdate+' hours ago</span></div>';
	}
	document.getElementById('favourite-jokes').innerHTML = favouritesHTML;
}

getjoke();

var addfav = function(id) {
	for (var i = 0; i < showedjokes.length; i++) {
		if (showedjokes[i].id == id) {
			savedjokes.push(showedjokes[i]);
		}
	}
	save();
	document.getElementById("heart-"+id).innerHTML = '<img src="SVG/heart-full.svg" onclick="delfav(\''+id+'\')">';
	showfav();
}

var delfav = function(id) {
	for (var i = 0; i < savedjokes.length; i++) {
		if (savedjokes[i].id == id) {
			savedjokes.splice(i, 1);
		}
	}
	save();
	document.getElementById("heart-"+id).innerHTML = '<img src="SVG/heart-empty.svg" onclick="addfav(\''+id+'\')">';
	showfav();
}



showfav();