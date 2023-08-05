import {$, stopLoop, round} from "/assets/js/lib/util.js";
import {gameState} from "/assets/js/window.js";
import {parseForm} from "./form.js";
import {MathUtils, Vector3} from "three";

var cam;
var playerObj;
var trees;
var listen;

const debugEl = $("#ui > #gui > #debug-ui");
const devArr = [
  {
    id: "debug-toggle",
    type: "toggle",
    enable: enableDevTools,
    disable: disableDevTools,
  }
];

export function setDebugObj(o = {}) {
  cam = o.camera;
  playerObj = o.player;
  trees = o.octrees;
  listen = o.listen;
  
  for(const btn of devArr) parseForm(btn);
  listen("#dev");
}

export function getDevEl(id) {
  return $("#ui > #gui > #debug-ui > #stats #" + id);
}

const devPos = getDevEl("pos");
const xe = getDevEl("x");
const ye = getDevEl("y");
const ze = getDevEl("z");
const devFps = getDevEl("fps");
const deltaTime = getDevEl("delta-time");
const facing = getDevEl("facing");
getDevEl("cores").innerText = 
`${navigator.hardwareConcurrency || "???"} cores`;

var lastTime = performance.now();
var fpsCounter = 60;
const devLoop = stopLoop(({delta}) => {
  const {x, y, z} = cam.camera.position;
  devPos.innerText = 
  `(${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)})`;
  
  const ma = 1000000;
  xe.innerText = round(x, ma);
  ye.innerText = round(y, ma);
  ze.innerText = round(z, ma);
  
  const currentTime = performance.now();
  gameState.fps = 1000 / (currentTime - lastTime);
  lastTime = currentTime;
  if(fpsCounter-- <= 0) {
    devFps.innerText = round(gameState.fps, 100);
    fpsCounter = 60;
  }
  deltaTime.innerText = round(delta, 10);
  
  const direction = new Vector3();
  cam.camera.getWorldDirection(direction);
  
  const za = MathUtils.radToDeg(
    Math.atan2(direction.z, direction.x)
  );
  
  if(za >= -45 && za < 45) {
    facing.innerText = "East";
  } else if(za >= 45 && za < 135) {
    facing.innerText = "North";
  } else if(za >= -135 && za < -45) {
    facing.innerText = "South";
  } else {
    facing.innerText = "West";
  }
}, false);

function enableDevTools() {
  gameState.devToolsEnabled = true;
  devLoop.start();
  debugEl.style.display = "block";
}

function disableDevTools() {
  gameState.devToolsEnabled = false;
  devLoop.stop();
  debugEl.style.display = "none";
}

function toggleDevTools() {
  if(gameState.devToolsEnabled) {
    disableDevTools();
  } else {
    enableDevTools();
  }
}

addEventListener("keydown", e => {
  e.preventDefault();
  switch (e.code) {
    case "F3":
      if (gameState.paused) break;
      toggleDevTools();
      break;
    case "Backquote":
      if (!supportsPointerLock()) break;
      forcePointerUnlocked = false;
      document.exitPointerLock();
      break;
  }
});
