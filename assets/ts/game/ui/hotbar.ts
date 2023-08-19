import {$, $$, $$Opts} from "../../lib/util";
import {imageImports} from "../../window";

type ListenFunction = 
((el: HTMLElement, nextEl?: HTMLElement) => void);

class Hotbar {
  public target: HTMLElement;
  public slots: Element[];
  public onDown: ListenFunction;
  public onUp: ListenFunction;
  public selected?: number = undefined;
  public selectedEl?: HTMLElement = undefined;
  public inventoryOpen: boolean = false;
  
  constructor(o: {
    target: Element;
    slots: Element[];
    down: ListenFunction,
    up: ListenFunction,
  }) {
    this.target = <HTMLElement>o.target;
    this.slots = o.slots;
    this.onDown = o.down;
    this.onUp = o.up;
    this.#generate();
    
    return this;
  }
  
  #generate(): void {
    for(let i in this.slots) {
      const el: HTMLElement =
      <HTMLElement>this.slots[i];
      
      if(el.id != "hotbar-menu") {
        const nextEl = <HTMLElement>this.slots[parseInt(i)+1];
        el.addEventListener("pointerdown", () => {
          if(this.selected != parseInt(i)
          && this.selected != undefined)
            this.onUp(this.selectedEl!, nextEl);
          
          this.selected = parseInt(i);
          this.selectedEl = el;
          this.onDown(el, nextEl);
        });
        
        el.addEventListener("pointerup", () => {
          if(this.selected != parseInt(i)) 
            this.onUp(el, nextEl);
        });
      }
      
      this.target.appendChild(el);
    }
  }
  
  static createSlot(opts?: $$Opts): Element {
    const el: Element = $$("div", opts);
    el.classList.add("hotbar-slot");
    
    return el;
  }
  
  static empty(n?: number): 
  Element[] {
    if(n) {
      const arr: Element[] = [];
      for(let i = 0; i != n; i++)
        arr.push(Hotbar.createSlot());
      
      return arr;
    } else {
      return [Hotbar.createSlot()];
    }
  }
  
  static async menuBtn(e: Element): Promise<Element> {
    const el = <HTMLElement>e;
    
    var io = false;
    const btn: HTMLElement = 
    await <HTMLElement>this.createSlot({
      attrs: {id: "hotbar-menu"},
      children: $$("img", {
        attrs: {
          src: (await imageImports[
            "game/hotbar-menu.png"
          ]()).default,
          alt: "Hotbar menu",
        },
      }),
    });
    
    btn.addEventListener("pointerup", () => {
      if(io) {
        el.style.display = "none";
        io = false;
      } else {
        el.style.display = "flex";
        io = true;
      }
    });
    
    return btn;
  }
}

const computed: CSSStyleDeclaration = 
getComputedStyle($("#ui > #hotbar")!);

const bw: string = computed
.getPropertyValue("--border-width");

const bc: string = computed
.getPropertyValue("--border-color");

export const hotbar = new Hotbar({
  target: $("#ui > #hotbar")!,
  slots: [
    ...Hotbar.empty(8),
    await Hotbar.menuBtn($("#ui > #inventory")!),
  ],
  down(el: HTMLElement, nextEl?: HTMLElement) {
    const color: string = "transparent";
    el.style.borderWidth = "5px";
    el.style.borderTopColor = color;
    el.style.borderBottomColor = color;
  },
  up(el: HTMLElement, nextEl?: HTMLElement) {
    el.style.borderWidth = bw;
    el.style.borderTopColor = bc;
    el.style.borderBottomColor = bc;
  },
});