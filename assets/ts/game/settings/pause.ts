import {$, addEventListeners} from "../../lib/util";
import {enableFullscreen, gameState, supportsPointerLock} from "../../window";
import {cam} from "../camera";
import {hideSettings} from "./main";

function pause({ resumeText = "Resume Game", resumeTimer = 0, timerFinishedCallback = () => {} } = {}) {
  cam.disableTouch();
  cam.disableMouse();
  const resumeButton = $("#resume")!;
  const overlay = $("#overlay")!;
  gameState.paused = true;
  overlay.style.display = "block";
  $(".resume-text")!.innerText = resumeText;
  $("#v-movement")!.style.display = "none";
  $("#movement")!.style.display = "none";
  $("#pause-btn")!.style.display = "none";
  $("#ui > #hotbar")!.style.display = "none";
  if (resumeTimer > 0) {
    lockProgressBar.style.width = "0%";
    resumeButton.style.backgroundColor = "#202020";
    resumeButton.style.color = "white";
    resumeButton.style.cursor = "default";
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms))
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
  cam.enableTouch();
  cam.enableMouse();
  enableFullscreen();
  $("#overlay")!.style.display = "none";
  gameState.paused = false;
  hideSettings();
  if (gameState.showControls) {
    $("#v-movement")!.style.display = "flex";
    $("#movement")!.style.display = "flex";
    $("#pause-btn")!.style.display = "flex";
    $("#ui > #hotbar")!.style.display = "flex";
  }
}
var resumeButtonEnabled = true;
pause({resumeText: "Start Game"});
addEventListeners($("#resume")!, ["click", "touchstart"], () => {
  if (!resumeButtonEnabled) return;
  resume();
});

document.addEventListener("pointerlockerror", () => {
  gameState.paused = true;
  $("#overlay")!.style.display = "block";
})
var forcePointerUnlocked = true;

const lockProgressBar = $("#lock-timer")!;

cam.onPointerUnlock = () => {
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


$("#pause-btn")!.addEventListener("touchstart", () => pause());

window.addEventListener("blur", () => pause())

addEventListener("keydown", e => {
  switch (e.code) {
    case "Backquote":
      if (!supportsPointerLock()) break;
      forcePointerUnlocked = false;
      document.exitPointerLock();
      break;
  }
})