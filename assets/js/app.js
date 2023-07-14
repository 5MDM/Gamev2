import {WebGLRenderer} from "three";
import {$} from "./lib/util.js";
import {canvasWidth, canvasHeight} from "./window.js";

setTimeout(() => {
  $("#loading-c").style.display = "none";
}, 500);

export var currentScene;
export var currentCamera;

const renderer = new WebGLRenderer({
  canvas: $("#c"),
  precision: "lowp",
});

renderer.debug.checkShaderErrors = true;

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(canvasWidth, canvasHeight);