import {$} from "../../lib/util";

type FormTypes = "toggle";

export type FormComponentOpts = {
  id: string,
  type: FormTypes,
  enable: () => void,
  disable: () => void
}

export function parseForm({id, type, enable, disable}: FormComponentOpts) {
  const el = 
  $(`#settings #settings-menu #content > #dev-content #${id}`);
  if (!el) throw new Error("Unknown form component element")
  
  switch(type) {
    case "toggle":
      const toggle = el.querySelector(".setting-toggle");
      if (!toggle) throw new Error(`Couldn't find toggle with class "setting-toggle" in form component by id "${id}"`)
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