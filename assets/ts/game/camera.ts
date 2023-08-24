import {PhysicsCamera} from "../lib/camera";
import {$, addEventListeners, clamp, stopLoop} from "../lib/util";
import {imageImports, isTouchDevice, gameState} from "../window";

export const cam = new PhysicsCamera({mouseSensitivity: 100});
cam.bind($("#c")!);
cam.setDefault(0, 0);

cam.onPointerMove = function(e) {
  cam.rx += e.x * 0.01;
  cam.ry = clamp(
    -Math.PI / 2 + 0.1,
    cam.ry + (e.y * 0.01),
    Math.PI / 3,
  );
  
};

var up = false;
var left = false;
var down = false;
var right = false;
var vup = false;
var vdown = false;

const playerSpeed = 0.07;
stopLoop(({delta}) => {
  if(gameState.paused) return;
  var s = playerSpeed * delta;
  if(up) cam.moveUp(s);
  if(left) cam.moveLeft(s);
  if(down) cam.moveDown(s);
  if(right) cam.moveRight(s);
  if(vup) cam.moveAbove(s + 0.03);
  if(vdown) cam.moveBelow(s + 0.03);
});

if(isTouchDevice()) {
  $("#ui > #gui > #movement #up")!
  .addEventListener("pointerdown", () => up = true);
  
  $("#ui > #gui > #movement #up")!
  .addEventListener("pointerup", () => up = false);
  
  $("#ui > #gui > #movement #left")!
  .addEventListener("pointerdown", () => left = true);
  
  $("#ui > #gui > #movement #left")!
  .addEventListener("pointerup", () => left = false);
  
  $("#ui > #gui > #movement #down")!
  .addEventListener("pointerdown", () => down = true);
  
  $("#ui > #gui > #movement #down")!
  .addEventListener("pointerup", () => down = false);
  
  $("#ui > #gui > #movement #right")!
  .addEventListener("pointerdown", () => right = true);
  
  $("#ui > #gui > #movement #right")!
  .addEventListener("pointerup", () => right = false);
 
  addEventListener("visibilitychange", () => {
    up = false;
    left = false;
    down = false;
    right = false;
    vup = false;
    vdown = false;
  });

  addEventListeners(
    $("#ui > #gui > #movement")!,
    ["touchstart", "gesturestart"],
    e => e.preventDefault()
  )
  
  // up/down
  $("#ui > #gui > #v-movement #up")!
  .addEventListener("pointerdown", () => vup = true);
  
  $("#ui > #gui > #v-movement #up")!
  .addEventListener("pointerup", () => vup = false);
  
  $("#ui > #gui > #v-movement #down")!
  .addEventListener("pointerdown", () => vdown = true);
  
  $("#ui > #gui > #v-movement #down")!
  .addEventListener("pointerup", () => vdown = false);

  addEventListeners(
    $("#ui > #gui > #v-movement")!,
    ["touchstart", "gesturestart"],
    e => e.preventDefault()
  )
  
  var lastJumpPressTime = 0;
  // shift
  $("#ui > #gui > #v-movement #shift")!
  .addEventListener("touchstart", async () => {
    if (cam.gravityEnabled) cam.jump();
    const jumpPressTime = Date.now();
    if (jumpPressTime - lastJumpPressTime <= 250) {
      // Double jump
      if (cam.gravityEnabled) {
        cam.disableGravity();
        $("#v-movement > #up")!.style.visibility = "visible";
        $("#v-movement > #down")!.style.visibility = "visible";
        $("#v-movement > #shift")!.src = (await imageImports["game/circle.png"]()).default;
      } else {
        cam.enableGravity();
        $("#v-movement > #up")!.style.visibility = "hidden";
        $("#v-movement > #down")!.style.visibility = "hidden";
        $("#v-movement > #shift")!.src = (await imageImports["game/small-arrow.png"]()).default;
        vup = false;
        vdown = false;
      }

      lastJumpPressTime = 0;
    } else {
      lastJumpPressTime = jumpPressTime;
    }
  });
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
      if (cam.gravityEnabled) cam.jump();
      else vup = true;
      break;
    case "ShiftLeft":
      if (!cam.gravityEnabled) vdown = true;
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
document.addEventListener("keydown", async e => {
  if (e.code === "Space") {
    if (keyState) return;
    keyState = true;
    const keypressTime = Date.now();
    if (keypressTime - lastKeypressTime <= 250) {
      // Double space bar pressed
      if (cam.gravityEnabled) {
        cam.disableGravity();
        $("#v-movement > #up")!.style.visibility = "visible";
        $("#v-movement > #down")!.style.visibility = "visible";
        $("#v-movement > #shift")!.src = (await imageImports["game/circle.png"]()).default;
        vup = true;
      } else {
        cam.enableGravity();
        $("#v-movement > #up")!.style.visibility = "hidden";
        $("#v-movement > #down")!.style.visibility = "hidden";
        $("#v-movement > #shift")!.src = (await imageImports["game/small_arrow.png"]()).default;
        vup = false;
        vdown = false;
      }

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