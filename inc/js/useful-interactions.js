/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		if (!window.console) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

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

	};

	// public functions
	useful.interactions = useful.interactions || {};
	useful.interactions.watch = interactions.watch;

}(window.useful = window.useful || {}));