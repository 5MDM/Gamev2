import {Camera, Scene, WebGLRenderer} from "three";
import {$} from "./lib/util";
import {canvasWidth, canvasHeight} from "./window";

export var currentScene: Scene;
export var currentCamera: Camera;

export function setCurrentScene(scene: Scene) {
  if(scene == undefined) 
    throw new Error("Scene is undefined");
  currentScene = scene;
}

export function setCurrentCamera(cam: Camera) {
  if(cam == undefined) 
    throw new Error("Camera is undefined");
  currentCamera = cam;
}

const renderer = new WebGLRenderer({
  canvas: $("#c")!,
  alpha: true,
});

export function renderLoop() {
  requestAnimationFrame(renderLoop);
  renderer.render(currentScene, currentCamera);
}

renderer.debug.checkShaderErrors = true;

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);