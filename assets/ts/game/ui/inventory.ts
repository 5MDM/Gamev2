import {$, $$, $$Opts, logError, parseCSS, throwError} from "../../lib/util";
import {imageImports} from "../../window";

interface SidebarSlot {
  name: string;
  target: string;
}

interface Target {
  rows: number;
  columns: number;
  el: string;
  amount?: number;
}

class Inventory {
  public targets: Target[];
  public sidebar: HTMLElement[];
  public sidebarTarget: HTMLElement;
  public onUp: ((el: HTMLElement) => void);
  public onDown: ((el: HTMLElement) => void);
  public selected?: number = undefined;
  public selectedEl?: HTMLElement = undefined;
  
  constructor(o: {
    targets: Target[];
    sidebarTarget: Element;
    sidebar: Element[];
    down: ((el: HTMLElement) => void),
    up: ((el: HTMLElement) => void),
  }) {
    this.targets = o.targets;
    this.sidebarTarget = <HTMLElement>o.sidebarTarget;
    this.sidebar = <HTMLElement[]>o.sidebar;
    this.onDown = o.down;
    this.onUp = o.up;
    this.#generate();
    
    return this;
  }
  
  #generate() {
    for(const i of this.targets) {
      const e = <HTMLElement>$("#ui > #inventory #" + i.el);
      e.style.gridTemplateColumns = 
      `repeat(${i.columns}, 1fr)`;
      e.style.gridTemplateRows = 
      `repeat(${i.rows}, 1fr)`;
      
      if(i.amount == undefined
      || i.amount > i.rows * i.columns)
        i.amount = i.rows * i.columns;
      
      for(let z = 0; z != i.amount; z++)
        e.appendChild(Inventory.createSlot());
    }
    
    for(let i in this.sidebar) {
      const el = this.sidebar[i];
      if(parseInt(i) == 0) {
        this.onDown(el);
        this.#getTargetFromEl(el).style.display = "grid";
        this.selected = 0;
        this.selectedEl = el;
      }
      
      el.addEventListener("pointerdown", () => {
        if(this.selected != parseInt(i)
        && this.selected != undefined) {
          this.onUp(this.selectedEl!);
          this.#getTargetFromEl(this.selectedEl!)
          .style.display = "none";
        }
        
        this.selected = parseInt(i);
        this.selectedEl = el;
        this.onDown(el);
        this.#getTargetFromEl(el).style.display = "grid";
      });
      
      /*el.addEventListener("pointerup", () => {
        if(this.selected != parseInt(i)) {
          this.onUp(el);
          this.#getTargetFromEl(this.selectedEl!)
          .style.display = "none";
        }
      });*/
      
      this.sidebarTarget.appendChild(el);
    }
  }
  
  #getTargetFromEl(el: Element): HTMLElement {
    const name = el.getAttribute("data-target");
    const found = $(`#inventory #inventory-main > #${name}`);
    if(found == undefined) throwError(
      `inventory.ts: "${name}" does not point `
    + `to a valid element in #inventory-main. `
    );
    
    return found;
  }
  
  static createSlot(opts?: $$Opts): Element {
    const el: Element = $$("div", opts);
    el.classList.add("inventory-slot");
    
    return el;
  }
  
  static createSidebar(o: SidebarSlot): Element {
    const el = $$("div", {
      attrs: {
        "data-target": o.target,
        class: "sidebar-slot",
      },
      children: $$("p", {text: o.name}),
    });
    
    return el;
  }
}

const computed: CSSStyleDeclaration = 
getComputedStyle($("#ui > #inventory #sidebar")!);

const bg: string = 
computed.getPropertyValue("--slot-bg");

const inventory = new Inventory({
  targets: [
    {
      rows: 9,
      columns: 6,
      el: "inventory-grid",
    },
    {
      rows: 9,
      columns: 9,
      el: "blocks",
    },
  ],
  sidebarTarget: $("#ui > #inventory #sidebar")!,
  sidebar: [
    Inventory.createSidebar({
      name: "Inventory",
      target: "inventory-grid",
    }),
    Inventory.createSidebar({
      name: "Blocks",
      target: "blocks",
    }),
  ],
  down(el: HTMLElement): void {
    el.style.backgroundColor = "#222222";
  },
  up(el: HTMLElement): void {
    el.style.backgroundColor = bg;
  }
});