import {updateCanvasSize} from "../../../ui";
import {gameState} from "../../../window";
import {SettingGroup} from "../main";
import {ToggleSetting, SliderSetting} from "html-settings-ui";

const fullScreenToggle = new ToggleSetting({
  id: "fullscreen",
  name: "Use Fullscreen",
  isToggled: gameState.useFullScreen,
});

fullScreenToggle.triggerElement
.addEventListener("pointerup", () => {
  
  if(fullScreenToggle.isToggled) {
    gameState.useFullScreen = true;
  } else {
    gameState.useFullScreen = false;
  }
  
});

const bodyPaddingToggle = new ToggleSetting({
  id: "body-padding",
  name: "Body Padding",
  isToggled: false,
});

bodyPaddingToggle.triggerElement
.addEventListener("pointerup", () => {
  
  if(bodyPaddingToggle.isToggled) {
    gameState.canvas.paddingWidth = 10;
    gameState.canvas.paddingHeight = 50;
    updateCanvasSize();
  } else {
    gameState.canvas.paddingWidth = 0;
    gameState.canvas.paddingHeight = 0;
    updateCanvasSize();
  }
  
});

const slider = new SliderSetting({
  id: "render-distance",
  name: "Render Distance",
  min: 0,
  max: 9,
  defaultValue: gameState.renderDistance,
});

slider.triggerElement
.addEventListener("input", () => {
  gameState.renderDistance = (slider.triggerElement as any).value;
});

const group = new SettingGroup("Video", "video")
.addComponent(fullScreenToggle)
.addComponent(bodyPaddingToggle)
.addComponent(slider);

export {group as video}