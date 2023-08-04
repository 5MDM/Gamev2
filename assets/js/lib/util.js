/**
 * Returns the first element that matches a specified CSS selector in the document
 * @param {string} e - The CSS selector to match
 * @returns {HTMLElement|null} - The matched element or null if no match is found
 */
export function $(e) {return document.querySelector(e)}

/**
 * Executes a callback function for each element in an array or a single value
 * @param {Array|any} a - The array or the value to iterate over
 * @param {function} b - The callback function to execute
 */
export function forAll(a, b) {
  if(Array.isArray(a)) {
    for(const i in a) b(a[i]);
  } else {
    b(a);
  }
}

/**
 * Converts an object of CSS properties and values into a string
 * @param {Object} e - The object of CSS properties and values
 * @returns {string} - The string of CSS declarations
 */
export function parseCSS(e) {
  var str = "";
  for(const i in e)
    str += `${i}: ${e[i]};`;
  
  return str;
}

/**
 * Creates and returns a new HTML element with the specified name and options
 * @param {keyof HTMLElementTagNameMap} name - The tag name of the HTML element to create
 * @param {Object} [opts] - The optional object of options to configure the element
 * @param {Object} [opts.attrs] - The object of attributes to set on the element
 * @param {Object} [opts.style] - The object of CSS properties and values to apply to the element
 * @param {Array|any} [opts.children] - The array or the value of children to append to the element. If a string is given, it will be wrapped in a <p> element.
 * @param {Array|any} [opts.listeners] - The array or the value of event listeners to add to the element. Each listener should be an array of two elements: the event name and the callback function.
 * @param {Array|any} [opts.up] - The array or the value of pointerup event handlers to add to the element. Each handler should be a function that takes an object with two properties: e (the event) and el (the element).
 * @param {Array|any} [opts.down] - The array or the value of pointerdown event handlers to add to the element. Each handler should be a function that takes an object with two properties: e (the event) and el (the element).
 * @returns {Element} - The created HTML element
 */
export function $$(name, opts) {
  const el = document.createElement(name);
  if(!opts) return el;
  
  if(opts.attrs)
    for(const i in opts.attrs)
      el.setAttribute(i, opts.attrs[i]);
  
  if(opts.style)
    el.setAttribute("style", parseCSS(opts.style));
  
  if(opts.children) {
    forAll(opts.children, e => {
      if(typeof e == "string") {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(e));
        el.appendChild(p);
      } else {
        el.appendChild(e);
      }
    });
  }
  
  if(opts.listeners)
    forAll(opts.listeners, ([evt, func]) =>
      el.addEventListener(evt, e => func({e, el}))
    );
  
  if(opts.up)
    forAll(opts.up, func => 
      el.addEventListener("pointerup", e => func({e, el}))
    );
  
  if(opts.down)
    forAll(opts.down, func => 
      el.addEventListener("pointerdown", e => func({e, el}))
    );
  
  return el;
}

/**
 * @typedef {Object} StopLoopControl
 * @property {function} start - Start the loop function if it was stopped
 * @property {function} stop - Stop the loop function if it was running
 */
/**
 * Creates and returns a loop function that can be started and stopped by calling the returned methods
 * @param {function} func - The function to execute in each loop iteration. The function will receive an object with two methods: start and stop, which can be used to control the loop.
 * @param {boolean} [ss=true] - The optional boolean value that indicates whether the loop should be stopped by default or not.
 * @returns {StopLoopControl} - The object with two methods: start and stop, which can be used to control the loop.
 */
