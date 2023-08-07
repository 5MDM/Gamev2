import type {Mesh} from "three";
import type {AnyCamera} from "../../lib/camera";
import {$, $$} from "../../lib/util";
import {setDebugObj} from "./debug";
import "./pause";
import { Octree } from "../../lib/quadrant";

const el: HTMLImageElement = $("#settings-btn")!;
const menu: HTMLDivElement = $("#settings #settings-menu")!;
var menuOpen = false;
var lastBtn: HTMLButtonElement;
var lastContent: HTMLDivElement;

el.addEventListener("pointerup", () => {
  if(menuOpen) {hideSettings()} 
  else {showSettings()}
});

export function hideSettings() {
  if(lastBtn != undefined) lastBtn.classList.remove("current");
  if(lastContent != undefined) lastContent.style.display = "none";
  $("#resume")!.style.display = "block";
  menu.style.display = "none";
  el.style.filter = "";
  menuOpen = false;
}

export function showSettings() {
  $("#resume")!.style.display = "none";
  el.style.filter = "brightness(50%)";
  menu.style.display = "flex";
  menuOpen = true;
}

// var cam;
// var playerObj;
// var trees;

export function setDevObj(o: {camera: AnyCamera, player: Mesh, octrees: Octree[]}) {
  // cam = o.camera;
  // playerObj = o.player;
  // trees = o.octrees;
  setDebugObj({
    camera: o.camera,
    player: o.player,
    octrees: o.octrees
  });
}

interface SettingComponentAddEventListenerOpts {
  once?: boolean,
  signal?: AbortSignal
}
interface SettingComponentListeners {
  listener: (() => void),
  opts?: SettingComponentAddEventListenerOpts
}
export class BaseSettingComponent {
  public id: string;
  public name: string;
  public value?: any;
  constructor(opts: {
    id: string,
    name: string,
    defaultValue?: any
  }) {
    this.id = opts.id;
    this.name = opts.name;
    this.value = opts.defaultValue;
    return this;
  }
}

export class ToggleSettingComponent extends BaseSettingComponent {
  public onenable?: () => void;
  public ondisable?: () => void;
  declare public value: boolean;
  public type: "toggle" = "toggle";
  listeners: {enable: SettingComponentListeners[], disable: SettingComponentListeners[]} = {
    enable: [],
    disable: []
  }
  constructor(opts: {
    id: string,
    name: string,
    defaultValue?: boolean
  }) {
    super(opts);
    this.value = opts.defaultValue || false;
  }
  addEventListener(type: "enable" | "disable", listener: () => void, opts?: SettingComponentAddEventListenerOpts) {
    if (type === "enable") this.listeners.enable.push({listener, opts});
    else this.listeners.disable.push({listener, opts});
  }
  removeEventListener(type: "enable" | "disable", listener: () => void, opts?: SettingComponentAddEventListenerOpts) {
    const listeners = this.listeners[type];
    const found = listeners.find(l => l.listener == listener
      && l.opts?.once == opts?.once
      && l.opts?.signal == opts?.signal);
    if (!found) return;
    this.listeners[type].splice(listeners.indexOf(found), 1);
  }

  generate() {
    const span = document.createElement("span");
    span.innerText = this.name;
    return $$("div", {
      attrs: {
        class: "setting"
      },
      children: [
        span,
        $$("span", {
          attrs: {
            class: this.value ? "setting-toggle enabled" : "setting-toggle"
          }
        })
      ],
      down: ({e, el}) => {
        this.value = !this.value
        if (this.value) {
          el.querySelector(".setting-toggle")?.classList.add("enabled")
          if (this.onenable) this.onenable();
          this.listeners.enable.forEach(e => {
            e.listener();
            if (e.opts?.once) this.listeners.enable.splice(this.listeners.enable.indexOf(e), 1);
          });
        } else {
          el.querySelector(".setting-toggle")?.classList.remove("enabled")
          if (this.ondisable) this.ondisable();
          this.listeners.disable.forEach(e => {
            e.listener();
            if (e.opts?.once) this.listeners.disable.splice(this.listeners.disable.indexOf(e), 1);
          });
        }
      },
    })
  }
}

export class SliderSettingComponent extends BaseSettingComponent {
  public onenable?: () => void;
  public ondisable?: () => void;
  
  declare public value: number;
  public min: number;
  public max: number;
  public step: number;
  
  public type: "slider" = "slider";
  listeners: {enable: SettingComponentListeners[], disable: SettingComponentListeners[]} = {
    enable: [],
    disable: []
  }
  constructor(opts: {
    id: string,
    name: string,
    defaultValue?: number,
    min: number,
    max: number,
    step?: number,
  }) {
    super(opts);
    this.value = opts.defaultValue || 0;
    this.min = opts.min;
    this.max = opts.max;
    this.step = opts.step || 1;
  }
  addEventListener(type: "enable" | "disable", listener: () => void, opts?: SettingComponentAddEventListenerOpts) {
    if (type === "enable") this.listeners.enable.push({listener, opts});
    else this.listeners.disable.push({listener, opts});
  }
  removeEventListener(type: "enable" | "disable", listener: () => void, opts?: SettingComponentAddEventListenerOpts) {
    const listeners = this.listeners[type];
    const found = listeners.find(l => l.listener == listener
      && l.opts?.once == opts?.once
      && l.opts?.signal == opts?.signal);
    if (!found) return;
    this.listeners[type].splice(listeners.indexOf(found), 1);
  }

  generate() {
    const span = document.createElement("span");
    span.innerText = this.name;
    
    const slider = <HTMLInputElement>$$("input", {
      attrs: {
        class: "slider",
        type: "range",
        min: this.min.toString(),
        max: this.max.toString(),
        value: this.value.toString(),
        step: this.step.toString(),
      },
    });
    
    const count = $$("p", {
      children: ": " + this.value.toString(),
    });
    
    slider.addEventListener("input", () => {
      count.innerText = ": " + slider.value.toString();
    });
    
    return $$("div", {
      attrs: {
        class: "setting"
      },
      children: [
        span,
        count,
        slider,
      ],
    });
  }
}

export type AnySettingComponent = 
  ToggleSettingComponent
| SliderSettingComponent;

export class SettingGroup {
  id: string;
  name: string;
  components: AnySettingComponent[] = [];
  constructor(opts: {
    id: string,
    name: string
  }) {
    this.id = opts.id;
    this.name = opts.name;
  }
  addComponent(component: AnySettingComponent) {
    this.components?.push(component);
    return this;
  }
  addToDOM(sidebar: HTMLDivElement, contentContainer: HTMLDivElement) {
    sidebar.appendChild($$("button", {
      attrs: {
        id: this.id
      },
      children: this.name,
      down: ({el}) => {
        const content = contentContainer.querySelector<HTMLDivElement>(`div.content#${this.id}-content`)!;
        content.style.display = "flex";
        const otherContents = contentContainer.querySelectorAll<HTMLDivElement>(`div.content:not(div.content#${this.id}-content)`);
        otherContents.forEach(e => e.style.display = "none");

        el.classList.add("current");
        const otherButtons = sidebar.querySelectorAll<HTMLButtonElement>(`button:not(button#${this.id})`);
        otherButtons.forEach(e => e.classList.remove("current"))
      },
    }))
    contentContainer.appendChild($$("div", {
      attrs: {
        id: `${this.id}-content`,
        class: "content"
      },
      children: this.components?.map(component => component.generate())
    }))
  }
}