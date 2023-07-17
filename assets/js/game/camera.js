import {MovementCamera} from "../lib/camera.js";
import {$, clamp, stopLoop} from "../lib/util.js";
import {isTouchDevice} from "../window.js"

const sensitivity = 100

export const cam = new MovementCamera();
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

const canvas = $("#c")
canvas.addEventListener("mousemove", e => {
  const dx = e.movementX;
  const dy = e.movementY;

  cam.rx += dx * (0.005 * sensitivity / 100);
  cam.ry = clamp(
    -Math.PI / 2 + 0.1,
    cam.ry + (dy * (0.005 * sensitivity / 100)),
    Math.PI / 3,
  );
})
canvas.addEventListener("click", e => {
  canvas.requestPointerLock()
})
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

stopLoop(() => {
  if(up) cam.moveUp();
  if(left) cam.moveLeft();
  if(down) cam.moveDown();
  if(right) cam.moveRight();
});

if (isTouchDevice()) {
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

  $("#ui > #gui > #movement")
  .addEventListener("gesturestart", e => e.preventDefault());
 
  addEventListener("visibilitychange", e => {
    up = false;
    left = false;
    down = false;
    right = false;
  });

  $("#ui > #gui > #movement")
  .addEventListener("touchstart", e => e.preventDefault());
}

const pressedKeys = {
  up: false,
  left: false,
  down: false,
  right: false,
};

document.addEventListener("keydown", e => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      if (pressedKeys.up) break;
      pressedKeys.up = true;
      up = true;
      break;
    case "KeyA":
    case "ArrowLeft":
      if (pressedKeys.left) break;
      pressedKeys.left = true;
      left = true;
      break;
    case "KeyS":
    case "ArrowDown":
      if (pressedKeys.down) break;
      pressedKeys.down = true;
      down = true;
      break;
    case "KeyD":
    case "ArrowRight":
      if (pressedKeys.right) break;
      pressedKeys.right = true;
      right = true;
      break;
  }
});

document.addEventListener("keyup", e => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      up = false;
      pressedKeys.up = false;
      break;
    case "KeyA":
    case "ArrowLeft":
      left = false;
      pressedKeys.left = false;
      break;
    case "KeyS":
    case "ArrowDown":
      down = false;
      pressedKeys.down = false;
      break;
    case "KeyD":
    case "ArrowRight":
      right = false;
      pressedKeys.right = false;
      break;
  }
});