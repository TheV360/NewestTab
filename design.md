# NewestTab design

## Goals
* Quick minimal lightweight tab page.
* NewerTab background support
* Maybe browser extension version?
* Inspired by some tab pages I've seen on r/UnixPorn and r/StartPages, the ones with a search bar and a few bookmarks in columns below it.

## Features
* A sort of omnibar - of course like in chrome, but with user-selected keywords
* "Keyword bookmarks" - type a single letter (or maybe more) and press enter, then it goes to a set bookmark
	* Example: I have 4 GMail accounts. This is because reasons. I could set up 4 different email bookmarks, and set the first one to trigger when I type `g1`, and so on or something.
* Maybe a browser extension that replaces your new tab with it and integrates bookmarks? -- This would not search through all your bookmarks (that'd be horrible), you'd just select a few to copy over.
* Same background-selection features as in NewerTab, with blurring done on-the-fly with "Javascript making an image object" and not CSS filters. This is for performance reasons. or maybe not do this?

## TODO
* Add FontAwesome and theme color support to bookmarks.
* Make config dialog "engine" like in NewerTab.
* Find a way to add a "search bar only takes up the top 2/3rds or 1/4th of the screen instead of exactly in the center" mode
* Clean up TypeScript by actually learning it.
* Clean up CSS? I have inconsistent style rule ordering, so maybe fix that.
	* border-radius goes with padding and margin too!

## ~~Two~~ ~~Three~~ A few view modes

### Nothing

![thing](-designSketches/minimal.jpg)

* Minimal but it's just the search bar and clock.
* If you have keyword bookmarks, they'll work. They just won't be visible.

### Minimal

![thing](-designSketches/minimal.jpg)
![thing](-designSketches/minimal2.jpg)

* Just the search bar in the center. When you search, a list below pops out with some bookmarks.

### Bookmarks

![thing](-designSketches/bookmarks.png)

* Option to have a default list of bookmarks that shows up beneath the search bar.
* Ignore that "Search for..." it's broken and i fixed it already

### Classic?????
* All it is is Bookmarks with a big clock above the search bar
* Meant to emulate NewerTab.
* Maybe this is dumb and I shouldn't include it. Bookmarks mode is already pretty good and I don't want to deal with moving the clock out of the bar

## How Bookmarks will work.

Each bookmark will have a name and url, and also a keyword. The keyword will be an exact phrase that you can enter into the search bar to go to the bookmark instead of searching.

## Settings

You access this by typing "settings". It returns a... -- hmm I like that aesthetically but it might screw with people. What if somebody actually has a link to browser settings because they toggle a feature often?

Here -- You access most settings popups by right-clicking the clock. Maybe have a first-time popup say "hey you can config by rightclicking there!"

* Version (start at 0.5.0, of course. I always add a visible version number when the project's half-finished)
* ~~Dark / Light theme~~ (I don't think themes do too much. Menus will be dark with enough contrast to be visible.)
* Bookmark list (will not sync with regular bookmarks if this becomes an extension.)

<!--* Please port over `secret.js`, or make a new secret. Pull a "Frog Fractions"? Blend the unused NewTab egg, the broken NewerTab eggs, and maybe [REDACTED]-->

## Specific things I have in mind
* ~~toggle for search bar to fill parent. otherwise it will have some padding that clearly says "I am not the entire parent"~~ see `bookmarks.png`
* ~~search bar initially glass but will transition to solid white when you start typing.~~
* ~~"Search..." text on left, current date/time on right.~~
* Maybe some basic favicon-kinda-thing with FontAwesome brands.svg and a short look-up table? With the kinda "white icons on colorful squares" thing? This also means the look-up table will have color data
* Color picker, when right-clicked, will change to a text field to allow for copying colors much more easily.
* Oof, columns will be fun to design
