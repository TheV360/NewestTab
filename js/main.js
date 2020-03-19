var mainNode;
var searchBar, results;

var searchProvider = "https://google.com/search?q=%s";

var database = [
	{ name: "Amazon",		link: "https://amazon.com/",	},
	{ name: "Bandcamp",		link: "https://bandcamp.com/",	},
	{ name: "Bill Wurtz",	link: "https://billwurtz.com/",	},
	{ name: "Reddit",		link: "https://reddit.com/hot/",},
	{ name: "Twitter",		link: "https://twitter.com/",	},
	{ name: "Tumblr",		link: "https://tumblr.com/",	},
];

// boxBlurImage(imageID,canvasID,radius,iterations)

document.addEventListener("DOMContentLoaded", e=>{
	// Remove all empty whitespace nodes.
	clean(document.body);
	
	alert("Heads up - this is very early in development. Not quite usable yet. For a stable new tab page, try https://tab.v360.dev/");
	
	mainNode = document.getElementById("main");
	
	bar = document.getElementById("bar");
	clock = document.getElementById("clock");
	searchBar = document.getElementById("search");
	
	results = document.getElementById("results");
	
	searchBar.addEventListener("input", e=>updateSearch(e.target.value));
	
	updateClock();
});

function updateClock() {
	var now = new Date();
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
	// todo: a lot of things here.
	// localetimestring is *very* useful, though. it'll also support multiple languages by default!!
	
	clock.textContent = now.toLocaleTimeString(undefined) + " " + now.toLocaleDateString(undefined, options);
	
	setTimeout(()=>{updateClock();}, .2e3);
}

function updateSearch(value) {
	// A bit gross
	if (value.length) {
		mainNode.classList.add("on");
		bar.classList.add("on");
		searchBar.classList.add("on");
	} else {
		mainNode.classList.remove("on");
		bar.classList.remove("on");
		searchBar.classList.remove("on");
	}
	
	var databaseResults = searchDatabase(value);
	
	results.innerHTML = "";
	if (databaseResults.length) {
		for (var i = 0; i < databaseResults.length; i++) {
			results.appendChild(makeDatabaseResultNode(databaseResults[i]));
		}
	}
	if (value.length) {
		results.appendChild(makeSearchRequestNode(value));
	}
}

function searchDatabase(term) {
	var result = [];
	
	term = term.toLocaleLowerCase();
	
	for (var i = 0; i < database.length; i++) {
		var tmp = database[i].name.toLocaleLowerCase().indexOf(term);
		if (tmp >= 0) {
			// just store some temporary data here
			result.push([i, tmp]);
		}
	}
	
	// sort by how close to the beginning the term is.
	result.sort((a, b)=>{return a[1] - b[1];});
	
	// remove temporary data, so it's just the indexes now.
	for (var i = 0; i < result.length; i++) {
		result[i] = result[i][0];
	}
	
	return result;
}

function makeDatabaseResultNode(index) {
	var node = document.createElement("li");
	var nodeLink = document.createElement("a");
	
	nodeLink.textContent = database[index].name;
	nodeLink.href = database[index].link;
	
	node.appendChild(nodeLink);
	return node;
}
function makeSearchRequestNode(term) {
	var node = document.createElement("li");
	var nodeLink = document.createElement("a");
	
	// Fun way to get around having to filter things.
	nodeLink.textContent = term;
	nodeLink.innerHTML = "Search for <strong>" + nodeLink.innerHTML + "</strong>...";
	
	nodeLink.href = searchProvider.replace("%s", encodeURIComponent(term));
	
	node.appendChild(nodeLink);
	return node;
}

// From sitepoint.com/removing-useless-nodes-from-the-dom/
function clean(node) {
	for (var n = 0; n < node.childNodes.length; n++) {
		var child = node.childNodes[n];
		
		if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
			node.removeChild(child);
			n--;
		} else if (child.nodeType === 1 && !/pre|code|blockquote/i.test(child.tagName)) {
			clean(child);
		}
	}
}
