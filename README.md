# useful.interactions.js: Interactions Library

A library of useful functions to ease working with touch and gestures.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=useful-interactions">tests</a>.

## How to include the script

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/interactions.min.js"></script>
```

## How to start the script

```javascript
useful.interaction.watch(
	element,
	{
		'wheel' : function (coords) {},
		'start' : function (coords) {},
		'move' : function (coords) {},
		'end' : function (coords) {}
	},
	coords
);
```

This function tries to unify mouse and touch interaction across desktop, Android, iOS and Windows 8.

**element : {DOM object}** - A DOM Element affected by the interaction.

**wheel : {function}** - A function that runs every time the mouse wheel is used.

**start : {function}** - A function that runs every time an interaction starts.

**move : {function}** - A function that runs every time an interaction is in progress.

**end : {function}** - A function that runs every time an interaction ends.

### Coordinated Format

The *coordinates* object is passed to all these functions.

```javascript
coordinates = {
	wheel : {y:0},
	id : {
		start : {x:0, y:0, rotation:0, scale:0},
		move : {x:0, y:0, rotation:0, scale:0},
		end : {x:0, y:0, rotation:0, scale:0}
	}
}
```

An optional (empty) object that gets filled with all the interactions that get registered.

**wheel : {object}** - The wheel object contains *y*, the scroll distance as an integer.

**id : {object}** - Each touch interaction gets added as a separate object. *0* is the default interaction, or the first finger to touch the screen.

**start : {object}** - This object contains the coordinates and gesture parameters of the start of the current interaction.

**move : {object}** - This object contains the coordinates and gesture parameters of the interaction in progress.

**end : {object}** - This object contains the coordinates and gesture parameters of the end of the current interaction.

## Prerequisites

To concatenate and minify the script yourself, the following prerequisites are required:
+ https://github.com/WoollyMittens/useful-polyfills

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
