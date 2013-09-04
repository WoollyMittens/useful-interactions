/*
	Source:
	van Creij, Maurice (2012). "useful.interactions.js: A library of useful functions to ease working with touch and gestures.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var interactions = interactions || {};

	// general interactions
	interactions.watch = function (element, handlers, coordinates) {
		// if touch is supported
		if (!!('ontouchstart' in window) || !!('onmsgesturechange' in window)) {
			// use touch
			interactions.touch(element, handlers, coordinates);
		} else {
			// fall back on mouse
			interactions.mouse(element, handlers, coordinates);
		}
		// if gestures are supported
		if (!!('ongesturestart' in window) || !!('onmsgesturestart' in window)) {
			// use gestures
			interactions.gestures(element, handlers, coordinates);
		}
	};

	// mouse interactions
	interactions.mouse = function (element, handlers, coordinates) {
		var wheel, start, move, end;

		// default handlers
		handlers = handlers || {};
		handlers.wheel = handlers.wheel || function () {};
		handlers.start = handlers.start || function () {};
		handlers.move = handlers.move || function () {};
		handlers.end = handlers.end || function () {};

		// default coordinates
		coordinates = coordinates || {};

		// handle the mouse wheel movement
		wheel = function (event) {
			// get the reading from the mouse wheel
			coordinates.wheel = {
				y : ((window.event) ? window.event.wheelDelta / 120 : -event.detail / 3)
			};
			// THINGS TO DO WHEN SCROLLED
			handlers.wheel(coordinates);
			// cancel the scrolling
			return false;
		};
		element.onmousewheel = wheel;
		if (navigator.userAgent.match(/firefox/gi)) { element.addEventListener('DOMMouseScroll', wheel, false); }

		// handle the start of the mouse movement
		start = function (event) {
			// get the event properties
			event = event || window.event;
			// reset the positions
			coordinates[0] = {};
			// store the start positions
			coordinates[0].start = {
				x : (event.pageX || event.x),
				y : (event.pageY || event.y)
			};
			// THINGS TO DO WHEN MOUSE DOWN
			handlers.start(coordinates);
			// cancel the click
			return false;
		};
		element.addEventListener('mousedown', start);

		// handle the duration of the mouse movement
		move = function (event) {
			// get the event properties
			event = event || window.event;
			// if there is a touch in progress
			if (coordinates[0] && coordinates[0].start) {
				// store the duration positions
				coordinates[0].move = {
					x : (event.pageX || event.x),
					y : (event.pageY || event.y)
				};
				// THINGS TO DO WHEN DRAGGED
				handlers.move(coordinates);
			}
			// cancel the click
			return false;
		};
		document.addEventListener('mousemove', move);

		// handle the end of the mouse movement
		end = function (event) {
			// get the event properties
			event = event || window.event;
			// store the end position
			if (coordinates[0]) {
				coordinates[0].end = {
					x : (event.pageX || event.x),
					y : (event.pageY || event.y)
				};
			}
			// THINGS TO DO WHEN MOUSE UP
			handlers.end(coordinates);
			// clear the positions
			coordinates[0] = {};
			// cancel the click
			return false;
		};
		document.addEventListener('mouseup', end);
	};

	// touch interactions
	interactions.touch = function (element, handlers, coordinates) {
		var start, move, end;

		// default handlers
		handlers = handlers || {};
		handlers.start = handlers.start || function () {};
		handlers.move = handlers.move || function () {};
		handlers.end = handlers.end || function () {};

		// default coordinates
		coordinates = coordinates || {};

		// handle the start of the touch
		start = function (event) {
			var a, b, interactionss, id;
			// for all interactionss
			interactionss = event.touches || [event];
			for (a = 0 , b = interactionss.length; a < b; a += 1) {
				// get a reference id for the event
				id = event.pointerId || a;
				// reset the positions
				coordinates[id] = {};
				// store the start positions
				coordinates[id].start = {
					x : interactionss[a].pageX,
					y : interactionss[a].pageY
				};
				// THINGS TO DO WHEN TOUCH DOWN
				handlers.start(coordinates);
			}
			// cancel the default
			//return false;
		};
		element.ontouchstart = start;
		element.onmspointerdown = start;

		// handle the duration of the touch
		move = function (event) {
			var a, b, interactionss, id;
			// for all interactionss
			interactionss = event.touches || [event];
			for (a = 0 , b = interactionss.length; a < b; a += 1) {
				// get a reference id for the event
				id = event.pointerId || a;
				// if there is a touch in progress
				if (coordinates[id] && coordinates[id].start) {
					// store the move positions
					coordinates[id].move = {
						x : interactionss[a].pageX,
						y : interactionss[a].pageY
					};
					// THINGS TO DO WHEN SWIPED
					handlers.move(coordinates);
				}
			}
			// cancel the default
			return false;
		};
		element.ontouchmove = move;
		element.onmspointermove = move;

		// handle the end of the touch
		end = function (event) {
			var interactionss, a, b, id;
			// for all interactionss
			interactionss = event.touches || [event];
			for (a = 0 , b = interactionss.length; a < b; a += 1) {
				// if there is a touch in progress
				if (coordinates[id] && coordinates[id].start) {
					// store the end positions
					coordinates[id].end = {
						x : interactionss[a].pageX,
						y : interactionss[a].pageY
					};
					// THINGS TO DO WHEN TOUCH UP
					handlers.end(coordinates);
				}
				// clear the positions afterwards
				coordinates[id] = {};
			}
			// cancel the default
			//return false;
		};
		element.ontouchend = end;
		element.onmspointerup = end;

	};

	// gesture interactions
	interactions.gestures = function (element, handlers, coordinates) {
		var start, move, end;

		// default handlers
		handlers = handlers || {};
		handlers.start = handlers.start || function () {};
		handlers.move = handlers.move || function () {};
		handlers.end = handlers.end || function () {};

		// default coordinates
		coordinates = coordinates || {};

		// handle the start of the gesture
		start = function (event) {
			// reset the positions
			coordinates[0] = {};
			// store the start positions
			coordinates[0].start = {
				rotation : event.rotation,
				scale : event.scale
			};
			// THINGS TO DO WHEN TOUCH DOWN
			handlers.start(coordinates);
		};
		element.ongesturestart = start;
		element.onmsgesturestart = start;

		// handle the duration of the gesture
		move = function (event) {
			// if there is a touch in progress
			if (coordinates[0] && coordinates[0].start) {
				// store the move positions
				coordinates[0].move = {
					rotation : event.rotation,
					scale : event.scale
				};
				// THINGS TO DO WHEN SWIPED
				handlers.move(coordinates);
			}
		};
		element.ongesturechange = move;
		element.onmsgesturechange = move;

		// handle the end of the gesture
		end = function (event) {
			// store the end positions
			coordinates[0].end = {
				rotation : event.rotation,
				scale : event.scale
			};
			// THINGS TO DO WHEN TOUCH UP
			handlers.end(coordinates);
			// clear the positions afterwards
			coordinates[0] = {};
		};
		element.ongestureend = end;
		element.onmsmsgestureend = end;
	};

	// public functions
	useful.interactions = useful.interactions || {};
	useful.interactions.watch = interactions.watch;

}(window.useful = window.useful || {}));
