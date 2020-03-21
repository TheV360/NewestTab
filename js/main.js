(function () {
    var mainNode;
    var bar, clock;
    var searchForm, searchBar;
    var results;
    var database = [
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
    var searchProviders = [
        { name: "Search", url: "https://google.com/search?q=%s", color: "#4286f3", icon: "img/solid.svg#search" },
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
        searchForm.addEventListener("submit", function (_) { return webSearch(searchProviders[0].url, searchBar.value); });
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
                for (var i = 0; i < searchProviders.length; i++) {
                    results.appendChild(makeSearchRequestNode(i, value).link);
                }
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
    function webSearch(searchProvider, term) {
        location.assign(makeSearchURL(searchProvider, term));
    }
    function makeSearchURL(searchProvider, term) {
        return searchProvider.replace("%s", encodeURIComponent(term));
    }
    function makeResultEntryNode(text, href, color, icon) {
        var linkNode = document.createElement("a");
        var labelNode = document.createElement("div");
        linkNode.classList.add("resultEntry");
        labelNode.classList.add("resultLabel");
        linkNode.href = href;
        labelNode.textContent = text;
        if (color || icon) {
            var iconNode = document.createElement("div");
            iconNode.classList.add("resultIcon");
            if (color) {
                iconNode.classList.add("hasBGColor");
                iconNode.style.backgroundColor = color;
            }
            if (icon) {
                var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var svgUseNode = document.createElementNS("http://www.w3.org/2000/svg", "use");
                svgNode.classList.add("resultIconSVG");
                svgUseNode.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", icon);
                svgNode.appendChild(svgUseNode);
                iconNode.appendChild(svgNode);
            }
            linkNode.appendChild(iconNode);
        }
        linkNode.appendChild(labelNode);
        return {
            link: linkNode, label: labelNode,
        };
    }
    function makeDatabaseResultNode(index) {
        var entry = database[index];
        var self = makeResultEntryNode(entry.name, entry.url, entry.color, entry.icon);
        self.link.classList.add("databaseResult");
        return self;
    }
    function makeSearchRequestNode(index, term) {
        var entry = searchProviders[index];
        var self = makeResultEntryNode(entry.name, makeSearchURL(entry.url, term), /*entry.color*/ null, entry.icon);
        self.link.classList.add("searchRequest");
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