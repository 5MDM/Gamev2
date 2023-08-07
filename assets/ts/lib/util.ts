/**
 * Returns the first element that matches a specified CSS selector in the document
 * @returns The selected element
 */
export function $(e: string): AnyHTMLElement | null {return document.querySelector(e)}

/**
 * Executes a callback function for each element in an array or a single value
 * @param a - The array or the value to iterate over
 * @param b - The callback function to execute
 */
export function forAll(a: any, b: (_args: any) => void): void {
  if(Array.isArray(a)) {
    for(const i in a) b(a[i]);
  } else {
    b(a);
  }
}

/**
 * Converts an object of CSS properties and values into a string
 * @param e - The object of CSS properties and values
 */
export function parseCSS(e: {[key: string]: string}): string {
  var str = "";
  for(const i in e)
    str += `${i}: ${e[i]};`;
  
  return str;
}

/**
 * Creates and returns a new HTML element with the specified name and options
 * @param name - The tag name of the HTML element to create
 * @param {Object} [opts] - The optional object of options to configure the element
 * @param {Object} [opts.attrs] - The object of attributes to set on the element
 * @param {Object} [opts.style] - The object of CSS properties and values to apply to the element
 * @param {Array|any} [opts.children] - The array or the value of children to append to the element. If a string is given, it will be wrapped in a <p> element.
 * @param {Array|any} [opts.listeners] - The array or the value of event listeners to add to the element. Each listener should be an array of two elements: the event name and the callback function.
 * @param {Array|any} [opts.up] - The array or the value of pointerup event handlers to add to the element. Each handler should be a function that takes an object with two properties: e (the event) and el (the element).
 * @param {Array|any} [opts.down] - The array or the value of pointerdown event handlers to add to the element. Each handler should be a function that takes an object with two properties: e (the event) and el (the element).
 * @returns The created HTML element
 */
export function $$(name: string, opts?: {
  attrs?: {[key: string]: string},
  style?: {[key: string]: string},
  children?: HTMLElement | string | (HTMLElement | string)[],
  listeners?: string,
  up?: ({e, el}: {e: PointerEvent, el: HTMLElement}) => void | (({e, el}: {e: PointerEvent, el: HTMLElement}) => void)[],
  down?: ({e, el}: {e: PointerEvent, el: HTMLElement}) => void | (({e, el}: {e: PointerEvent, el: HTMLElement}) => void)[],
}): HTMLElement {
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

interface StopLoopIterationParams {
  start: () => void,
  stop: () => void,
  delta: number,
  rawDelta: number
}
/**
 * Creates and returns a loop function that can be started and stopped by calling the returned methods
 * @param func - The function to execute in each loop iteration. The function will receive an object with two methods: start and stop, which can be used to control the loop.
 * @param {boolean} [ss=true] - The optional boolean value that indicates whether the loop should be stopped by default or not.
 * @returns The object with two methods: start and stop, which can be used to control the loop.
 */
export function stopLoop(func: (_arg: StopLoopIterationParams) => void, ss: boolean = true): {start: () => void, stop: () => void} {
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
 * @param f - The function to execute in each loop iteration. The function will receive a parameter that is a reference to itself, which can be used to call the next iteration or stop the loop.
 */
export function stepLoop(f: (step: () => void) => any): void {
  function step() {f(step)}
  return step();
}

/**
 * Returns a number that is clamped between a minimum and a maximum value. If the number is above or below, it is set to the min or max.
 * @param min - The lower bound of the clamp range
 * @param num - The number to clamp
 * @param max - The upper bound of the clamp range
 * @returns The clamped number
 */
export function clamp(min: number, num: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Represents a color in the HSL (hue, saturation, lightness) color space
 */
export class HSL {
  /**
   * @description The hue of the color, in degrees from 0 to 360
   */
  h: number;
  /**
   * @description The saturation of the color, in percentage from 0 to 100
   */
  s: number;
  /**
   * @description The lightness of the color, in percentage from 0 to 100
   */
  l: number;
  /**
   * Creates a new HSL color object with the given hue, saturation, and lightness values
   * @param {number} [h=0] - The hue of the color, in degrees from 0 to 360
   * @param {number} [s=100] - The saturation of the color, in percentage from 0 to 100
   * @param {number} [l=50] - The lightness of the color, in percentage from 0 to 100
   */
  constructor(h: number = 0, s: number = 100, l: number = 50) {
    this.h = h;
    this.s = s;
    this.l = l;
    return this;
  }
  
  /**
   * Converts the HSL color to a hexadecimal string representation
   * @returns The hexadecimal string of the color, without the leading #
   */
  toHex(): string {
    const h = this.h;
    const s = this.s;
    const l = this.l / 100;
    const a = s * Math.min(l, 1 - l) / 100;
    
    function f(n: number) {
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
   * @returns The numerical value of the color, obtained by parsing the hexadecimal string as an integer
   */
  toNum(): number {return parseInt(this.toHex())}
  
  toCSS() {return `hsl(${this.h}, ${this.s}%, ${this.l}%)`}
}

// https://flaviocopes.com/javascript-why-not-modify-object-prototype/
// Element.prototype.addEventListeners = function(events, callback, opts) { // Has to be function() {}, not () => {}
//   events.forEach((e) => {
//     this.addEventListener(e, callback, opts)
//   })
// }

/**
 * Adds event listeners to a given element for multiple events with the same callback function and options
 * @param element - The element to add the event listeners to
 * @param events - The array of event names to listen for
 * @param callback - The function to execute when any of the events occur
 * @param {AddEventListenerOptions|boolean} [opts] - The optional object of options or a boolean value indicating whether the event listener should be passive or not
 */
export function addEventListeners(element: Element, events: string[], callback: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions | boolean) {
  events.forEach((e) => {
    element.addEventListener(e, callback, opts)
  })
}

/**
 * Rounds a number to a specified number of digits after the decimal point.
 * @param num - The number to be rounded.
 * @param places - The power of 10 that determines the number of digits.
 * @returns The rounded number.
 */
export function round(num: number, places: number): number {
  return Math.round(num * places) / places;
}

/**
 * Returns a promise that resolves after the specified amount of milliseconds
 * @param ms The amount of milliseconds to wait
 * @returns The promise that will resolve after the specified time
 */
export function wait(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms)
  })
}