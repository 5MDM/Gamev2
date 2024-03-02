import {disableDevTools, enableDevTools, enableConsole, disableConsole} from "../debug";
import {SettingGroup} from "../main";
import {ToggleSetting} from "html-settings-ui"
import {windowTouchendListener} from "../../../window"

const debugToggle = new ToggleSetting({
  name: "Debug Overlay",
  id: "debug",
});

debugToggle.triggerElement.addEventListener("pointerup", () => {
  if(debugToggle.isToggled) {
    enableDevTools();
  } else {
    disableDevTools();
  }
});

const fixConsole = new ToggleSetting({
  name: "Fix Eruda Console (Warning: unstable)",
  id: "fix-console",
});

fixConsole.triggerElement.addEventListener("pointerup", () => {
  if(fixConsole.isToggled) {
    removeEventListener("touchend", windowTouchendListener);
  } else {
    addEventListener("touchend", windowTouchendListener);
  }
});

const group = 
new SettingGroup("Developer", "dev")
.addComponent(debugToggle)
.addComponent(fixConsole);

export {group as developer}