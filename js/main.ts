(()=>{
var mainNode: HTMLElement;
var bar: HTMLElement, clock: HTMLElement;
var searchForm: HTMLElement, searchBar: HTMLInputElement;
var results: HTMLElement;

class DatabaseEntry {
	name: string;
	url: string;
	color: string;
	icon: string;
}

class ResultNode {
	link: HTMLElement;
	label: HTMLElement;
}

var database: DatabaseEntry[] = [
	{ name: "Bandcamp", url: "https://bandcamp.com/", color: "#1da0c3", icon: "img/brands.svg#bandcamp", },
	{ name: "Bill Wurtz", url: "https://billwurtz.com/", color: "#000000", icon: "img/solid.svg#umbrella", },
	{ name: "Gmail 1", url: "https://mail.google.com/mail/u/0/", color: "#c5221f", icon: "img/solid.svg#envelope", },
	{ name: "Gmail 2", url: "https://mail.google.com/mail/u/1/", color: "#c5221f", icon: "img/solid.svg#envelope", },
	{ name: "Gmail 3", url: "https://mail.google.com/mail/u/2/", color: "#c5221f", icon: "img/solid.svg#envelope", },
	{ name: "Gmail 4", url: "https://mail.google.com/mail/u/3/", color: "#c5221f", icon: "img/solid.svg#envelope", },
	{ name: "Reddit", url: "https://reddit.com/hot/", color: "#ff4500", icon: "img/brands.svg#reddit-alien", },
	{ name: "Twitter", url: "https://twitter.com/", color: "#1da1f2", icon: "img/brands.svg#twitter", },
	{ name: "Tumblr", url: "https://tumblr.com/", color: "#001935", icon: "img/brands.svg#tumblr", },
	{ name: "YouTube", url: "https://youtube.com/feed/subscriptions", color: "#ff0000", icon: "img/brands.svg#youtube", },
];
var searchProviders: DatabaseEntry[] = [
	{ name: "Search", url: "https://google.com/search?q=%s", color: null, icon: "img/solid.svg#search" },
];

// boxBlurImage(imageID,canvasID,radius,iterations)

document.addEventListener("DOMContentLoaded", _=>{
	// Remove all empty whitespace nodes.
	clean(document.body);
	
	// Get all the HTMLElements.
	
	mainNode = document.getElementById("main");
	
	bar = document.getElementById("bar");
	clock = document.getElementById("clock");
	
	searchForm = document.getElementById("searchForm");
	searchBar = <HTMLInputElement>document.getElementById("search");
	
	results = document.getElementById("results");
	
	// Update a few things.
	getBackground();
	updateClock();
	updateSearch(searchBar.value);
	
	// Set up the search bar.
	searchBar.addEventListener("input", _=>updateSearch(searchBar.value));
	searchForm.addEventListener("submit", _=>webSearch(searchProviders[0].url, searchBar.value));
	searchBar.focus();
	
	// And show that this is a work in progress if you're not running it locally.
	if ((location.protocol !== "file:") && (location.host !== "localhost:8000")) {
		alert("Heads up - this is very early in development. Not quite usable yet. For a stable new tab page, try https://tab.v360.dev/");
		searchBar.focus();
	}
});

function getBackground() {
	var root: HTMLElement = document.documentElement;
	
	root.style.setProperty("--background", `url("../img/test2.jpg")`);
	root.style.setProperty("--background-blur", `url("../img/test2Blurred.jpg")`);
}

const clockShortDisplayOptions: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit"
};
const clockLongDisplayOptions: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	weekday: "long",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit"
};

function updateClock() {
	var now = new Date();
	
	// localetimestring is good and supports multiple languages by default.
	clock.textContent = now.toLocaleDateString(undefined, clockShortDisplayOptions);
	
	setTimeout(_=>{updateClock();}, 200);
}

function updateSearch(value: string) {
	// A bit gross
	if (value.length) {
		mainNode.classList.add("on");
		bar.classList.add("on");
	} else {
		mainNode.classList.remove("on");
		bar.classList.remove("on");
	}
	
	var databaseResults = searchDatabase(value);
	
	results.innerHTML = "";
	if (databaseResults !== null) {
		if (databaseResults.length) {
			for (var i = 0; i < databaseResults.length; i++) {
				results.appendChild(makeDatabaseResultNode(databaseResults[i]).link);
			}
		}
		if (value.length) {
			for (var i = 0; i < searchProviders.length; i++) {
				results.appendChild(makeSearchRequestNode(i, value).link);
			}
		}
		results.classList.add("on");
	} else {
		results.classList.remove("on");
	}
}

function searchDatabase(term: string): number[] {
	if (!term || !term.length) return null;
	
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

function webSearch(searchProvider: string, term: string) {
	location.assign(makeSearchURL(searchProvider, term));
}

function makeSearchURL(searchProvider: string, term: string): string {
	return searchProvider.replace("%s", encodeURIComponent(term));
}

function makeResultEntryNode(entry: DatabaseEntry): ResultNode {
	var linkNode = document.createElement("a");
	var labelNode = document.createElement("div");
	
	linkNode.classList.add("resultEntry");
	labelNode.classList.add("resultLabel");
	
	linkNode.href = entry.url;
	labelNode.textContent = entry.name;
	
	if (entry.color || entry.icon) {
		var iconNode = document.createElement("div");
		iconNode.classList.add("resultIcon");
	
		if (entry.color) {
			iconNode.classList.add("hasBGColor");
			iconNode.style.backgroundColor = entry.color;
		}
		
		if (entry.icon) {
			var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			var svgUseNode = document.createElementNS("http://www.w3.org/2000/svg", "use");
			
			svgNode.classList.add("resultIconSVG");
			
			svgUseNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", entry.icon);
			
			svgNode.appendChild(svgUseNode);
			iconNode.appendChild(svgNode);
		}
		
		linkNode.appendChild(iconNode);
	}
	
	linkNode.appendChild(labelNode);
	
	return { link: linkNode, label: labelNode };
}

function makeDatabaseResultNode(index: number): ResultNode {
	var self = makeResultEntryNode(database[index]);
	
	self.link.classList.add("databaseResult");
	
	return self;
}
function makeSearchRequestNode(index: number, term: string): ResultNode {
	var entry = Object.assign({}, searchProviders[index]);
	entry.url = makeSearchURL(entry.url, term);
	var self = makeResultEntryNode(entry);
	
	self.link.classList.add("searchRequest");
	
	return self;
}

// From sitepoint.com/removing-useless-nodes-from-the-dom/
function clean(node: HTMLElement) {
	for (var n = 0; n < node.childNodes.length; n++) {
		var child = <HTMLElement>node.childNodes[n];
		
		if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
			node.removeChild(child);
			n--;
		} else if (child.nodeType === 1 && !/pre|code|blockquote/i.test(child.tagName)) {
			clean(child);
		}
	}
}
})();
