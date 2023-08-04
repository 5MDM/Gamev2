import {$, addEventListeners, stopLoop} from "../lib/util.js";
import {gameState, supportsPointerLock} from "../window.js";
import {Vector3, MathUtils} from "three";

const el = $("#settings-btn");
const menu = $("#settings #settings-menu");
var menuOpen = false;
var lastBtn;
var lastContent;

function hideSettings() {
  if(lastBtn != undefined) lastBtn.classList.remove("current");
  if(lastContent != undefined) lastContent.style.display = "none";
  $("#resume").style.display = "block";
  menu.style.display = "none";
  el.style.filter = "";
  menuOpen = false;
}

function showSettings() {
  $("#resume").style.display = "none";
  el.style.filter = "brightness(50%)";
  menu.style.display = "flex";
  menuOpen = true;
}

el.addEventListener("pointerup", () => {
  if(menuOpen) {hideSettings()} 
  else {showSettings()}
});

var cam;
var playerObj;
var trees;
export function setDevObj(o = {}) {
  cam = o.camera;
  playerObj = o.player;
  trees = o.octrees;
}

function listen(id, f) {
  const btn = 
  $("#settings #settings-menu #sidebar > " + id);
  if(btn == undefined) 
    throw new Error(`pause.js: button ID "${id}" not found`);
  
  const content = 
  $(`#settings #settings-menu #content > ${id}-content`);
  
  btn.addEventListener("pointerup", () => {
    if(lastBtn != undefined)
      lastBtn.classList.remove("current");
    
    lastBtn = btn;
    btn.classList.add("current");
    
    lastContent = content;
    content.style.display = "flex";
    
    if(f != undefined) f();
  });
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

var lastTime = performance.now();
var fpsCounter = 60;
const devLoop = stopLoop(({delta}) => {
  const {x, y, z} = cam.camera.position;
  devPos.innerText = 
  `(${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)})`;
  
  const ma = 1000000;
  xe.innerText = Math.round(x * ma) / ma;
  ye.innerText = Math.round(y * ma) / ma;
  ze.innerText = Math.round(z * ma) / ma;
  
  const currentTime = performance.now();
  gameState.fps = 1000 / (currentTime - lastTime);
  lastTime = currentTime;
  if(fpsCounter-- <= 0) {
    devFps.innerText = Math.round(gameState.fps * 100) / 100;
    fpsCounter = 60;
  }
  deltaTime.innerText = Math.round(delta * 10) / 10;
  
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

const debugEl = $("#ui > #gui > #debug-ui");

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

[
  {
    id: "debug-toggle",
    type: "toggle",
    enable: enableDevTools,
    disable: disableDevTools,
  }
].forEach(({id, type, enable, disable}) => {
  const e = $(`#settings #settings-menu #content > #dev-content #${id}`);
  switch (type) {
    case "toggle":
      const toggle = e.querySelector(".setting-toggle");
      e.addEventListener("pointerup", () => {
        if (toggle.classList.contains("enabled")) {
          toggle.classList.remove("enabled");
          return disable();
        } else {
          toggle.classList.add("enabled");
          return enable();
        }
      })
  }
})

listen("#dev");

function pause({ resumeText = "Resume Game", resumeTimer = 0, timerFinishedCallback = () => {} } = {}) {
  const resumeButton = $("#resume");
  const overlay = $("#overlay");
  gameState.paused = true;
  overlay.style.display = "block";
  $(".resume-text").innerText = resumeText;
  $("#v-movement").style.display = "none";
  $("#movement").style.display = "none";
  $("#pause-btn").style.display = "none";
  if (resumeTimer > 0) {
    lockProgressBar.style.width = "0%";
    resumeButton.style.backgroundColor = "#202020";
    resumeButton.style.color = "white";
    resumeButton.style.cursor = "default";
    const wait = ms => new Promise(res => setTimeout(res, ms))
    var timerPercent = 0;
    (async () => {
      for (let i = 0; i < 100; i++) {
        timerPercent += 1;
        lockProgressBar.style.width = `${timerPercent}%`;
        await wait(resumeTimer / 100);
      }
      resumeButton.style.cursor = "pointer";
      resumeButton.style.color = "black";
      timerFinishedCallback();
    })();
  } else {
    resumeButton.style.backgroundColor = "#808080";
    resumeButton.style.color = "black";
    resumeButton.style.cursor = "pointer";
  }
}
function resume() {
  if (supportsPointerLock()) canvas.requestPointerLock();
  $("#overlay").style.display = "none";
  gameState.paused = false;
  hideSettings();
  if (gameState.showControls) {
    $("#v-movement").style.display = "flex";
    $("#movement").style.display = "flex";
    $("#pause-btn").style.display = "flex";
  }
}
const canvas = $("#c");
var resumeButtonEnabled = true;
pause({resumeText: "Start Game"});
addEventListeners($("#resume"), ["click", "touchstart"], e => {
  if (!resumeButtonEnabled) return;
  resume();
});

document.addEventListener("pointerlockerror", e => {
  gameState.paused = true;
  overlay.style.display = "block";
})
var forcePointerUnlocked = true;

const lockProgressBar = $("#lock-timer");
document.addEventListener("pointerlockchange", async e => {
  if (document.pointerLockElement != canvas) {
    if (forcePointerUnlocked) {
      resumeButtonEnabled = false;
      pause({
        resumeTimer: 1200,
        timerFinishedCallback: () => {
          resumeButtonEnabled = true;
        }
      });
    } else {
      forcePointerUnlocked = true;
      pause();
    }
  }
})


$("#pause-btn").addEventListener("touchstart", () => pause());

window.addEventListener("blur", () => pause())