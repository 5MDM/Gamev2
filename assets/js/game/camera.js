import {PhysicsCamera} from "../lib/camera.js";
import {$, clamp, stopLoop} from "../lib/util.js";
import {isTouchDevice, supportsPointerLock} from "../window.js"

const sensitivity = 100
var paused = false;

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
const overlay = $("#overlay");
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

if(supportsPointerLock()) {
  paused = true;
  overlay.style.display = "block";
  $(".resume-text").innerText = "Start Game";
}
$("#resume").addEventListener("click", e => {
  if (!resumeButtonEnabled) return;
  if (supportsPointerLock()) canvas.requestPointerLock();
  overlay.style.display = "none";
  forcePointerUnlocked = true;
  paused = false;
});

document.addEventListener("pointerlockerror", e => {
  paused = true;
  overlay.style.display = "block";
})
var forcePointerUnlocked = true;
const resumeButton = $("#resume");
const lockProgressBar = $("#lock-timer");
var resumeButtonEnabled = true;
document.addEventListener("pointerlockchange", async e => {
  if (document.pointerLockElement != canvas) {
    // Pointer unlocked
    paused = true;
    $(".resume-text").innerText = "Resume Game";
    overlay.style.display = "block";
    if (forcePointerUnlocked) {
      // Pressed escape or switched tabs to let browser handle unlock
      resumeButtonEnabled = false;
      lockProgressBar.style.width = "0%";
      resumeButton.style.backgroundColor = "#202020";
      resumeButton.style.color = "white";
      resumeButton.style.cursor = "default";
      const wait = ms => new Promise(res => setTimeout(res, ms))
      var timerPercent = 0;
      for (let i = 0; i < 100; i++) {
        timerPercent += 1;
        lockProgressBar.style.width = `${timerPercent}%`;
        await wait(1200 / 100);
      }
      resumeButton.style.cursor = "pointer";
      resumeButton.style.color = "black";
      resumeButtonEnabled = true;
    } else {
      // Pressed backquote to use code to unlock cursor
      resumeButton.style.backgroundColor = "#808080";
      resumeButton.style.color = "black";
      resumeButton.style.cursor = "pointer";
    }
  }
})
var up = false;
var left = false;
var down = false;
var right = false;
var vup = false;
var vdown = false;
var sprinting = false;

stopLoop(() => {
  if(paused) return;
  if (cam.gravityEnabled) { // Walking
    if(up) cam.moveUp(sprinting ? 0.1 : 0.05);
    if(down) cam.moveDown();
    if(left) cam.moveLeft();
    if(right) cam.moveRight();
    if(vup) cam.moveAbove();
    if(vdown) cam.moveBelow();
  } else { // Flying
    if(up) cam.moveUp(sprinting ? 0.15 : 0.1);
    if(down) cam.moveDown(0.1);
    if(left) cam.moveLeft(0.1);
    if(right) cam.moveRight(0.1);
    if(vup) cam.moveAbove(sprinting ? 0.15 : 0.1);
    if(vdown) cam.moveBelow(sprinting ? 0.15 : 0.1);
  }
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
    sprinting = false;
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
  
  var lastJumpPressTime = 0;
  // shift
  $("#ui > #gui > #v-movement #shift")
  .addEventListener("touchstart", e => {
    if (cam.gravityEnabled) cam.jump();
    const jumpPressTime = Date.now();
    if (jumpPressTime - lastJumpPressTime <= 250) {
      // Double jump
      if (cam.gravityEnabled) {
        cam.disableGravity();
        $("#v-movement > #up").style.visibility = "visible";
        $("#v-movement > #down").style.visibility = "visible";
        $("#v-movement > #shift").src = "/assets/images/game/circle.png";
      } else {
        cam.enableGravity();
        $("#v-movement > #up").style.visibility = "hidden";
        $("#v-movement > #down").style.visibility = "hidden";
        $("#v-movement > #shift").src = "/assets/images/game/small_arrow.png";
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
    case "KeyR":
      sprinting = !sprinting;
      break;
    case "Backquote":
      if (!supportsPointerLock()) break;
      forcePointerUnlocked = false;
      document.exitPointerLock();
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
    const keypressTime = Date.now();
    if (keypressTime - lastKeypressTime <= 250) {
      // Double space bar pressed
      if (cam.gravityEnabled) {
        cam.disableGravity();
        $("#v-movement > #up").style.visibility = "visible";
        $("#v-movement > #down").style.visibility = "visible";
        $("#v-movement > #shift").src = "/assets/images/game/circle.png";
        vup = true;
      } else {
        cam.enableGravity();
        $("#v-movement > #up").style.visibility = "hidden";
        $("#v-movement > #down").style.visibility = "hidden";
        $("#v-movement > #shift").src = "/assets/images/game/small_arrow.png";
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