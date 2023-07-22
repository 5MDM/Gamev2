import {PhysicsCamera} from "../lib/camera.js";
import {$, clamp, stopLoop} from "../lib/util.js";
import {isTouchDevice} from "../window.js"

const sensitivity = 100

export const cam = new PhysicsCamera();
cam.bind($("#c"));
cam.setDefault(0, 0);
cam.enable();

cam.onPointerMove = function(e) {
  cam.rx += e.x * 0.01;
  cam.ry = clamp(
    -Math.PI / 2 + 0.1,
    cam.ry + (e.y * 0.01),
    Math.PI / 3,
  );
};

const canvas = $("#c");
canvas.addEventListener("mousemove", e => {
  if (document.pointerLockElement != canvas) return;
  const dx = e.movementX;
  const dy = e.movementY;

  cam.rx -= dx * (0.005 * sensitivity / 100);
  cam.ry = clamp(
    -Math.PI / 2 + 0.1,
    cam.ry - (dy * (0.005 * sensitivity / 100)),
    Math.PI / 3,
  );
});

canvas.addEventListener("click", e => 
  canvas.requestPointerLock()
);
/*
const up = stopLoop(() => cam.moveUp(), false);
const left = stopLoop(() => cam.moveLeft(), false);
const down = stopLoop(() => cam.moveDown(), false);
const right = stopLoop(() => cam.moveRight(), false);
*/
var up = false;
var left = false;
var down = false;
var right = false;
var vup = false;
var vdown = false;

stopLoop(() => {
  if(up) cam.moveUp();
  if(left) cam.moveLeft();
  if(down) cam.moveDown();
  if(right) cam.moveRight();
  if(vup) cam.moveAbove();
  if(vdown) cam.moveBelow();
});

if(isTouchDevice()) {
  $("#ui > #gui > #movement #up")
  .addEventListener("pointerdown", e => up = true);
  
  $("#ui > #gui > #movement #up")
  .addEventListener("pointerup", e => up = false);
  
  $("#ui > #gui > #movement #left")
  .addEventListener("pointerdown", e => left = true);
  
  $("#ui > #gui > #movement #left")
  .addEventListener("pointerup", e => left = false);
  
  $("#ui > #gui > #movement #down")
  .addEventListener("pointerdown", e => down = true);
  
  $("#ui > #gui > #movement #down")
  .addEventListener("pointerup", e => down = false);
  
  $("#ui > #gui > #movement #right")
  .addEventListener("pointerdown", e => right = true);
  
  $("#ui > #gui > #movement #right")
  .addEventListener("pointerup", e => right = false);
 
  addEventListener("visibilitychange", e => {
    up = false;
    left = false;
    down = false;
    right = false;
    vup = false;
    vdown = false;
  });

  $("#ui > #gui > #movement")
  .addEventListener("touchstart", e => e.preventDefault());
  
  $("#ui > #gui > #movement")
  .addEventListener("gesturestart", e => e.preventDefault());
  
  // up/down
  $("#ui > #gui > #v-movement #up")
  .addEventListener("pointerdown", e => vup = true);
  
  $("#ui > #gui > #v-movement #up")
  .addEventListener("pointerup", e => vup = false);
  
  $("#ui > #gui > #v-movement #down")
  .addEventListener("pointerdown", e => vdown = true);
  
  $("#ui > #gui > #v-movement #down")
  .addEventListener("pointerup", e => vdown = false);
  
  $("#ui > #gui > #v-movement")
  .addEventListener("touchstart", e => e.preventDefault());
  
  $("#ui > #gui > #v-movement")
  .addEventListener("gesturestart", e => e.preventDefault());
  
  // shift
  $("#ui > #gui > #v-movement #shift")
  .addEventListener("pointerup", e => cam.enableGravity());
}

document.addEventListener("keydown", e => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      up = true;
      break;
    case "KeyA":
    case "ArrowLeft":
      left = true;
      break;
    case "KeyS":
    case "ArrowDown":
      down = true;
      break;
    case "KeyD":
    case "ArrowRight":
      right = true;
      break;
    case "Space":
      vup = true;
      break;
    case "ShiftLeft":
      vdown = true;
      break;
  }
});

document.addEventListener("keyup", e => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      up = false;
      break;
    case "KeyA":
    case "ArrowLeft":
      left = false;
      break;
    case "KeyS":
    case "ArrowDown":
      down = false;
      break;
    case "KeyD":
    case "ArrowRight":
      right = false;
      break;
    case "Space":
      vup = false;
      break;
    case "ShiftLeft":
      vdown = false;
      break;
  }
});

var lastKeypressTime = 0;
var keyState = false;
// Detect double press space for enabling gravity
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (keyState) return;
    keyState = true;
    let keypressTime = Date.now();
    if (keypressTime - lastKeypressTime <= 250) {
      // Double space bar pressed
      cam.enableGravity();

      lastKeypressTime = 0;
    } else {
      lastKeypressTime = keypressTime;
    }
  } else {
    lastKeypressTime = 0;
  }
})
document.addEventListener("keyup", e => {
  if (e.code === "Space") keyState = false;
})