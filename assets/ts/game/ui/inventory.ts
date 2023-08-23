import {$, $$, $$Opts, logError, parseCSS} from "../../lib/util";
import {imageImports} from "../../window";

interface SidebarSlot {
  name: string;
  target: Element;
}

class Inventory {
  public rows: number;
  public columns: number;
  public slotsAmount: number;
  public target: HTMLElement;
  public sidebar: HTMLElement[];
  public sidebarTarget: HTMLElement;
  public onUp: ((el: HTMLElement) => void);
  public onDown: ((el: HTMLElement) => void);
  public selected?: number = undefined;
  public selectedEl?: HTMLElement = undefined;
  
  constructor(o: {
    rows: number;
    columns: number;
    slotsAmount?: number;
    target: Element;
    sidebarTarget: Element;
    sidebar: Element[];
    down: ((el: HTMLElement) => void),
    up: ((el: HTMLElement) => void),
  }) {
    this.rows = o.rows;
    this.columns = o.columns;
    
    if(o.slotsAmount == undefined
    || o.slotsAmount > o.rows * o.columns)
      o.slotsAmount = o.rows * o.columns;
    
    this.slotsAmount = o.slotsAmount;
    this.target = <HTMLElement>o.target;
    this.sidebarTarget = <HTMLElement>o.sidebarTarget;
    this.sidebar = <HTMLElement[]>o.sidebar;
    this.onDown = o.down;
    this.onUp = o.up;
    this.#generate();
    
    return this;
  }
  
  #generate() {
    this.target.style.gridTemplateColumns = 
    `repeat(${this.columns}, 1fr)`;
    this.target.style.gridTemplateRows = 
    `repeat(${this.rows}, 1fr)`;
    
    for(let i = 0; i != this.slotsAmount; i++)
      this.target.appendChild(Inventory.createSlot());
    
    for(let i in this.sidebar) {
      const el = this.sidebar[i];
      if(parseInt(i) == 0) this.onDown(el);
      
      el.addEventListener("pointerdown", () => {
        if(this.selected != parseInt(i)
        && this.selected != undefined)
          this.onUp(this.selectedEl!)
        
        this.selected = parseInt(i);
        this.selectedEl = el;
        this.onDown(el);
      });
      
      el.addEventListener("pointerup", () => {
        if(this.selected != parseInt(i)) 
          this.onUp(el);
      });
      
      this.sidebarTarget.appendChild(el);
    }
  }
  
  static createSlot(opts?: $$Opts): Element {
    const el: Element = $$("div", opts);
    el.classList.add("inventory-slot");
    
    return el;
  }
  
  static createSidebar(o: SidebarSlot): Element {
    const el = $$("div", {
      attrs: {class: "sidebar-slot"},
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
  target: $("#ui > #inventory #inventory-grid")!,
  columns: 6,
  rows: 9,
  sidebarTarget: $("#ui > #inventory #sidebar")!,
  sidebar: [
    Inventory.createSidebar({
      name: "Inventory",
      target: $("#ui > #inventory #inventory-grid")!,
    }),
  ],
  down(el: HTMLElement): void {
    el.style.backgroundColor = "#222222";
  },
  up(el: HTMLElement): void {
    el.style.backgroundColor = bg;
  }
});