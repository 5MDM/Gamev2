import {$, $$, $$Opts} from "../../lib/util";
import {imageImports} from "../../window";

class Inventory {
  public target: Element;
  public slots: Element[];
  
  constructor(o: {
    target: Element;
    slots: Element[];
  }) {
    this.target = o.target;
    this.slots = o.slots;
    this.#generate();
    
    return this;
  }
  
  #generate(): void {
    for(const el of this.slots)
      this.target.appendChild(el);
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
        arr.push(Inventory.createSlot());
      
      return arr;
    } else {
      return [Inventory.createSlot()];
    }
  }
  
  static async menuBtn(el: Element): Promise<Element> {
    return this.createSlot({
      children: $$("img", {
        attrs: {
          src: (await imageImports[
            "game/hotbar-menu.png"
          ]()).default,
          alt: "Hotbar menu",
        },
      }),
    });
  }
}

export const inventory = new Inventory({
  target: $("#ui > #hotbar")!,
  slots: [
    ...Inventory.empty(8),
    await Inventory.menuBtn($("#ui > #inventory")!),
  ],
});