export function stopLoop(func, ss = true) {
  const perfectFPS = 1000 / 60;
  var s = !ss;
  var lastTime = performance.now();
  function start() {
    if(s == false) return;
    s = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
  
  function stop() {s = true}
  
  function loop() {
    if(!s) {
      const currentTime = performance.now();
      const rawDelta = (currentTime - lastTime);
      var delta = rawDelta / perfectFPS;
      
      if(delta > 4) delta = 4;
      lastTime = currentTime;
      func({start, stop, delta, rawDelta});
      requestAnimationFrame(loop);
    }
  }
  loop();
  
  return {start, stop};
}

/**
 * Executes a function in a loop that can be controlled by the function itself
 * @param {function} f - The function to execute in each loop iteration. The function will receive a parameter that is a reference to itself, which can be used to call the next iteration or stop the loop.
 * @returns {any} - The return value of the first call of the function
 */
export function stepLoop(f) {
  function step() {f(step)}
  return step();
}

/**
 * Executes an array of functions in a loop with a specified delay or a custom delay for each function
 * @param {Array} arr - The array of functions to execute in the loop. Each function should take a parameter that is a reference to the next function in the loop. Optionally, each function can be wrapped in an array with a second element that is a number representing the custom delay for that function in milliseconds.
 * @param {number} s - The default delay for each function in milliseconds
 */
export function timeoutLoop(arr, s) {
  var i = 0;
  stepLoop(next => {
    const item = arr[i];
    if(!item) return;
    if(Array.isArray(item)) {
      setTimeout(() => item[0](next), arr[i][1]);
    } else {
      setTimeout(() => item(next), s);
    }
    i++;
  });
}

/**
 * Returns a number that is clamped between a minimum and a maximum value. If the number is above or below, it is set to the min or max.
 * @param {number} min - The lower bound of the clamp range
 * @param {number} num - The number to clamp
 * @param {number} max - The upper bound of the clamp range
 * @returns {number} - The clamped number
 */
export function clamp(min, num, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Represents a color in the HSL (hue, saturation, lightness) color space
 */
export class HSL {
  /**
   * @type {number}
   * @description The hue of the color, in degrees from 0 to 360
   */
  h;
  /**
   * @type {number}
   * @description The saturation of the color, in percentage from 0 to 100
   */
  s;
  /**
   * @type {number}
   * @description The lightness of the color, in percentage from 0 to 100
   */
  l;
  /**
   * Creates a new HSL color object with the given hue, saturation, and lightness values
   * @param {number} [h=0] - The hue of the color, in degrees from 0 to 360
   * @param {number} [s=100] - The saturation of the color, in percentage from 0 to 100
   * @param {number} [l=50] - The lightness of the color, in percentage from 0 to 100
   */
  constructor(h = 0, s = 100, l = 50) {
    this.h = h;
    this.s = s;
    this.l = l;
    return this;
  }
  
  /**
   * Converts the HSL color to a hexadecimal string representation
   * @returns {string} - The hexadecimal string of the color, without the leading #
   */
  toHex() {
    const h = this.h;
    const s = this.s;
    const l = this.l / 100;
    const a = s * Math.min(l, 1 - l) / 100;
    
    function f(n) {
      const k = (n + h / 30) % 12;
      const color = 
      l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
    };
    
    return `${f(0)}${f(8)}${f(4)}`;
  }
  
  /**
   * Converts the HSL color to a numerical value representation
   * @returns {number} - The numerical value of the color, obtained by parsing the hexadecimal string as an integer
   */
  toNum() {return parseInt(this.toHex())}
}

// https://flaviocopes.com/javascript-why-not-modify-object-prototype/
// Element.prototype.addEventListeners = function(events, callback, opts) { // Has to be function() {}, not () => {}
//   events.forEach((e) => {
//     this.addEventListener(e, callback, opts)
//   })
// }

/**
 * Adds event listeners to a given element for multiple events with the same callback function and options
 * @param {Element} element - The element to add the event listeners to
 * @param {string[]} events - The array of event names to listen for
 * @param {function} callback - The function to execute when any of the events occur
 * @param {AddEventListenerOptions|boolean} [opts] - The optional object of options or a boolean value indicating whether the event listener should be passive or not
 */
export function addEventListeners(element, events, callback, opts) {
  events.forEach((e) => {
    element.addEventListener(e, callback, opts)
  })
}