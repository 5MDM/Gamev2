import {$, $$} from "../../lib/util";
import {setToggleElement, setSliderElement, SliderSetting, ToggleSetting} from "html-settings-ui";
import "./debug";
import "./pause";

const settingsIcon: HTMLImageElement = $("#settings-btn")!;
const menu: HTMLDivElement = $("#settings #settings-menu")!;
const resume: HTMLDivElement = $("#resume")!;

var menuOpen = false;

var lastSettingBtn: HTMLButtonElement;
var lastSettingPage: HTMLDivElement;

settingsIcon.addEventListener("pointerup", () => {
  if(menuOpen) {hideSettings()} 
  else {showSettings()}
});



export function hideSettings(): void {
  if(lastSettingBtn != undefined)
    lastSettingBtn.classList.remove("current");
  
  if(lastSettingPage != undefined) 
      lastSettingPage.style.display = "none";
  
  resume.style.display = "block";
  menu.style.display = "none";
  menuOpen = false;
  
  // Removes the settings icon 50% brightness filter
  settingsIcon.style.filter = "";
}

export function showSettings(): void {
  resume.style.display = "none";
  menu.style.display = "flex";
  menuOpen = true;
  
  // Makes the settings icon 50% darker
  settingsIcon.style.filter = "brightness(50%)";
}

setToggleElement((o, el) => {
  const div = $$("div", {
    attrs: {
      class: "setting",
    },
    children: [
      $$("p", {text: o.name}),
      el,
    ],
  });
  
  el.classList.add("setting-toggle");

  el.addEventListener("pointerup", () =>
    el.classList.toggle("enabled")
  );
  
  return div;
});

setSliderElement((o, slider: any) => {
  const count = $$("span", {
    style: {
      margin: "auto",
      "margin-right": "0"
    },
    text: o.defaultValue,
  });
  
  slider.classList.add("slider");
  
  slider.addEventListener("input", () =>
    count.innerText = slider.value
  );
  
  const div = $$("div", {
    attrs: {
      class: "setting",
    },
    children: [
      $$("p", {text: o.name}),
      count,
      slider,
    ],
  });

  return div;
});

export class SettingGroup {
  id: string;
  name: string;
  elements: HTMLElement[] = [];
  
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
  
  addComponent(e: ToggleSetting | SliderSetting) {
    this.elements.push(e.element as HTMLElement);
    return this;
  }
  
  addToDOM(sidebar: HTMLDivElement, contentContainer: HTMLDivElement) {
    sidebar.appendChild($$("button", {
      attrs: {id: this.id},
      text: this.name,
      
      down: ({el}) => {
        const content = 
        contentContainer.querySelector<HTMLDivElement>
        (`div.content#${this.id}-content`)!;
        content.style.display = "flex";
        
        const otherContents = 
        contentContainer.querySelectorAll<HTMLDivElement>
        (`div.content:not(div.content#${this.id}-content)`);
        otherContents.forEach(e => e.style.display = "none");

        el.classList.add("current");
        
        const otherButtons =
        sidebar.querySelectorAll<HTMLButtonElement>
        (`button:not(button#${this.id})`);
        
        otherButtons.forEach(e =>
          e.classList.remove("current")
        );
      },
    }));
    
    contentContainer.appendChild($$("div", {
      attrs: {
        id: `${this.id}-content`,
        class: "content"
      },
      children: this.elements,
    }));
  }
}