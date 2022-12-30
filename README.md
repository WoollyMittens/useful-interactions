# interactions.js: Interactions Library

A library of useful functions to ease working with touch and gestures.

## How to include the script

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="js/interactions.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'js/interactions.js'
], function(interactions) {
	...
});
```

Or import into an MVC framework.

```js
var interactions = require('js/interactions.js');
```

## How to start the script

```javascript
interactions.watch(
	element,
	{
		'wheel' : function (coords, event) {},
		'start' : function (coords, event) { event.preventDefault(); },
		'move' : function (coords, event) {},
		'end' : function (coords, event) {}
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

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens) and at [WoollyMittens.nl](https://www.woollymittens.nl/).
