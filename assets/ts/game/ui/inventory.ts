import {$, $$, $$Opts, logError, parseCSS} from "../../lib/util";
import {imageImports} from "../../window";

class Inventory {
  public rows: number;
  public columns: number;
  public slotsAmount: number;
  public target: HTMLElement;
  
  constructor(o: {
    rows: number;
    columns: number;
    slotsAmount?: number;
    target: Element;
  }) {
    this.rows = o.rows;
    this.columns = o.columns;
    
    if(o.slotsAmount == undefined
    || o.slotsAmount > o.rows * o.columns)
      o.slotsAmount = o.rows * o.columns;
    
    this.slotsAmount = o.slotsAmount;
    this.target = <HTMLElement>o.target;
    this.#generate();
    
    return this;
  }
  
  #generate() {
    this.target.style.gridTemplateColumns = 
    `repeat(${this.columns}, 1fr)`;
    this.target.style.gridTemplateRows = 
    `repeat(${this.rows}, 1fr)`;
    
    for(let i = 0; i != this.slotsAmount; i++) {
      this.target.appendChild(Inventory.createSlot());
    }
  }
  
  static createSlot(opts?: $$Opts): Element {
    const el: Element = $$("div", opts);
    el.classList.add("inventory-slot");
    
    return el;
  }
}

const inventory = new Inventory({
  target: $("#ui > #inventory #inventory-grid")!,
  columns: 8,
  rows: 7,
});