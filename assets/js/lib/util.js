export function $(e) {return document.querySelector(e)}

export function forAll(a, b) {
  if(Array.isArray(a)) {
    for(const i in a) b(a[i]);
  } else {
    b(a);
  }
}

export function parseCSS(e) {
  var str = "";
  for(const i in e)
    str += `${i}: ${e[i]};`;
  
  return str;
}

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

export function stopLoop(func, ss = true) {
  var s = !ss;
  function start() {
    s = false;
    requestAnimationFrame(loop);
  }
  
  function stop() {s = true}
  
  function loop() {
    if(!s) {
      func({start, stop});
      requestAnimationFrame(loop);
    }
  }
  loop();
  
  return {start, stop};
}

export function stepLoop(f) {
  function step() {f(step)}
  return step();
}

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

export function clamp(min, num, max) {
  return Math.min(Math.max(num, min), max);
}

export class HSL {
  constructor(h = 0, s = 100, l = 50) {
    this.h = h;
    this.s = s;
    this.l = l;
    return this;
  }
  
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
  
  toNum() {return parseInt(this.toHex())}
}