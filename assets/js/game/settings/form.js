import {$} from "/assets/js/lib/util.js";

export function parseForm({id, type, enable, disable}) {
  const el = 
  $(`#settings #settings-menu #content > #dev-content #${id}`);
  
  switch(type) {
    case "toggle":
      const toggle = el.querySelector(".setting-toggle");
      el.addEventListener("pointerup", () => {
        if(toggle.classList.contains("enabled")) {
          toggle.classList.remove("enabled");
          return disable();
        } else {
          toggle.classList.add("enabled");
          return enable();
        }
      });
  }
}