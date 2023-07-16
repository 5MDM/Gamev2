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

const up = stopLoop(() => cam.moveUp(), false);
const left = stopLoop(() => cam.moveLeft(), false);
const down = stopLoop(() => cam.moveDown(), false);
const right = stopLoop(() => cam.moveRight(), false);

if (isTouchDevice()) {
  $("#ui > #gui > #movement #up")
  .addEventListener("pointerdown", e => up.start());
  
  $("#ui > #gui > #movement #up")
  .addEventListener("pointerup", e => up.stop());
  
  $("#ui > #gui > #movement #left")
  .addEventListener("pointerdown", e => left.start());
  
  $("#ui > #gui > #movement #left")
  .addEventListener("pointerup", e => left.stop());
  
  $("#ui > #gui > #movement #down")
  .addEventListener("pointerdown", e => down.start());
  
  $("#ui > #gui > #movement #down")
  .addEventListener("pointerup", e => down.stop());
  
  $("#ui > #gui > #movement #right")
  .addEventListener("pointerdown", e => right.start());
  
  $("#ui > #gui > #movement #right")
  .addEventListener("pointerup", e => right.stop());

  $("#ui > #gui > #movement")
  .addEventListener("gesturestart", e => e.preventDefault());

  $("#ui > #gui > #movement")
  .addEventListener("touchstart", e => e.preventDefault());
}

const pressedKeys = {
  up: false,
  left: false,
  down: false,
  right: false
}

document.addEventListener("keydown", e => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      if (pressedKeys.up) break;
      pressedKeys.up = true;
      up.start();
      break;
    case "KeyA":
    case "ArrowLeft":
      if (pressedKeys.left) break;
      pressedKeys.left = true;
      left.start();
      break;
    case "KeyS":
    case "ArrowDown":
      if (pressedKeys.down) break;
      pressedKeys.down = true;
      down.start();
      break;
    case "KeyD":
    case "ArrowRight":
      if (pressedKeys.right) break;
      pressedKeys.right = true;
      right.start();
      break;
  }
})
document.addEventListener("keyup", e => {
  switch (e.code) {
    case "KeyW":
    case "ArrowUp":
      up.stop();
      pressedKeys.up = false;
      break;
    case "KeyA":
    case "ArrowLeft":
      left.stop();
      pressedKeys.left = false;
      break;
    case "KeyS":
    case "ArrowDown":
      down.stop();
      pressedKeys.down = false;
      break;
    case "KeyD":
    case "ArrowRight":
      right.stop();
      pressedKeys.right = false;
      break;
  }
})