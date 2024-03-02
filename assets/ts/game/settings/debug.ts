import {$, stopLoop, round} from "../../lib/util";
import {MathUtils, Mesh, Vector3} from "three";
import {gameState} from "../../window";
import {AnyCamera, CameraOctreeMap} from "../../lib/camera";
import {Octree} from "../../lib/quadrant";

var cam: AnyCamera;
// var playerObj: Mesh;
// var trees: Octree[];
var listen: (id: string) => void;

const debugEl = $("#ui > #gui > #debug-ui")!;

export function setDebugObj(camera: AnyCamera) {
  cam = camera;
}

export function getDevEl(id: string) {
  return $("#ui > #gui > #debug-ui > #stats #" + id);
}

const devPos = getDevEl("pos")!;
const xe = getDevEl("x")!;
const ye = getDevEl("y")!;
const ze = getDevEl("z")!;
const devFps = getDevEl("fps")!;
const deltaTime = getDevEl("delta-time")!;
const facing = getDevEl("facing")!;
getDevEl("cores")!.innerText = 
`${navigator.hardwareConcurrency || "???"} cores`;

var lastTime = performance.now();
var fpsCounter = 60;
const devLoop = stopLoop(({delta}) => {
  const {x, y, z} = cam.camera.position;
  devPos.innerText = 
  `(${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)})`;

  const ma = 1000000;
  xe.innerText = `${round(x, ma)}`;
  ye.innerText = `${round(y, ma)}`;
  ze.innerText = `${round(z, ma)}`;

  const currentTime = performance.now();
  gameState.fps = 1000 / (currentTime - lastTime);
  lastTime = currentTime;
  if(fpsCounter-- <= 0) {
    devFps.innerText = `${round(gameState.fps, 100)}`;
    fpsCounter = 60;
  }
  deltaTime.innerText = `${round(delta, 10)}`;

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

export function enableDevTools() {
  gameState.devToolsEnabled = true;
  devLoop.start();
  debugEl.style.display = "block";
}

export function disableDevTools() {
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
  switch (e.code) {
    case "F3":
      e.preventDefault();
      if (gameState.paused) break;
      toggleDevTools();
      break;
    case "F1":
      e.preventDefault();
      console.log(gameState)
  }
});

export function enableConsole() {
  $("#ui > #console")!.style.display = "flex";
}

export function disableConsole() {
  $("#ui > #console")!.style.display = "none";
}