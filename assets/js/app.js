import {WebGLRenderer} from "three";
import {$} from "./lib/util.js";
import {canvasWidth, canvasHeight} from "./window.js";

export var currentScene;
export var currentCamera;

export function setCurrentScene(scene) {
  if(scene == undefined) 
    throw new Error("Scene is undefined");
  currentScene = scene;
}

export function setCurrentCamera(cam) {
  if(cam == undefined) 
    throw new Error("Camera is undefined");
  currentCamera = cam;
}

const renderer = new WebGLRenderer({
  canvas: $("#c"),
});

export function renderLoop() {
  requestAnimationFrame(renderLoop);
  renderer.render(currentScene, currentCamera);
}

renderer.debug.checkShaderErrors = true;

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);