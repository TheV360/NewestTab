(function () {
    var mainNode;
    var bar, clock;
    var searchForm, searchBar;
    var results;
    var searchProvider = "https://google.com/search?q=%s";
    var database = [
        { name: "Amazon", label: "https://amazon.com/", },
        { name: "Bandcamp", label: "https://bandcamp.com/", },
        { name: "Bill Wurtz", label: "https://billwurtz.com/", },
        { name: "Reddit", label: "https://reddit.com/hot/", },
        { name: "Twitter", label: "https://twitter.com/", },
        { name: "Tumblr", label: "https://tumblr.com/", },
        { name: "Query 1", label: "https://example.com/", },
        { name: "Query 2", label: "https://example.com/", },
        { name: "Query 3", label: "https://example.com/", },
        { name: "Query 4", label: "https://example.com/", },
        { name: "Query 5", label: "https://example.com/", },
    ];
    // boxBlurImage(imageID,canvasID,radius,iterations)
    document.addEventListener("DOMContentLoaded", function (e) {
        // Remove all empty whitespace nodes.
        clean(document.body);
        // Get all the HTMLElements.
        mainNode = document.getElementById("main");
        bar = document.getElementById("bar");
        clock = document.getElementById("clock");
        searchForm = document.getElementById("searchForm");
        searchBar = document.getElementById("search");
        results = document.getElementById("results");
        // Update a few things.
        getBackground();
        updateClock();
        updateSearch(searchBar.value);
        // Set up the search bar.
        searchBar.addEventListener("input", function (_) { return updateSearch(searchBar.value); });
        searchForm.addEventListener("submit", function (_) { return webSearch(searchBar.value); });
        searchBar.focus();
        // And show that this is a work in progress if you're not running it locally.
        if ((location.protocol !== "file:") && (location.host !== "localhost")) {
            alert("Heads up - this is very early in development. Not quite usable yet. For a stable new tab page, try https://tab.v360.dev/");
            searchBar.focus();
        }
    });
    function getBackground() {
        var root = document.documentElement;
        root.style.setProperty("--background", "url(\"../img/test2.jpg\")");
        root.style.setProperty("--background-blur", "url(\"../img/test2Blurred.jpg\")");
    }
    var clockShortDisplayOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };
    var clockLongDisplayOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };
    function updateClock() {
        var now = new Date();
        // todo: a lot of things here.
        // localetimestring is *very* useful, though. it'll also support multiple languages by default!!
        clock.textContent = now.toLocaleDateString(undefined, clockShortDisplayOptions);
        setTimeout(function (_) { updateClock(); }, 200);
    }
    function updateSearch(value) {
        // A bit gross
        if (value.length) {
            mainNode.classList.add("on");
            bar.classList.add("on");
        }
        else {
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
                results.appendChild(makeSearchRequestNode(value).link);
            }
            results.classList.add("on");
        }
        else {
            results.classList.remove("on");
        }
    }
    function searchDatabase(term) {
        if (!term || !term.length)
            return null;
        var result = [];
        term = term.toLocaleLowerCase();
        for (var i = 0; i < database.length; i++) {
            var tmp = database[i].name.toLocaleLowerCase().indexOf(term);
            if (tmp >= 0) {
                // just store some temporary data here
                result.push([i, tmp]);
                // result.push([i, 0]);
            }
        }
        // sort by how close to the beginning the term is.
        result.sort(function (a, b) { return a[1] - b[1]; });
        // remove temporary data, so it's just the indexes now.
        for (var i = 0; i < result.length; i++) {
            result[i] = result[i][0];
        }
        return result;
    }
    function webSearch(term) {
        location.assign(makeSearchURL(searchProvider, term));
    }
    function makeSearchURL(searchProvider, term) {
        return searchProvider.replace("%s", encodeURIComponent(term));
    }
    function makeResultEntryNode(text, href) {
        var linkNode = document.createElement("a");
        var iconNode = document.createElement("div");
        var labelNode = document.createElement("div");
        linkNode.classList.add("resultEntry");
        iconNode.classList.add("resultIcon");
        labelNode.classList.add("resultLabel");
        linkNode.href = href;
        labelNode.textContent = text;
        linkNode.appendChild(iconNode);
        linkNode.appendChild(labelNode);
        return {
            link: linkNode, label: labelNode, icon: iconNode,
        };
    }
    function makeDatabaseResultNode(index) {
        var self = makeResultEntryNode(database[index].name, database[index].label);
        self.link.classList.add("databaseResult");
        return self;
    }
    function makeSearchRequestNode(term) {
        var self = makeResultEntryNode(term, makeSearchURL(searchProvider, term));
        self.link.classList.add("searchRequest");
        // We've already set the textContent, which filters out any bad HTML, and we can drop that into this HTML easily.
        self.label.innerHTML = "Search for “<strong>" + self.label.innerHTML + "</strong>”";
        return self;
    }
    // From sitepoint.com/removing-useless-nodes-from-the-dom/
    function clean(node) {
        for (var n = 0; n < node.childNodes.length; n++) {
            var child = node.childNodes[n];
            if (child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
                node.removeChild(child);
                n--;
            }
            else if (child.nodeType === 1 && !/pre|code|blockquote/i.test(child.tagName)) {
                clean(child);
            }
        }
    }
})();
//# sourceMappingURL=main.js.map