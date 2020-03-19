# NewestTab design doc.

## Goals
* Quick minimal lightweight tab page.
* Inspired by some tab pages I've seen on r/UnixPorn

## Features
* A sort of omnibar - of course like in chrome, but with user-selected keywords
* Maybe a browser extension that replaces your new tab with it and integrates bookmarks?
* Same background-selection features as in NewerTab, with blurring done on-the-fly with "Javascript making an image object" and not CSS filters.

## Two view options
Minimal
* Just the search bar in the center. When you search, a list below pops out with some bookmarks.

Bookmarks
* Option to have a default list of bookmarks that shows up beneath the search bar.

Classic
* Like NewerTab, but instead of the big icons, it'll be a static list of websites.

## Specific things I have in mind
* toggle for search bar to fill parent
* search bar initially glass but will transition to solid white when you start typing.
* "Search..." text on left, current date/time on right.
* Maybe some basic favicon-kinda-thing with FontAwesome brands.svg and a look-up table?
