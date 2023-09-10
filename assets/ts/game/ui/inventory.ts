import {$, $$, $$Opts, logError, parseCSS, throwError} from "../../lib/util";
import {imageImports} from "../../window";
import {blocksJson} from "../generation/blocks";

interface SidebarSlot {
  name: string;
  target: string;
}

interface Target {
  rows: number;
  columns: number;
  el: string;
  amount?: number;
  loopBlocks?: boolean;
}

class Inventory {
  public targets: Target[];
  public sidebar: HTMLElement[];
  public sidebarTarget: HTMLElement;
  public onUp: ((el: HTMLElement) => void);
  public onDown: ((el: HTMLElement) => void);
  public selected?: number = undefined;
  public selectedEl?: HTMLElement = undefined;
  public currentPage: HTMLElement;
  public selectedSlot?: HTMLElement = undefined;
  
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
    this.currentPage = 
    this.#getTargetFromEl(this.sidebar[0]);
    
    this.#generate();
    
    return this;
  }
  
  getSlot(x: number, y: number): HTMLElement {
    const el = <HTMLElement>
    this.currentPage.querySelector(`#pos-${x}-${y}`);
    
    if(el === null) throwError(
      `inventory.ts: Couldn't find slot (${x}, ${y})`
    );
    
    return el;
  }
  
  setSlot(x: number, y: number): void {
    
  }
  
  async #generate() {
    const json: {
      name: string;
      texture: string;
    }[] = (await blocksJson).default.blocks;
    
    for(const i of this.targets) {
      const e = <HTMLElement>$("#ui > #inventory #" + i.el);
      e.style.gridTemplateColumns = 
      `repeat(${i.columns}, 1fr)`;
      e.style.gridTemplateRows = 
      `repeat(${i.rows}, 1fr)`;
      
      if(i.amount == undefined
      || i.amount > i.rows * i.columns)
        i.amount = i.rows * i.columns;
      
      let am = i.amount;
      let blocksI = 0;
      
      outerLoop: for(let y = 0; y < i.rows; y++) {
        for(let x = 0; x < i.columns; x++) {
          if(am-- <= 0) break outerLoop;
          
          const slotEl: HTMLElement = 
          <HTMLElement> Inventory.createSlot({
            attrs: {
              id: `pos-${x}-${y}`,
            },
          });
          
          if(i.loopBlocks
          && blocksI < json.length) {
            const currentBlock = json[blocksI++];
            const blockId = blocksI;
            
            const img = $$("img", {
              attrs: {
                alt: currentBlock.name,
                src:             `/assets/images/game/blocks/${currentBlock.texture}`,
                "data-block": blocksI.toString(),
                class: "block-img",
                id: `img-${x}-${y}`,
                draggable: "true",
              }
            });
            
            img.addEventListener("dragstart", e => {
              e.dataTransfer!
              .setData("block", blockId.toString());
              e.dataTransfer!.dropEffect = "move";
            });
            
            slotEl.appendChild(img);
          }
          
          slotEl.addEventListener("pointerup", e => {
            if(this.selectedSlot) 
              this.selectedSlot.classList
              .remove("selected-slot");
            
            this.selectedSlot = slotEl;
            this.selectedSlot.classList
            .add("selected-slot");
          });
          
          e.appendChild(slotEl);
        }
      }
    }
    
    for(let i in this.sidebar) {
      const el = this.sidebar[i];
      if(parseInt(i) == 0) {
        this.onDown(el);
        this.currentPage.style.display = "grid";
        
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
        this.currentPage = this.#getTargetFromEl(el);
        this.currentPage.style.display = "grid";
      });
      
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
      loopBlocks: true,
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
