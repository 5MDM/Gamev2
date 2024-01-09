import {disableDevTools, enableDevTools, enableConsole, disableConsole} from "../debug";
import {SettingGroup, ToggleSettingComponent} from "../main";

const debugToggle = new ToggleSettingComponent({
  id: "debug",
  name: "Debug Overlay",
  defaultValue: false
})
debugToggle.addEventListener("enable", enableDevTools)
debugToggle.addEventListener("disable", disableDevTools)

const consoleFixToggle = new ToggleSettingComponent({
    id: "devtools-toggle",
    name: "Enable devtools console",
    defaultValue: false
  });

consoleFixToggle.addEventListener("enable", enableConsole)
consoleFixToggle.addEventListener("disable", disableConsole)

const group = new SettingGroup({id: "dev", name: "Developer"})
.addComponent(debugToggle)
.addComponent(consoleFixToggle);

export {group as developer}