import {disableDevTools, enableDevTools} from "../debug";
import {SettingGroup, ToggleSettingComponent} from "../main";

const debugToggle = new ToggleSettingComponent({
  id: "debug",
  name: "Debug Overlay",
  defaultValue: false
})
debugToggle.addEventListener("enable", enableDevTools)
debugToggle.addEventListener("disable", disableDevTools)

const group = new SettingGroup({id: "dev", name: "Developer"})
  .addComponent(debugToggle)

export {group as developer}