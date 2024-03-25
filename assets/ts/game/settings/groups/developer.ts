import {disableDevTools, enableDevTools, enableConsole, disableConsole} from "../debug";
import {SettingGroup} from "../main";
import {ToggleSetting} from "html-settings-ui"
import {windowTouchendListener} from "../../../window"
import {disableChunkRendering, enableChunkRendering} from "../../generation/render";

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

const freezeChunkRendering = new ToggleSetting({
  name: "Freeze Chunk Rendering",
  id: "freeze-rendering",
});

freezeChunkRendering.triggerElement.addEventListener("pointerup", () => {
  if(freezeChunkRendering.isToggled) {
    disableChunkRendering();
  } else {
    enableChunkRendering();
  }
});



const group = 
new SettingGroup("Developer", "dev")
.addComponent(debugToggle)
.addComponent(fixConsole)
.addComponent(freezeChunkRendering);

export {group as developer}