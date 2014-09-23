/*
	Source:
	van Creij, Maurice (2012). "useful.interactions.js: A library of useful functions to ease working with touch and gestures.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.interactions = {

		// general interactions
		watch : function (element, handlers, coordinates) {
			// if touch is supported
			if (!!('ontouchstart' in window) || !!('onmsgesturechange' in window)) {
				// use touch
				this.touch(element, handlers, coordinates);
			} else {
				// fall back on mouse
				this.mouse(element, handlers, coordinates);
			}
			// if gestures are supported
			if (!!('ongesturestart' in window) || !!('onmsgesturestart' in window)) {
				// use gestures
				this.gestures(element, handlers, coordinates);
			}
		},

		// mouse interactions
		mouse : function (element, handlers, coordinates) {
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
				handlers.wheel(coordinates, event);
			};
			element.addEventListener('mousewheel', wheel);
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
				handlers.start(coordinates, event);
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
					handlers.move(coordinates, event);
				}
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
				handlers.end(coordinates, event);
				// clear the positions
				coordinates = {};
			};
			document.addEventListener('mouseup', end);
		},

		// touch interactions
		touch : function (element, handlers, coordinates) {
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
				var a, b, touches, id;
				// for all touches
				touches = event.touches || [event];
				for (a = 0, b = touches.length; a < b; a += 1) {
					// get a reference id for the event
					id = event.pointerId || a;
					// reset the positions
					coordinates[id] = {};
					// store the start positions
					coordinates[id].start = {
						x : touches[a].pageX,
						y : touches[a].pageY
					};
				}
				// THINGS TO DO WHEN TOUCHED
				handlers.start(coordinates, event);
			};
			element.addEventListener('touchstart', start);
			element.addEventListener('mspointerdown', start);

			// handle the duration of the touch
			move = function (event) {
				var a, b, touches, id, hasStarted = false;
				// for all touches
				touches = event.touches || [event];
				for (a = 0, b = touches.length; a < b; a += 1) {
					// get a reference id for the event
					id = event.pointerId || a;
					// if there is a touch in progress
					if (coordinates[id] && coordinates[id].start) {
						// report motion
						hasStarted = true;
						// store the move positions
						coordinates[id].move = {
							x : touches[a].pageX,
							y : touches[a].pageY
						};
					}
				}
				// THINGS TO DO WHEN MOVED
				if (hasStarted) { handlers.move(coordinates, event); }
			};
			element.addEventListener('touchmove', move);
			element.addEventListener('mspointermove', move);

			// handle the end of the touch
			end = function (event) {
				var touches, a, b, id;
				// for all touches
				touches = event.touches || [event];
				for (a = 0, b = touches.length; a < b; a += 1) {
					// get a reference id for the event
					id = event.pointerId || a;
					// if there is a touch in progress
					if (coordinates[id] && coordinates[id].start) {
						// store the end positions
						coordinates[id].end = {
							x : touches[a].pageX,
							y : touches[a].pageY
						};
					}
				}
				// THINGS TO DO WHEN RELEASED
				handlers.end(coordinates, event);
				// clear the positions afterwards
				coordinates = {};
			};
			element.addEventListener('touchend', end);
			element.addEventListener('mspointerup', end);

		},

		// gesture interactions
		gestures : function (element, handlers, coordinates) {
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
				handlers.start(coordinates, event);
			};
			element.addEventListener('gesturestart', start);
			element.addEventListener('msgesturestart', start);

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
					handlers.move(coordinates, event);
				}
			};
			element.addEventListener('gesturechange', move);
			element.addEventListener('msgesturechange', move);

			// handle the end of the gesture
			end = function (event) {
				// store the end positions
				coordinates[0].end = {
					rotation : event.rotation,
					scale : event.scale
				};
				// THINGS TO DO WHEN TOUCH UP
				handlers.end(coordinates, event);
				// clear the positions afterwards
				coordinates = {};
			};
			element.addEventListener('gestureend', move);
			element.addEventListener('msgestureend', move);

		}

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.interactions;
	}

})();
